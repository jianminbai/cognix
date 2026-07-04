import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SitePreferences } from "@/components/site-preferences";
import "./globals.css";

export const metadata: Metadata = {
  title: "cogniX - 认知复利实验室",
  description:
    "认知科学与个人知识复利平台，沉淀注意力、元认知、决策质量、问题选择和长期成长。",
  keywords: ["知识管理", "认知科学", "元认知", "决策质量", "知识复利"],
};

function Navbar() {
  return (
    <nav className="site-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cognix-logo.svg"
            alt="cogniX logo"
            width={40}
            height={40}
            priority
            className="brand-logo"
          />
          <span className="text-lg font-semibold tracking-wide">cogniX</span>
        </Link>
        <div className="flex items-center gap-4 text-sm sm:gap-5">
          <Link href="/#atlas" className="nav-link">
            <span className="lang-zh">认知地图</span>
            <span className="lang-en">Atlas</span>
          </Link>
          <Link href="/category/cognitive-science/" className="nav-link">
            <span className="lang-zh">文章</span>
            <span className="lang-en">Articles</span>
          </Link>
          <a
            href="https://github.com/jianminbai/cognix"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link hidden sm:inline"
          >
            GitHub
          </a>
          <SitePreferences />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-7xl px-5">
        cogniX &copy; {new Date().getFullYear()} ·{" "}
        <span className="lang-zh">知识的内化结构和连接密度更重要。</span>
        <span className="lang-en">Structure and connection density matter more than volume.</span>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" data-theme="dark" data-lang="zh">
      <body className="site-body theme-dark lang-zh min-h-full">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
