import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(webDir, "..");
const outPath = path.join(webDir, "public", "search-index.json");

const TAG_RULES = [
  { tag: "自我理解", patterns: ["意识", "自由意志", "情绪", "记忆", "身份", "死亡", "习惯"] },
  { tag: "判断决策", patterns: ["认知偏差", "概率", "可证伪", "决策", "机会成本", "风险", "边际"] },
  { tag: "注意力", patterns: ["注意力", "信息", "语言", "认知负荷", "切换"] },
  { tag: "社会结构", patterns: ["制度", "激励", "权力", "阶层", "文化", "群体", "国家", "法律", "教育", "城市"] },
  { tag: "财富经济", patterns: ["货币", "通货膨胀", "复利", "稀缺", "资本", "劳动", "消费", "全球化"] },
  { tag: "复杂系统", patterns: ["复杂系统", "熵增", "反馈", "路径依赖", "黑天鹅", "尺度"] },
  { tag: "技术未来", patterns: ["技术", "平台", "算法", "自动化", "人机", "数字", "生物", "长期主义", "AI"] },
  { tag: "长期成长", patterns: ["复利", "成长", "生命资本", "长期", "信任", "边界", "结构改进"] },
];

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return entry.name.endsWith(".md") && entry.name !== "README.md" ? [target] : [];
  });
}

function titleFrom(content, filename) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].replace(/[*_`]/g, "").trim() : path.basename(filename, ".md");
}

function tagsFor(title, slug, value) {
  const tags = new Set(Array.isArray(value) ? value.map(String) : []);
  for (const rule of TAG_RULES) {
    if (rule.patterns.some((pattern) => `${title} ${slug}`.includes(pattern))) tags.add(rule.tag);
  }
  if (slug.startsWith("levers-")) tags.add("认知杠杆");
  if (tags.size === 0) tags.add("认知科学");
  return Array.from(tags).slice(0, 4);
}

function plainText(content, maxLength = 620) {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, maxLength);
}

const categorySlug = "cognitive-science";
const categoryDir = path.join(projectRoot, categorySlug);
const documents = markdownFiles(categoryDir).map((filePath) => {
  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const slug = path.relative(categoryDir, filePath).replace(/\.md$/, "").split(path.sep).join("-");
  const title = titleFrom(parsed.content, filePath);
  const headings = Array.from(parsed.content.matchAll(/^#{1,3}\s+(.+)/gm), (match) => match[1]).join(" · ");
  return {
    id: `${categorySlug}/${slug}`,
    categorySlug,
    slug,
    title,
    tags: tagsFor(title, slug, parsed.data.tags),
    headings,
    excerpt: plainText(parsed.content),
  };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ version: 3, documents }));
const size = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`[search-index] wrote ${documents.length} articles (${size} kB)`);
