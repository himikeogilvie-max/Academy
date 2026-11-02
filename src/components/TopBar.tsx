import { useStore } from "../store/useStore";
import { ProgressRing } from "./ProgressRing";
import { EditToggle } from "./Editable";
import { Icon } from "./icons";
import { Link } from "react-router-dom";

const THEME_ORDER = ["light", "warm", "sand", "olive", "sage", "mocha", "midnight", "dark"] as const;
const THEME_META: Record<(typeof THEME_ORDER)[number], { label: string; swatch: string }> = {
  light: { label: "Silver", swatch: "#e9e7e2" },
  warm: { label: "Warm", swatch: "#eae3d6" },
  sand: { label: "Sand", swatch: "#f0eade" },
  olive: { label: "Olive", swatch: "#a6b06a" },
  sage: { label: "Sage", swatch: "#c9d6c9" },
  mocha: { label: "Mocha", swatch: "#3a2e24" },
  midnight: { label: "Midnight", swatch: "#101a2e" },
  dark: { label: "Dark", swatch: "#0a0b0d" },
};

/** Cycles through the colour schemes on each click. */
function ThemeToggle() {
  const { theme, setTheme } = useStore();
  const current = THEME_META[theme as (typeof THEME_ORDER)[number]] ?? THEME_META.light;
  const next = THEME_ORDER[(THEME_ORDER.indexOf(theme as (typeof THEME_ORDER)[number]) + 1) % THEME_ORDER.length];
  return (
    <button
      onClick={() => setTheme(next)}
      title={`Switch to ${THEME_META[next].label}`}
      className="flex items-center gap-2 rounded-full border border-fg/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg/55 transition hover:border-fg/25 hover:text-fg"
    >
      <span className="h-3 w-3 rounded-full border border-fg/25" style={{ background: current.swatch }} />
      {current.label}
    </button>
  );
}

/** Round avatar wrapped by the course-completion ring, with a flame streak badge. */
function ProfileBadge() {
  const { courseStat, streak, profile } = useStore();
  const pct = courseStat().pct;
  const days = streak();
  return (
    <Link to="/profile" className="group relative block" title={`${pct}% complete · ${days} day streak`}>
      <div className="relative h-[52px] w-[52px]">
        <ProgressRing value={pct} size={52} stroke={3} showPct={false} />
        <div className="absolute inset-0 grid place-items-center">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="h-[38px] w-[38px] rounded-full object-cover" />
          ) : (
            <div className="grid h-[38px] w-[38px] place-items-center rounded-full border border-fg/12 bg-fg/[0.04] transition group-hover:border-accent/50">
              <Icon.user size={20} className="text-fg/70 group-hover:text-accent" />
            </div>
          )}
        </div>
        {/* flame streak badge */}
        <div className="absolute -right-1.5 -top-1.5 flex items-center gap-0.5 rounded-full border border-signal/40 bg-bg px-1.5 py-[2px] shadow-sm">
          <Icon.flame size={10} className="text-signal" />
          <span className="font-mono text-[9px] leading-none text-signal">{days}</span>
        </div>
      </div>
    </Link>
  );
}

export function TopBar() {
  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-end gap-4 border-b border-fg/7 bg-bg/50 px-6 backdrop-blur-xl">
      <ThemeToggle />
      <EditToggle />
      <ProfileBadge />
    </header>
  );
}

