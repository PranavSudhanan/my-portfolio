"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { FiCheck, FiCopy } from "react-icons/fi";
import { profile } from "@/lib/data";
import { Rise } from "../Rise";
import { Magnetic } from "../Magnetic";
import { Globe } from "../Globe";
import { P } from "../Parallax";
import { Cube } from "../Cube";
import styles from "../v3.module.css";

/** Old-school copy for browsers that deny the async Clipboard API. */
function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function Contact({ show }: { show: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(profile.email);
      ok = true;
    } catch {
      ok = legacyCopy(profile.email);
    }
    if (!ok) return; // clipboard blocked entirely — the mailto link still works
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

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
            <Globe active={show} />
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
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.aAlt}>
                LinkedIn
              </a>
              .
            </p>
            <div className={`${styles.mailRow} mt-8`}>
              <a href={`mailto:${profile.email}`} className={`${styles.bigMail} text-lg sm:text-2xl lg:text-3xl`}>
                {profile.email}
              </a>
              <Magnetic strength={0.45}>
                <button
                  type="button"
                  onClick={copy}
                  className={`${styles.copyBtn} ${copied ? styles.copyDone : ""}`}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </Magnetic>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    className={styles.toast}
                    role="status"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    Copied to clipboard
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Magnetic strength={0.5}>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={styles.socialBtn}
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
                  className={styles.socialBtn}
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
