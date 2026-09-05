"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaLinkedinIn, FaGithub, FaAws } from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiDjango,
  SiFastapi,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGit,
  SiDatabricks,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { profile, projects } from "@/lib/data";
import styles from "./v3.module.css";

const SECTIONS = ["home", "about", "skills", "portfolio", "contact"];
const N = SECTIONS.length;
const PORTFOLIO = 3;
const LAST_SLIDE = projects.length - 1;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Stable animation targets (module-level so the `animate` prop reference
   never changes between renders — prevents Framer from restarting/freezing). */
const SHOWN = { opacity: 1, x: 0, y: 0 };
const HIDDEN = {
  left: { opacity: 0, x: -70, y: 0 },
  right: { opacity: 0, x: 70, y: 0 },
  up: { opacity: 0, x: 0, y: 45 },
} as const;

/* Self-contained reveal — drives its own initial/animate from `show`
   (no variant propagation, works reliably nested anywhere). */
function Rise({
  show,
  from = "up",
  delay = 0,
  className,
  children,
}: {
  show: boolean;
  from?: "left" | "right" | "up";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const hidden = HIDDEN[from];
  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={show ? SHOWN : hidden}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const skills: { name: string; Icon: IconType }[] = [
  { name: "Python", Icon: SiPython },
  { name: "Django", Icon: SiDjango },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "JavaScript", Icon: SiJavascript },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "Redis", Icon: SiRedis },
  { name: "Azure", Icon: VscAzure },
  { name: "AWS", Icon: FaAws },
  { name: "Databricks", Icon: SiDatabricks },
  { name: "Git", Icon: SiGit },
];

type MockKind = "chat" | "dashboard" | "table" | "loyalty" | "travel";
const projectMock: Record<string, MockKind> = {
  "LIA — Conversational AI Assistant": "chat",
  "AspireBI — Enterprise BI Platform": "dashboard",
  "LeapsurgeBI — Business Analytics": "dashboard",
  "Master Data Management (MDM)": "table",
  "BestBI — Analytics for SMBs": "dashboard",
  "Bansal TMT Points": "loyalty",
  "Flyworld — OTA Website": "travel",
  "Votecast — Voter Management": "dashboard",
};

