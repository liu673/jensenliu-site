import { experiences, profile, projects, skills } from "@/data/resume";
import { Period, Section } from "./shared";

/** 问题 / 方案 / 结果 三行：产品视角的基本单元 */
function CaseRows({
  problem,
  solution,
  outcomes,
}: {
  problem: string;
  solution: string;
  outcomes: string[];
}) {
  return (
    <dl className="mt-5 grid gap-y-4 sm:grid-cols-[4rem_1fr] sm:gap-x-6">
      <dt className="text-sm font-medium text-accent">问题</dt>
      <dd className="text-[15px] leading-7 text-ink-2">{problem}</dd>

      <dt className="text-sm font-medium text-accent">方案</dt>
      <dd className="text-[15px] leading-7 text-ink-2">{solution}</dd>

      <dt className="text-sm font-medium text-accent">结果</dt>
      <dd>
        <ul className="space-y-1.5 text-[15px] leading-7 text-ink-2">
          {outcomes.map((o) => (
            <li key={o} className="flex gap-3">
              <span className="mt-[13px] h-px w-3 shrink-0 bg-accent" aria-hidden />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}

export function ProductView() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="mt-6">
      <p className="max-w-3xl text-base leading-7 text-ink-2">{profile.summary.product}</p>

      <Section title="案例" className="mt-12">
        <div className="space-y-14">
          {featured.map((p) => (
            <article key={p.id} className="print-break-avoid">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-medium">{p.name}</h3>
                  <p className="mt-1 text-ink-2">{p.tagline}</p>
                  <p className="mt-1 text-sm text-muted">
                    {p.company}，{p.period}
                    {p.links?.github && (
                      <>
                        {"，"}
                        <a
                          href={p.links.github}
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          开源仓库
                        </a>
                      </>
                    )}
                  </p>
                </div>
                {p.product.metrics && p.product.metrics.length > 0 && (
                  <dl className="flex shrink-0 gap-8">
                    {p.product.metrics.map((m) => (
                      <div key={m.label}>
                        <dd className="text-2xl font-medium tabular-nums text-ink">{m.value}</dd>
                        <dt className="text-sm text-muted">{m.label}</dt>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <CaseRows
                problem={p.product.problem}
                solution={p.product.solution}
                outcomes={p.product.outcomes}
              />
            </article>
          ))}

          {rest.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm text-muted hover:text-ink">
                还有 {rest.length} 个案例
              </summary>
              <div className="mt-6 space-y-10">
                {rest.map((p) => (
                  <article key={p.id}>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="mt-1 text-sm text-ink-2">{p.tagline}</p>
                    <CaseRows
                      problem={p.product.problem}
                      solution={p.product.solution}
                      outcomes={p.product.outcomes}
                    />
                  </article>
                ))}
              </div>
            </details>
          )}
        </div>
      </Section>

      <Section title="经历">
        <div className="space-y-12">
          {experiences.map((exp) => (
            <article key={exp.id} className="print-break-avoid">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">{exp.company}</h3>
                <span className="text-ink-2">{exp.role}</span>
                <Period start={exp.start} end={exp.end} className="text-sm text-muted" />
              </div>
              <CaseRows
                problem={exp.product.problem}
                solution={exp.product.approach}
                outcomes={exp.product.outcomes}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section title="能力">
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {skills.map((g) => (
            <p key={g.name} className="text-[15px] leading-7 text-ink-2">
              <span className="font-medium text-ink">{g.name}</span>
              <span className="text-muted">，</span>
              {g.items.join("，")}
            </p>
          ))}
        </div>
      </Section>
    </div>
  );
}
