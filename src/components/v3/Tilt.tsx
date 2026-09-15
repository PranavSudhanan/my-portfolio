"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import styles from "./v3.module.css";

const SPRING = { stiffness: 210, damping: 22, mass: 0.6 };

/**
 * 3D card: tilts toward the pointer on springs, lifts slightly on hover and
 * carries a pointer-tracked sheen plus a glowing edge that follows the cursor
 * around its border. On touch screens pressing the card tilts it toward the
 * finger (and it follows while dragging), springing flat on release.
 * `cursor` / `cursorLabel` feed the custom cursor.
 */
export function Tilt({
  children,
  className,
  glareClassName,
  max = 9,
  scale = 1.02,
  glare = true,
  cursor = "tilt",
  cursorLabel,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  glareClassName?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  cursor?: string;
  cursorLabel?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pressed = useRef(false);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sc = useMotionValue(1);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);
  const scaleS = useSpring(sc, SPRING);
  const sheen = useMotionTemplate`radial-gradient(300px circle at ${mx}% ${my}%, var(--glare), transparent 66%)`;
  const edge = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgba(var(--accent-rgb), 0.7), transparent 72%)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    if (e.pointerType === "touch" && !pressed.current) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max);
    ry.set(px * max);
    mx.set((px + 0.5) * 100);
    my.set((py + 0.5) * 100);
  };
  const onEnter = (e: React.PointerEvent) => {
    if (!reduce && e.pointerType !== "touch") sc.set(scale);
  };
  const onDown = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "touch") return;
    pressed.current = true;
    sc.set(scale);
    onMove(e);
  };
  const onLeave = () => {
    pressed.current = false;
    rx.set(0);
    ry.set(0);
    sc.set(1);
    mx.set(50);
    my.set(50);
  };

  const glareCls = glareClassName ? ` ${glareClassName}` : "";
  return (
    <div
      className={styles.tiltScene}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerDown={onDown}
      onPointerUp={onLeave}
      onPointerCancel={onLeave}
      onPointerLeave={onLeave}
      data-cursor={cursor}
      data-cursor-label={cursorLabel}
    >
      <motion.div ref={ref} className={className} style={{ ...style, rotateX, rotateY, scale: scaleS }}>
        {children}
        {glare && !reduce && (
          <>
            <motion.span className={styles.tiltGlare + glareCls} style={{ background: sheen }} />
            <motion.span className={styles.tiltEdge + glareCls} style={{ background: edge }} />
          </>
        )}
      </motion.div>
    </div>
  );
}
