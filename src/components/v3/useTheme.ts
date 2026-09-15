"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const FADE_CLASS = "theme-fading";

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

/** Light/dark/system theme state, persisted to localStorage.
 *  `resolved` is the concrete "light" | "dark" to stamp on the root element;
 *  in "system" mode it tracks the OS preference live.
 *
 *  Switching is a short, plain cross-fade of the whole page (a View Transition,
 *  so it is one GPU fade rather than every element re-animating its colours),
 *  with a CSS colour transition as the fallback. Reduced motion: instant. */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // hydrate the saved preference (client-only, avoids SSR mismatch)
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage unavailable — fall back to system */
    }
    const m: ThemeMode = saved === "light" || saved === "dark" ? saved : "system";
    // one-time sync from external storage on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModeState(m);
    setResolved(m === "system" ? systemTheme() : m);
  }, []);

  // follow the OS while in "system" mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = (m: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore write failures (private mode, etc.) */
    }
    const next = m === "system" ? systemTheme() : m;
    const apply = () => {
      setModeState(m);
      setResolved(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (next === resolved || reduce) {
      apply(); // nothing visible changes (or motion is unwanted)
      return;
    }

    const root = document.documentElement;
    if (typeof document.startViewTransition === "function" && !document.hidden) {
      const vt = document.startViewTransition(() => flushSync(apply));
      // the browser may skip a transition (e.g. tab hidden) — the theme still applies
      vt.ready.catch(() => {});
      vt.finished.catch(() => {});
      return;
    }

    // fallback: briefly transition colours on everything, then drop the rule
    root.classList.add(FADE_CLASS);
    apply();
    window.setTimeout(() => root.classList.remove(FADE_CLASS), 400);
  };

  return { mode, resolved, setMode };
}
