import styles from "./v3.module.css";

/** A CSS-3D rotating cube (six faces). */
export function Cube({
  size,
  dark,
  className,
  style,
}: {
  size: number;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const h = size / 2;
  const faces = [
    `translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ];
  return (
    <div className={`${styles.cubeWrap} ${dark ? styles.cubeDark : ""} ${className || ""}`} style={style}>
      <div className={styles.cube} style={{ width: size, height: size }}>
        {faces.map((t, i) => (
          <div key={i} className={styles.face} style={{ transform: t }} />
        ))}
      </div>
    </div>
  );
}
