"use client";

import { FiMail, FiPhone, FiMapPin, FiArrowUpRight, FiDownload } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa6";
import { Reveal } from "./Reveal";
import { profile } from "@/lib/data";

const channels = [
  {
    icon: FiMail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: FiPhone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    value: "pranav-s-l",
    href: profile.linkedin,
  },
  {
    icon: FiMapPin,
    label: "Location",
    value: "Bangalore, India",
    href: undefined,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-pad">
      <div className="container-px mx-auto max-w-5xl">
        <Reveal>
          <div className="glow-border glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(500px circle at 50% -10%, rgba(139,124,255,0.22), transparent 60%)",
              }}
            />

            <p className="mb-3 font-mono text-sm text-[var(--color-cyan)]">
              05 — What&apos;s next
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s build something{" "}
              <span className="gradient-text">great together</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">
              I&apos;m open to full-time roles and interesting freelance work.
              Whether you have a project in mind or just want to connect, my inbox
              is always open.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)] px-6 py-3.5 font-medium text-black shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              >
                <FiMail />
                Say hello
                <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-6 py-3.5 font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-cyan)]/50 hover:bg-white/[0.06]"
              >
                <FiDownload className="text-[var(--color-cyan)]" />
                Download résumé
              </a>
            </div>

            <div className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
              {channels.map((c) => {
                const content = (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[var(--color-cyan)]">
                      <c.icon />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-muted)]">{c.label}</p>
                      <p className="truncate text-sm font-medium text-[var(--color-fg)]">
                        {c.value}
                      </p>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={c.label}>{content}</div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
