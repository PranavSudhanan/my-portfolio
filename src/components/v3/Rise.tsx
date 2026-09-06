"use client";

import { motion } from "framer-motion";
import { EASE } from "./constants";

/* Stable animation targets (module-level so the `animate` prop reference
   never changes between renders — prevents Framer from restarting/freezing). */
const SHOWN = { opacity: 1, x: 0, y: 0 };
const HIDDEN = {
  left: { opacity: 0, x: -70, y: 0 },
  right: { opacity: 0, x: 70, y: 0 },
  up: { opacity: 0, x: 0, y: 45 },
} as const;

/**
 * Self-contained reveal — drives its own initial/animate from `show`
 * (no variant propagation, so it works reliably nested anywhere).
 */
export function Rise({
  show,
  from = "up",
  delay = 0,
  className,
  children,
}: {
  show: boolean;
  from?: "left" | "right" | "up";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const hidden = HIDDEN[from];
  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={show ? SHOWN : hidden}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
