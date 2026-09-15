"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Gently pulls its child toward the cursor (desktop) and presses on tap.
 *  The pull is capped at `max` px so a control never slides out from under
 *  the pointer, and it is measured from the element's resting position (the
 *  live rect includes the pull itself, which made the old version jitter). */
export function Magnetic({
  children,
  className,
  strength = 0.4,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 320, damping: 28, mass: 0.5 });
  const y = useSpring(my, { stiffness: 320, damping: 28, mass: 0.5 });
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));
  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        // subtract the current offset to get the un-pulled centre
        const cx = r.left + r.width / 2 - x.get();
        const cy = r.top + r.height / 2 - y.get();
        mx.set(clamp((e.clientX - cx) * strength));
        my.set(clamp((e.clientY - cy) * strength));
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.span>
  );
}
