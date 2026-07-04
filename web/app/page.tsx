import Link from "next/link";
import { getCategories } from "@/lib/content";

const atlas = [
  { zh: "问题表征", en: "Framing" },
  { zh: "注意力预算", en: "Attention" },
  { zh: "元认知", en: "Meta-cognition" },
  { zh: "决策质量", en: "Decisions" },
  { zh: "问题选择", en: "Problem Choice" },
  { zh: "生命资源", en: "Life Capital" },
];

const pillars = [
  {
    zhTitle: "看清结构",
    enTitle: "See Structure",
    zhBody: "把模糊经验拆成变量、机制和反馈，而不是停在情绪和标签里。",
    enBody: "Turn vague experience into variables, mechanisms, and feedback loops.",
  },
  {
    zhTitle: "校准判断",
    enTitle: "Calibrate Judgment",
    zhBody: "用基准率、二阶后果、反事实复盘和决策日志训练更稳的判断力。",
    enBody: "Use base rates, second-order effects, counterfactuals, and decision logs.",
  },
  {
    zhTitle: "形成复利",
    enTitle: "Compound Insight",
    zhBody: "让注意力、知识、信任和生命资源进入可持续的正向循环。",
    enBody: "Let attention, knowledge, trust, and life capital move into positive loops.",
  },
];

function formatCount(count: number) {
  return count.toString().padStart(2, "0");
}

export default function Home() {
  const [category] = getCategories();
  const articleCount = category?.articles.length ?? 0;
  const featured = category?.articles.slice(0, 6) ?? [];

  return (
    <>
      <section className="hero-field relative min-h-screen overflow-hidden pt-16">
        <div className="neural-grid" aria-hidden="true" />
        <div className="neural-orbit neural-orbit-a" aria-hidden="true" />
        <div className="neural-orbit neural-orbit-b" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="signal-pill mb-6">
              <span className="signal-dot" />
              <span className="lang-zh">认知复利实验室</span>
              <span className="lang-en">Cognitive Compounding Lab</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              Build a sharper mind.
            </h1>
            <p className="hero-copy mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
              <span className="lang-zh">
                用结构化文章整理注意力、学习、元认知、决策质量和问题选择，把日常经验沉淀成可迁移的判断力。
              </span>
              <span className="lang-en">
                A bilingual cognition lab for attention, learning, metacognition, decisions,
                and choosing better problems.
              </span>
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/category/cognitive-science/" className="primary-action">
                <span className="lang-zh">进入认知地图</span>
                <span className="lang-en">Enter Atlas</span>
              </Link>
              <Link href="#atlas" className="secondary-action">
                <span className="lang-zh">查看核心杠杆</span>
                <span className="lang-en">View Levers</span>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="mind-core">
              <div className="mind-core-ring" />
              <div className="mind-core-inner">
                <span className="text-sm uppercase tracking-[0.35em]">Cognition</span>
                <strong className="mt-3 text-6xl font-semibold">
                  {formatCount(articleCount)}
                </strong>
                <span className="mt-2 text-sm">
                  <span className="lang-zh">篇认知文章</span>
                  <span className="lang-en">articles</span>
                </span>
              </div>
            </div>
            {atlas.map((item, index) => (
              <span key={item.en} className={`node-chip node-chip-${index + 1}`}>
                <span className="lang-zh">{item.zh}</span>
                <span className="lang-en">{item.en}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="atlas" className="section-panel py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="section-kicker">Cognitive Atlas</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">
                <span className="lang-zh">少一点噪声，多一点结构。</span>
                <span className="lang-en">Less noise. More structure.</span>
              </h2>
            </div>
            <p className="section-copy max-w-xl text-base leading-7">
              <span className="lang-zh">
                从观察问题，到校准判断，再到形成长期复利。
              </span>
              <span className="lang-en">
                One clear path: observe problems, calibrate judgment, and compound insight.
              </span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <div key={pillar.enTitle} className="glass-card group p-6">
                <div className="mb-8 text-sm text-[var(--accent)]">0{index + 1}</div>
                <h3 className="text-xl font-semibold">
                  <span className="lang-zh">{pillar.zhTitle}</span>
                  <span className="lang-en">{pillar.enTitle}</span>
                </h3>
                <p className="mt-4 leading-7 text-[var(--muted)]">
                  <span className="lang-zh">{pillar.zhBody}</span>
                  <span className="lang-en">{pillar.enBody}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-section py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Latest Nodes</p>
              <h2 className="mt-3 text-3xl font-semibold">
                <span className="lang-zh">认知节点</span>
                <span className="lang-en">Cognitive Nodes</span>
              </h2>
            </div>
            <Link href="/category/cognitive-science/" className="quiet-action">
              <span className="lang-zh">全部文章</span>
              <span className="lang-en">All Articles</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/article/cognitive-science/${article.slug}/`}
                className="node-link"
              >
                <span className="text-base font-medium">{article.title}</span>
                <span className="shrink-0 text-sm text-[var(--accent)]">
                  <span className="lang-zh">阅读</span>
                  <span className="lang-en">Read</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
