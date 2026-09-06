import styles from "./v3.module.css";

/** Decorative "syntax bars" tucked into a corner of a section. */
export function CodeBars({ where }: { where: "tl" | "bl" | "tr" | "br" }) {
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 24 },
    bl: { bottom: 24, left: 24 },
    tr: { top: 24, right: 24, alignItems: "flex-end" },
    br: { bottom: 24, right: 24, alignItems: "flex-end" },
  };
  const rows = [
    [["#9b93c9", 34], ["#3a3a44", 20]],
    [["#57575f", 18], ["#6b6494", 40], ["#3a3a44", 14]],
    [["#48484f", 26], ["#3a3a44", 22]],
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
