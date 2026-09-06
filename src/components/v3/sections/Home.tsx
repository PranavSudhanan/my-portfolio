"use client";

import { FiArrowRight } from "react-icons/fi";
import { Rise } from "../Rise";
import { Cube } from "../Cube";
import { P } from "../Parallax";
import { CodeBars } from "../CodeBars";
import styles from "../v3.module.css";

export function Home({ show, onAbout }: { show: boolean; onAbout: () => void }) {
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
                  focus: <span className={styles.aAmber}>&apos;AI · Web . API&apos;</span>,
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
