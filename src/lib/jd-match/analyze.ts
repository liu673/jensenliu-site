import { DICTIONARY } from "./dictionary";
import { STOPWORDS } from "./stopwords";

/* ---------- 类型 ---------- */

export interface Term {
  /** 展示名（词典规范名，或分词结果） */
  text: string;
  /** 归一化后的 key，用于两边对比 */
  key: string;
  jdCount: number;
  resumeCount: number;
  /** 是否来自技术词典 / 英文术语（权重更高） */
  skill: boolean;
  weight: number;
}

export interface Span {
  start: number;
  end: number;
  key: string;
  status: "matched" | "missing";
}

export interface MatchResult {
  /** 0–1，按权重的 JD 关键词覆盖率 */
  score: number;
  matched: Term[];
  missing: Term[];
  /** 简历里有、JD 没提的 */
  extra: Term[];
  /** JD 原文里各关键词的位置，用于高亮 */
  jdSpans: Span[];
  jdTokenCount: number;
  resumeTokenCount: number;
}

/* ---------- 词典匹配 ---------- */

interface DictEntry {
  canonical: string;
  key: string;
  regex: RegExp;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

const LATIN = /^[A-Za-z0-9][A-Za-z0-9+.#/ -]*$/;

function aliasPattern(alias: string) {
  const body = escapeRegex(alias).replace(/ /g, "[ _-]?");
  // 英文别名要求前后不是字母数字，避免 "go" 命中 "google"
  return LATIN.test(alias) ? `(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])` : body;
}

const DICT: DictEntry[] = DICTIONARY.map(([canonical, ...aliases]) => {
  const all = [canonical, ...aliases].sort((a, b) => b.length - a.length);
  return {
    canonical,
    key: `dict:${canonical.toLowerCase()}`,
    regex: new RegExp(all.map(aliasPattern).join("|"), "gi"),
  };
});

/* ---------- 分词 ---------- */

const CJK = /[一-鿿]/;
const WORD_CHAR = /[\p{L}\p{N}+#.]/u;

interface Token {
  text: string;
  key: string;
  start: number;
  end: number;
  skill: boolean;
}

function getSegmenter(): Intl.Segmenter | null {
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return null;
  return new Intl.Segmenter("zh-Hans", { granularity: "word" });
}

/**
 * 分词：先用词典把术语整体抠出来，剩下的交给 Intl.Segmenter。
 * 返回带位置的 token，位置相对原文，方便高亮。
 */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const masked = text.split("");

  // 1. 词典术语：收集所有命中，按"位置靠前、长度优先"取不重叠的
  const hits: { start: number; end: number; entry: DictEntry }[] = [];
  for (const entry of DICT) {
    entry.regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = entry.regex.exec(text)) !== null) {
      if (m[0].length === 0) {
        entry.regex.lastIndex++;
        continue;
      }
      hits.push({ start: m.index, end: m.index + m[0].length, entry });
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  for (const h of hits) {
    if (masked.slice(h.start, h.end).some((c) => c === "\u0000")) continue;
    tokens.push({ text: h.entry.canonical, key: h.entry.key, start: h.start, end: h.end, skill: true });
    for (let i = h.start; i < h.end; i++) masked[i] = "\u0000";
  }

  // 2. 其余文本分词
  const rest = masked.join("");
  const seg = getSegmenter();
  if (seg) {
    for (const s of seg.segment(rest)) {
      if (!s.isWordLike) continue;
      pushWord(tokens, s.segment, s.index);
    }
  } else {
    // 没有 Segmenter 的兜底：英文按词，中文按字二元组
    const re = /[A-Za-z0-9+#.]+|[一-鿿]+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(rest)) !== null) {
      const chunk = m[0];
      if (CJK.test(chunk)) {
        for (let i = 0; i + 1 < chunk.length; i++) pushWord(tokens, chunk.slice(i, i + 2), m.index + i);
      } else {
        pushWord(tokens, chunk, m.index);
      }
    }
  }

  return tokens.sort((a, b) => a.start - b.start);
}

function pushWord(tokens: Token[], raw: string, start: number) {
  const text = raw.trim();
  if (!text || text.includes("\u0000")) return;
  if (![...text].every((c) => WORD_CHAR.test(c))) return;
  const key = text.toLowerCase();
  if (STOPWORDS.has(key)) return;
  if (/^[\d.]+$/.test(key)) return;
  // 单个汉字、单个字母基本没有信息量
  if ([...text].length < 2) return;
  const skill = !CJK.test(text);
  tokens.push({ text, key, start, end: start + raw.length, skill });
}

/* ---------- 匹配 ---------- */

function count(tokens: Token[]) {
  const map = new Map<string, { text: string; n: number; skill: boolean }>();
  for (const t of tokens) {
    const cur = map.get(t.key);
    if (cur) cur.n += 1;
    else map.set(t.key, { text: t.text, n: 1, skill: t.skill });
  }
  return map;
}

function weightOf(n: number, skill: boolean) {
  return (1 + Math.log(n)) * (skill ? 1.5 : 1);
}

export function analyze(jd: string, resume: string, ignored: Set<string> = new Set()): MatchResult {
  const jdTokens = tokenize(jd);
  const resumeTokens = tokenize(resume);
  const jdMap = count(jdTokens);
  const resumeMap = count(resumeTokens);

  const matched: Term[] = [];
  const missing: Term[] = [];
  let total = 0;
  let hit = 0;

  for (const [key, { text, n, skill }] of jdMap) {
    if (ignored.has(key)) continue;
    const r = resumeMap.get(key);
    const weight = weightOf(n, skill);
    const term: Term = { text, key, jdCount: n, resumeCount: r?.n ?? 0, skill, weight };
    total += weight;
    if (r) {
      hit += weight;
      matched.push(term);
    } else {
      missing.push(term);
    }
  }

  const extra: Term[] = [];
  for (const [key, { text, n, skill }] of resumeMap) {
    if (jdMap.has(key)) continue;
    extra.push({ text, key, jdCount: 0, resumeCount: n, skill, weight: weightOf(n, skill) });
  }

  const byWeight = (a: Term, b: Term) => b.weight - a.weight || a.text.localeCompare(b.text, "zh");
  matched.sort(byWeight);
  missing.sort(byWeight);
  extra.sort(byWeight);

  const jdSpans: Span[] = jdTokens
    .filter((t) => jdMap.has(t.key) && !ignored.has(t.key))
    .map((t) => ({
      start: t.start,
      end: t.end,
      key: t.key,
      status: resumeMap.has(t.key) ? "matched" : "missing",
    }));

  return {
    score: total === 0 ? 0 : hit / total,
    matched,
    missing,
    extra,
    jdSpans,
    jdTokenCount: jdTokens.length,
    resumeTokenCount: resumeTokens.length,
  };
}

/** 生成可复制的 Markdown 摘要 */
export function toMarkdown(r: MatchResult): string {
  const pct = Math.round(r.score * 100);
  const list = (terms: Term[]) => (terms.length ? terms.map((t) => t.text).join("、") : "无");
  return [
    `## JD 关键词覆盖率：${pct}%`,
    ``,
    `**对上了（${r.matched.length}）**：${list(r.matched)}`,
    ``,
    `**JD 提到、简历没有（${r.missing.length}）**：${list(r.missing)}`,
    ``,
    `**简历有、JD 没提（${r.extra.length}）**：${list(r.extra.slice(0, 30))}`,
    ``,
    `_覆盖率按关键词出现次数加权，技术术语权重更高；这不是录用概率。_`,
  ].join("\n");
}
