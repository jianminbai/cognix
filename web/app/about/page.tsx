import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我 - JmBai",
  description: "JmBai，一名 IT 软件与运维工程师，在代码、系统和真实问题之间持续实践。",
};

const practices = [
  {
    number: "01",
    label: "BUILD",
    titleZh: "构建软件",
    titleEn: "Build software",
    bodyZh: "把需求转化为清晰、可靠、可维护的软件，让想法真正进入现实。",
    bodyEn: "Turn needs into clear, reliable, and maintainable software that works in the real world.",
  },
  {
    number: "02",
    label: "OPERATE",
    titleZh: "守护系统",
    titleEn: "Operate systems",
    bodyZh: "关注系统在压力、故障和变化中的表现，用自动化与工程纪律维持稳定。",
    bodyEn: "Keep systems dependable through pressure, failure, and change with automation and discipline.",
  },
  {
    number: "03",
    label: "APPLY AI",
    titleZh: "应用 AI",
    titleEn: "Apply AI",
    bodyZh: "将大模型、智能体与自动化能力融入研发和运维，在知识检索、故障分析、流程协同与辅助决策中创造实际价值。",
    bodyEn: "Apply language models, agents, and automation to engineering, operations, diagnosis, and decision support.",
  },
  {
    number: "04",
    label: "REFLECT",
    titleZh: "沉淀认知",
    titleEn: "Reflect deeply",
    bodyZh: "从实践中提炼结构与方法，校准判断，把一次经验变成可以复用的能力。",
    bodyEn: "Extract structures from practice, calibrate judgment, and turn experience into reusable ability.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-grid" aria-hidden="true" />
        <div className="page-shell about-hero-layout">
          <div className="about-heading">
            <p className="eyebrow"><span /> About JmBai</p>
            <h1>
              <span className="lang-zh">在代码与系统之间，<br />解决真实问题。</span>
              <span className="lang-en">Between code and systems,<br />solve real problems.</span>
            </h1>
          </div>

          <div className="about-mark" aria-label="JmBai">
            <span className="about-mark-index">IT / 01</span>
            <strong>JmBai</strong>
            <div><span>SOFTWARE</span><span>OPERATIONS</span><span>AI SYSTEMS</span></div>
            <i />
          </div>
        </div>
      </section>

      <section className="about-intro">
        <div className="page-shell about-intro-layout">
          <p className="about-section-label"><span>01</span> PROFILE</p>
          <div className="about-statement">
            <p className="lang-zh">
              我是 JmBai，一名 IT 软件和运维工程师。长期在代码、系统与真实故障之间工作，
              我既关注软件如何被设计和构建，也关心它上线以后能否稳定、可观测并持续演进。
              对我来说，工程不只是完成需求，而是理解问题、控制复杂度，并为长期运行负责。
            </p>
            <p className="lang-zh">
              我也持续探索 AI 在工程场景中的实际应用，包括大语言模型、智能体、知识检索、
              运维自动化和智能故障分析。我关注的不是简单接入一个模型，而是如何让 AI 理解上下文、
              接入工具、保留证据并接受人的校验，最终成为可靠的软件能力和生产力系统。
            </p>
            <p className="lang-zh">
              这个网站记录我对技术实践、认知方法和长期成长的思考。我希望把工作中的经验继续向下追问：
              一个问题为什么反复发生，什么判断值得信任，怎样建立更清晰、更可靠、能够长期复利的系统。
            </p>
            <p className="lang-en">
              I am JmBai, an IT software and operations engineer working where code, systems,
              and real-world failures meet. I care not only about how software is designed and built,
              but also whether it remains observable, dependable, and capable of evolving after launch.
            </p>
            <p className="lang-en">
              I also explore practical AI systems across software and operations, including language models,
              agents, knowledge retrieval, automation, and intelligent incident analysis. My focus is turning AI
              into reliable engineering capability through context, tools, evidence, and human verification.
            </p>
            <p className="lang-en">
              This site is where I connect engineering practice with cognition and long-term growth:
              understanding why problems recur, which judgments deserve trust, and how to build systems
              that become clearer and more resilient over time.
            </p>
          </div>
        </div>
      </section>

      <section className="about-practice">
        <div className="page-shell">
          <div className="about-section-head">
            <p className="about-section-label"><span>02</span> PRACTICE</p>
            <h2><span className="lang-zh">我持续构建的能力</span><span className="lang-en">Capabilities in practice</span></h2>
          </div>
          <div className="about-practice-grid">
            {practices.map((practice) => (
              <article key={practice.number} className="about-practice-item">
                <div><span>{practice.number}</span><small>{practice.label}</small></div>
                <h3><span className="lang-zh">{practice.titleZh}</span><span className="lang-en">{practice.titleEn}</span></h3>
                <p><span className="lang-zh">{practice.bodyZh}</span><span className="lang-en">{practice.bodyEn}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact">
        <div className="page-shell about-contact-layout">
          <div>
            <p className="about-section-label"><span>03</span> CONTACT</p>
            <h2><span className="lang-zh">交流一个真实的问题。</span><span className="lang-en">Start with a real problem.</span></h2>
          </div>
          <a className="about-email" href="mailto:imjmbai@qq.com">
            <span>imjmbai@qq.com</span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>
    </div>
  );
}
