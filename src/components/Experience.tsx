"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { experiences } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="section-pad relative">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          subtitle="Where I've worked"
          title="Experience"
        />

        <div className="relative pl-2">
          {/* vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px timeline-line md:left-1/2" />

          <div className="space-y-10 md:space-y-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative pl-8 md:grid md:grid-cols-2 md:gap-10 md:pl-0 ${
                  i % 2 === 0 ? "" : ""
                }`}
              >
                {/* node */}
                <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-white/20 bg-[var(--color-bg)] md:left-1/2 md:-translate-x-1/2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" />
                </span>

                {/* card - alternate sides on desktop */}
                <div
                  className={`md:col-span-1 ${
                    i % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:col-start-2 md:pl-12"
                  }`}
                >
                  <div className="glow-border card-hover glass rounded-2xl p-6 text-left">
                    <div
                      className={`mb-3 flex flex-wrap items-center gap-2 ${
                        i % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      <span className="rounded-full border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/10 px-2.5 py-0.5 font-mono text-xs text-[var(--color-violet)]">
                        {exp.period}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-[var(--color-muted)]">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold">{exp.role}</h3>
                    <p className="mt-0.5 text-[var(--color-cyan)]">{exp.company}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {exp.location}
                    </p>

                    <ul className="mt-4 space-y-2 text-left">
                      {exp.points.map((p) => (
                        <li
                          key={p}
                          className="flex gap-2.5 text-sm leading-relaxed text-[var(--color-muted)]"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-violet)]" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`mt-4 flex flex-wrap gap-1.5 ${
                        i % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      {exp.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg)]/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
