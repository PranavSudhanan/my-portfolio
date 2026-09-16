"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { SECTIONS, N, SLIDE_MS } from "./constants";
import { useFullpage } from "./useFullpage";
import { Magnetic } from "./Magnetic";
import { ThemeSwitch } from "./ThemeSwitch";
import { useTheme } from "./useTheme";
import { Cursor } from "./Cursor";
import { TouchFX } from "./TouchFX";
import { Dock } from "./Dock";
import { Dust } from "./Dust";
import { GyroScene } from "./GyroScene";
import { MotionButton } from "./MotionButton";
import { Home } from "./sections/Home";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Portfolio } from "./sections/Portfolio";
import { Contact } from "./sections/Contact";
import styles from "./v3.module.css";

/** DVLPR-style full-page portfolio: the fixed chrome (top bar, side nav,
 *  scroll cue), the reactive backdrop (aurora, dot-grid reveal, dust) and the
 *  custom cursor, plus the snapping section track. */
export default function V3() {
  const { active, slide, setSlide, goTo, navigate, rootRef, containerRef } = useFullpage();
  const { mode, resolved, setMode } = useTheme();

  return (
    <div className={styles.root} data-theme={resolved} ref={rootRef}>
      {/* ---- reactive backdrop ---- */}
      <div className={styles.aurora} aria-hidden>
        <span className={styles.auroraA} data-depth={40} />
        <span className={styles.auroraB} data-depth={40} />
      </div>
      <div className={styles.gridBase} aria-hidden />
      <div className={styles.gridReveal} aria-hidden>
        <div className={styles.gridRevealDots} />
      </div>
      <GyroScene />
      <Dust />

      <div className={styles.topbar}>
        <Magnetic strength={0.25}>
          <button className={styles.brand} onClick={() => goTo(0)} aria-label="Home">
            <span className={styles.brandMark}>{"</>"}</span>
            PRANAV
          </button>
        </Magnetic>
        <div className={styles.topRight}>
          <MotionButton />
          <ThemeSwitch mode={mode} setMode={setMode} />
          <Magnetic className={styles.contactWrap}>
            <button className={styles.contactBtn} onClick={() => goTo(4)}>
              Contact
            </button>
          </Magnetic>
        </div>
      </div>

      <div className={styles.side}>
        {SECTIONS.map((s, i) => (
          <Magnetic key={s} strength={0.35}>
            <button
              onClick={() => goTo(i)}
              className={`${styles.sideNum} ${i === active ? styles.sideNumActive : ""}`}
              aria-label={`Go to ${s}`}
              aria-current={i === active ? "true" : undefined}
            >
              <span className={styles.sideLabel}>{s}</span>
              {String(i).padStart(2, "0")}
            </button>
          </Magnetic>
        ))}
      </div>

      <Magnetic strength={0.3} className={styles.scrollCueWrap}>
        <button className={styles.scrollCue} onClick={() => (active >= N - 1 ? goTo(0) : navigate(1))}>
          {active >= N - 1 ? "Back to Top" : "Scroll Down"}
          {active >= N - 1 ? <FiChevronUp /> : <FiChevronDown className="animate-bounce" />}
        </button>
      </Magnetic>

      <div ref={containerRef} className={styles.viewport}>
        <div
          className={styles.track}
          style={{
            transform: `translate3d(0, -${active * (100 / N)}%, 0)`,
            // expo-out: moves the instant you scroll, then settles softly
            // (the old ease-in-out spent its first ~200ms barely moving)
            transition: `transform ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          <Home show={active === 0} onAbout={() => goTo(1)} onHire={() => goTo(4)} />
          <About show={active === 1} />
          <Skills show={active === 2} />
          <Portfolio show={active === 3} slide={slide} setSlide={setSlide} />
          <Contact show={active === 4} />
        </div>
      </div>

      <Dock active={active} goTo={goTo} />
      <Cursor rootRef={rootRef} />
      <TouchFX rootRef={rootRef} />
    </div>
  );
}
