import { education, experiences, profile, projects, skills } from "@/data/resume";
import { Chips, Period, Section } from "./shared";

/* ---------- NER 风格标注：只用于工程师视角的自我介绍 ---------- */

const ENTITIES: { text: string; label: string }[] = [
  { text: "四年", label: "DUR" },
  { text: "NLP", label: "TECH" },
  { text: "知识图谱", label: "TECH" },
  { text: "OCR", label: "TECH" },
  { text: "信息抽取", label: "TECH" },
  { text: "实体识别", label: "TECH" },
  { text: "关系抽取", label: "TECH" },
  { text: "对话系统", label: "TECH" },
  { text: "图数据库", label: "TECH" },
  { text: "图算法", label: "TECH" },
];

function Annotated({ text }: { text: string }) {
  const pattern = new RegExp(`(${ENTITIES.map((e) => e.text).join("|")})`, "g");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) => {
        const ent = ENTITIES.find((e) => e.text === part);
        if (!ent) return <span key={i}>{part}</span>;
        return (
          <span
            key={i}
            className="border-b border-accent/60 pb-px"
            title={`实体：${ent.label}`}
          >
            {part}
            <sup className="ml-0.5 font-mono text-[9px] text-accent select-none">
              {ent.label}
            </sup>
          </span>
        );
      })}
    </>
  );
}

/* ---------- 架构管线：把 "A → B → C" 渲染成可读的步骤 ---------- */

function Pipeline({ text }: { text: string }) {
  const steps = text.split("→").map((s) => s.trim());
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[13px] leading-5 text-ink-2">
      {steps.map((step, i) => (
        <li key={i} className="flex items-center gap-x-1.5">
          <span className="rounded-sm border border-line bg-surface px-1.5 py-0.5">{step}</span>
          {i < steps.length - 1 && <span className="text-muted" aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

/* ---------- 视图 ---------- */

export function EngineerView() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="mt-6">
      <p className="max-w-3xl text-base leading-7 text-ink-2">
        <Annotated text={profile.summary.engineer} />
      </p>

      <Section title="经历" className="mt-12">
        <div className="space-y-10">
          {experiences.map((exp) => (
            <article key={exp.id} className="print-break-avoid">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">{exp.company}</h3>
                <span className="text-ink-2">{exp.role}</span>
                <Period start={exp.start} end={exp.end} className="font-mono text-sm text-muted" />
              </div>
              <div className="mt-3">
                <Chips items={exp.engineer.stack} mono />
              </div>
              <ul className="mt-4 space-y-1.5 text-[15px] leading-6 text-ink-2">
                {exp.engineer.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[11px] h-px w-3 shrink-0 bg-muted" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="项目">
        <div className="space-y-12">
          {featured.map((p) => (
            <article key={p.id} className="print-break-avoid">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-medium">{p.name}</h3>
                {p.nameEn && <span className="font-mono text-sm text-muted">{p.nameEn}</span>}
                {p.links?.github && (
                  <a
                    href={p.links.github}
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    源码
                  </a>
                )}
              </div>
              <p className="mt-1 text-ink-2">{p.tagline}</p>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm text-muted">架构</dt>
                  <dd className="mt-1.5">
                    <Pipeline text={p.engineer.architecture} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">技术栈</dt>
                  <dd className="mt-1.5">
                    <Chips items={p.engineer.stack} mono />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">难点</dt>
                  <dd className="mt-1.5">
                    <ul className="space-y-1.5 text-[15px] leading-6 text-ink-2">
                      {p.engineer.challenges.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span className="mt-[11px] h-px w-3 shrink-0 bg-muted" aria-hidden />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </article>
          ))}

          {rest.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted hover:text-ink">
                还有 {rest.length} 个项目
              </summary>
              <div className="mt-6 space-y-8">
                {rest.map((p) => (
                  <article key={p.id}>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="mt-1 text-sm text-ink-2">{p.tagline}</p>
                    <div className="mt-2">
                      <Pipeline text={p.engineer.architecture} />
                    </div>
                  </article>
                ))}
              </div>
            </details>
          )}
        </div>
      </Section>

      <Section title="技能">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.name}>
              <dt className="text-sm text-muted">{g.name}</dt>
              <dd className="mt-1.5">
                <Chips items={g.items} mono />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="教育">
        {education.map((e) => (
          <p key={e.school} className="text-ink-2">
            {e.school}，{e.major}，{e.degree}
            <span className="ml-3 font-mono text-sm text-muted">
              {e.start} — {e.end}
            </span>
          </p>
        ))}
      </Section>
    </div>
  );
}
