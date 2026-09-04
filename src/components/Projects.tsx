"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, staggerItem } from "./Reveal";
import { projects, type Project } from "@/lib/data";

const accentVar: Record<Project["accent"], string> = {
  violet: "var(--color-violet)",
  cyan: "var(--color-cyan)",
  emerald: "var(--color-emerald)",
  amber: "var(--color-amber)",
};

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-pad">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          subtitle="What I've built"
          title="Featured projects"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} project={p} delay={i * 0.08} />
          ))}
        </div>

        <Reveal className="mb-8 mt-20">
          <h3 className="font-display text-2xl font-bold">More things I&apos;ve built</h3>
          <p className="mt-1 text-[var(--color-muted)]">
            A selection of other projects across BI, web and data.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <motion.div key={p.title} variants={staggerItem}>
              <MiniCard project={p} />
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function FeaturedCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 18,
  });
  const accent = accentVar[project.accent];

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="glow-border card-hover glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
      >
        {/* glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: accent }}
        />

        <div className="mb-4 flex items-center justify-between">
          <span
            className="rounded-full border px-3 py-1 font-mono text-xs"
            style={{
              color: accent,
              borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            }}
          >
            {project.tag}
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              <FiArrowUpRight />
            </a>
          )}
        </div>

        <h3 className="font-display text-xl font-bold leading-snug">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {project.description}
        </p>

        <ul className="mt-4 flex-1 space-y-2">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="flex gap-2 text-sm leading-relaxed text-[var(--color-fg)]/80"
            >
              <FiCheck className="mt-1 shrink-0" style={{ color: accent }} />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg)]/80"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.article>
    </motion.div>
  );
}

function MiniCard({ project }: { project: Project }) {
  const accent = accentVar[project.accent];
  const inner = (
    <article className="glow-border card-hover glass group flex h-full flex-col rounded-xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
        <span className="font-mono text-[11px] text-[var(--color-muted)]">
          {project.tag}
        </span>
      </div>
      <h4 className="flex items-center gap-1.5 font-display text-base font-semibold">
        {project.title}
        {project.link && (
          <FiArrowUpRight className="text-sm text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </h4>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-[var(--color-fg)]/70"
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
