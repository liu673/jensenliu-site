"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyze, toMarkdown, type Term } from "@/lib/jd-match/analyze";
import { SAMPLE_JD, SAMPLE_RESUME } from "@/lib/jd-match/samples";

const MATCHED = "bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100";
const MISSING = "bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100";

function TermChip({
  term,
  tone,
  onClick,
  struck = false,
}: {
  term: Term;
  tone: "matched" | "missing" | "extra";
  onClick?: () => void;
  struck?: boolean;
}) {
  const cls =
    tone === "matched" ? MATCHED : tone === "missing" ? MISSING : "bg-accent-soft text-ink-2";
  const inner = (
    <>
      <span className={struck ? "line-through opacity-60" : undefined}>{term.text}</span>
      {tone !== "extra" && term.jdCount > 1 && (
        <span className="ml-1 text-[11px] tabular-nums opacity-70">×{term.jdCount}</span>
      )}
    </>
  );
  if (!onClick) {
    return <li className={`rounded-sm px-2 py-0.5 text-sm ${cls}`}>{inner}</li>;
  }
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        title={struck ? "恢复计入" : "标记为不相关，不计入覆盖率"}
        className={`rounded-sm px-2 py-0.5 text-sm hover:opacity-80 ${cls}`}
      >
        {inner}
      </button>
    </li>
  );
}

/** 在 JD 原文里高亮关键词 */
function HighlightedJd({
  text,
  spans,
}: {
  text: string;
  spans: { start: number; end: number; status: "matched" | "missing" }[];
}) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  spans.forEach((s, i) => {
    if (s.start < cursor) return;
    if (s.start > cursor) parts.push(text.slice(cursor, s.start));
    parts.push(
      <mark key={i} className={`rounded-sm px-0.5 ${s.status === "matched" ? MATCHED : MISSING}`}>
        {text.slice(s.start, s.end)}
      </mark>,
    );
    cursor = s.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <p className="whitespace-pre-wrap leading-7 text-ink-2">{parts}</p>;
}

export function JdMatch() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // 输入时不阻塞打字，分析结果稍后跟上
  const jdD = useDeferredValue(jd);
  const resumeD = useDeferredValue(resume);

  const ready = jdD.trim().length > 0 && resumeD.trim().length > 0;
  const result = useMemo(
    () => (ready ? analyze(jdD, resumeD, ignored) : null),
    [jdD, resumeD, ignored, ready],
  );

  const ignoredTerms = useMemo(() => {
    if (!ready) return [] as Term[];
    // 被忽略的词不在 result 里，单独算一次拿到它们的展示信息
    const all = analyze(jdD, resumeD);
    return [...all.matched, ...all.missing].filter((t) => ignored.has(t.key));
  }, [jdD, resumeD, ignored, ready]);

  function toggleIgnore(key: string) {
    setIgnored((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function loadSample() {
    setJd(SAMPLE_JD);
    setResume(SAMPLE_RESUME);
    setIgnored(new Set());
  }

  function clearAll() {
    setJd("");
    setResume("");
    setIgnored(new Set());
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(toMarkdown(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const pct = result ? Math.round(result.score * 100) : 0;

  return (
    <div className="mt-10">
      {/* 输入区 */}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">招聘要求（JD）</span>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="把职位描述和任职要求整段贴进来"
            rows={14}
            className="w-full resize-y rounded-sm border border-line bg-surface p-3 text-[15px] leading-6 placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">你的简历</span>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="贴纯文本就行，格式不重要"
            rows={14}
            className="w-full resize-y rounded-sm border border-line bg-surface p-3 text-[15px] leading-6 placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <button type="button" onClick={loadSample} className="text-accent underline-offset-4 hover:underline">
          用示例试试
        </button>
        {(jd || resume) && (
          <button type="button" onClick={clearAll} className="text-muted underline-offset-4 hover:underline">
            清空
          </button>
        )}
        <span className="text-muted">文字只在你的浏览器里处理，不会发送到任何地方。</span>
      </div>

      {/* 结果区 */}
      {!result ? (
        <p className="mt-16 border-t border-line pt-8 text-ink-2">
          两边都填上，结果会自动出现。
        </p>
      ) : (
        <div className="mt-14 border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-5xl font-semibold tabular-nums tracking-tight">
                {pct}
                <span className="ml-1 text-2xl font-normal text-muted">%</span>
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                JD 关键词覆盖率，按出现次数加权，技术术语权重更高。它衡量的是简历有没有说到 JD 在意的词，不是录用概率。
              </p>
            </div>
            <button
              type="button"
              onClick={copy}
              className="rounded-sm border border-line px-4 py-2 text-sm text-ink-2 hover:border-ink hover:text-ink"
            >
              {copied ? "已复制" : "复制结果（Markdown）"}
            </button>
          </div>

          <section className="mt-12">
            <h2 className="text-base font-medium">
              JD 提到、简历里没有
              <span className="ml-2 text-sm font-normal text-muted">
                {result.missing.length} 个，点一下可以标记为不相关
              </span>
            </h2>
            {result.missing.length === 0 ? (
              <p className="mt-3 text-ink-2">没有缺的了。</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {result.missing.map((t) => (
                  <TermChip key={t.key} term={t} tone="missing" onClick={() => toggleIgnore(t.key)} />
                ))}
              </ul>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-base font-medium">
              对上了
              <span className="ml-2 text-sm font-normal text-muted">{result.matched.length} 个</span>
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {result.matched.map((t) => (
                <TermChip key={t.key} term={t} tone="matched" onClick={() => toggleIgnore(t.key)} />
              ))}
            </ul>
          </section>

          {ignoredTerms.length > 0 && (
            <section className="mt-10">
              <h2 className="text-base font-medium">
                已标记为不相关
                <span className="ml-2 text-sm font-normal text-muted">不计入覆盖率，点一下恢复</span>
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ignoredTerms.map((t) => (
                  <TermChip key={t.key} term={t} tone="extra" struck onClick={() => toggleIgnore(t.key)} />
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-base font-medium">JD 原文</h2>
            <p className="mt-1 text-sm text-muted">
              <mark className={`rounded-sm px-1 ${MATCHED}`}>绿色</mark> 是对上的，
              <mark className={`ml-1 rounded-sm px-1 ${MISSING}`}>黄色</mark> 是简历里没有的。
            </p>
            <div className="mt-4 max-w-3xl rounded-sm border border-line bg-surface p-4">
              <HighlightedJd text={jdD} spans={result.jdSpans} />
            </div>
          </section>

          <details className="mt-10">
            <summary className="cursor-pointer text-base font-medium">
              简历里有、JD 没提
              <span className="ml-2 text-sm font-normal text-muted">
                {result.extra.length} 个，考虑精简或换成 JD 的说法
              </span>
            </summary>
            <ul className="mt-4 flex flex-wrap gap-2">
              {result.extra.map((t) => (
                <TermChip key={t.key} term={t} tone="extra" />
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
