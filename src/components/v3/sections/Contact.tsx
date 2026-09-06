"use client";

import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { profile } from "@/lib/data";
import { Rise } from "../Rise";
import { Magnetic } from "../Magnetic";
import { Globe } from "../Globe";
import { P } from "../Parallax";
import { Cube } from "../Cube";
import styles from "../v3.module.css";

export function Contact({ show }: { show: boolean }) {
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
            <h2
              className={`${styles.h2} mt-4 max-w-xl`}
              style={{ fontSize: "clamp(1.5rem, 2.9vw, 2.35rem)", lineHeight: 1.15 }}
            >
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
            <a href={`mailto:${profile.email}`} className={`${styles.bigMail} mt-8 block text-lg sm:text-2xl lg:text-3xl`}>
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
