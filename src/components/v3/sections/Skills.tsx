"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { Rise } from "../Rise";
import { Cube } from "../Cube";
import { P } from "../Parallax";
import { CodeBars } from "../CodeBars";
import { Magnetic } from "../Magnetic";
import { skills, type SkillGroup } from "../constants";
import styles from "../v3.module.css";

export function Skills({ show }: { show: boolean }) {
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const focus = hovered ?? pinned;
  const focusGroup: SkillGroup | null = focus
    ? (skills.find((s) => s.name === focus)?.group ?? null)
    : null;

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
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.aAlt}>
                LinkedIn
              </a>
              .
            </p>
          </Rise>
          <Rise show={show} from="up" delay={0.26}>
            {/* hover/tap a skill: it lights up and shows its area; siblings in
                the same area glow while everything else steps back */}
            <div
              className={`${styles.skillGrid} mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-x-6 gap-y-9 sm:grid-cols-5 lg:grid-cols-7`}
              data-focused={focusGroup ? "true" : undefined}
              onMouseLeave={() => setHovered(null)}
            >
              {skills.map((s) => {
                const isFocus = focus === s.name;
                const isKin = !isFocus && focusGroup === s.group;
                return (
                  <Magnetic key={s.name} strength={0.3} className={styles.skillCell}>
                    <button
                      type="button"
                      onClick={() => setPinned((p) => (p === s.name ? null : s.name))}
                      onMouseEnter={() => setHovered(s.name)}
                      onFocus={() => setHovered(s.name)}
                      onBlur={() => setHovered(null)}
                      className={`${styles.skillItem} ${isFocus ? styles.skillActive : ""} ${isKin ? styles.skillKin : ""}`}
                      aria-pressed={pinned === s.name}
                    >
                      <span className={styles.skillIcon}>
                        <s.Icon size={34} />
                      </span>
                      <span>{s.name}</span>
                      <span className={styles.skillTag}>{s.group}</span>
                    </button>
                  </Magnetic>
                );
              })}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
