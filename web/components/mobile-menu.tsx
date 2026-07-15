"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Mobile-only navigation. On desktop the links live in `.nav-center`; that group
// is `display:none` under 900px, so without this menu the page entries would be
// unreachable on phones. The hamburger toggles a dropdown with the same links.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-toggle-bar" data-open={open} />
        <span className="nav-toggle-bar" data-open={open} />
        <span className="nav-toggle-bar" data-open={open} />
      </button>

      {open ? (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div id="mobile-nav-panel" className="mobile-nav-panel" role="menu">
            <Link href="/#atlas" role="menuitem" onClick={() => setOpen(false)}>
              <span className="lang-zh">认知路径</span>
              <span className="lang-en">Path</span>
            </Link>
            <Link href="/category/cognitive-science/" role="menuitem" onClick={() => setOpen(false)}>
              <span className="lang-zh">全部文章</span>
              <span className="lang-en">Articles</span>
            </Link>
            <Link href="/about/" role="menuitem" onClick={() => setOpen(false)}>
              <span className="lang-zh">关于我</span>
              <span className="lang-en">About</span>
            </Link>
            <a
              href="https://github.com/jianminbai/cognix"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              GitHub
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
