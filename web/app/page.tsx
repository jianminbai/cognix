import Link from "next/link";
import { getCategories } from "@/lib/content";

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            cogniX
          </span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto">
          知识复利实验室 — 每一条笔记成为新知识的锚点，
          跨学科连接产生交叉验证的自催化效应
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatBadge label="认知科学" value="4 篇深度分析" />
          <StatBadge label="Spring Cloud" value="30 课体系" />
          <StatBadge label="英语晨读" value="每日更新" />
        </div>
      </div>
    </section>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2 rounded-full border border-card-border bg-card-bg text-sm">
      <span className="text-muted">{label}</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CategoryCard({
  slug,
  name,
  description,
  icon,
  articleCount,
}: {
  slug: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}) {
  return (
    <Link
      href={`/category/${slug}/`}
      className="group block p-6 rounded-xl border border-card-border bg-card-bg hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      <div className="mt-4 text-xs text-accent font-medium">
        {articleCount} 篇文章 &rarr;
      </div>
    </Link>
  );
}

export default function Home() {
  const categories = getCategories();

  return (
    <>
      <HeroSection />
      <section id="categories" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">知识领域</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                slug={cat.slug}
                name={cat.name}
                description={cat.description}
                icon={cat.icon}
                articleCount={cat.articles.length}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 border-t border-card-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">关于知识复利</h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              这个知识库是知识复利理念的实践：每一条笔记成为新知识的锚点，
              跨学科连接产生交叉验证的自催化效应，间隔回顾确保净增长率为正。
            </p>
            <p>
              涵盖从数学本质到工程实践的认知体系：复利原理、知识网络拓扑与自催化回路、
              压力管理的控制论框架、Spring Cloud 微服务架构、英语每日学习等方向。
            </p>
            <blockquote className="mt-6 text-lg font-medium text-foreground italic border-l-4 border-accent pl-4 text-left">
              &ldquo;知识的量不重要，知识的内化结构和连接密度才重要。&rdquo;
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
}
