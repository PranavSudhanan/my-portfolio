"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/lib/data";
import { N, PORTFOLIO, SLIDE_MS } from "./constants";
import { gyro } from "./gyro";
import { haptic } from "./haptics";
import styles from "./v3.module.css";

const LAST_SLIDE = projects.length - 1;

/**
 * The full-page slide engine: section snapping via wheel / touch / keys, with
 * sections that scroll internally when their content is taller than the screen,
 * a nested horizontal slider on the portfolio section, and cursor parallax.
 */
export function useFullpage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);

  const activeRef = useRef(0);
  const slideRef = useRef(0);
  const lockRef = useRef(false);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => (lockRef.current = false), SLIDE_MS + 50);
  }, []);

  // the internal scroller of a section (content scrolls when taller than viewport)
  const scrollerFor = useCallback((i: number) => {
    const secs = containerRef.current?.querySelectorAll<HTMLElement>("section");
    const sec = secs && secs[i];
    return sec ? sec.querySelector<HTMLElement>("." + styles.inner) : null;
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      const idx = activeRef.current;
      if (idx === PORTFOLIO) {
        const s = slideRef.current;
        if (dir > 0 && s < LAST_SLIDE) {
          setSlide(s + 1);
          lock();
          return;
        }
        if (dir < 0 && s > 0) {
          setSlide(s - 1);
          lock();
          return;
        }
      }
      const next = Math.max(0, Math.min(N - 1, idx + dir));
      if (next !== idx) {
        setActive(next);
        lock();
      }
    },
    [lock]
  );

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(N - 1, i));
      if (clamped !== activeRef.current) {
        setActive(clamped);
        lock();
      }
    },
    [lock]
  );

  // when the section changes, start it scrolled to the top and treat the way
  // the phone is being held right now as the new neutral tilt
  useEffect(() => {
    const sc = scrollerFor(active);
    if (sc) sc.scrollTop = 0;
    gyro.recenter();
  }, [active, scrollerFor]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const extremes = () => {
      const sc = scrollerFor(activeRef.current);
      if (!sc) return { top: true, bottom: true };
      return {
        top: sc.scrollTop <= 1,
        bottom: sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1,
      };
    };

    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      const { top, bottom } = extremes();
      // let the section scroll internally until an edge is reached
      if ((dir > 0 && !bottom) || (dir < 0 && !top)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 6) return;
      navigate(dir);
    };

    let ty = 0;
    let tx = 0;
    let startTop = true;
    let startBottom = true;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY;
      tx = e.touches[0].clientX;
      const ex = extremes();
      startTop = ex.top;
      startBottom = ex.bottom;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - ty;
      const dx = e.touches[0].clientX - tx;
      if (Math.abs(dx) > Math.abs(dy)) return; // horizontal → let the slider handle it
      // block native overscroll only when a section change is intended
      if ((dy < 0 && startBottom) || (dy > 0 && startTop)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - ty;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dy) < 55 || Math.abs(dx) > Math.abs(dy)) return;
      const wasLocked = lockRef.current;
      if (dy < 0 && startBottom) navigate(1);
      else if (dy > 0 && startTop) navigate(-1);
      if (!wasLocked && lockRef.current) haptic(6); // a section/slide actually changed
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        navigate(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(N - 1);
      else if (activeRef.current === PORTFOLIO && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        // left/right flip project slides while on the portfolio section
        e.preventDefault();
        const s = slideRef.current;
        if (e.key === "ArrowRight" && s < LAST_SLIDE) setSlide(s + 1);
        else if (e.key === "ArrowLeft" && s > 0) setSlide(s - 1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate, goTo, scrollerFor]);

  // parallax: every [data-depth] element leans by up to `depth` px — toward the
  // pointer on desktop, and with the phone's tilt on touch devices (see gyro.ts).
  // An element can also carry data-rot to bank in 3D by that many degrees.
  // Transforms are written straight onto those elements from one eased rAF loop
  // that sleeps once settled. (Setting CSS variables on the root instead forced
  // a style recalc of the entire page on every mouse move.)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      el,
      depth: Number(el.dataset.depth) || 0,
      rot: Number(el.dataset.rot) || 0,
    }));
    // a phone's tilt has a shorter throw than a pointer sweep, so give it more travel
    const gain = fine ? 1 : 1.55;
    const ease = fine ? 0.08 : 0.14;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const frame = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      for (const { el, depth, rot } of layers) {
        const dx = (x * depth * gain).toFixed(2);
        const dy = (y * depth * gain).toFixed(2);
        el.style.transform = rot
          ? `perspective(700px) translate3d(${dx}px, ${dy}px, 0) rotateX(${(-y * rot).toFixed(2)}deg) rotateY(${(x * rot).toFixed(2)}deg)`
          : `translate3d(${dx}px, ${dy}px, 0)`;
      }
      raf = Math.abs(tx - x) < 0.002 && Math.abs(ty - y) < 0.002 ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    if (fine) {
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        kick();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
      };
    }

    const unsubscribe = gyro.subscribe((gx, gy) => {
      tx = gx;
      ty = gy;
      kick();
    });
    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, []);

  return { active, slide, setSlide, goTo, navigate, rootRef, containerRef };
}
