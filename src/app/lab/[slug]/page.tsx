import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProduct,
  products,
  PRODUCT_STATUS_LABEL,
  PRODUCT_TYPE_LABEL,
} from "@/data/products";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductPage({ params }: { params: Params }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const actions = [
    p.links?.use && { href: p.links.use, label: "打开使用" },
    p.links?.download && { href: p.links.download, label: "下载" },
    p.links?.github && { href: p.links.github, label: "源码" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
      <div className="pt-10">
        <Link href="/lab" className="text-sm text-muted underline-offset-4 hover:underline">
          Lab
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{p.name}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-2">{p.tagline}</p>
        <p className="mt-2 text-sm text-muted">
          {PRODUCT_STATUS_LABEL[p.status]}，{PRODUCT_TYPE_LABEL[p.type]}，更新于 {p.updated}
        </p>

        {actions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {actions.map((a, i) => (
              <a
                key={a.href}
                href={a.href}
                className={
                  i === 0
                    ? "rounded-sm bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
                    : "rounded-sm border border-line px-4 py-2 text-sm text-ink-2 hover:border-ink hover:text-ink"
                }
              >
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <section className="mt-12 grid gap-4 border-t border-line py-10 md:grid-cols-[9rem_1fr] md:gap-8">
        <h2 className="text-sm font-medium text-muted">为什么做它</h2>
        <p className="max-w-2xl leading-7 text-ink-2">{p.why}</p>
      </section>

      <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[9rem_1fr] md:gap-8">
        <h2 className="text-sm font-medium text-muted">技术</h2>
        <p className="text-ink-2">{p.stack.join("，")}</p>
      </section>

      {p.notes && p.notes.length > 0 && (
        <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[9rem_1fr] md:gap-8">
          <h2 className="text-sm font-medium text-muted">过程记录</h2>
          <ul className="max-w-2xl space-y-3 leading-7 text-ink-2">
            {p.notes.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-[13px] h-px w-3 shrink-0 bg-muted" aria-hidden />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
