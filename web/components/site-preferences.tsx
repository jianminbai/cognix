"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type Lang = "zh" | "en";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("cognix-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const stored = window.localStorage.getItem("cognix-lang");
  return stored === "en" ? "en" : "zh";
}

function applyPreferences(nextTheme: Theme, nextLang: Lang) {
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.dataset.lang = nextLang;
  document.documentElement.lang = nextLang === "en" ? "en" : "zh-CN";
  document.body.classList.toggle("theme-light", nextTheme === "light");
  document.body.classList.toggle("theme-dark", nextTheme === "dark");
  document.body.classList.toggle("lang-en", nextLang === "en");
  document.body.classList.toggle("lang-zh", nextLang === "zh");
}

export function SitePreferences() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const nextTheme = getInitialTheme();
      const nextLang = getInitialLang();
      setTheme(nextTheme);
      setLang(nextLang);
      applyPreferences(nextTheme, nextLang);
    });
  }, []);

  function updateTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    window.localStorage.setItem("cognix-theme", nextTheme);
    applyPreferences(nextTheme, lang);
  }

  function updateLang(nextLang: Lang) {
    setLang(nextLang);
    window.localStorage.setItem("cognix-lang", nextLang);
    applyPreferences(theme, nextLang);
  }

  return (
    <div className="preference-controls" aria-label="Site preferences">
      <button
        type="button"
        className="preference-button"
        onClick={() => updateTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle light and dark theme"
      >
        {theme === "dark" ? "☾" : "☀"}
      </button>
      <button
        type="button"
        className="preference-button preference-lang"
        onClick={() => updateLang(lang === "zh" ? "en" : "zh")}
        aria-label="Toggle Chinese and English"
      >
        {lang === "zh" ? "EN" : "中"}
      </button>
    </div>
  );
}
