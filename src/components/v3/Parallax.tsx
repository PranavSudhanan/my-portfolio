import styles from "./v3.module.css";

/** Absolutely-positioned wrapper that drifts with the cursor; `depth` is the
 *  max offset in px, applied by the parallax loop in useFullpage. */
export function P({
  depth,
  style,
  children,
}: {
  depth: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={styles.parallax}
      style={style}
      data-depth={depth}
    >
      {children}
    </div>
  );
}
