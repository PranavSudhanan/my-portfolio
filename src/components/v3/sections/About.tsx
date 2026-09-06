"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { profile } from "@/lib/data";
import { Rise } from "../Rise";
import { Cube } from "../Cube";
import { P } from "../Parallax";
import styles from "../v3.module.css";

export function About({ show }: { show: boolean }) {
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
            <p className={`${styles.lead} mt-3`}>Full-Stack Developer · API &amp; AI</p>
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
