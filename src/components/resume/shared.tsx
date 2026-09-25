import type { ReactNode } from "react";

/** 两栏区块：左侧区块名，右侧内容。工程师 / 产品视角共用。 */
export function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`grid gap-4 border-t border-line py-10 md:grid-cols-[9rem_1fr] md:gap-8 ${className}`}
    >
      <h2 className="text-sm font-medium text-muted md:sticky md:top-6 md:self-start">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** 技术栈标签：只在需要"列举"时用，不做装饰 */
export function Chips({ items, mono = false }: { items: string[]; mono?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-sm bg-accent-soft px-1.5 py-0.5 text-[13px] leading-5 text-ink-2 ${
            mono ? "font-mono" : ""
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** 时间段：2022-03 — 2024-11 */
export function Period({
  start,
  end,
  className = "",
}: {
  start: string;
  end: string | null;
  className?: string;
}) {
  return (
    <span className={`tabular-nums ${className}`}>
      {start.replace("-", ".")}
      {" — "}
      {end ? end.replace("-", ".") : "至今"}
    </span>
  );
}
