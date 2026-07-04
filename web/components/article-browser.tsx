"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArticleIllustration } from "@/components/article-illustration";

export interface ArticleSummary {
  slug: string;
  title: string;
  tags: string[];
  visualSeed: number;
  wordCount: number;
}

function formatSize(wordCount: number) {
  return Math.max(1, Math.round(wordCount / 1000));
}

export function ArticleBrowser({
  categorySlug,
  articles,
}: {
  categorySlug: string;
  articles: ArticleSummary[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = useMemo(
    () =>
      Array.from(new Set(articles.flatMap((article) => article.tags))).sort((a, b) =>
        a.localeCompare(b, "zh-CN")
      ),
    [articles]
  );
  const filteredArticles = activeTag
    ? articles.filter((article) => article.tags.includes(activeTag))
    : articles;

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#tag=")) return;
    const tag = decodeURIComponent(hash.replace("#tag=", ""));
    if (!tags.includes(tag)) return;
    const timer = window.setTimeout(() => setActiveTag(tag), 0);
    return () => window.clearTimeout(timer);
  }, [tags]);

  function selectTag(tag: string | null) {
    setActiveTag(tag);
    const nextHash = tag ? `#tag=${encodeURIComponent(tag)}` : window.location.pathname;
    window.history.replaceState(null, "", nextHash);
  }

  return (
    <section className="article-browser">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={`tag-filter ${activeTag === null ? "tag-filter-active" : ""}`}
          onClick={() => selectTag(null)}
        >
          <span className="lang-zh">全部</span>
          <span className="lang-en">All</span>
          <span className="tag-count">{articles.length}</span>
        </button>
        {tags.map((tag) => {
          const count = articles.filter((article) => article.tags.includes(tag)).length;
          return (
            <button
              type="button"
              key={tag}
              className={`tag-filter ${activeTag === tag ? "tag-filter-active" : ""}`}
              onClick={() => selectTag(tag)}
            >
              {tag}
              <span className="tag-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-5 text-sm text-[var(--muted)]">
        <span className="lang-zh">当前显示 {filteredArticles.length} 篇文章</span>
        <span className="lang-en">Showing {filteredArticles.length} articles</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${categorySlug}/${article.slug}/`}
            className="article-card"
          >
            <ArticleIllustration
              title={article.title}
              tags={article.tags}
              seed={article.visualSeed}
              compact
            />
            <span className="article-card-body">
              <span className="text-lg font-semibold">{article.title}</span>
              <span className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </span>
            </span>
            <span className="article-card-meta">
              <span>
                <span className="lang-zh">约 {formatSize(article.wordCount)}k 字</span>
                <span className="lang-en">~{formatSize(article.wordCount)}k chars</span>
              </span>
              <span className="text-[var(--accent)]">
                <span className="lang-zh">阅读</span>
                <span className="lang-en">Read</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
