"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import type { ThemeMode } from "./useTheme";
import { haptic } from "./haptics";
import styles from "./v3.module.css";

const OPTIONS: { key: ThemeMode; label: string; Icon: IconType }[] = [
  { key: "light", label: "Light", Icon: FiSun },
  { key: "dark", label: "Dark", Icon: FiMoon },
  { key: "system", label: "System", Icon: FiMonitor },
];

/** Segmented light / dark / system control for the top bar. The active
 *  highlight is a shared-layout pill that slides between options; each option
 *  has a styled tooltip. */
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
          onClick={() => {
            haptic();
            setMode(key);
          }}
          className={`${styles.themeBtn} ${mode === key ? styles.themeBtnActive : ""}`}
          aria-pressed={mode === key}
          aria-label={`${label} theme`}
          data-tip={label}
        >
          {mode === key && (
            <motion.span
              layoutId="theme-pill"
              className={styles.themePill}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className={styles.themeIcon}>
            <Icon size={15} />
          </span>
        </button>
      ))}
    </div>
  );
}
