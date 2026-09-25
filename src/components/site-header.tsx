import Link from "next/link";

const nav = [
  { href: "/lab", label: "Lab" },
  { href: "/resume", label: "简历" },
  // 关于 页面做好后再加进来
];

export function SiteHeader() {
  return (
    <header className="no-print mx-auto flex w-full max-w-5xl items-baseline justify-between px-6 py-6">
      <Link href="/" className="font-medium tracking-tight">
        Jensen Liu
      </Link>
      <nav className="flex gap-6 text-sm text-ink-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-ink underline-offset-4 hover:underline"
          >
            {item.label}
          </Link>
        ))}
        <a
          href="https://github.com/liu673"
          className="hover:text-ink underline-offset-4 hover:underline"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
