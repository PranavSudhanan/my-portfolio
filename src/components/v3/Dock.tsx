"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiHome, FiUser, FiCpu, FiLayers, FiSend } from "react-icons/fi";
import { SECTIONS } from "./constants";
import { haptic } from "./haptics";
import styles from "./v3.module.css";

const ICONS: IconType[] = [FiHome, FiUser, FiCpu, FiLayers, FiSend];

/** Mobile-only floating dock: thumb-reachable section nav with a glowing pill
 *  that glides to the active section and a label that unfolds beside it. */
export function Dock({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  return (
    <nav className={styles.dock} aria-label="Sections">
      {SECTIONS.map((s, i) => {
        const Icon = ICONS[i];
        const on = i === active;
        return (
          <button
            key={s}
            type="button"
            className={`${styles.dockBtn} ${on ? styles.dockBtnActive : ""}`}
            onClick={() => {
              haptic();
              goTo(i);
            }}
            aria-label={`Go to ${s}`}
            aria-current={on ? "true" : undefined}
          >
            {on && (
              <motion.span
                layoutId="dock-pill"
                className={styles.dockPill}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className={styles.dockIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.dockLabel}>{s}</span>
          </button>
        );
      })}
    </nav>
  );
}
