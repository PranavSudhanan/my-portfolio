"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

/** Light/dark/system theme state, persisted to localStorage.
 *  `resolved` is the concrete "light" | "dark" to stamp on the root element;
 *  in "system" mode it tracks the OS preference live. */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // hydrate the saved preference (client-only, avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
    } catch {
      /* localStorage unavailable — fall back to system */
    }
  }, []);

  // resolve the concrete theme and follow the OS while in "system" mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolve = () =>
      setResolved(mode === "system" ? (mq.matches ? "dark" : "light") : mode);
    resolve();
    if (mode === "system") {
      mq.addEventListener("change", resolve);
      return () => mq.removeEventListener("change", resolve);
    }
  }, [mode]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore write failures (private mode, etc.) */
    }
  };

  return { mode, resolved, setMode };
}
