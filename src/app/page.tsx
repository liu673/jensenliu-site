export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 font-mono text-sm text-zinc-500">jensenliu.dev · under construction</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Jensen Liu</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        后端工程师，做 NLP 与算法；正在用 AI 把想法一个个做成产品，并记录从开发到部署的全过程。
      </p>
      <nav className="mt-10 flex gap-6 font-mono text-sm text-zinc-500">
        <span>Lab</span>
        <span>Resume</span>
        <span>About</span>
      </nav>
    </main>
  );
}
