"use client";

import styles from "./v3.module.css";

/** One ambient object: `depth` px of drift and `rot` degrees of 3D bank, both
 *  driven by the phone's tilt through the parallax loop in useFullpage. */
function Obj({
  depth,
  rot,
  className,
  style,
  children,
}: {
  depth: number;
  rot?: number;
  className?: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${styles.gyroObj} ${className ?? ""}`}
      style={style}
      data-depth={depth}
      data-rot={rot}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-only ambient scene that reacts to how the phone is tilted: a horizon
 * grid, an orbiting ring, a wireframe hex, a reticle and a few code glyphs, all
 * at different depths so the background reads as a space you can look around
 * rather than a flat picture. Sits behind every section (the sections
 * themselves are transparent) and is hidden on desktop.
 */
export function GyroScene() {
  return (
    <div className={styles.gyroScene} aria-hidden>
      {/* horizon grid receding to the vanishing point */}
      <Obj depth={16} rot={5} style={{ left: "-25%", right: "-25%", bottom: "-6%", height: "42%" }}>
        <div className={styles.gyroHorizon} />
      </Obj>

      {/* dashed orbit with a travelling satellite */}
      <Obj depth={34} rot={14} style={{ top: "-7%", right: "-26%", width: 210, height: 210 }}>
        <div className={styles.gyroRing}>
          <span className={styles.gyroSat} />
        </div>
        <div className={styles.gyroRingInner} />
      </Obj>

      {/* wireframe hex */}
      <Obj depth={26} rot={20} style={{ bottom: "4%", left: "-24%", width: 170, height: 170 }}>
        <svg viewBox="0 0 100 100" className={styles.gyroHex}>
          <polygon points="50,3 93,27 93,73 50,97 7,73 7,27" />
          <polygon points="50,20 78,36 78,64 50,80 22,64 22,36" className={styles.gyroHexInner} />
        </svg>
      </Obj>

      {/* targeting reticle */}
      <Obj depth={46} style={{ top: "38%", right: "4%", width: 42, height: 42 }}>
        <div className={styles.gyroReticle}>
          <span />
          <span />
        </div>
      </Obj>

      {/* code glyphs at three different depths */}
      <Obj depth={54} rot={12} className={styles.gyroGlyph} style={{ top: "31%", left: "3%" }}>
        {"{ }"}
      </Obj>
      <Obj depth={40} rot={10} className={styles.gyroGlyph} style={{ bottom: "27%", right: "4%" }}>
        {"</>"}
      </Obj>
      <Obj depth={62} className={`${styles.gyroGlyph} ${styles.gyroGlyphDim}`} style={{ bottom: "13%", right: "24%" }}>
        01
      </Obj>
    </div>
  );
}
