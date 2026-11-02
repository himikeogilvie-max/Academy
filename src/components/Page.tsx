import { TypeText } from "./TypeText";

/** Standard page wrapper with a self-typing header (retypes on navigation). */
export function Page({
  kicker: _kicker,
  title,
  subtitle,
  children,
  right,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1240px] px-6 py-7">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <TypeText as="h1" text={title} className="text-3xl font-medium tracking-tight text-fg md:text-[34px]" speed={22} />
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-fg/45">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="animate-fade-up">{children}</div>
    </div>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg/45">
        <span className="h-1.5 w-1.5 rounded-[2px] bg-accent" />
        {children}
      </h2>
      {right}
    </div>
  );
}
