import Link from "next/link";
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
    title: article ? `${article.title} — cogniX` : "cogniX",
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">文章未找到</h1>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link
          href={`/category/${article.categorySlug}/`}
          className="hover:text-accent transition-colors"
        >
          {article.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{article.title}</span>
      </div>

      <article>
        <header className="mb-8 pb-6 border-b border-card-border">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted">
            <span>约 {Math.round(article.wordCount / 1000)}k 字</span>
            <span>{article.category}</span>
          </div>
        </header>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <div className="mt-12 pt-6 border-t border-card-border">
        <Link
          href={`/category/${article.categorySlug}/`}
          className="text-accent hover:underline text-sm"
        >
          &larr; 返回 {article.category}
        </Link>
      </div>
    </div>
  );
}
