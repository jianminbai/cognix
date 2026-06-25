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
    title: cat ? `${cat.name} — cogniX` : "cogniX",
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">分类未找到</h1>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        &larr; 返回首页
      </Link>

      <div className="mt-6 mb-10">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-muted">{category.description}</p>
        <p className="mt-1 text-sm text-muted">
          共 {category.articles.length} 篇文章
        </p>
      </div>

      <div className="space-y-4">
        {category.articles.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${category.slug}/${article.slug}/`}
            className="group block p-5 rounded-lg border border-card-border bg-card-bg hover:border-accent/50 hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-lg font-medium group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted">
              <span>
                约 {Math.round(article.wordCount / 1000)}k 字
              </span>
              <span className="text-accent">阅读全文 &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      {category.articles.length === 0 && (
        <div className="text-center py-12 text-muted">
          暂无文章，敬请期待
        </div>
      )}
    </div>
  );
}
