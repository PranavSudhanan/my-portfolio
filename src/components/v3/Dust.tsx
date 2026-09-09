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
  tone: 0 | 1 | 2; // neutral | accent | amber
  phase: number;
  ox: number; // pointer-induced offset (eases back to 0)
  oy: number;
};

const REPEL = 160;

function fill(tone: Speck["tone"], light: boolean, alpha: number) {
  const rgb =
    tone === 1
      ? light ? "109, 79, 214" : "167, 139, 250"
      : tone === 2
        ? light ? "181, 121, 43" : "211, 184, 146"
        : light ? "60, 55, 90" : "222, 222, 236";
  return `rgba(${rgb}, ${alpha.toFixed(3)})`;
}

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mouseout", onOut);
    }

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(48, now - last) / 16.67; // frames, clamped after a stall
      last = now;
      t += dt;
      const light = canvas.closest("[data-theme]")?.getAttribute("data-theme") === "light";
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
        ctx.fillStyle = fill(s.tone, light, Math.min(1, s.a + near * 0.55));
        ctx.fill();
      }
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
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={styles.dust} aria-hidden />;
}
