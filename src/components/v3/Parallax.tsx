import styles from "./v3.module.css";

/** Absolutely-positioned wrapper that drifts with the cursor (via --px/--py). */
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
      style={{ ...style, ["--depth" as string]: depth } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
