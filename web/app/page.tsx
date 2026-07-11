import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";
import { getCategories } from "@/lib/content";

const stages = [
  {
    number: "01",
    title: "观察问题",
    en: "Observe",
    body: "暂缓结论，先辨认事实、变量、边界与反馈。看见问题真正发生在哪里。",
  },
  {
    number: "02",
    title: "校准判断",
    en: "Calibrate",
    body: "引入基准率、概率与反事实，让直觉接受现实检验，持续缩小判断误差。",
  },
  {
    number: "03",
    title: "形成复利",
    en: "Compound",
    body: "把有效判断沉淀为方法、习惯与系统，让认知在时间中产生累积收益。",
  },
];

export default function Home() {
  const [category] = getCategories();
  const articles = category?.articles ?? [];
  const featured = articles.slice(0, 6);
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags))).slice(0, 8);

  return (
    <>
      <section className="home-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="page-shell hero-layout">
          <div className="hero-content">
            <p className="eyebrow"><span /> JmBai Cognitive Journal</p>
            <h1>
              让思考成为<br />
              <span>可积累的能力。</span>
            </h1>
            <p className="hero-lead lang-zh">从观察问题，到校准判断，再到形成长期复利。</p>
            <p className="hero-lead lang-en">Observe problems, calibrate judgment, then build long-term compounding.</p>
            <div className="hero-search"><SearchDialog prominent /></div>
            <div className="hero-meta">
              <span><strong>{String(articles.length).padStart(2, "0")}</strong> 深度文章</span>
              <span><strong>{String(tags.length).padStart(2, "0")}</strong> 认知主题</span>
              <Link href="/category/cognitive-science/">浏览全部文章 <span>↗</span></Link>
            </div>
          </div>

          <div className="thinking-map" aria-label="观察、判断与复利的认知路径">
            <div className="map-axis" />
            <div className="map-node map-node-a"><i />观察<small>事实与结构</small></div>
            <div className="map-node map-node-b"><i />判断<small>概率与校准</small></div>
            <div className="map-node map-node-c"><i />复利<small>行动与时间</small></div>
            <div className="map-core"><span>Jm</span><small>THINKING<br />SYSTEM</small></div>
            <span className="map-coordinate coordinate-a">23.17 / SIGNAL</span>
            <span className="map-coordinate coordinate-b">SYSTEM / 03</span>
          </div>
        </div>
      </section>

      <section id="atlas" className="path-section">
        <div className="page-shell">
          <div className="section-heading">
            <div><p className="eyebrow">One clear path</p><h2>一条清晰的认知主线</h2></div>
            <p>不是收集更多观点，而是建立一套可以反复使用的思考过程。</p>
          </div>
          <div className="stage-grid">
            {stages.map((stage) => (
              <article key={stage.number} className="stage-item">
                <div className="stage-top"><span>{stage.number}</span><small>{stage.en}</small></div>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
                <i aria-hidden="true">↘</i>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="latest-section">
        <div className="page-shell">
          <div className="section-heading">
            <div><p className="eyebrow">Latest thinking</p><h2>最近更新</h2></div>
            <Link className="text-link" href="/category/cognitive-science/">全部文章 <span>↗</span></Link>
          </div>
          <div className="featured-list">
            {featured.map((article, index) => (
              <a key={article.slug} href={`/article/cognitive-science/${article.slug}/`} className="featured-row">
                <span className="featured-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="featured-main"><strong>{article.title}</strong><small>{article.tags.slice(0, 3).join(" · ")}</small></span>
                <span className="featured-size">约 {Math.max(1, Math.round(article.wordCount / 1000))}k 字</span>
                <span className="featured-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
