"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDown, FiArrowUpRight, FiMail } from "react-icons/fi";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { profile, stats } from "@/lib/data";

function useRotatingText(words: string[], speed = 70, pause = 1400) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const current = words[index];
    if (!deleting && sub === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setSub((s) => s + (deleting ? -1 : 1)),
      deleting ? speed / 1.8 : speed
    );
    return () => clearTimeout(t);
  }, [sub, deleting, index, words, speed, pause, reduce]);

  if (reduce) return words[0];
  return words[index].slice(0, sub);
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const role = useRotatingText(profile.roles);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      {/* Aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora animate-floaty left-[-8%] top-[6%] h-[38vw] w-[38vw] max-h-[520px] max-w-[520px] bg-[var(--color-violet)]/40" />
        <div className="aurora animate-floaty-2 right-[-6%] top-[12%] h-[34vw] w-[34vw] max-h-[460px] max-w-[460px] bg-[var(--color-cyan)]/30" />
        <div className="aurora animate-floaty left-[35%] bottom-[-10%] h-[30vw] w-[30vw] max-h-[420px] max-w-[420px] bg-[var(--color-emerald)]/20" />
      </div>

      <div className="shell grid w-full items-center gap-14 2xl:gap-20 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-[var(--color-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-emerald)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-emerald)]" />
              </span>
              Available for opportunities
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 font-mono text-sm text-[var(--color-cyan)]"
          >
            Hi, I&apos;m
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-2 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl 2xl:text-8xl"
          >
            {profile.name.split(" ").slice(0, 1).join(" ")}{" "}
            <span className="gradient-text">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-4 flex h-9 items-center font-display text-xl text-[var(--color-fg)]/90 sm:text-2xl"
          >
            <span className="text-[var(--color-muted)]">I&apos;m a&nbsp;</span>
            <span className="font-semibold text-[var(--color-fg)]">{role}</span>
            <span className="caret ml-0.5 inline-block h-6 w-[2px] bg-[var(--color-cyan)] sm:h-7" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg 2xl:max-w-2xl 2xl:text-xl"
          >
            {profile.tagline} I turn complex business data into dashboards,
            automated reports and conversational tools people actually use.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)] px-5 py-3 font-medium text-black shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              View my work
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-violet)]/50 hover:bg-white/[0.06]"
            >
              <FiMail className="text-[var(--color-cyan)]" />
              Get in touch
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-3">
            <SocialLink href={profile.linkedin} label="LinkedIn">
              <FaLinkedinIn />
            </SocialLink>
            <SocialLink href={profile.github} label="GitHub">
              <FaGithub />
            </SocialLink>
            <SocialLink href={`mailto:${profile.email}`} label="Email">
              <FiMail />
            </SocialLink>
          </motion.div>
        </motion.div>

        {/* Right: terminal + monogram card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md 2xl:max-w-lg"
        >
          <div className="glow-border card-hover glass relative overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-[var(--color-muted)]">
                pranav@dev ~ portfolio
              </span>
            </div>
            <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
              <p className="text-[var(--color-muted)]">
                <span className="text-[var(--color-emerald)]">$</span> whoami
              </p>
              <p className="text-[var(--color-fg)]">{profile.name}</p>
              <p className="text-[var(--color-muted)]">
                <span className="text-[var(--color-emerald)]">$</span> cat role.txt
              </p>
              <p className="gradient-text font-semibold">{profile.role}</p>
              <p className="text-[var(--color-muted)]">
                <span className="text-[var(--color-emerald)]">$</span> stack --list
              </p>
              <p className="flex flex-wrap gap-1.5 pt-1">
                {["Python", "FastAPI", "React", "Next.js", "Azure", "Databricks"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-[var(--color-fg)]/90"
                    >
                      {t}
                    </span>
                  )
                )}
              </p>
              <p className="text-[var(--color-muted)]">
                <span className="text-[var(--color-emerald)]">$</span> location
              </p>
              <p className="text-[var(--color-fg)]">📍 Bangalore, India</p>
              <p className="flex items-center text-[var(--color-muted)]">
                <span className="text-[var(--color-emerald)]">$</span>
                <span className="caret ml-2 inline-block h-4 w-2 bg-[var(--color-cyan)]" />
              </p>
            </div>
          </div>

          {/* floating badge */}
          <div className="glass absolute -bottom-5 -left-5 hidden rounded-xl px-4 py-3 sm:block">
            <p className="font-display text-2xl font-bold gradient-text">4+</p>
            <p className="text-xs text-[var(--color-muted)]">years building</p>
          </div>
        </motion.div>
      </div>

      {/* stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="shell absolute inset-x-0 bottom-6 hidden lg:block"
      >
        <div className="glass grid grid-cols-4 divide-x divide-white/10 rounded-2xl">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-4 text-center">
              <p className="font-display text-2xl font-bold gradient-text">{s.value}</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] lg:hidden"
      >
        <FiArrowDown className="animate-bounce" />
      </a>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-[var(--color-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-cyan)]/50 hover:text-[var(--color-fg)]"
    >
      {children}
    </a>
  );
}
