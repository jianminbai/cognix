import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cogniX — 知识复利实验室",
  description:
    "个人知识积累与复利的平台，汇聚 AI、认知科学、英语学习、微服务架构等方向的学习笔记与深度分析",
  keywords: ["知识管理", "认知科学", "Spring Cloud", "英语学习", "AI"],
};

function Navbar() {
  return (
    <nav className="border-b border-card-border bg-card-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              cogniX
            </span>
            <span className="text-xs text-muted hidden sm:inline">
              知识复利实验室
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/#categories"
              className="text-muted hover:text-foreground transition-colors"
            >
              知识库
            </Link>
            <Link
              href="/#about"
              className="text-muted hover:text-foreground transition-colors"
            >
              关于
            </Link>
            <a
              href="https://github.com/jianminbai/cognix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-card-border mt-auto py-8 text-center text-sm text-muted">
      <div className="max-w-6xl mx-auto px-4">
        <p>
          cogniX &copy; {new Date().getFullYear()} &mdash;
          知识的量不重要，知识的内化结构和连接密度才重要
        </p>
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
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
