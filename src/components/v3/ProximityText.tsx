"use client";

import { useEffect, useRef } from "react";
import styles from "./v3.module.css";

/**
 * Splits `text` into characters that lift and tint as the pointer approaches
 * (within `radius` px) — or as a finger slides across them on touch screens.
 * Pure DOM writes on rAF — no React re-renders. Static for reduced motion.
 */
export function ProximityText({
  text,
  className,
  radius = 150,
  lift = 12,
}: {
  text: string;
  className?: string;
  radius?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(el.children) as HTMLElement[];
    const prev = new Array<number>(chars.length).fill(0);
    let centers: { x: number; y: number }[] = [];
    let measuredAt = -1;
    const measure = () => {
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    let px = -1e4;
    let py = -1e4;
    let raf = 0;
    const apply = () => {
      raf = 0;
      // text moves during section slides / entrance animation — re-measure lazily
      const now = performance.now();
      if (now - measuredAt > 180) {
        measure();
        measuredAt = now;
      }
      for (let i = 0; i < chars.length; i++) {
        const d = Math.hypot(px - centers[i].x, py - centers[i].y);
        const t = d < radius ? 1 - d / radius : 0;
        const e = t * t * (3 - 2 * t); // smoothstep
        if (Math.abs(e - prev[i]) < 0.002) continue;
        prev[i] = e;
        chars[i].style.transform = e ? `translateY(${(-lift * e).toFixed(2)}px)` : "";
        chars[i].style.setProperty("--t", e.toFixed(3));
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      px = py = -1e4;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      px = t.clientX;
      py = t.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length) return;
      px = py = -1e4;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [radius, lift]);

  return (
    <span ref={ref} className={`${styles.prox} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.ch} aria-hidden>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
