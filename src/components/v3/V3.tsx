"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { SECTIONS, N } from "./constants";
import { useFullpage } from "./useFullpage";
import { Magnetic } from "./Magnetic";
import { Home } from "./sections/Home";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Portfolio } from "./sections/Portfolio";
import { Contact } from "./sections/Contact";
import styles from "./v3.module.css";

/** DVLPR-style full-page portfolio: the fixed chrome (top bar, side nav,
 *  scroll cue, cursor spotlight) plus the snapping section track. */
export default function V3() {
  const { active, slide, setSlide, goTo, navigate, rootRef, containerRef, onMouseMove } =
    useFullpage();

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
