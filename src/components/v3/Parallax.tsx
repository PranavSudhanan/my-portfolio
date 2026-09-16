import styles from "./v3.module.css";

/** Absolutely-positioned wrapper that drifts with the cursor (desktop) or the
 *  phone's tilt (mobile): `depth` is the max offset in px and `rot` the max 3D
 *  bank in degrees — both applied by the parallax loop in useFullpage.
 *  `mobile` hides it on phones, or keeps it for phones only. */
export function P({
  depth,
  rot,
  mobile,
  style,
  children,
}: {
  depth: number;
  rot?: number;
  mobile?: "hide" | "only";
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const only = mobile === "only" ? ` ${styles.mobileOnly}` : "";
  const hide = mobile === "hide" ? ` ${styles.desktopOnly}` : "";
  return (
    <div
      className={`${styles.parallax}${only}${hide}`}
      style={style}
      data-depth={depth}
      data-rot={rot}
    >
      {children}
    </div>
  );
}
