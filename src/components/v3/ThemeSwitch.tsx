"use client";

import type { IconType } from "react-icons";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import type { ThemeMode } from "./useTheme";
import styles from "./v3.module.css";

const OPTIONS: { key: ThemeMode; label: string; Icon: IconType }[] = [
  { key: "light", label: "Light", Icon: FiSun },
  { key: "dark", label: "Dark", Icon: FiMoon },
  { key: "system", label: "System", Icon: FiMonitor },
];

/** Segmented light / dark / system control for the top bar. */
export function ThemeSwitch({
  mode,
  setMode,
}: {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}) {
  return (
    <div className={styles.themeSwitch} role="group" aria-label="Color theme">
      {OPTIONS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setMode(key)}
          className={`${styles.themeBtn} ${mode === key ? styles.themeBtnActive : ""}`}
          aria-pressed={mode === key}
          aria-label={`${label} theme`}
          title={`${label} theme`}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
}
