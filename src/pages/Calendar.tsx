import { useStore } from "../store/useStore";
import { Page, SectionTitle } from "../components/Page";
import { Icon } from "../components/icons";
import { FlickerNumber } from "../components/Scramble";

export function Calendar() {
  const { calls } = useStore();
  const sorted = [...calls].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <Page kicker="Schedule" title="Live Calls" subtitle="One group coaching call every week · one 1:1 review every 14 days.">
      {/* cadence cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="panel hud flex items-center gap-4 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-accent/30 bg-accent/5 text-accent">
            <Icon.chat size={22} />
          </div>
          <div>
            <div className="tag">Cadence</div>
            <div className="text-lg text-fg">Group Coaching</div>
            <div className="font-mono text-[11px] text-accent/70">Weekly · 90 min · live Q&A</div>
          </div>
        </div>
        <div className="panel hud flex items-center gap-4 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-accent/30 bg-accent/5 text-accent">
            <Icon.user size={22} />
          </div>
          <div>
            <div className="tag">Cadence</div>
            <div className="text-lg text-fg">1:1 Work Review</div>
            <div className="font-mono text-[11px] text-accent/70">Every 14 days · 45 min · private</div>
          </div>
        </div>
      </div>

      <SectionTitle>Upcoming</SectionTitle>
      <div className="space-y-3">
        {sorted.map((c) => {
          const d = new Date(c.date);
          return (
            <div key={c.id} className="panel panel-hover group flex items-center gap-5 p-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-fg/8 bg-fg/[0.02] text-center">
                <div className="font-mono text-[10px] uppercase text-accent/60">{d.toLocaleString("en-GB", { month: "short" })}</div>
                <div className="font-mono text-2xl leading-none text-fg">{d.getDate()}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${c.type === "group" ? "bg-accent/15 text-accent" : "bg-signal/15 text-signal"}`}>
                    {c.type === "group" ? "GROUP" : "1:1"}
                  </span>
                  <span className="tag">{c.duration} · host {c.host}</span>
                </div>
                <div className="mt-1 truncate text-base text-fg">{c.title}</div>
                <div className="font-mono text-[11px] text-fg/40">
                  {d.toLocaleString("en-GB", { weekday: "long", hour: "2-digit", minute: "2-digit" })} · CET · ROOM <FlickerNumber digits={4} />
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-xs text-accent transition hover:bg-accent/15">
                Add to calendar <Icon.arrow size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
