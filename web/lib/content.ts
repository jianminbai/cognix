import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const contentRoot = path.join(process.cwd(), "..");

export interface Article {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  content: string;
  tags: string[];
  visualSeed: number;
  wordCount: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  articles: { slug: string; title: string; tags: string[]; visualSeed: number; wordCount: number }[];
}

const CATEGORIES: Record<string, { name: string; description: string; icon: string }> = {
  "cognitive-science": {
    name: "认知科学",
    description: "注意力、元认知、决策质量、问题选择与长期成长",
    icon: "◈",
  },
};

function extractTitle(content: string, filename: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)/);
    if (match) return match[1].replace(/[*_`]/g, "").trim();
  }
  return filename
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function stableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const TAG_RULES: { tag: string; patterns: string[] }[] = [
  { tag: "自我理解", patterns: ["意识", "自由意志", "情绪", "记忆", "身份", "死亡", "习惯"] },
  { tag: "判断决策", patterns: ["认知偏差", "概率", "可证伪", "决策", "机会成本", "风险", "边际"] },
  { tag: "注意力", patterns: ["注意力", "信息", "语言", "认知负荷", "切换"] },
  { tag: "社会结构", patterns: ["制度", "激励", "权力", "阶层", "文化", "群体", "国家", "法律", "教育", "城市"] },
  { tag: "财富经济", patterns: ["货币", "通货膨胀", "复利", "稀缺", "资本", "劳动", "消费", "全球化"] },
  { tag: "复杂系统", patterns: ["复杂系统", "熵增", "反馈", "路径依赖", "黑天鹅", "尺度"] },
  { tag: "技术未来", patterns: ["技术", "平台", "算法", "自动化", "人机", "数字", "生物", "长期主义", "AI"] },
  { tag: "长期成长", patterns: ["复利", "成长", "生命资本", "长期", "信任", "边界", "结构改进"] },
];

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function deriveTags(title: string, relativeSlug: string, frontmatterTags: unknown): string[] {
  const tags = new Set(normalizeTags(frontmatterTags));
  const haystack = `${title}\n${relativeSlug}`;

  for (const rule of TAG_RULES) {
    if (rule.patterns.some((pattern) => haystack.includes(pattern))) {
      tags.add(rule.tag);
    }
  }

  if (relativeSlug.startsWith("levers-")) tags.add("认知杠杆");
  if (relativeSlug.startsWith("expansion-")) tags.add("认知拓展");
  if (tags.size === 0) tags.add("认知科学");

  return Array.from(tags).slice(0, 4);
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      files.push(fullPath);
    }
  }
  return files;
}

function toArticleSlug(dir: string, filePath: string): string {
  return path
    .relative(dir, filePath)
    .replace(/\.md$/, "")
    .split(path.sep)
    .join("-");
}

export function getCategories(): Category[] {
  return Object.entries(CATEGORIES).map(([slug, meta]) => {
    const dir = path.join(contentRoot, slug);
    const files = getMarkdownFiles(dir);
    const articles = files.map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(raw);
      const slug = toArticleSlug(dir, filePath);
      const title = extractTitle(parsed.content, path.basename(filePath));
      return {
        slug,
        title,
        tags: deriveTags(title, slug, parsed.data.tags),
        visualSeed: stableHash(slug),
        wordCount: parsed.content.length,
      };
    });
    return { slug, ...meta, articles };
  });
}

export async function getArticle(
  categorySlug: string,
  articleSlug: string
): Promise<Article | null> {
  const meta = CATEGORIES[categorySlug];
  if (!meta) return null;

  const dir = path.join(contentRoot, categorySlug);
  const files = getMarkdownFiles(dir);

  for (const filePath of files) {
    const slug = toArticleSlug(dir, filePath);
    if (slug === articleSlug) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(raw);
      const title = extractTitle(parsed.content, path.basename(filePath));
      const result = await remark().use(remarkGfm).use(html).process(parsed.content);
      return {
        slug,
        title,
        category: meta.name,
        categorySlug,
        tags: deriveTags(title, slug, parsed.data.tags),
        visualSeed: stableHash(slug),
        content: result.toString(),
        wordCount: parsed.content.length,
      };
    }
  }
  return null;
}

export function getAllArticlePaths(): { categorySlug: string; articleSlug: string }[] {
  const paths: { categorySlug: string; articleSlug: string }[] = [];
  for (const categorySlug of Object.keys(CATEGORIES)) {
    const dir = path.join(contentRoot, categorySlug);
    const files = getMarkdownFiles(dir);
    for (const filePath of files) {
      paths.push({ categorySlug, articleSlug: toArticleSlug(dir, filePath) });
    }
  }
  return paths;
}
