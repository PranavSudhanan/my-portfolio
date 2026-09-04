import { Reveal } from "./Reveal";

type Props = {
  index: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ index, title, subtitle }: Props) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm text-[var(--color-cyan)]">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-[var(--color-violet)] to-transparent" />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
          {subtitle}
        </span>
      </div>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
