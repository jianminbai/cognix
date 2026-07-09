// Build-time script: walks ../cognitive-science/**/*.md, builds a MiniSearch
// index, and writes it to public/search-index.json. Run via `npm run build:index`
// (also wired into `prebuild`). Pure Node ESM so no transpiler is needed.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MiniSearch from "minisearch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(webDir, "..");
// Mirror `lib/content.ts` convention: contentRoot is the parent of each
// category directory (e.g. `cognix/`), and each category lives under it.
const contentRoot = projectRoot;
const outPath = path.join(webDir, "public", "search-index.json");

// Only one category today, kept here so the index can be regenerated when more
// categories are added without changing the search UI.
const CATEGORIES = {
  "cognitive-science": { name: "认知科学" },
};

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

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      files.push(fullPath);
    }
  }
  return files;
}

function toArticleSlug(dir, filePath) {
  return path
    .relative(dir, filePath)
    .replace(/\.md$/, "")
    .split(path.sep)
    .join("-");
}

function extractTitle(content) {
  for (const line of content.split("\n")) {
    const m = line.match(/^#\s+(.+)/);
    if (m) return m[1].replace(/[*_`]/g, "").trim();
  }
  return null;
}

// Capture all H1/H2/H3 headings as a dedicated indexed field. These are the
// densest concentration of topical keywords per article, so weighting them
// boosts topic-specific matches (e.g. typing "复利" surfaces "复利的元理论…").
function extractHeadings(content) {
  const out = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^#{1,3}\s+(.+)/);
    if (m) {
      const heading = m[1].replace(/[*_`]/g, "").trim();
      if (heading) out.push(heading);
    }
  }
  return out.join(" • ");
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function deriveTags(title, relativeSlug, frontmatterTags) {
  const tags = new Set(normalizeTags(frontmatterTags));
  const haystack = `${title}\n${relativeSlug}`;
  for (const rule of TAG_RULES) {
    if (rule.patterns.some((p) => haystack.includes(p))) tags.add(rule.tag);
  }
  if (relativeSlug.startsWith("levers-")) tags.add("认知杠杆");
  if (tags.size === 0) tags.add("认知科学");
  return Array.from(tags).slice(0, 4);
}

// Build a compact plain-text excerpt suitable for snippet display and for
// indexing. Strip common markdown noise so matching keywords isn't blocked by
// syntax punctuation.
function buildExcerpt(body, maxChars = 800) {
  const cleaned = body
    .replace(/^---\s*$/gm, " ") // frontmatter dashes
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/^#{1,6}\s*/gm, "") // heading hashes
    .replace(/^>\s?/gm, "") // blockquote prefix
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // markdown links / images
    .replace(/[*_~]/g, ""); // emphasis markers
  // Collapse whitespace runs into single spaces.
  const flat = cleaned.replace(/\s+/g, " ").trim();
  return flat.length > maxChars ? `${flat.slice(0, maxChars)}…` : flat;
}

// Custom tokenizer: English/ASCII words (lower-cased) + each CJK character
// individually. Necessary because MiniSearch's default tokenizer splits on
// whitespace, which would index CJK as one giant unsearchable token.
function tokenize(text) {
  if (!text) return [];
  const tokens = [];
  const wordRe = /[A-Za-z0-9_]+/g;
  let m;
  while ((m = wordRe.exec(text)) !== null) {
    tokens.push(m[0].toLowerCase());
  }
  for (const ch of text) {
    if (/[一-鿿㐀-䶿]/.test(ch)) {
      tokens.push(ch);
    }
  }
  return tokens;
}

function buildDocuments() {
  const docs = [];
  for (const [categorySlug] of Object.entries(CATEGORIES)) {
    const dir = path.join(contentRoot, categorySlug);
    const files = getMarkdownFiles(dir);
    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(raw);
      const slug = toArticleSlug(dir, filePath);
      const title = extractTitle(parsed.content) ?? path.basename(filePath, ".md");
      const tags = deriveTags(title, slug, parsed.data.tags);
      const headings = extractHeadings(parsed.content);
      const excerpt = buildExcerpt(parsed.content);
      docs.push({
        id: `${categorySlug}/${slug}`,
        categorySlug,
        slug,
        title,
        tags,
        headings,
        excerpt,
      });
    }
  }
  return docs;
}

function main() {
  if (!fs.existsSync(contentRoot)) {
    console.warn(`[search-index] content root not found: ${contentRoot}`);
    return;
  }
  const documents = buildDocuments();
  const index = new MiniSearch({
    fields: ["title", "headings", "tags", "excerpt"],
    storeFields: ["title", "slug", "categorySlug", "tags", "excerpt"],
    searchOptions: {
      boost: { title: 3, headings: 2.5, tags: 2 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: "AND",
    },
    // `extractField` lets us feed tokenizers a normalized string per field.
    extractField: (doc, fieldName) => {
      const value = doc[fieldName];
      if (Array.isArray(value)) return value.join(" ");
      return String(value ?? "");
    },
    tokenize: tokenize,
    processTerm: (term) => (term ? term.toLowerCase() : term),
  });
  index.addAll(documents);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({
      version: 2,
      generatedAt: new Date().toISOString(),
      documents,
      miniSearch: index.toJSON(),
    })
  );
  const bytes = fs.statSync(outPath).size;
  console.log(
    `[search-index] wrote ${documents.length} articles -> ${path.relative(webDir, outPath)} (${(bytes / 1024).toFixed(1)} kB)`
  );
}

main();
