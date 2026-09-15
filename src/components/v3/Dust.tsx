"use client";

import { useEffect, useRef } from "react";
import styles from "./v3.module.css";

type Speck = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tone: 0 | 1 | 2; // neutral | accent (emerald) | accent-2 (sky)
  phase: number;
  ox: number; // pointer-induced offset (eases back to 0)
  oy: number;
};

const REPEL = 160;

/** Solid tone colours per theme; per-speck opacity goes through globalAlpha,
 *  so no colour strings are built inside the frame loop. */
const TONES = {
  dark: ["rgb(222, 228, 236)", "rgb(52, 211, 153)", "rgb(56, 189, 248)"],
  light: ["rgb(60, 70, 85)", "rgb(5, 150, 105)", "rgb(2, 132, 199)"],
} as const;

/**
 * Ambient "dust": a few dozen slowly rising specks on a full-screen canvas.
 * They scatter away from the pointer and drift back, so the background feels
 * alive without competing with the content. Pauses when the tab is hidden and
 * renders nothing for reduced-motion users.
 */
export function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const themeEl = canvas.closest("[data-theme]");

    let W = 0;
    let H = 0;
    const specks: Speck[] = [];

    const seed = () => {
      const count = Math.round(Math.min(70, Math.max(22, (W * H) / 26000)));
      specks.length = 0;
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        specks.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.8 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: -(0.05 + Math.random() * 0.14),
          a: 0.22 + Math.random() * 0.45,
          tone: roll < 0.14 ? 2 : roll < 0.6 ? 1 : 0,
          phase: Math.random() * Math.PI * 2,
          ox: 0,
          oy: 0,
        });
      }
    };
    const resize = () => {
      // soft 1–3px specks don't need a retina buffer; a smaller canvas is far
      // cheaper to clear and re-upload every frame
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let px = -1e4;
    let py = -1e4;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) px = py = -1e4;
    };
    // fingers push the dust too: follow the touch, release when it lifts
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      px = t.clientX;
      py = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!e.touches.length) px = py = -1e4;
    };
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mouseout", onOut);
    } else {
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(48, now - last) / 16.67; // frames, clamped after a stall
      last = now;
      t += dt;
      const tones = TONES[themeEl?.getAttribute("data-theme") === "light" ? "light" : "dark"];
      ctx.clearRect(0, 0, W, H);

      for (const s of specks) {
        s.x += (s.vx + Math.sin(t * 0.012 + s.phase) * 0.07) * dt;
        s.y += s.vy * dt;

        const dx = s.x + s.ox - px;
        const dy = s.y + s.oy - py;
        const d = Math.hypot(dx, dy);
        let near = 0;
        if (d < REPEL && d > 0.001) {
          near = 1 - d / REPEL;
          const f = near * near * 2.4 * dt;
          s.ox += (dx / d) * f;
          s.oy += (dy / d) * f;
        }
        const decay = 1 - 0.035 * dt;
        s.ox *= decay;
        s.oy *= decay;

        if (s.y < -12) {
          s.y = H + 12;
          s.x = Math.random() * W;
        }
        if (s.x < -12) s.x = W + 12;
        else if (s.x > W + 12) s.x = -12;

        ctx.beginPath();
        ctx.arc(s.x + s.ox, s.y + s.oy, s.r + near * 1.4, 0, Math.PI * 2);
        ctx.globalAlpha = Math.min(1, s.a + near * 0.55);
        ctx.fillStyle = tones[s.tone];
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={styles.dust} aria-hidden />;
}
