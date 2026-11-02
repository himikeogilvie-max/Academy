import { useState } from "react";
import { Page, SectionTitle } from "../components/Page";
import { Icon } from "../components/icons";
import { WHATSAPP_URL } from "../data/content";

const FAQ = [
  { q: "How do I book my 1:1 review?", a: "Open Coaching → Schedule your next 1:1, every 14 days. Pick a time and upload your work-in-progress beforehand." },
  { q: "Can I rewatch group calls?", a: "Yes — every call is posted to Recordings within 24 hours, fully replayable." },
  { q: "How is my progress tracked?", a: "Videos auto-complete when watched to the end. Each step is a manual check. Module + course % update instantly." },
  { q: "What if a tool link is broken?", a: "Flag it here and we'll update the Link Library — owners can also edit links directly in Edit mode." },
];

export function Support() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("Technical");

  return (
    <Page title="Support">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* form */}
        <div className="col-span-1 lg:col-span-7">
          <div className="panel hud p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-accent/40 bg-accent/15 text-accent">
                  <Icon.check size={28} />
                </div>
                <div className="mt-4 font-mono text-lg text-fg">Transmission received.</div>
                <div className="mt-1 text-sm text-fg/45">Ticket #{Math.floor(Math.random() * 90000 + 10000)} · we'll be in touch.</div>
                <button onClick={() => setSent(false)} className="mt-5 rounded-full border border-fg/15 px-4 py-2 text-xs text-fg/60 hover:border-accent/40 hover:text-accent">
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="tag mb-2">Topic</div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {["Technical", "Billing", "Coaching", "Content", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${
                        topic === t ? "border-accent/60 bg-accent/15 text-accent" : "border-fg/10 text-fg/50 hover:border-fg/25"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="tag mb-2">Subject</div>
                <input required className="mb-4 w-full rounded-lg border border-fg/10 bg-fg/[0.05] px-4 py-3 text-sm text-fg outline-none placeholder:text-fg/25 focus:border-accent/50" placeholder="Short summary..." />

                <div className="tag mb-2">Message</div>
                <textarea required rows={6} className="mb-5 w-full resize-none rounded-lg border border-fg/10 bg-fg/[0.05] px-4 py-3 text-sm text-fg outline-none placeholder:text-fg/25 focus:border-accent/50" placeholder="Describe what you need help with..." />

                <button type="submit" className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm text-accent transition hover:bg-accent/20">
                  Send to support <Icon.send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* contact + faq */}
        <div className="col-span-1 space-y-4 lg:col-span-5">
          <div className="panel p-5">
            <SectionTitle>Direct lines</SectionTitle>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group flex items-center gap-3 border-b border-fg/5 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-signal/30 bg-signal/5 text-signal">
                <Icon.chat size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="tag">Community</div>
                <div className="text-sm text-fg/80 transition group-hover:text-accent">Join the WhatsApp Community</div>
              </div>
              <Icon.arrow size={15} className="text-signal transition group-hover:translate-x-0.5" />
            </a>
            <Contact icon={<Icon.life size={18} />} label="Email" value="support@juice.ext" />
            <Contact icon={<Icon.clock size={18} />} label="Response time" value="< 24h business days" />
          </div>

          <div className="panel p-5">
            <SectionTitle>FAQ</SectionTitle>
            <div className="space-y-2">
              {FAQ.map((f, i) => (
                <Faq key={i} {...f} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Contact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-fg/5 py-3 last:border-0">
      <div className="grid h-9 w-9 place-items-center rounded-lg border border-fg/8 bg-fg/[0.02] text-accent">{icon}</div>
      <div>
        <div className="tag">{label}</div>
        <div className="text-sm text-fg/80">{value}</div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full rounded-lg border border-fg/7 bg-fg/[0.015] p-3 text-left transition hover:border-fg/15">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-fg/80">{q}</span>
        <span className={`text-accent transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </div>
      {open && <p className="mt-2 text-[13px] leading-relaxed text-fg/45">{a}</p>}
    </button>
  );
}
