"use client";

import { useEffect, useRef } from "react";
import { gyro } from "./gyro";
import styles from "./v3.module.css";

const COUNT = 900;
/** Dots are batched into depth bands so a frame is ~a dozen fills, not 900. */
const BANDS = 12;
const TAU = Math.PI * 2;

/** Interactive 3D dot-sphere (2D canvas — always renders, drag to spin).
 *  The render loop only runs while `active` (its section is on screen). */
export function Globe({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    if (active) wakeRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const themeEl = canvas.closest("[data-theme]");

    // Fibonacci sphere of points
    const px = new Float32Array(COUNT);
    const py = new Float32Array(COUNT);
    const pz = new Float32Array(COUNT);
    const accent: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      px[i] = Math.cos(theta) * r;
      py[i] = y;
      pz[i] = Math.sin(theta) * r;
      if (i % 41 === 0) accent.push(i);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO = reduce ? 0 : 0.0026;
    let dpr = 1;
    let size = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width || 360;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      if (!raf) draw(); // keep a correct still frame while paused
    };

    const rot = { x: 0.35, y: 0 };
    const vel = { x: 0, y: AUTO };
    let tiltX = 0;
    let tiltY = 0;
    let dragging = false;
    let hover = false;
    let last = { x: 0, y: 0 };

    const draw = () => {
      if (!dragging) {
        rot.y += vel.y;
        rot.x += vel.x;
        // tilting the phone spins the globe and nudges its pole
        const target = (hover ? 0.006 : AUTO) + tiltX * 0.012;
        vel.y += (target - vel.y) * 0.03;
        vel.x *= 0.9;
        rot.x += (0.35 + tiltY * 0.45 - rot.x) * 0.012;
      }
      const light = themeEl?.getAttribute("data-theme") === "light";
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = (size * dpr) / 2 - 4 * dpr;
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const rBase = light ? 0.75 : 0.5;
      const rGrow = light ? 1.85 : 1.8;

      const bands: Path2D[] = [];
      for (let b = 0; b < BANDS; b++) bands.push(new Path2D());
      for (let i = 0; i < COUNT; i++) {
        const x1 = px[i] * cosY + pz[i] * sinY;
        const z1 = -px[i] * sinY + pz[i] * cosY;
        const y2 = py[i] * cosX - z1 * sinX;
        const z2 = py[i] * sinX + z1 * cosX;
        const t = (z2 + 1) / 2; // 0 back .. 1 front
        const sx = cx + x1 * R;
        const sy = cy + y2 * R;
        const rad = (rBase + rGrow * t) * dpr;
        const path = bands[Math.min(BANDS - 1, (t * BANDS) | 0)];
        path.moveTo(sx + rad, sy);
        path.arc(sx, sy, rad, 0, TAU);
      }
      // back to front, so nearer bands paint over farther ones
      for (let b = 0; b < BANDS; b++) {
        const t = (b + 0.5) / BANDS;
        ctx.fillStyle = light
          ? `rgba(51, 65, 85, ${(0.32 + 0.5 * t).toFixed(3)})`
          : `rgba(${Math.round(140 + 90 * t)}, ${Math.round(152 + 84 * t)}, ${Math.round(166 + 76 * t)}, ${(0.1 + 0.85 * t).toFixed(3)})`;
        ctx.fill(bands[b]);
      }

      // emerald accent dots, with a soft halo in place of an (expensive) shadowBlur
      const rgb = light ? "5, 150, 105" : "52, 211, 153";
      for (const i of accent) {
        const x1 = px[i] * cosY + pz[i] * sinY;
        const z1 = -px[i] * sinY + pz[i] * cosY;
        const y2 = py[i] * cosX - z1 * sinX;
        const z2 = py[i] * sinX + z1 * cosX;
        const t = (z2 + 1) / 2;
        const sx = cx + x1 * R;
        const sy = cy + y2 * R;
        const rad = (rBase + 0.3 + rGrow * t) * dpr;
        const a = Math.max(light ? 0.6 : 0.25, Math.min(1, 0.2 + 0.85 * t));
        ctx.fillStyle = `rgba(${rgb}, ${(a * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, rad * 2.6, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, TAU);
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = () => {
      if (!activeRef.current || document.hidden) {
        raf = 0; // sleep until the section is shown again
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    wakeRef.current = wake;

    // tilting the phone spins the globe (subscribed after `wake` exists — the
    // first reading is delivered synchronously)
    const untilt = reduce
      ? () => {}
      : gyro.subscribe((gx, gy) => {
          tiltX = gx;
          tiltY = gy;
          wake();
        });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      rot.y += dx * 0.006;
      rot.x = Math.max(-1.3, Math.min(1.3, rot.x + dy * 0.006));
      vel.y = dx * 0.006;
      vel.x = dy * 0.006;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", wake);

    draw();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      untilt();
      wakeRef.current = () => {};
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  return (
    <div className={styles.globeWrap}>
      <div className={styles.globeGlow} />
      <div className={styles.globe} />
      <canvas ref={canvasRef} className={styles.globeCanvas} />
      <div className={styles.globeRing} />
    </div>
  );
}
