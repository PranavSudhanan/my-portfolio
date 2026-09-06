"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { Rise } from "../Rise";
import { Cube } from "../Cube";
import { P } from "../Parallax";
import { CodeBars } from "../CodeBars";
import { skills } from "../constants";
import styles from "../v3.module.css";

export function Skills({ show }: { show: boolean }) {
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
