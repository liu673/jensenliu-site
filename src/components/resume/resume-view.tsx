"use client";

import { useState } from "react";
import { profile, VIEW_MODES, type ViewMode } from "@/data/resume";
import { EngineerView } from "./engineer-view";
import { ProductView } from "./product-view";
import { StoryView } from "./story-view";

const VIEW_COMPONENTS: Record<ViewMode, () => React.JSX.Element> = {
  engineer: EngineerView,
  product: ProductView,
  story: StoryView,
};

export function ResumeView({ initialView }: { initialView: ViewMode }) {
  const [view, setView] = useState<ViewMode>(initialView);
  // 首次渲染不播动画，只有用户切换后才淡入
  const [switched, setSwitched] = useState(false);

  function change(next: ViewMode) {
    if (next === view) return;
    setView(next);
    setSwitched(true);
    const params = new URLSearchParams(window.location.search);
    params.set("view", next);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }

  const Body = VIEW_COMPONENTS[view];
  const isStory = view === "story";

  return (
    <div data-view={view} className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl px-6 pb-24">
        {/* 名字：三个视角共用 */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pt-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {profile.name}
            <span
              className={`ml-3 font-normal text-muted ${
                isStory ? "font-serif italic" : ""
              }`}
            >
              {profile.nameEn}
            </span>
          </h1>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print text-sm text-ink-2 underline-offset-4 hover:underline"
          >
            保存为 PDF
          </button>
        </div>

        {/* 视角切换：整页唯一的"大动作" */}
        <div className="no-print mt-10">
          <p className="text-sm text-muted">这份简历有三种读法，选一种：</p>
          <div role="group" aria-label="切换简历视角" className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
            {VIEW_MODES.map((m) => {
              const active = m.id === view;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => change(m.id)}
                  className={`group flex flex-col items-start border-b-2 pb-2 text-left transition-colors ${
                    active
                      ? "border-accent text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  <span className="text-lg font-medium">{m.label}</span>
                  <span className="text-xs text-muted">{m.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 视角相关内容：切换时重新挂载并淡入 */}
        <div key={view} className={switched ? "view-in" : undefined}>
          <section className={`mt-12 ${isStory ? "max-w-2xl" : "max-w-3xl"}`}>
            <p className="text-xl font-medium leading-relaxed text-accent sm:text-2xl">
              {profile.headline[view]}
            </p>
          </section>
          <Body />
        </div>
      </main>
    </div>
  );
}
