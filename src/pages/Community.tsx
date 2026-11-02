import { useEffect, useRef, useState } from "react";
import { Page } from "../components/Page";
import { Icon } from "../components/icons";
import { TypeText } from "../components/TypeText";

type Msg = { id: number; who: string; role: string; text: string; me?: boolean; t: string };

const CHANNELS = ["# general", "# wins", "# look-dev", "# motion-models", "# feedback", "# off-topic"];

const SEED: Record<string, Msg[]> = {
  "# general": [
    { id: 1, who: "Aria Mensah", role: "VFX Lead · LA", text: "Just shipped my first fully AI-native title sequence for a client. They had no idea.", t: "09:14" },
    { id: 2, who: "Lukas Hoffmann", role: "Director · Berlin", text: "The continuity pass from module 04 completely changed my shot matching. Game changer.", t: "09:21" },
    { id: 3, who: "Yuki Tanaka", role: "Producer · Tokyo", text: "Anyone around for a render-economics question before the group call?", t: "09:40" },
  ],
  "# wins": [
    { id: 1, who: "James Okoro", role: "Studio · Atlanta", text: "Closed a €40k spot using the delivery package template 🔥", t: "Yesterday" },
  ],
};

export function Community() {
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [store, setStore] = useState<Record<string, Msg[]>>(SEED);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = store[channel] ?? [];
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, channel]);

  const send = () => {
    if (!draft.trim()) return;
    const msg: Msg = { id: Date.now(), who: "Mike Ogilvie", role: "You · Amsterdam", text: draft.trim(), me: true, t: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) };
    setStore((s) => ({ ...s, [channel]: [...(s[channel] ?? []), msg] }));
    setDraft("");
  };

  return (
    <Page kicker="Community" title="Open Chat" subtitle="Talk to the cohort in real time. Channels keep the signal high.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* channels */}
        <div className="panel col-span-1 h-fit p-3 lg:col-span-3">
          <div className="tag px-2 pb-2">Channels</div>
          {CHANNELS.map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-sm transition ${
                channel === c ? "bg-accent/10 text-accent" : "text-fg/55 hover:bg-fg/[0.04] hover:text-fg"
              }`}
            >
              {c}
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
            </button>
          ))}

          <div className="mt-3 rounded-lg border border-signal/25 bg-signal/[0.06] p-3">
            <div className="tag text-signal/80">Also available</div>
            <p className="mt-1 text-[12px] leading-relaxed text-fg/55">Mirror this chat to a WhatsApp group for mobile push.</p>
            <a href="#" onClick={(e) => e.preventDefault()} className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-signal hover:underline">
              open whatsapp group <Icon.arrow size={12} />
            </a>
          </div>
        </div>

        {/* thread */}
        <div className="panel hud col-span-1 flex h-[560px] flex-col lg:col-span-9">
          <div className="flex items-center justify-between border-b border-fg/7 px-5 py-3">
            <TypeText as="div" text={channel} className="font-mono text-sm text-fg" speed={18} />
            <div className="flex items-center gap-2 font-mono text-[11px] text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> 12 online
            </div>
          </div>

          <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {msgs.length === 0 && <div className="grid h-full place-items-center font-mono text-sm text-fg/30">No messages yet — start the thread.</div>}
            {msgs.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.me ? "flex-row-reverse" : ""}`}>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-fg/12 bg-fg/[0.03] font-mono text-[11px] text-accent">
                  {m.who.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div className={`max-w-[70%] ${m.me ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-fg/35" style={{ flexDirection: m.me ? "row-reverse" : "row" }}>
                    <span className="text-fg/60">{m.who}</span>
                    <span>· {m.role} · {m.t}</span>
                  </div>
                  <div className={`mt-1 inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.me ? "bg-accent/15 text-fg" : "bg-fg/[0.04] text-fg/80"}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-fg/7 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${channel}`}
              className="flex-1 rounded-full border border-fg/10 bg-fg/[0.05] px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg/25 focus:border-accent/50"
            />
            <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent transition hover:bg-accent/20">
              <Icon.send size={18} />
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}
