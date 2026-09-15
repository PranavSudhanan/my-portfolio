"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimate } from "framer-motion";
import { EASE } from "./constants";
import { Tilt } from "./Tilt";
import { haptic } from "./haptics";
import styles from "./v3.module.css";

type WinState = "open" | "min" | "max" | "closed";

const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 } as const;

/** Traffic-light glyphs, drawn at 12×12 like the real thing. */
const Glyph = {
  close: (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
    </svg>
  ),
  min: (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path d="M2.8 6h6.4" />
    </svg>
  ),
  max: (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path className={styles.glyphFill} d="M3.3 8.7V4.6l4.1 4.1zM8.7 3.3v4.1L4.6 3.3z" />
    </svg>
  ),
  unmax: (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path className={styles.glyphFill} d="M6.4 5.6V2.4l3.2 3.2zM5.6 6.4v3.2L2.4 6.4z" />
    </svg>
  ),
};

/**
 * A macOS-style window whose traffic lights actually work:
 *  • red    — CRT power-off, leaving a "relaunch" placeholder that powers it back on
 *  • yellow — folds the window down to its title bar (click the bar to unfold)
 *  • green  — focus mode: the window grows out of its spot into a full-screen
 *             overlay (Esc, backdrop or green again to shrink back)
 */
export function MacWindow({
  title,
  className,
  barClassName,
  show = true,
  tilt,
  children,
}: {
  title: string;
  /** frame styles (border, background, radius, shadow) */
  className: string;
  /** title bar styles */
  barClassName: string;
  /** the owning section is on screen — focus mode exits when it isn't */
  show?: boolean;
  tilt?: { max: number; scale: number };
  children: React.ReactNode;
}) {
  const [state, setState] = useState<WinState>("open");
  const [host, setHost] = useState<Element | null>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const overlayWin = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const pending = useRef<"powerOn" | "grow" | null>(null);
  const busy = useRef(false);

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- red: power off / relaunch ----
  // works in place and in focus mode (then the big window powers off and the
  // relaunch slot appears back where the window lives)
  const close = async (inOverlay = false) => {
    if (busy.current || !scope.current) return;
    haptic(12);
    const r = scope.current.getBoundingClientRect(); // in-place slot, even while hidden
    setSize({ w: r.width, h: r.height });
    const target = inOverlay ? overlayWin.current : scope.current;
    if (target && !reduce()) {
      busy.current = true;
      // the overlay window scales from its top-left for FLIP; pinch the CRT
      // collapse to the centre instead (its scale is 1 here, so no jump)
      if (inOverlay && overlayWin.current) overlayWin.current.style.transformOrigin = "50% 50%";
      await Promise.all([
        animate(
          target,
          {
            scaleY: [1, 0.012, 0.012],
            scaleX: [1, 1, 0],
            opacity: [1, 1, 0],
            filter: ["brightness(1)", "brightness(2.4)", "brightness(3)"],
          },
          { duration: 0.5, times: [0, 0.55, 1], ease: "easeIn" }
        ),
        inOverlay && backdrop.current && animate(backdrop.current, { opacity: 0 }, { duration: 0.5 }),
      ]);
      busy.current = false;
    }
    setState("closed");
  };
  const relaunch = () => {
    haptic(12);
    pending.current = reduce() ? null : "powerOn";
    setState("open");
  };

  // ---- yellow: fold to title bar ----
  const toggleMin = (inOverlay = false) => {
    if (inOverlay) {
      restore("min"); // shrink back into place, then fold to the title bar
      return;
    }
    haptic();
    setState((s) => (s === "min" ? "open" : "min"));
  };

  // ---- green: focus mode ----
  const maximize = () => {
    if (!scope.current) return;
    haptic();
    setHost(scope.current.closest("[data-theme]"));
    pending.current = reduce() ? null : "grow";
    setState("max");
  };
  const flipFrom = () => {
    const from = scope.current?.getBoundingClientRect();
    const to = overlayWin.current?.getBoundingClientRect();
    if (!from || !to || !to.width || !to.height) return null;
    return {
      x: from.left - to.left,
      y: from.top - to.top,
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
    };
  };
  const restore = async (to: "open" | "min" = "open") => {
    if (busy.current) return;
    haptic();
    const f = flipFrom();
    if (f && overlayWin.current && !reduce()) {
      busy.current = true;
      await Promise.all([
        animate(overlayWin.current, { ...f, opacity: 0.4 }, { duration: 0.34, ease: EASE }),
        backdrop.current && animate(backdrop.current, { opacity: 0 }, { duration: 0.3 }),
      ]);
      busy.current = false;
    }
    setState(to);
  };

  // run entrance animations once the new state is in the DOM
  useLayoutEffect(() => {
    const job = pending.current;
    pending.current = null;
    if (job === "powerOn" && scope.current) {
      animate(
        scope.current,
        {
          scaleX: [0, 1, 1],
          scaleY: [0.012, 0.012, 1],
          opacity: [0, 1, 1],
          filter: ["brightness(3)", "brightness(2.4)", "brightness(1)"],
        },
        { duration: 0.55, times: [0, 0.4, 1], ease: "easeOut" }
      );
    } else if (job === "grow" && overlayWin.current) {
      const f = flipFrom();
      const el = overlayWin.current;
      if (f) {
        // pin the first frame before paint so the big window never flashes
        el.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.scaleX}, ${f.scaleY})`;
        animate(el, { x: [f.x, 0], y: [f.y, 0], scaleX: [f.scaleX, 1], scaleY: [f.scaleY, 1] }, SPRING);
      }
      if (backdrop.current) {
        backdrop.current.style.opacity = "0";
        animate(backdrop.current, { opacity: [0, 1] }, { duration: 0.3 });
      }
      overlayWin.current.querySelector<HTMLButtonElement>("[data-light='max']")?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Esc leaves focus mode
  useEffect(() => {
    if (state !== "max") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") restore();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // leaving the section drops focus mode instantly
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!show && state === "max") setState("open");
  }, [show, state]);

  const lights = (inOverlay: boolean) => (
    <div className={styles.lights} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={`${styles.light} ${styles.lightClose}`}
        onClick={() => close(inOverlay)}
        aria-label={`Close ${title}`}
      >
        {Glyph.close}
      </button>
      <button
        type="button"
        className={`${styles.light} ${styles.lightMin}`}
        onClick={() => toggleMin(inOverlay)}
        aria-label={state === "min" ? `Restore ${title}` : `Minimize ${title}`}
      >
        {Glyph.min}
      </button>
      <button
        type="button"
        data-light="max"
        className={`${styles.light} ${styles.lightMax}`}
        onClick={inOverlay ? () => restore() : maximize}
        aria-label={inOverlay ? `Exit focus mode` : `Open ${title} in focus mode`}
      >
        {inOverlay ? Glyph.unmax : Glyph.max}
      </button>
    </div>
  );

  const frame = (inOverlay: boolean) => {
    const folded = state === "min" && !inOverlay;
    return (
      <>
        <div
          className={`${barClassName} ${styles.winBar} ${folded ? styles.winBarFolded : ""}`}
          onClick={folded ? () => toggleMin() : undefined}
        >
          {lights(inOverlay)}
          <span className={styles.winTitle}>
            {folded && <span className={styles.winPulse} aria-hidden />}
            {title}
          </span>
        </div>
        <motion.div
          initial={false}
          animate={folded ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
          transition={{ duration: 0.38, ease: EASE }}
          style={{ overflow: "hidden" }}
          aria-hidden={folded || undefined}
        >
          {children}
        </motion.div>
      </>
    );
  };

  if (state === "closed") {
    return (
      <motion.button
        type="button"
        className={styles.winGhost}
        style={{ height: size.h || undefined, maxWidth: size.w || undefined }}
        onClick={relaunch}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
        aria-label={`Relaunch ${title}`}
      >
        <span className={styles.winGhostLine}>
          <span className={styles.winGhostDot} aria-hidden />
          {title} · process exited
        </span>
        <span className={styles.winGhostCta}>↻ relaunch</span>
      </motion.button>
    );
  }

  const maxed = state === "max";
  return (
    <>
      <div
        ref={scope}
        className={styles.winSlot}
        style={{ visibility: maxed ? "hidden" : undefined }}
        aria-hidden={maxed || undefined}
        inert={maxed || undefined}
      >
        {tilt ? (
          <Tilt className={className} max={tilt.max} scale={tilt.scale}>
            {frame(false)}
          </Tilt>
        ) : (
          <div className={className}>{frame(false)}</div>
        )}
      </div>

      {maxed &&
        host &&
        createPortal(
          <div className={styles.winOverlay} role="dialog" aria-modal="true" aria-label={title}>
            <div ref={backdrop} className={styles.winBackdrop} onClick={() => restore()} />
            <div ref={overlayWin} className={`${className} ${styles.winMax}`}>
              {frame(true)}
            </div>
            <span className={styles.winHint}>esc · exit focus mode</span>
          </div>,
          host
        )}
    </>
  );
}
