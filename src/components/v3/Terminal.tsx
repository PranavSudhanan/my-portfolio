"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { haptic } from "./haptics";
import { MacWindow } from "./MacWindow";
import styles from "./v3.module.css";

type Line = { text: string; tone?: "accent" | "alt" | "muted" };

const COMMANDS: Record<string, Line[]> = {
  whoami: [
    { text: profile.name, tone: "accent" },
    { text: "Full-stack engineer · API & AI" },
    { text: `loc: ${profile.location.split(",")[0]}, IN`, tone: "muted" },
  ],
  stack: [
    { text: "api   → Python · FastAPI · Django", tone: "alt" },
    { text: "ui    → React · Next.js · TypeScript", tone: "alt" },
    { text: "data  → Databricks · SQL · Azure", tone: "alt" },
  ],
  status: [
    { text: "● available for new projects", tone: "accent" },
    { text: "uptime: 4+ yrs · replies < 24h", tone: "muted" },
  ],
  "hire --now": [
    { text: "opening secure channel…", tone: "muted" },
    { text: "✓ handshake ok → contact", tone: "accent" },
  ],
};
const NAMES = Object.keys(COMMANDS);
const TYPE_MS = 42;

/**
 * Mobile hero toy: a tiny terminal you drive by tapping command chips. The
 * command types itself out, the response streams in line by line, and
 * `hire --now` actually jumps to the contact section.
 */
export function Terminal({ show, onHire }: { show: boolean; onHire: () => void }) {
  const [cmd, setCmd] = useState("");
  const [typed, setTyped] = useState(0);
  const [run, setRun] = useState(0);
  const started = useRef(false);
  const hireTimer = useRef<number | undefined>(undefined);

  const exec = (c: string) => {
    window.clearTimeout(hireTimer.current);
    setCmd(c);
    setTyped(0);
    setRun((r) => r + 1);
    if (c === "hire --now") {
      hireTimer.current = window.setTimeout(onHire, c.length * TYPE_MS + 1100);
    }
  };

  // greet with `whoami` the first time the hero is on screen
  useEffect(() => {
    if (!show || started.current) return;
    started.current = true;
    const t = window.setTimeout(() => exec("whoami"), 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // type the command one character at a time
  useEffect(() => {
    if (typed >= cmd.length) return;
    const t = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(t);
  }, [typed, cmd, run]);

  useEffect(() => () => window.clearTimeout(hireTimer.current), []);

  const done = cmd !== "" && typed >= cmd.length;
  const toneCls = { accent: styles.aAccent, alt: styles.aAlt, muted: styles.termMuted };

  return (
    <MacWindow
      title="pranav@portfolio: ~"
      className={styles.term}
      barClassName={styles.termTop}
      tilt={{ max: 6, scale: 1 }}
      show={show}
    >
      <div className={styles.termBody} aria-live="polite">
        <div>
          <span className={styles.aAccent}>➜</span> <span className={styles.aAlt}>~</span>{" "}
          {cmd.slice(0, typed)}
          {!done && <span className={styles.caret} aria-hidden />}
        </div>
        {done &&
          COMMANDS[cmd].map((l, i) => (
            <motion.div
              key={`${run}-${i}`}
              className={l.tone ? toneCls[l.tone] : undefined}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.12, duration: 0.25 }}
            >
              {l.text}
            </motion.div>
          ))}
        {done && (
          <motion.div
            key={`${run}-prompt`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + COMMANDS[cmd].length * 0.12 }}
          >
            <span className={styles.aAccent}>➜</span> <span className={styles.aAlt}>~</span>{" "}
            <span className={styles.caret} aria-hidden />
          </motion.div>
        )}
      </div>
      <div className={styles.termChips} role="group" aria-label="Run a command">
        {NAMES.map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.termChip} ${cmd === n ? styles.termChipActive : ""}`}
            onClick={() => {
              haptic();
              exec(n);
            }}
          >
            <span className={styles.termChipDollar}>$</span> {n}
          </button>
        ))}
      </div>
    </MacWindow>
  );
}
