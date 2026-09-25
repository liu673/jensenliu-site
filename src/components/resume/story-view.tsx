import { experiences, milestones, profile, projects } from "@/data/resume";

type Node =
  | { kind: "milestone"; date: string; title: string; note: string }
  | { kind: "experience"; date: string; exp: (typeof experiences)[number] };

function buildTimeline(): Node[] {
  const nodes: Node[] = [
    ...milestones.map((m) => ({ kind: "milestone" as const, ...m })),
    ...experiences.map((e) => ({ kind: "experience" as const, date: e.start, exp: e })),
  ];
  // 时间正序：故事从头讲起
  return nodes.sort((a, b) => a.date.localeCompare(b.date));
}

function fmt(date: string) {
  const [y, m] = date.split("-");
  return m ? `${y} 年 ${Number(m)} 月` : `${y} 年`;
}

export function StoryView() {
  const timeline = buildTimeline();
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div className="mt-6 max-w-2xl">
      <p className="text-lg leading-8 text-ink-2">{profile.summary.story}</p>

      <ol className="relative mt-16 border-l border-line pl-8">
        {timeline.map((node, i) => {
          const isExp = node.kind === "experience";
          return (
            <li key={i} className="relative pb-14 last:pb-0">
              {/* 时间线上的点：经历用实心，里程碑用空心 */}
              <span
                aria-hidden
                className={`absolute -left-[2.4rem] top-[0.55rem] h-3 w-3 rounded-full border-2 border-accent ${
                  isExp ? "bg-accent" : "bg-canvas"
                }`}
              />
              <time
                dateTime={node.date}
                className="font-serif text-sm tabular-nums text-muted"
              >
                {fmt(node.date)}
              </time>

              {node.kind === "milestone" ? (
                <>
                  <h3 className="mt-1 text-lg font-medium">{node.title}</h3>
                  <p className="mt-1 text-ink-2">{node.note}</p>
                </>
              ) : (
                <>
                  <h3 className="mt-1 text-lg font-medium">
                    {node.exp.company}
                    <span className="ml-2 text-base font-normal text-muted">{node.exp.role}</span>
                  </h3>
                  <p className="mt-3 text-[17px] leading-8 text-ink-2">{node.exp.story}</p>

                  {node.exp.projects.length > 0 && (
                    <ul className="mt-6 space-y-5">
                      {node.exp.projects
                        .map((id) => byId[id])
                        .filter((p) => p && p.featured)
                        .map((p) => (
                          <li key={p.id} className="border-l-2 border-accent-soft pl-4">
                            <p className="font-medium">
                              {p.name}
                              {p.links?.github && (
                                <a
                                  href={p.links.github}
                                  className="ml-2 text-sm font-normal text-accent underline-offset-4 hover:underline"
                                >
                                  在 GitHub 上看
                                </a>
                              )}
                            </p>
                            <p className="mt-1.5 leading-7 text-ink-2">{p.story}</p>
                          </li>
                        ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-16 border-t border-line pt-8 text-ink-2">
        故事还在继续。想聊聊的话，可以去{" "}
        <a href={profile.links.github} className="text-accent underline-offset-4 hover:underline">
          GitHub
        </a>{" "}
        找我。
      </p>
    </div>
  );
}
