import Link from "next/link";
import { ArticleIllustration } from "@/components/article-illustration";
import { getArticle, getAllArticlePaths } from "@/lib/content";

export function generateStaticParams() {
  return getAllArticlePaths().map(({ categorySlug, articleSlug }) => ({
    category: categorySlug,
    slug: articleSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  return {
    title: article ? `${article.title} - JmBai` : "JmBai",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 text-center">
        <h1 className="text-2xl font-bold">
          <span className="lang-zh">文章未找到</span>
          <span className="lang-en">Article not found</span>
        </h1>
        <Link href="/" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          <span className="lang-zh">返回首页</span>
          <span className="lang-en">Back home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-32 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="transition hover:text-[var(--accent)]">
          <span className="lang-zh">首页</span>
          <span className="lang-en">Home</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${article.categorySlug}/`}
          className="transition hover:text-[var(--accent)]"
        >
          {article.category}
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{article.title}</span>
      </div>

      <article>
        <header className="mb-10 grid gap-8 border-b border-[var(--line)] pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/category/${article.categorySlug}/#tag=${encodeURIComponent(tag)}`}
                  className="tag-chip tag-chip-link"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">{article.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <span>
                <span className="lang-zh">约 {Math.max(1, Math.round(article.wordCount / 1000))}k 字</span>
                <span className="lang-en">~{Math.max(1, Math.round(article.wordCount / 1000))}k chars</span>
              </span>
              <span>{article.category}</span>
            </div>
          </div>
          <ArticleIllustration
            title={article.title}
            tags={article.tags}
            seed={article.visualSeed}
          />
        </header>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <div className="mt-12 border-t border-[var(--line)] pt-6">
        <Link
          href={`/category/${article.categorySlug}/`}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          &larr;{" "}
          <span className="lang-zh">返回 {article.category}</span>
          <span className="lang-en">Back to {article.category}</span>
        </Link>
      </div>
    </div>
  );
}
