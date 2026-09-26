import type { Metadata } from "next";
import Link from "next/link";
import { JdMatch } from "@/components/tools/jd-match";

export const metadata: Metadata = {
  title: "JD 匹配器",
  description: "把招聘要求和简历放在一起，看关键词对上了多少、缺了什么。全部在浏览器里计算，文字不上传。",
};

export default function JdMatchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
      <div className="pt-10">
        <Link href="/lab/jd-match" className="text-sm text-muted underline-offset-4 hover:underline">
          Lab
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">JD 匹配器</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-2">
          把招聘要求和你的简历放在一起，看关键词对上了多少、缺了什么、哪些可以删。改完简历再贴一次，看数字有没有变。
        </p>
      </div>
      <JdMatch />
    </main>
  );
}
