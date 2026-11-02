/** SVG progress ring / pie. Used for video, module and course completion. */
export function ProgressRing({
  value,
  size = 56,
  stroke = 4,
  label,
  showPct = true,
  className = "",
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  showPct?: boolean;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} style={{ stroke: "rgb(var(--fg) / 0.12)" }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            stroke: "rgb(var(--accent))",
            transition: "stroke-dashoffset 0.6s cubic-bezier(.2,.7,.2,1)",
            filter: "drop-shadow(0 0 4px rgb(var(--accent) / 0.55))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {showPct && (
          <span className="font-mono font-medium" style={{ fontSize: size * 0.24 }}>
            {Math.round(value)}
            <span className="opacity-50" style={{ fontSize: size * 0.16 }}>
              %
            </span>
          </span>
        )}
        {label && <span className="tag mt-0.5" style={{ fontSize: size * 0.1 }}>{label}</span>}
      </div>
    </div>
  );
}

/** Thin horizontal progress bar with mono percentage. */
export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${value}%`, transition: "width .6s cubic-bezier(.2,.7,.2,1)", boxShadow: "0 0 8px rgb(var(--accent) / 0.5)" }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-fg/55">{Math.round(value)}%</span>
    </div>
  );
}
