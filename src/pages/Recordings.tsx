import { useState } from "react";
import { useStore } from "../store/useStore";
import { Page } from "../components/Page";
import { Icon } from "../components/icons";
import { FlickerNumber } from "../components/Scramble";

export function Recordings() {
  const { recordings } = useStore();
  const [active, setActive] = useState<string | null>(null);

  return (
    <Page kicker="Archive" title="Call Recordings" subtitle="Every past group call and guest session, replayable on demand.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recordings.map((r) => (
          <div key={r.id} className="panel panel-hover group overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {active === r.id ? (
                <video src={r.videoUrl} controls autoPlay className="h-full w-full" />
              ) : (
                <button onClick={() => setActive(r.id)} className="relative h-full w-full">
                  <video src={r.videoUrl} muted preload="metadata" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 to-transparent">
                    <div className="grid h-14 w-14 place-items-center rounded-full border border-accent/40 bg-bg/60 text-accent backdrop-blur transition group-hover:scale-110 group-hover:bg-accent/15">
                      <Icon.play size={26} />
                    </div>
                  </div>
                  <div className="absolute left-3 top-3 rounded bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent backdrop-blur">{r.tag}</div>
                  <div className="absolute bottom-3 right-3 rounded bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-fg/70 backdrop-blur">{r.duration}</div>
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="text-sm text-fg">{r.title}</div>
              <div className="mt-1 font-mono text-[11px] text-fg/40">
                {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} · REC <FlickerNumber digits={4} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
