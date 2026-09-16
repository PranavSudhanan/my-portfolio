"use client";

import { useEffect, useState } from "react";
import { FiSmartphone } from "react-icons/fi";
import { gyro } from "./gyro";
import { haptic } from "./haptics";
import styles from "./v3.module.css";

/**
 * iOS hands out motion access only from inside a tap, so phones that need it
 * get a small "tilt" button in the top bar. It disappears as soon as readings
 * arrive — and never appears at all on devices that just work (Android) or have
 * no sensor (desktop).
 */
export function MotionButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // touch devices only: a desktop browser can expose the permission API
    // without ever having a sensor to grant access to
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (!gyro.needsPermission() || gyro.isLive()) return;
    // give a device that already has access a moment to report in
    const t = window.setTimeout(() => setShow(!gyro.isLive()), 1200);
    const off = gyro.onLive(() => {
      window.clearTimeout(t);
      setShow(false);
    });
    return () => {
      window.clearTimeout(t);
      off();
    };
  }, []);

  if (!show) return null;
  return (
    <button
      type="button"
      className={styles.motionBtn}
      onClick={async () => {
        haptic();
        if (await gyro.request()) setShow(false);
      }}
      aria-label="Enable tilt effects"
    >
      <FiSmartphone size={14} />
      <span>tilt</span>
    </button>
  );
}
