import { useStore } from "../store/useStore";
import { Page } from "../components/Page";
import { Globe } from "../components/Globe";
import { FlickerNumber, Scramble } from "../components/Scramble";

export function Members() {
  const { members } = useStore();
  const countries = new Set(members.map((m) => m.location.split(", ")[1])).size;

  return (
    <Page kicker="Network" title="Global Cohort" subtitle="Every member is a node. Drag the globe to orbit the network.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* globe */}
        <div className="panel hud col-span-1 flex flex-col items-center justify-center overflow-hidden p-6 lg:col-span-7">
          <Globe members={members} size={460} />
          <div className="mt-4 grid w-full grid-cols-3 gap-3 border-t border-fg/7 pt-4">
            <Metric label="Members" value={`${members.length}`} />
            <Metric label="Countries" value={`${countries}`} />
            <Metric label="Uplink" value="LIVE" />
          </div>
        </div>

        {/* list */}
        <div className="col-span-1 lg:col-span-5">
          <div className="panel max-h-[560px] overflow-y-auto p-2">
            {members.map((m) => (
              <div key={m.id} className="group flex items-center gap-3 rounded-lg p-3 transition hover:bg-fg/[0.03]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fg/12 bg-fg/[0.03] font-mono text-[11px] text-accent">
                  {m.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-fg">{m.name}</div>
                  <div className="truncate font-mono text-[11px] text-fg/40">{m.role}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] text-accent/70">{m.location}</div>
                  <div className="font-mono text-[9px] text-fg/25">
                    {m.lat.toFixed(2)}, {m.lng.toFixed(2)}
                  </div>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-accent/50 group-hover:animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="tag">{label}</div>
      <div className="mt-1 font-mono text-xl text-fg">
        <Scramble value={value} />
      </div>
    </div>
  );
}
