"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./v3.module.css";

/**
 * Anything the cursor should react to. An element can pick its own state with
 * `data-cursor` ("link" | "tilt" | "drag" | "view" | "copy") and put a word
 * inside the ring with `data-cursor-label`.
 */
const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, summary, [data-cursor]";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Custom pointer: a precise dot, a lagging ring that morphs over interactive
 * elements, a soft accent glow that trails behind, and a click ripple.
 * Desktop-only (fine pointer + hover) and disabled for reduced-motion users;
 * on touch devices it renders nothing and the native cursor is untouched.
 * It also publishes the smoothed pointer position as `--cx` / `--cy` on the
 * root so CSS layers (the dot-grid reveal) can follow it.
 */
export function Cursor({ rootRef }: { rootRef: React.RefObject<HTMLDivElement | null> }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const layer = layerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const glow = glowRef.current;
    const ripple = rippleRef.current;
    if (!root || !layer || !dot || !ring || !label || !glow || !ripple) return;

    root.classList.add(styles.hasCursor);

    // raw pointer target, plus followers with increasing lag
    let tx = -300;
    let ty = -300;
    let rx = tx;
    let ry = ty;
    let gx = tx;
    let gy = ty;
    let shown = false;
    let raf = 0;
    let hovered: Element | null = null;

    const setHover = (el: Element | null) => {
      hovered = el;
      ring.dataset.kind = el ? el.getAttribute("data-cursor") || "link" : "";
      label.textContent = el?.getAttribute("data-cursor-label") ?? "";
      root.classList.toggle(styles.cursorHover, !!el);
    };

    const frame = () => {
      rx = lerp(rx, tx, 0.22);
      ry = lerp(ry, ty, 0.22);
      gx = lerp(gx, tx, 0.09);
      gy = lerp(gy, ty, 0.09);
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      glow.style.transform = `translate3d(${gx.toFixed(2)}px, ${gy.toFixed(2)}px, 0)`;
      root.style.setProperty("--cx", rx.toFixed(1));
      root.style.setProperty("--cy", ry.toFixed(1));
      const settled =
        Math.abs(gx - tx) < 0.15 &&
        Math.abs(gy - ty) < 0.15 &&
        Math.abs(rx - tx) < 0.15 &&
        Math.abs(ry - ty) < 0.15;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        rx = gx = tx;
        ry = gy = ty;
        layer.classList.add(styles.cursorOn);
      }
      const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (target !== hovered) setHover(target);
      else if (target) {
        // the label can change while hovering (e.g. "Copy" → "Done")
        const text = target.getAttribute("data-cursor-label") ?? "";
        if (label.textContent !== text) label.textContent = text;
      }
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      root.classList.add(styles.cursorDown);
      ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ripple.classList.remove(styles.rippleGo);
      void ripple.offsetWidth; // force reflow so the animation restarts
      ripple.classList.add(styles.rippleGo);
    };
    // the page can move under a still pointer (section slides, slider swipes,
    // clicked nav buttons) — re-read what is under it once things settle
    let recheckTimer = 0;
    const recheck = () => {
      if (!shown) return;
      const el = document.elementFromPoint(tx, ty);
      const target = el ? el.closest(INTERACTIVE) : null;
      if (target !== hovered) setHover(target);
    };
    const scheduleRecheck = () => {
      window.clearTimeout(recheckTimer);
      recheckTimer = window.setTimeout(recheck, 1000);
    };
    const onUp = () => {
      root.classList.remove(styles.cursorDown);
      scheduleRecheck();
    };
    const hide = () => {
      shown = false;
      layer.classList.remove(styles.cursorOn);
      root.classList.remove(styles.cursorDown);
      setHover(null);
    };
    // relatedTarget is null only when the pointer leaves the window
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", hide);
    window.addEventListener("wheel", scheduleRecheck, { passive: true });
    window.addEventListener("keyup", scheduleRecheck);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(recheckTimer);
      window.removeEventListener("wheel", scheduleRecheck);
      window.removeEventListener("keyup", scheduleRecheck);
      root.classList.remove(styles.hasCursor, styles.cursorHover, styles.cursorDown);
      root.style.removeProperty("--cx");
      root.style.removeProperty("--cy");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
    };
  }, [enabled, rootRef]);

  if (!enabled) return null;
  return (
    <div ref={layerRef} className={styles.cursorLayer} aria-hidden>
      <div ref={glowRef} className={styles.cursorGlow} />
      <div ref={rippleRef} className={styles.cursorRipple} />
      <div ref={ringRef} className={styles.cursorRing}>
        <span ref={labelRef} className={styles.cursorLabel} />
      </div>
      <div ref={dotRef} className={styles.cursorDot} />
    </div>
  );
}
