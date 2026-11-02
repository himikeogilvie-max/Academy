import { useEffect, useMemo, useRef } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * GitHub-style contribution graph. Horizontally scrollable across `months`,
 * with month labels along the bottom. Active days light up in accent tiers.
 */
export function Heatmap({ activity, months = 9, compact = false }: { activity: string[]; months?: number; compact?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cell = compact ? 11 : 14;
  const gap = compact ? 3 : 4;

  const { weeks, total, labels } = useMemo(() => {
    const set = new Set(activity);
    const today = new Date();
    const start = new Date(today);
    start.setMonth(today.getMonth() - months);
    start.setDate(start.getDate() - start.getDay()); // back to Sunday

    const days: { date: string; level: number }[] = [];
    const cursor = new Date(start);
    let total = 0;
    while (cursor <= today) {
      const key = cursor.toISOString().slice(0, 10);
      const active = set.has(key);
      if (active) total++;
      const seed = active ? ((cursor.getDate() * 7 + cursor.getMonth()) % 3) + 2 : 0;
      days.push({ date: key, level: active ? seed : 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    const weeks: { date: string; level: number }[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    // a month label on the first week that enters a new month
    const labels: string[] = [];
    let lastMonth = -1;
    for (const w of weeks) {
      const mth = new Date(w[0].date).getMonth();
      if (mth !== lastMonth) {
        labels.push(MONTHS[mth]);
        lastMonth = mth;
      } else labels.push("");
    }
    return { weeks, total, labels };
  }, [activity, months]);

  // start scrolled to the most recent
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [weeks.length]);

  const colors = ["rgb(var(--fg) / 0.07)", "rgb(var(--accent) / 0.28)", "rgb(var(--accent) / 0.45)", "rgb(var(--accent) / 0.68)", "rgb(var(--accent) / 0.95)"];

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div className="font-mono text-2xl text-fg">
          {total} <span className="text-sm text-fg/40">active days</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-fg/40">
          <span>less</span>
          {colors.map((c, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
        <div className="inline-flex flex-col" style={{ gap }}>
          <div className="flex" style={{ gap }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap }}>
                {week.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date}${d.level ? " · active" : ""}`}
                    className="rounded-[3px] transition-colors hover:outline hover:outline-1 hover:outline-accent/60"
                    style={{ width: cell, height: cell, background: colors[d.level], boxShadow: d.level >= 3 ? "0 0 6px rgb(var(--accent) / 0.35)" : undefined }}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* month legend */}
          <div className="flex" style={{ gap }}>
            {labels.map((l, i) => (
              <div key={i} className="whitespace-nowrap font-mono text-[9px] text-fg/40" style={{ width: cell }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
