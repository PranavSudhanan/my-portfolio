"use client";

import { useEffect, useRef } from "react";
import styles from "./v3.module.css";

/** Interactive 3D dot-sphere (2D canvas — always renders, drag to spin). */
export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fibonacci sphere of points
    const COUNT = 900;
    const pts: { x: number; y: number; z: number; amber: boolean }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, amber: i % 41 === 0 });
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
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rot = { x: 0.35, y: 0 };
    const vel = { x: 0, y: AUTO };
    let dragging = false;
    let hover = false;
    let last = { x: 0, y: 0 };

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

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!dragging) {
        rot.y += vel.y;
        rot.x += vel.x;
        const target = hover ? 0.006 : AUTO;
        vel.y += (target - vel.y) * 0.03;
        vel.x *= 0.9;
        rot.x += (0.35 - rot.x) * 0.012;
      }
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

      const proj = pts.map((p) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        return { sx: cx + x1 * R, sy: cy + y2 * R, z: z2, amber: p.amber };
      });
      proj.sort((a, b) => a.z - b.z);

      for (const p of proj) {
        const t = (p.z + 1) / 2; // 0 back .. 1 front
        const rad = (0.5 + 1.8 * t) * dpr;
        const alpha = 0.1 + 0.85 * t;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
        if (p.amber) {
          ctx.fillStyle = `rgba(182, 173, 160, ${Math.min(1, alpha + 0.1)})`;
          ctx.shadowColor = "rgba(182, 173, 160, 0.7)";
          ctx.shadowBlur = 6 * dpr * t;
        } else {
          ctx.fillStyle = `rgba(${Math.round(150 + 78 * t)}, ${Math.round(148 + 78 * t)}, ${Math.round(170 + 62 * t)}, ${alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
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
