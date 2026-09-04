"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";
import { navLinks, profile } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-[var(--color-violet)] via-[var(--color-cyan)] to-[var(--color-emerald)]"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <nav
          className={`container-px mx-auto flex max-w-6xl items-center justify-between rounded-2xl transition-all duration-300 ${
            scrolled
              ? "glass mx-4 px-4 py-2.5 shadow-lg shadow-black/30 sm:mx-auto"
              : "px-2"
          }`}
        >
          <a
            href="#top"
            className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-violet)] to-[var(--color-cyan)] font-mono text-sm text-black shadow-[var(--shadow-glow)]">
              PS
            </span>
            <span className="hidden sm:block">
              Pranav<span className="text-[var(--color-cyan)]">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative rounded-lg px-3.5 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-[var(--color-fg)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download
              className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-violet)]/50 hover:bg-white/[0.06] sm:flex"
            >
              <FiDownload className="text-[var(--color-cyan)]" />
              Resume
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-lg md:hidden"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute inset-x-4 top-24 rounded-2xl p-3"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[var(--color-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={profile.resume}
                    download
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)] px-4 py-3 font-medium text-black"
                  >
                    <FiDownload />
                    Download Resume
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
