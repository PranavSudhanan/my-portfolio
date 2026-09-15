"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./v3.module.css";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The touch counterpart of <Cursor />: wherever a finger lands, a soft accent
 * light blooms, the dot grid lights up beneath it and a ripple ring pulses out;
 * the light trails the finger while it drags and fades once it lifts.
 * Touch-only (coarse pointer), off for reduced-motion users. Listeners are
 * passive, so it never interferes with the section swipes.
 */
export function TouchFX({ rootRef }: { rootRef: React.RefObject<HTMLDivElement | null> }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(coarse.matches && !reduce.matches);
    update();
    coarse.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const layer = layerRef.current;
    const glow = glowRef.current;
    const ripple = rippleRef.current;
    if (!root || !layer || !glow || !ripple) return;
    const reveal = root.querySelector<HTMLElement>("." + styles.gridReveal);
    const revealDots = reveal?.firstElementChild as HTMLElement | null;
    const half = reveal ? reveal.offsetWidth / 2 : 0;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let fadeTimer = 0;

    const frame = () => {
      x = lerp(x, tx, 0.2);
      y = lerp(y, ty, 0.2);
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (reveal && revealDots) {
        const ox = x - half;
        const oy = y - half;
        reveal.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
        revealDots.style.transform = `translate3d(${(-ox).toFixed(1)}px, ${(-oy).toFixed(1)}px, 0)`;
      }
      raf = Math.abs(tx - x) < 0.2 && Math.abs(ty - y) < 0.2 ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      window.clearTimeout(fadeTimer);
      tx = x = t.clientX;
      ty = y = t.clientY;
      layer.classList.add(styles.cursorOn);
      root.classList.add(styles.touchActive);
      ripple.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ripple.classList.remove(styles.rippleGo);
      void ripple.offsetWidth; // restart the ripple animation
      ripple.classList.add(styles.rippleGo);
      kick();
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      tx = t.clientX;
      ty = t.clientY;
      kick();
    };
    const onEnd = (e: TouchEvent) => {
      if (e.touches.length) return;
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => {
        layer.classList.remove(styles.cursorOn);
        root.classList.remove(styles.touchActive);
      }, 450);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
      root.classList.remove(styles.touchActive);
      reveal?.style.removeProperty("transform");
      revealDots?.style.removeProperty("transform");
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled, rootRef]);

  if (!enabled) return null;
  return (
    <div ref={layerRef} className={styles.cursorLayer} aria-hidden>
      <div ref={glowRef} className={`${styles.cursorGlow} ${styles.touchGlow}`} />
      <div ref={rippleRef} className={styles.cursorRipple} />
    </div>
  );
}
