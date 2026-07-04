import Link from "next/link";
import { getCategories } from "@/lib/content";

export function generateStaticParams() {
  return getCategories().map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} - cogniX` : "cogniX",
    description: cat?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 text-center">
        <h1 className="text-2xl font-bold">
          <span className="lang-zh">分类未找到</span>
          <span className="lang-en">Category not found</span>
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
      <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
        &larr;{" "}
        <span className="lang-zh">返回首页</span>
        <span className="lang-en">Back home</span>
      </Link>

      <div className="mb-10 mt-8">
        <div className="mb-3 text-4xl text-[var(--accent)]">{category.icon}</div>
        <h1 className="text-4xl font-semibold">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{category.description}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <span className="lang-zh">共 {category.articles.length} 篇文章</span>
          <span className="lang-en">{category.articles.length} articles</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {category.articles.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${category.slug}/${article.slug}/`}
            className="node-link"
          >
            <span className="text-base font-medium">{article.title}</span>
            <span className="flex shrink-0 items-center gap-4 text-sm text-[var(--muted)]">
              <span>
                <span className="lang-zh">约 {Math.max(1, Math.round(article.wordCount / 1000))}k 字</span>
                <span className="lang-en">~{Math.max(1, Math.round(article.wordCount / 1000))}k chars</span>
              </span>
              <span className="text-[var(--accent)]">
                <span className="lang-zh">阅读</span>
                <span className="lang-en">Read</span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {category.articles.length === 0 && (
        <div className="py-12 text-center text-[var(--muted)]">
          <span className="lang-zh">暂无文章，敬请期待。</span>
          <span className="lang-en">No articles yet.</span>
        </div>
      )}
    </div>
  );
}
