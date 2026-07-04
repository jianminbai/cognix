import Link from "next/link";
import { ArticleBrowser } from "@/components/article-browser";
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
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8">
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

      <ArticleBrowser categorySlug={category.slug} articles={category.articles} />

      {category.articles.length === 0 && (
        <div className="py-12 text-center text-[var(--muted)]">
          <span className="lang-zh">暂无文章，敬请期待。</span>
          <span className="lang-en">No articles yet.</span>
        </div>
      )}
    </div>
  );
}