/* ───── 3D cube ───── */
function Cube({
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

/* parallax wrapper */
function P({
  depth,
  style,
  children,
}: {
  depth: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.parallax} style={{ ...style, ["--depth" as string]: depth } as React.CSSProperties}>
      {children}
    </div>
  );
}

/* Interactive 3D dot-sphere (2D canvas — always renders, drag to spin). */
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fibonacci sphere of points
    const N = 900;
    const pts: { x: number; y: number; z: number; amber: boolean }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, amber: i % 41 === 0 });
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO = reduce ? 0 : 0.0026;
    let dpr = 1;
    let size = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width || 360;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rot = { x: 0.35, y: 0 };
    const vel = { x: 0, y: AUTO };
    let dragging = false;
    let hover = false;
    let last = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      rot.y += dx * 0.006;
      rot.x = Math.max(-1.3, Math.min(1.3, rot.x + dy * 0.006));
      vel.y = dx * 0.006;
      vel.x = dy * 0.006;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!dragging) {
        rot.y += vel.y;
        rot.x += vel.x;
        const target = hover ? 0.006 : AUTO;
        vel.y += (target - vel.y) * 0.03;
        vel.x *= 0.9;
        rot.x += (0.35 - rot.x) * 0.012;
      }
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = (size * dpr) / 2 - 4 * dpr;
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);

      const proj = pts.map((p) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        return { sx: cx + x1 * R, sy: cy + y2 * R, z: z2, amber: p.amber };
      });
      proj.sort((a, b) => a.z - b.z);

      for (const p of proj) {
        const t = (p.z + 1) / 2; // 0 back .. 1 front
        const rad = (0.5 + 1.8 * t) * dpr;
        const alpha = 0.1 + 0.85 * t;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
        if (p.amber) {
          ctx.fillStyle = `rgba(240, 166, 58, ${Math.min(1, alpha + 0.1)})`;
          ctx.shadowColor = "rgba(240,166,58,0.8)";
          ctx.shadowBlur = 6 * dpr * t;
        } else {
          ctx.fillStyle = `rgba(${Math.round(150 + 70 * t)}, ${Math.round(120 + 55 * t)}, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={styles.globeWrap}>
      <div className={styles.globeGlow} />
      <div className={styles.globe} />
      <canvas ref={canvasRef} className={styles.globeCanvas} />
      <div className={styles.globeRing} />
    </div>
  );
}

/* Magnetic wrapper — pulls toward the cursor (desktop) + tap-scale (both) */
function Magnetic({
  children,
  className,
  strength = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.span>
  );
}

/* ───────────────── Mock UIs (project previews) ───────────────── */
function DashboardMock({ label }: { label: string }) {
  const bars = [42, 66, 50, 80, 92, 68, 86];
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>{label}</span>
        <span className={styles.mockPill}>Live</span>
      </div>
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <b>₹4.2M</b>
          <em>↗ 12%</em>
          <span>Revenue</span>
        </div>
        <div className={styles.kpi}>
          <b>18.4k</b>
          <em>↗ 8%</em>
          <span>Orders</span>
        </div>
        <div className={styles.kpi}>
          <b>92%</b>
          <em>↗ 3%</em>
          <span>Fulfilled</span>
        </div>
      </div>
      <div className={styles.chart}>
        {bars.map((h, i) => (
          <span
            key={i}
            className={styles.barCol}
            style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>LIA Assistant</span>
        <span className={styles.mockPill}>AI</span>
      </div>
      <div className={styles.chat}>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>Q3 sales for the South region?</div>
        <div className={`${styles.bubble} ${styles.bubbleBot}`}>
          South Q3 was ₹1.8M — up 14% vs Q2. Top SKU: Aspirin-500.
        </div>
        <div className={styles.typing}>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className={styles.chatInput}>
        Ask about sales, stock…
        <span className={styles.chatSend}>
          <FiArrowRight size={11} />
        </span>
      </div>
    </div>
  );
}

function TableMock() {
  const rows: [string, string, string][] = [
    ["ITM-1042", "Aspirin-500", "Active"],
    ["ITM-1043", "Paracetol", "Active"],
    ["ITM-1044", "Ibuprofen", "Review"],
    ["ITM-1045", "Amox-250", "Active"],
  ];
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>Master Data</span>
        <span className={styles.mockPill}>4,812 rows</span>
      </div>
      <div className={styles.table}>
        <div className={`${styles.trow} ${styles.thead}`}>
          <span>Item code</span>
          <span>Name</span>
          <span>Status</span>
        </div>
        {rows.map((r) => (
          <div key={r[0]} className={styles.trow}>
            <span>{r[0]}</span>
            <span>{r[1]}</span>
            <span className={styles.tStatus}>
              <i
                className={styles.tDot}
                style={{ background: r[2] === "Review" ? "var(--amber)" : "#3ddc97" }}
              />
              {r[2]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppCardMock({ variant }: { variant: "loyalty" | "travel" }) {
  if (variant === "loyalty") {
    return (
      <div className={styles.mock}>
        <div className={styles.mockHead}>
          <span className={styles.mockTitle}>Bansal TMT Rewards</span>
          <span className={styles.mockPill}>Gold</span>
        </div>
        <div className={styles.appCard}>
          <div className={styles.appHero}>
            <b>12,480</b>
            <span>Reward points</span>
            <div className={styles.progress}>
              <i style={{ width: "72%" }} />
            </div>
          </div>
          <div className={styles.appRow}>
            Order #TMT-8841 <span>+320 pts</span>
          </div>
          <div className={styles.appRow}>
            Redeemed voucher <span>−500 pts</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>Flyworld</span>
        <span className={styles.mockPill}>Flights</span>
      </div>
      <div className={styles.appCard}>
        <div className={styles.appHero}>
          <b>COK → DXB</b>
          <span>Non-stop · 4h 15m · ₹18,900</span>
        </div>
        <div className={styles.appRow}>
          Marina Bay Hotel <span>★ 4.6</span>
        </div>
        <div className={styles.appRow}>
          2 guests · 3 nights <span>₹22,400</span>
        </div>
      </div>
    </div>
  );
}

function DeviceCard({ kind, label }: { kind: MockKind; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div className={styles.deviceScene} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className={styles.device}>
        <div className={styles.deviceBar}>
          <span className={styles.deviceDot} />
          <span className={styles.deviceDot} />
          <span className={styles.deviceDot} />
        </div>
        <div className={styles.deviceScreen}>
          {kind === "chat" ? (
            <ChatMock />
          ) : kind === "table" ? (
            <TableMock />
          ) : kind === "loyalty" ? (
            <AppCardMock variant="loyalty" />
          ) : kind === "travel" ? (
            <AppCardMock variant="travel" />
          ) : (
            <DashboardMock label={label} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Main ───────────────── */
export default function V3() {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);

  const activeRef = useRef(0);
  const slideRef = useRef(0);
  const lockRef = useRef(false);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => (lockRef.current = false), 950);
  }, []);

  // the internal scroller of a section (content scrolls when taller than viewport)
  const scrollerFor = useCallback((i: number) => {
    const secs = containerRef.current?.querySelectorAll<HTMLElement>("section");
    const sec = secs && secs[i];
    return sec ? sec.querySelector<HTMLElement>("." + styles.inner) : null;
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      const idx = activeRef.current;
      if (idx === PORTFOLIO) {
        const s = slideRef.current;
        if (dir > 0 && s < LAST_SLIDE) {
          setSlide(s + 1);
          lock();
          return;
        }
        if (dir < 0 && s > 0) {
          setSlide(s - 1);
          lock();
          return;
        }
      }
      const next = Math.max(0, Math.min(N - 1, idx + dir));
      if (next !== idx) {
        setActive(next);
        lock();
      }
    },
    [lock]
  );

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(N - 1, i));
      if (clamped !== activeRef.current) {
        setActive(clamped);
        lock();
      }
    },
    [lock]
  );

  // when the section changes, start it scrolled to the top
  useEffect(() => {
    const sc = scrollerFor(active);
    if (sc) sc.scrollTop = 0;
  }, [active, scrollerFor]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const extremes = () => {
      const sc = scrollerFor(activeRef.current);
      if (!sc) return { top: true, bottom: true };
      return {
        top: sc.scrollTop <= 1,
        bottom: sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1,
      };
    };

    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      const { top, bottom } = extremes();
      // let the section scroll internally until an edge is reached
      if ((dir > 0 && !bottom) || (dir < 0 && !top)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 6) return;
      navigate(dir);
    };

    let ty = 0;
    let tx = 0;
    let startTop = true;
    let startBottom = true;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY;
      tx = e.touches[0].clientX;
      const ex = extremes();
      startTop = ex.top;
      startBottom = ex.bottom;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - ty;
      const dx = e.touches[0].clientX - tx;
      if (Math.abs(dx) > Math.abs(dy)) return; // horizontal → let the slider handle it
      // block native overscroll only when a section change is intended
      if ((dy < 0 && startBottom) || (dy > 0 && startTop)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - ty;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dy) < 55 || Math.abs(dx) > Math.abs(dy)) return;
      if (dy < 0 && startBottom) navigate(1);
      else if (dy > 0 && startTop) navigate(-1);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        navigate(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(N - 1);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate, goTo, scrollerFor]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    const el = rootRef.current;
    if (el) {
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      el.style.setProperty("--cx", String(Math.round(e.clientX)));
      el.style.setProperty("--cy", String(Math.round(e.clientY)));
    }
  }, []);

  return (
    <div className={styles.root} ref={rootRef} onMouseMove={onMouseMove}>
      <div className={styles.cursorGlow} aria-hidden />
      <div className={styles.topbar}>
        <button className={styles.brand} onClick={() => goTo(0)} aria-label="Home">
          <span className={styles.brandMark}>{"</>"}</span>
          PRANAV
        </button>
        <Magnetic>
          <button className={styles.contactBtn} onClick={() => goTo(4)}>
            Contact
          </button>
        </Magnetic>
      </div>

      <div className={styles.side}>
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => goTo(i)}
            className={`${styles.sideNum} ${i === active ? styles.sideNumActive : ""}`}
            aria-label={`Go to ${s}`}
          >
            {String(i).padStart(2, "0")}
          </button>
        ))}
      </div>

      <button className={styles.scrollCue} onClick={() => (active >= N - 1 ? goTo(0) : navigate(1))}>
        {active >= N - 1 ? "Back to Top" : "Scroll Down"}
        {active >= N - 1 ? <FiChevronUp /> : <FiChevronDown className="animate-bounce" />}
      </button>

      <div ref={containerRef} className={styles.viewport}>
        <div
          className={`${styles.track} ${styles.engineMode}`}
          style={{
            transform: `translateY(-${active * (100 / N)}%)`,
            transition: "transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          <Home show={active === 0} onAbout={() => goTo(1)} />
          <About show={active === 1} />
          <Skills show={active === 2} />
          <Portfolio show={active === 3} slide={slide} setSlide={setSlide} />
          <Contact show={active === 4} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Home ───────────────── */
function Home({ show, onAbout }: { show: boolean; onAbout: () => void }) {
  return (
    <section className={styles.section}>
      <CodeBars where="bl" />
      <P depth={55} style={{ left: "40%", bottom: "12%" }}>
        <div className={styles.floatA}>
          <Cube size={64} />
        </div>
      </P>
      <P depth={30} style={{ right: "30%", top: "18%" }}>
        <div className={`${styles.orb} ${styles.orbPurple} ${styles.floatB}`} style={{ width: 26, height: 26 }} />
      </P>

      <div className={styles.inner}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Rise show={show} from="left" delay={0.05}>
              <h1 className={styles.h1}>
                Full-Stack
                <br />
                Software
                <br />
                <span className={styles.aPurple}>Engineer</span>
              </h1>
            </Rise>
            <Rise show={show} from="left" delay={0.15}>
              <p className={`${styles.lead} mt-7 max-w-lg`}>
                Crafting scalable web apps, enterprise BI platforms and AI
                assistants. I build elegant interfaces, wire up robust backends,
                and turn complex business data into tools people actually use.
              </p>
            </Rise>
            <Rise show={show} from="left" delay={0.25}>
              <button onClick={onAbout} className={`${styles.arrowLink} mt-8`}>
                About me <FiArrowRight />
              </button>
            </Rise>
          </div>

          <Rise show={show} from="right" delay={0.2} className={`${styles.heroArt} relative`}>
            <P depth={26} style={{ right: "-4%", top: "-8%" }}>
              <div className={styles.floatB}>
                <Cube size={44} dark />
              </div>
            </P>
            <div className={styles.codeWin}>
              <div className={styles.codeTop}>
                <span className={styles.codeDot} style={{ background: "#ff5f57" }} />
                <span className={styles.codeDot} style={{ background: "#febc2e" }} />
                <span className={styles.codeDot} style={{ background: "#28c840" }} />
              </div>
              <div className={styles.codeBody}>
                <div>
                  <span className={styles.aPurple}>const</span> engineer = {"{"}
                </div>
                <div style={{ paddingLeft: 18, color: "var(--muted)" }}>
                  name: <span className={styles.aAmber}>&apos;Pranav S L&apos;</span>,
                </div>
                <div style={{ paddingLeft: 18, color: "var(--muted)" }}>
                  stack: [<span className={styles.aAmber}>&apos;Python&apos;</span>,{" "}
                  <span className={styles.aAmber}>&apos;FastAPI&apos;</span>,
                </div>
                <div style={{ paddingLeft: 60, color: "var(--muted)" }}>
                  <span className={styles.aAmber}>&apos;React&apos;</span>,{" "}
                  <span className={styles.aAmber}>&apos;Next.js&apos;</span>],
                </div>
                <div style={{ paddingLeft: 18, color: "var(--muted)" }}>
                  focus: <span className={styles.aAmber}>&apos;BI · AI · Web&apos;</span>,
                </div>
                <div style={{ paddingLeft: 18, color: "var(--muted)" }}>
                  available: <span className={styles.aPurple}>true</span>,
                </div>
                <div>{"};"}</div>
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── About ───────────────── */
function About({ show }: { show: boolean }) {
  return (
    <section className={styles.section}>
      <P depth={40} style={{ right: "8%", top: "16%" }}>
        <div className={styles.floatB}>
          <Cube size={54} dark />
        </div>
      </P>
      <div className={styles.inner}>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_0.9fr_1.1fr]">
          <Rise show={show} from="left" delay={0.05}>
            <p className={styles.kicker}>About me</p>
            <h2 className={`${styles.h2} mt-4`}>
              Hi, I&apos;m
              <br />
              <span className={styles.aPurple}>Pranav</span>
            </h2>
            <p className={`${styles.lead} mt-3`}>Full-Stack Developer · BI &amp; AI</p>
          </Rise>

          <Rise show={show} from="up" delay={0.15} className={styles.portraitWrap}>
            <Image src={profile.profileImage} alt={profile.name} fill sizes="340px" className={styles.portrait} />
          </Rise>

          <Rise show={show} from="right" delay={0.25}>
            <p className={styles.lead}>{profile.summary}</p>
            <p className={`${styles.lead} mt-4`}>
              Currently at Leapsurge Business Innovations, I build enterprise BI
              platforms — most recently <span className={styles.aPurple}>Aspire BI</span>{" "}
              end to end and <span className={styles.aPurple}>LIA</span>, a
              conversational AI assistant over live Databricks data.
            </p>
            <a href={profile.resume} download className={`${styles.arrowLink} mt-6`}>
              Download CV <FiArrowUpRight />
            </a>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Skills ───────────────── */
function Skills({ show }: { show: boolean }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  return (
    <section className={styles.section}>
      <CodeBars where="bl" />
      <P depth={45} style={{ left: "7%", top: "20%" }}>
        <div className={styles.floatA}>
          <Cube size={40} />
        </div>
      </P>
      <div className={styles.inner}>
        <div className="text-center">
          <Rise show={show} from="up" delay={0.05}>
            <p className={styles.kicker}>Clean code, real business impact</p>
          </Rise>
          <Rise show={show} from="up" delay={0.12}>
            <h2 className={`${styles.h2} mt-4`}>Skills &amp; Experience</h2>
          </Rise>
          <Rise show={show} from="up" delay={0.19}>
            <p className={`${styles.lead} mx-auto mt-5 max-w-2xl`}>
              I specialise in end-to-end web and data platforms — Python, Django
              and FastAPI on the backend; React and Next.js on the front; SQL,
              Databricks and Azure behind the scenes. For a deeper look, visit my{" "}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.aAmber}>
                LinkedIn
              </a>
              .
            </p>
          </Rise>
          <Rise show={show} from="up" delay={0.26}>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-x-6 gap-y-9 sm:grid-cols-5 lg:grid-cols-7">
              {skills.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActiveSkill((p) => (p === s.name ? null : s.name))}
                  className={`${styles.skillItem} ${activeSkill === s.name ? styles.skillActive : ""}`}
                >
                  <s.Icon size={34} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Portfolio ───────────────── */
function Portfolio({
  show,
  slide,
  setSlide,
}: {
  show: boolean;
  slide: number;
  setSlide: (n: number) => void;
}) {
  const touchX = useRef(0);
  const touchY = useRef(0);
  const next = () => setSlide(Math.min(slide + 1, LAST_SLIDE));
  const prev = () => setSlide(Math.max(slide - 1, 0));

  return (
    <section className={styles.section}>
      <P depth={60} style={{ right: "-2%", top: "14%" }}>
        <div className={`${styles.orb} ${styles.floatB}`} style={{ width: 120, height: 120 }} />
      </P>
      <P depth={35} style={{ left: "3%", bottom: "12%" }}>
        <div className={`${styles.orb} ${styles.orbPurple} ${styles.floatA}`} style={{ width: 54, height: 54 }} />
      </P>

      <div className={styles.inner}>
        <Rise show={show} from="left" delay={0.05}>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className={styles.kicker}>Selected work</p>
              <h2 className={`${styles.h2} mt-3`}>
                Portfolio &amp; <span className={styles.aPurple}>Projects</span>
              </h2>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <Magnetic strength={0.5}>
                <button className={styles.arrowBtn} onClick={prev} disabled={slide === 0} aria-label="Previous">
                  <FiArrowLeft />
                </button>
              </Magnetic>
              <Magnetic strength={0.5}>
                <button className={styles.arrowBtn} onClick={next} disabled={slide === LAST_SLIDE} aria-label="Next">
                  <FiArrowRight />
                </button>
              </Magnetic>
            </div>
          </div>
        </Rise>

        <Rise show={show} from="up" delay={0.15}>
          <div
            className={styles.pfViewport}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
              touchY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              const dy = e.changedTouches[0].clientY - touchY.current;
              if (Math.abs(dx) < 45 || Math.abs(dy) > Math.abs(dx)) return;
              if (dx < 0) next();
              else prev();
            }}
          >
            <motion.div
              className={styles.pfTrack}
              animate={{ x: `-${slide * 100}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {projects.map((p) => (
                <div key={p.title} className={styles.pfSlide}>
                  <div>
                    <p className={styles.kicker}>{p.tag}</p>
                    <h3 className={`${styles.h2} mt-3`} style={{ fontSize: "clamp(1.7rem,3vw,2.6rem)" }}>
                      {p.title}
                    </h3>
                    <p className={`${styles.lead} mt-3`}>{p.description}</p>
                    <p className="mt-4 text-sm text-[var(--muted)]">
                      <span className="text-[var(--fg)]">Built with:</span> {p.stack.join(", ")}
                    </p>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className={`${styles.arrowLink} mt-6`}>
                        Visit the app <FiArrowUpRight />
                      </a>
                    )}
                  </div>
                  <DeviceCard
                    kind={projectMock[p.title] ?? "dashboard"}
                    label={p.title.split("—")[0].trim()}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </Rise>

        <Rise show={show} from="up" delay={0.25}>
          <div className={`${styles.dots} mt-8`}>
            {projects.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setSlide(i)}
                className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* ───────────────── Contact ───────────────── */
function Contact({ show }: { show: boolean }) {
  return (
    <section className={styles.section}>
      <P depth={30} style={{ right: "12%", bottom: "16%" }}>
        <div className={styles.floatA}>
          <Cube size={38} dark />
        </div>
      </P>
      <div className={styles.inner}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Rise show={show} from="left" delay={0.1} className="order-last lg:order-first">
            <Globe />
          </Rise>

          <Rise show={show} from="right" delay={0.15}>
            <p className={styles.kicker}>Contact</p>
            <h2 className={`${styles.h2} mt-4`}>
              What would you do if a full-stack engineer was a click away?
            </h2>
            <p className={`${styles.lead} mt-5`}>
              Whether you want to start a new project or just say hello, I&apos;d love
              to hear from you. You can also connect with me on{" "}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.aAmber}>
                LinkedIn
              </a>
              .
            </p>
            <a href={`mailto:${profile.email}`} className={`${styles.bigMail} mt-8 block text-2xl sm:text-3xl lg:text-4xl`}>
              {profile.email}
            </a>
            <div className="mt-8 flex items-center gap-4">
              <Magnetic strength={0.5}>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--purple)] hover:text-[var(--fg)]"
                >
                  <FaLinkedinIn />
                </a>
              </Magnetic>
              <Magnetic strength={0.5}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--purple)] hover:text-[var(--fg)]"
                >
                  <FaGithub />
                </a>
              </Magnetic>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Code bars ───────────────── */
function CodeBars({ where }: { where: "tl" | "bl" | "tr" | "br" }) {
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 24 },
    bl: { bottom: 24, left: 24 },
    tr: { top: 24, right: 24, alignItems: "flex-end" },
    br: { bottom: 24, right: 24, alignItems: "flex-end" },
  };
  const rows = [
    [["#b833ff", 34], ["#3a3a44", 20]],
    [["#f0a63a", 18], ["#4bd1c8", 40], ["#3a3a44", 14]],
    [["#4a7bff", 26], ["#3a3a44", 22]],
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
