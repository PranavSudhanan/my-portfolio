import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { profile } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10">
      <div className="shell flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-violet)] to-[var(--color-cyan)] font-mono text-xs text-black">
            PS
          </span>
          <p className="text-sm text-[var(--color-muted)]">
            © {year} {profile.name}. Built with Next.js & Tailwind.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FooterLink href={profile.linkedin} label="LinkedIn">
            <FaLinkedinIn />
          </FooterLink>
          <FooterLink href={profile.github} label="GitHub">
            <FaGithub />
          </FooterLink>
          <FooterLink href={`mailto:${profile.email}`} label="Email">
            <FiMail />
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
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
      className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[var(--color-muted)] transition-colors hover:border-white/20 hover:text-[var(--color-fg)]"
    >
      {children}
    </a>
  );
}
