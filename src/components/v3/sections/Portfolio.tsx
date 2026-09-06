"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/lib/data";
import { EASE, projectMock } from "../constants";
import { Rise } from "../Rise";
import { Magnetic } from "../Magnetic";
import { P } from "../Parallax";
import { DeviceCard } from "../DeviceCard";
import styles from "../v3.module.css";

const LAST_SLIDE = projects.length - 1;

export function Portfolio({
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
