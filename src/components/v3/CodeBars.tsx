import styles from "./v3.module.css";

/** Decorative "syntax bars" tucked into a corner of a section. */
export function CodeBars({ where }: { where: "tl" | "bl" | "tr" | "br" }) {
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 24 },
    bl: { bottom: 24, left: 24 },
    tr: { top: 24, right: 24, alignItems: "flex-end" },
    br: { bottom: 24, right: 24, alignItems: "flex-end" },
  };
  const accent = "rgba(var(--accent-rgb), 0.55)";
  const accent2 = "rgba(var(--accent2-rgb), 0.45)";
  const dim = "var(--surface-3)";
  const mid = "var(--line-strong)";
  const rows = [
    [[accent, 34], [dim, 20]],
    [[mid, 18], [accent2, 40], [dim, 14]],
    [[mid, 26], [dim, 22]],
  ] as const;
  return (
    <div className={styles.bars} style={pos[where]}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6 }}>
          {r.map(([c, w], j) => (
            <span key={j} className={styles.bar} style={{ background: c, width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}
