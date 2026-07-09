"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import MiniSearch from "minisearch";

interface SearchDoc {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  tags: string[];
  excerpt: string;
}

interface SearchHit {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  tags: string[];
  excerpt: string;
  score: number;
}

// Same CJK + ASCII word tokenizer used at index build time. Keep these in
// sync — if either side changes the other must follow.
function tokenize(text: string): string[] {
  if (!text) return [];
  const tokens: string[] = [];
  const wordRe = /[A-Za-z0-9_]+/g;
  let m: RegExpExecArray | null;
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

const MAX_RESULTS = 12;

async function loadIndex(): Promise<MiniSearch<SearchDoc>> {
  const url = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`failed to load search index: ${res.status}`);
  }
  const json = await res.text();
  return MiniSearch.loadJSON<SearchDoc>(json, {
    fields: ["title", "headings", "tags", "excerpt"],
    storeFields: ["title", "slug", "categorySlug", "tags", "excerpt"],
    searchOptions: {
      boost: { title: 3, headings: 2.5, tags: 2 },
      prefix: true,
      fuzzy: 0.2,
    },
    extractField: (doc, fieldName) => {
      const value = (doc as unknown as Record<string, unknown>)[fieldName];
      if (Array.isArray(value)) return value.join(" ");
      return value == null ? "" : String(value);
    },
    tokenize,
    processTerm: (term) => (term ? term.toLowerCase() : term),
  });
}

// Insert `<mark>` around each occurrence of any query term. Matches are
// case-insensitive and split so they survive mixed-language prefixes.
function highlight(text: string, terms: string[]): ReactNode {
  if (!text || terms.length === 0) return text;
  const escaped = terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter((t) => t.length > 0);
  if (escaped.length === 0) return text;
  const re = new RegExp(`(${escaped.join("|")})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) && i % 2 === 1 ? (
      <mark key={i} className="search-hit-mark">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// Build a snippet that concentrates around the first matching term so the
// preview shows why this hit was returned.
function buildSnippet(excerpt: string, terms: string[]): string {
  if (!excerpt) return "";
  if (terms.length === 0) return excerpt.slice(0, 140);
  const lower = excerpt.toLowerCase();
  let earliest = -1;
  for (const t of terms) {
    const idx = lower.indexOf(t.toLowerCase());
    if (idx !== -1 && (earliest === -1 || idx < earliest)) {
      earliest = idx;
    }
  }
  if (earliest === -1) return excerpt.slice(0, 140);
  const start = Math.max(0, earliest - 30);
  const end = Math.min(excerpt.length, earliest + 110);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < excerpt.length ? "…" : "";
  return prefix + excerpt.slice(start, end) + suffix;
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<MiniSearch<SearchDoc> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const indexPromiseRef = useRef<Promise<MiniSearch<SearchDoc>> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setError(null);
  }, []);

  // Cmd/Ctrl+K toggles the dialog from anywhere on the page.
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      const isOpenShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isOpenShortcut) {
        event.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  // Lazy-load the index + indexer the first time the dialog is opened. The
  // ~120 KB gzipped JSON would otherwise sit in the initial page weight.
  useEffect(() => {
    if (!isOpen || index || error) return;
    if (!indexPromiseRef.current) {
      indexPromiseRef.current = loadIndex();
    }
    indexPromiseRef.current
      .then((idx) => {
        setIndex(idx);
        setError(null);
      })
      .catch((err: Error) => {
        indexPromiseRef.current = null;
        setError(err.message);
      });
  }, [error, index, isOpen]);

  // Focus the input when the dialog opens.
  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  const hits = useMemo<SearchHit[]>(() => {
    if (!index) return [];
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];
    const results = index.search(trimmed, { prefix: true, fuzzy: 0.2 });
    return results.slice(0, MAX_RESULTS).map((r) => ({
      id: r.id as string,
      categorySlug: (r as unknown as Record<string, string>).categorySlug,
      slug: (r as unknown as Record<string, string>).slug,
      title: (r as unknown as Record<string, string>).title,
      tags: (r as unknown as Record<string, string[]>).tags ?? [],
      excerpt: (r as unknown as Record<string, string>).excerpt,
      score: r.score,
    }));
  }, [index, query]);

  const queryTerms = useMemo(() => tokenize(query.trim()), [query]);
  const isLoading = isOpen && !index && !error;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");
  const shortcutHint = isMac ? "⌘ K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={open}
        aria-label="Open article search"
      >
        <SearchIcon />
        <span className="search-trigger-label lang-zh">搜索文章</span>
        <span className="search-trigger-label lang-en">Search</span>
        <span className="search-shortcut" aria-hidden="true">
          {shortcutHint}
        </span>
      </button>

      {isOpen ? (
        <div
          className="search-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Article search"
          >
            <div className="search-dialog-head">
              <SearchIcon />
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="搜索全部文章 / Search all articles"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="search-close"
                onClick={close}
                aria-label="Close search"
              >
                <span className="lang-zh">关闭</span>
                <span className="lang-en">Esc</span>
              </button>
            </div>
            <div className="search-dialog-body">
              {error ? (
                <div className="search-empty">
                  <span className="lang-zh">索引加载失败：{error}</span>
                  <span className="lang-en">Failed to load index: {error}</span>
                </div>
              ) : isLoading ? (
                <div className="search-empty">
                  <span className="lang-zh">加载索引…</span>
                  <span className="lang-en">Loading index…</span>
                </div>
              ) : query.trim().length === 0 ? (
                <div className="search-empty">
                  <span className="lang-zh">输入关键词以搜索标题、章节、标签和正文。</span>
                  <span className="lang-en">
                    Type to search titles, headings, tags, and body text.
                  </span>
                </div>
              ) : hits.length === 0 ? (
                <div className="search-empty">
                  <span className="lang-zh">没有匹配的文章。</span>
                  <span className="lang-en">No matches.</span>
                </div>
              ) : (
                <ul className="search-results">
                  {hits.map((hit) => {
                    const snippet = buildSnippet(hit.excerpt, queryTerms);
                    return (
                      <li key={hit.id}>
                        <Link
                          href={`/article/${hit.categorySlug}/${hit.slug}/`}
                          className="search-result"
                          onClick={close}
                        >
                          <span className="search-result-title">
                            {highlight(hit.title, queryTerms)}
                          </span>
                          <span className="search-result-snippet">
                            {highlight(snippet, queryTerms)}
                          </span>
                          {hit.tags.length > 0 ? (
                            <span className="search-result-tags">
                              {hit.tags.map((tag) => (
                                <span key={tag} className="tag-chip">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="search-dialog-foot">
              <span className="lang-zh">
                {hits.length} 条结果 · 按相关度排序
              </span>
              <span className="lang-en">
                {hits.length} results · ranked by relevance
              </span>
              <span className="search-foot-spacer" />
              <span>
                <span className="lang-zh">按 Esc 关闭</span>
                <span className="lang-en">Esc to close</span>
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="search-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}
