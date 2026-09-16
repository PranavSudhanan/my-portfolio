"use client";

import { useRef } from "react";
import { motion, type PanInfo } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/lib/data";
import { EASE, projectMock } from "../constants";
import { Rise } from "../Rise";
import { Magnetic } from "../Magnetic";
import { P } from "../Parallax";
import { DeviceCard } from "../DeviceCard";
import { haptic } from "../haptics";
import styles from "../v3.module.css";

const LAST_SLIDE = projects.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

export function Portfolio({
  show,
  slide,
  setSlide,
}: {
  show: boolean;
  slide: number;
  setSlide: (n: number) => void;
}) {
  const dragged = useRef(false);
  const next = () => setSlide(Math.min(slide + 1, LAST_SLIDE));
  const prev = () => setSlide(Math.max(slide - 1, 0));

  // swipe / drag with mouse or finger: the wrapper stretches elastically and
  // snaps back while the track animates to the new slide
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if ((offset.x < -70 || velocity.x < -450) && slide < LAST_SLIDE) {
      haptic();
      next();
    } else if ((offset.x > 70 || velocity.x > 450) && slide > 0) {
      haptic();
      prev();
    }
    // keep the click that follows a drag from opening links
    window.setTimeout(() => (dragged.current = false), 60);
  };

  return (
    <section className={styles.section}>
      <P depth={60} style={{ right: "-2%", top: "14%" }}>
        <div className={`${styles.orb} ${styles.floatB}`} style={{ width: 120, height: 120 }} />
      </P>
      <P depth={35} style={{ left: "3%", bottom: "12%" }}>
        <div className={`${styles.orb} ${styles.orbAccent} ${styles.floatA}`} style={{ width: 54, height: 54 }} />
      </P>

      <div className={styles.inner}>
        <Rise show={show} from="left" delay={0.05}>
          <div className={`${styles.pfHead} mb-8 flex items-end justify-between gap-4`}>
            <div>
              <p className={styles.kicker}>Selected work</p>
              <h2 className={`${styles.h2} mt-3`}>
                Portfolio &amp; <span className={styles.aAccent}>Projects</span>
              </h2>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className={styles.pfCount} aria-live="polite">
                {pad(slide + 1)} <em>/ {pad(projects.length)}</em>
              </span>
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
          <div className={styles.pfViewport}>
            <motion.div
              className={styles.pfDrag}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              dragSnapToOrigin
              dragMomentum={false}
              onDragStart={() => (dragged.current = true)}
              onDragEnd={onDragEnd}
              onClickCapture={(e) => {
                if (dragged.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              data-cursor="drag"
              data-cursor-label="Drag"
            >
              <motion.div
                className={styles.pfTrack}
                animate={{ x: `-${slide * 100}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {projects.map((p, i) => (
                  <div
                    key={p.title}
                    className={styles.pfSlide}
                    aria-hidden={i !== slide}
                    inert={i !== slide ? true : undefined}
                  >
                    <div>
                      <p className={styles.kicker}>{p.tag}</p>
                      <h3 className={`${styles.h2} mt-3`} style={{ fontSize: "clamp(1.7rem,3vw,2.6rem)" }}>
                        {p.title}
                      </h3>
                      <p className={`${styles.lead} mt-3`}>{p.description}</p>
                      <p className="mt-4 text-sm text-[var(--muted)]">
                        <span className="text-[var(--fg)]">Built with:</span>{" "}
                        {p.stack.map((s) => (
                          <span key={s} className={styles.stackChip}>
                            {s}
                          </span>
                        ))}
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
                      href={p.link}
                      show={show && i === slide}
                    />
                  </div>
                ))}
              </motion.div>
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
                aria-label={`Project ${i + 1}: ${p.title}`}
                aria-current={i === slide ? "true" : undefined}
              />
            ))}
          </div>
        </Rise>
      </div>
    </section>
  );
}
