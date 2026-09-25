import type { Metadata } from "next";
import Link from "next/link";
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_TYPE_LABEL,
  sortedProducts,
} from "@/data/products";

export const metadata: Metadata = {
  title: "Lab",
  description: "用 AI 做出来的产品，每一个都能用或能下载，边做边上架。",
};

export default function LabPage() {
  const list = sortedProducts();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
      <div className="pt-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Lab</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-ink-2">
          用 AI 把想法做成产品的地方。做出来的东西都放在这里，能用的可以直接用，能下载的可以下载，还没做完的也如实写着。
        </p>
      </div>

      {list.length === 0 ? (
        <p className="mt-16 border-t border-line pt-8 text-ink-2">
          第一个产品正在路上。
        </p>
      ) : (
        <ul className="mt-12 divide-y divide-line border-t border-line">
          {list.map((p) => (
            <li key={p.slug} className="py-6">
              <Link href={`/lab/${p.slug}`} className="group block">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-xl font-medium group-hover:underline underline-offset-4">
                    {p.name}
                  </h2>
                  <span className="text-sm text-muted">
                    {PRODUCT_STATUS_LABEL[p.status]}，{PRODUCT_TYPE_LABEL[p.type]}
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl text-ink-2">{p.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
