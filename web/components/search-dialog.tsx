"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface SearchDoc {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  tags: string[];
  headings?: string;
  excerpt: string;
}

interface SearchHit extends SearchDoc {
  score: number;
}

interface SearchPayload {
  documents?: SearchDoc[];
}

const MAX_RESULTS = 10;
const QUICK_QUERIES = ["复利", "认知偏差", "复杂系统", "注意力"];

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim();
}

function queryTerms(query: string) {
  const normalized = normalize(query);
  if (!normalized) return [];
  const chunks = normalized.match(/[\p{Script=Han}]+|[a-z0-9_]+/gu) ?? [];
  return Array.from(new Set([normalized, ...chunks]));
}

function scoreDocuments(documents: SearchDoc[], query: string): SearchHit[] {
  const phrase = normalize(query);
  const terms = queryTerms(query);
  if (!phrase || terms.length === 0) return [];

  return documents
    .map((doc) => {
      const title = normalize(doc.title);
      const tags = normalize(doc.tags.join(" "));
      const headings = normalize(doc.headings ?? "");
      const excerpt = normalize(doc.excerpt);
      const all = `${title} ${tags} ${headings} ${excerpt}`;
      if (!terms.every((term) => all.includes(term))) return null;

      let score = 0;
      if (title === phrase) score += 80;
      if (title.includes(phrase)) score += 36;
      if (tags.includes(phrase)) score += 24;
      if (headings.includes(phrase)) score += 16;
      if (excerpt.includes(phrase)) score += 8;
      for (const term of terms) {
        if (title.includes(term)) score += 12;
        if (tags.includes(term)) score += 8;
        if (headings.includes(term)) score += 5;
        if (excerpt.includes(term)) score += 1;
      }
      return { ...doc, score };
    })
    .filter((hit): hit is SearchHit => hit !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-CN"))
    .slice(0, MAX_RESULTS);
}

async function fetchDocuments(): Promise<SearchDoc[]> {
  const configuredBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const cacheKey = Date.now().toString(36);
  const candidates = Array.from(
    new Set([`${configuredBase}/search-index.json`, "/search-index.json", "/cognix/search-index.json"])
  ).map((url) => `${url}?v=${cacheKey}`);
  const failures: string[] = [];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        failures.push(`${url} (${response.status})`);
        continue;
      }
      const payload = (await response.json()) as SearchPayload | SearchDoc[];
      const documents = Array.isArray(payload) ? payload : payload.documents;
      if (Array.isArray(documents) && documents.length > 0) return documents;
      failures.push(`${url} (empty)`);
    } catch {
      failures.push(`${url} (network)`);
    }
  }
  throw new Error(failures.join(" · "));
}

function highlight(text: string, query: string): ReactNode {
  const terms = queryTerms(query).sort((a, b) => b.length - a.length);
  if (!text || terms.length === 0) return text;
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const expression = new RegExp(`(${escaped.join("|")})`, "ig");
  return text.split(expression).map((part, index) =>
    terms.some((term) => normalize(part) === term) ? (
      <mark key={`${part}-${index}`} className="search-hit-mark">{part}</mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

function snippet(excerpt: string, query: string) {
  const normalizedExcerpt = normalize(excerpt);
  const positions = queryTerms(query)
    .map((term) => normalizedExcerpt.indexOf(term))
    .filter((position) => position >= 0);
  const position = positions.length > 0 ? Math.min(...positions) : 0;
  const start = Math.max(0, position - 34);
  const end = Math.min(excerpt.length, start + 150);
  return `${start > 0 ? "…" : ""}${excerpt.slice(start, end)}${end < excerpt.length ? "…" : ""}`;
}

export function SearchDialog({ prominent = false }: { prominent?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState(false);
  const requestRef = useRef<Promise<SearchDoc[]> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((value) => !value);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen || documents || error) return;
    requestRef.current ??= fetchDocuments();
    requestRef.current
      .then((items) => setDocuments(items))
      .catch(() => {
        requestRef.current = null;
        setError(true);
      });
  }, [documents, error, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const hits = useMemo(() => scoreDocuments(documents ?? [], query), [documents, query]);
  const hasQuery = query.trim().length > 0;

  const dialog = isOpen && typeof document !== "undefined"
    ? createPortal(
        <div className="search-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-label="文章搜索">
            <header className="search-dialog-head">
              <SearchIcon />
              <input
                ref={inputRef}
                className="search-input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索概念、问题或文章"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" className="search-close" onClick={close} aria-label="关闭搜索">Esc</button>
            </header>

            <div className="search-dialog-body">
              {error ? (
                <div className="search-state">
                  <strong>搜索索引暂时无法加载</strong>
                  <span>请刷新页面后重试。</span>
                  <button type="button" onClick={() => setError(false)}>重新加载</button>
                </div>
              ) : !documents ? (
                <div className="search-state"><span className="search-loader" />正在准备全文索引</div>
              ) : !hasQuery ? (
                <div className="search-intro">
                  <p>从一个概念开始，进入相关的标题、章节与正文。</p>
                  <div className="search-suggestions">
                    {QUICK_QUERIES.map((item) => (
                      <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>
                    ))}
                  </div>
                </div>
              ) : hits.length === 0 ? (
                <div className="search-state"><strong>没有找到“{query}”</strong><span>试试更短的概念或相近表达。</span></div>
              ) : (
                <ul className="search-results">
                  {hits.map((hit, index) => (
                    <li key={hit.id}>
                      <a href={`/article/${hit.categorySlug}/${hit.slug}/`} className="search-result">
                        <span className="search-result-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="search-result-content">
                          <strong>{highlight(hit.title, query)}</strong>
                          <span>{highlight(snippet(hit.excerpt, query), query)}</span>
                          <small>{hit.tags.slice(0, 3).join(" · ")}</small>
                        </span>
                        <span className="search-result-arrow" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <footer className="search-dialog-foot">
              <span>{hasQuery ? `${hits.length} 个结果` : `${documents?.length ?? 0} 篇文章`}</span>
              <span>全文检索</span>
            </footer>
          </section>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button type="button" className={prominent ? "search-trigger search-trigger-prominent" : "search-trigger"} onClick={open} aria-label="搜索文章">
        <SearchIcon />
        <span className="lang-zh">{prominent ? "搜索一个你正在思考的问题" : "搜索"}</span>
        <span className="lang-en">{prominent ? "Search a question you are thinking about" : "Search"}</span>
        <kbd>{prominent ? "Ctrl K" : "K"}</kbd>
      </button>
      {dialog}
    </>
  );
}

function SearchIcon() {
  return (
    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
