"use client";

import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, staggerItem } from "./Reveal";
import { motion } from "framer-motion";
import { FiServer, FiLayout, FiCloud, FiCpu } from "react-icons/fi";
import { profile, education, certifications, spokenLanguages } from "@/lib/data";
import Image from 'next/image'

const whatIDo = [
  {
    icon: FiServer,
    title: "Backend & APIs",
    text: "Python, Django, FastAPI and REST services built to scale — auth, jobs and clean data layers.",
  },
  {
    icon: FiLayout,
    title: "Frontend",
    text: "React & Next.js interfaces and interactive dashboards that make complex data feel simple.",
  },
  {
    icon: FiCloud,
    title: "Cloud & DevOps",
    text: "Multi-tenant hosting on Azure with DevOps CI/CD, App Service and Blob Storage.",
  },
  {
    icon: FiCpu,
    title: "BI & AI",
    text: "Automated Power BI reporting pipelines and AI assistants over live enterprise data.",
  },
];

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="shell">
        <SectionHeading index="01" subtitle="Who I am" title="About me" />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: avatar + quick facts */}
          <Reveal>
            <div className="glow-border card-hover glass rounded-2xl p-6">
              <div className="relative mx-auto mb-6 h-40 w-40">
                {/* Glow */}
                <div className="absolute inset-0 animate-floaty rounded-full bg-gradient-to-br from-[var(--color-violet)] to-[var(--color-cyan)] opacity-60 blur-xl" />

                {/* Circular image container */}
                <div className="relative h-40 w-40 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                <Fact label="Location" value={profile.location} />
                <Fact label="Experience" value="4+ years" />
                <Fact label="Languages" value={spokenLanguages.join(", ")} />
                <Fact label="Open to" value="Full-time · Remote · Hybrid" />
              </dl>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Education
                </p>
                <ul className="space-y-3">
                  {education.map((e) => (
                    <li key={e.school}>
                      <p className="text-sm font-medium text-[var(--color-fg)]">
                        {e.degree}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {e.school} · {e.period}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Certifications
                </p>
                <ul className="flex flex-wrap gap-2">
                  {certifications.map((c) => (
                    <li
                      key={c}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-[var(--color-muted)]"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Right: bio + what I do */}
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-[var(--color-fg)]/90">
                {profile.summary}
              </p>
              <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
                Currently at{" "}
                <span className="text-[var(--color-fg)]">
                  Leapsurge Business Innovations
                </span>
                , I build enterprise BI platforms — most recently{" "}
                <span className="text-[var(--color-cyan)]">Aspire BI</span> end to
                end and <span className="text-[var(--color-violet)]">LIA</span>, a
                conversational AI assistant over live Databricks data.
              </p>
            </Reveal>

            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {whatIDo.map((c) => (
                <motion.div
                  key={c.title}
                  variants={staggerItem}
                  className="glow-border card-hover glass group rounded-xl p-5"
                >
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xl text-[var(--color-cyan)] transition-colors group-hover:text-[var(--color-violet)]">
                    <c.icon />
                  </div>
                  <h3 className="font-display text-base font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {c.text}
                  </p>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-[var(--color-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--color-fg)]">{value}</dd>
    </div>
  );
}
