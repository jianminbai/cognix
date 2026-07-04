import fs from "fs";
import path from "path";
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
  wordCount: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  articles: { slug: string; title: string; wordCount: number }[];
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
      const content = fs.readFileSync(filePath, "utf-8");
      return {
        slug: toArticleSlug(dir, filePath),
        title: extractTitle(content, path.basename(filePath)),
        wordCount: content.length,
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
      const result = await remark().use(remarkGfm).use(html).process(raw);
      return {
        slug,
        title: extractTitle(raw, path.basename(filePath)),
        category: meta.name,
        categorySlug,
        content: result.toString(),
        wordCount: raw.length,
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
