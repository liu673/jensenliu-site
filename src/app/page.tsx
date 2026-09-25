import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Jensen Liu</h1>
      <p className="mt-5 max-w-md text-lg leading-8 text-ink-2">
        后端工程师，做 NLP 与算法；正在用 AI 把想法一个个做成产品，并记录从开发到部署的全过程。
      </p>
      <nav className="mt-10 flex gap-6 text-ink-2">
        <Link href="/lab" className="underline-offset-4 hover:underline">
          去 Lab
        </Link>
        <Link href="/resume" className="underline-offset-4 hover:underline">
          看简历
        </Link>
      </nav>
    </main>
  );
}
