import type { Metadata } from "next";
import Link from "next/link";
import { NavbarActions } from "@/components/navbar-actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "JmBai - 认知复利",
  description: "从观察问题，到校准判断，再到形成长期复利。",
  keywords: ["认知", "思考", "判断", "决策", "长期主义"],
};

function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="JmBai 首页">
          <span className="brand-logo"><b>Jm</b><i /></span>
          <span className="brand-wordmark">JmBai<small>认知复利</small></span>
        </Link>
        <div className="nav-center">
          <Link href="/#atlas"><span className="lang-zh">认知路径</span><span className="lang-en">Path</span></Link>
          <Link href="/category/cognitive-science/"><span className="lang-zh">全部文章</span><span className="lang-en">Articles</span></Link>
          <a href="https://github.com/jianminbai/cognix" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <NavbarActions />
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" data-lang="zh">
      <body className="site-body theme-dark lang-zh">
        <Navbar />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="page-shell"><span>JmBai © {new Date().getFullYear()}</span><span>保持观察，持续校准。</span></div>
        </footer>
      </body>
    </html>
  );
}
