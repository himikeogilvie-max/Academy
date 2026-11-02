import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Page } from "../components/Page";
import { Globe } from "../components/Globe";
import { MemberModal } from "../components/MemberModal";
import { Icon } from "../components/icons";
import type { Call, Recording, Member } from "../data/content";

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => new Date(v).toISOString();

// ---- collapsible widget; whole header toggles; `preview` shown while closed ----
function Section({ title, count, defaultOpen = false, action, preview, children }: { title: string; count?: string; defaultOpen?: boolean; action?: React.ReactNode; preview?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="panel mb-4 overflow-hidden">
      <div onClick={() => setOpen((o) => !o)} className="flex cursor-pointer select-none items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`grid h-6 w-6 place-items-center rounded-md border border-fg/10 text-accent transition-transform ${open ? "rotate-90" : ""}`}>
            <Icon.arrow size={13} />
          </span>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-fg/80">{title}</h2>
          {count && <span className="font-mono text-[11px] text-fg/35">{count}</span>}
        </div>
        {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
      </div>
      {!open && preview && <div className="border-t border-fg/7 p-5">{preview}</div>}
      {open && <div className="border-t border-fg/7 p-5 animate-fade-up">{children}</div>}
    </div>
  );
}

// ---- collapsible link category ----
function LinkCategory({ cat, links }: { cat: string; links: ReturnType<typeof useStore>["links"] }) {
  const [open, setOpen] = useState(true);
  const items = links.filter((l) => l.category === cat);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 py-1.5">
        <Icon.arrow size={11} className={`text-accent transition-transform ${open ? "rotate-90" : ""}`} />
        <span className="tag">{cat}</span>
        <span className="ml-auto font-mono text-[10px] text-fg/25">{items.length}</span>
      </button>
      {open && (
        <div className="mb-1 space-y-0.5 pl-1">
          {items.map((l) => (
            <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-fg/[0.04]">
              <span className="truncate text-sm text-fg/75 group-hover:text-accent">{l.name}</span>
              {l.download ? <Icon.download size={13} className="ml-auto text-fg/30 group-hover:text-accent" /> : <Icon.external size={12} className="ml-auto text-fg/25 group-hover:text-accent" />}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Coaching() {
  const { calls, recordings, members, links, theme, editing, profile, addCall, updateCall, deleteCall, addRecording, updateRecording, deleteRecording } = useStore();
  const [selected, setSelected] = useState<Member | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sorted = [...calls]
    .filter((c) => +new Date(c.date) >= +startOfToday)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const nextCall = sorted[0];
  const cats = Array.from(new Set(links.map((l) => l.category)));

  // Admins (founder/coach) see every member's meetings; members see group calls + their own 1:1s.
  const isAdmin = /founder|coach|admin/i.test(profile.role);
  const calendarCalls = isAdmin ? sorted : sorted.filter((c) => c.type === "group" || c.owner === "me");

  return (
    <Page title="Meetings">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_13fr]">
        {/* ============ LEFT: Link library (narrower, dropdowns, scroll) ============ */}
        <aside>
          <div className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg/60"><Icon.link size={14} className="text-accent" /> Link Library</h2>
              <Link to="/links" className="font-mono text-[10px] text-accent/70 hover:text-accent">all →</Link>
            </div>
            <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
              {cats.map((cat) => (
                <LinkCategory key={cat} cat={cat} links={links} />
              ))}
            </div>
          </div>
        </aside>

        {/* ============ RIGHT ============ */}
        <div className="min-w-0">
          {/* live calls — collapsed by default, shows next call as preview */}
          <Section
            title="Live Calls"
            count={`${sorted.length} upcoming`}
            preview={nextCall ? <CallRow call={nextCall} /> : <div className="font-mono text-sm text-fg/40">No calls scheduled.</div>}
            action={
              <div className="flex items-center gap-2">
                {editing && (
                  <button onClick={() => addCall()} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent hover:bg-accent/20">
                    + Add call
                  </button>
                )}
                <button
                  onClick={() => setCalendarOpen(true)}
                  title="Open meetings calendar"
                  className="grid h-8 w-8 place-items-center rounded-md border border-fg/10 text-fg/55 transition hover:border-accent/40 hover:text-accent"
                >
                  <Icon.calendar size={16} />
                </button>
              </div>
            }
          >
            {/* next call at the top */}
            {nextCall && !editing && (
              <div className="mb-3">
                <div className="tag mb-2">Next call</div>
                <CallRow call={nextCall} />
              </div>
            )}
            <div className="space-y-3">
              {editing
                ? sorted.map((c) => <CallEdit key={c.id} call={c} onChange={(p) => updateCall(c.id, p)} onDelete={() => deleteCall(c.id)} />)
                : sorted.slice(1).map((c) => <CallRow key={c.id} call={c} />)}
            </div>
          </Section>

          {/* global cohort — open, moved up under calls */}
          <Section title="Global Cohort" count={`${members.length} members`} defaultOpen>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="col-span-1 flex items-center justify-center lg:col-span-5">
                <Globe members={members} size={300} theme={theme} onSelectMember={setSelected} />
              </div>
              <div className="col-span-1 lg:col-span-7">
                <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
                  {members.map((m) => (
                    <button key={m.id} onClick={() => setSelected(m)} className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition hover:bg-fg/[0.03]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-fg">{m.name}</div>
                        <div className="truncate font-mono text-[11px] text-fg/40">{m.role}</div>
                      </div>
                      <div className="font-mono text-[11px] text-accent/70">{m.location}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* recordings — open, horizontal scroll, no count/hint */}
          <Section
            title="Call Recordings"
            defaultOpen
            action={editing ? <button onClick={addRecording} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent hover:bg-accent/20">+ Add recording</button> : undefined}
          >
            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
              {recordings.map((r) => (
                <RecordingCard key={r.id} rec={r} editing={editing} onChange={(p) => updateRecording(r.id, p)} onDelete={() => deleteRecording(r.id)} />
              ))}
              {recordings.length === 0 && <div className="font-mono text-sm text-fg/40">No recordings yet.</div>}
            </div>
          </Section>
        </div>
      </div>

      <MemberModal member={selected} onClose={() => setSelected(null)} />
      {calendarOpen && <CalendarModal calls={calendarCalls} isAdmin={isAdmin} onClose={() => setCalendarOpen(false)} />}
    </Page>
  );
}

/** Month-view calendar of all future meetings. Admins see every member's 1:1s. */
function CalendarModal({ calls, isAdmin, onClose }: { calls: Call[]; isAdmin: boolean; onClose: () => void }) {
  const [monthStart, setMonthStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const callsOn = (day: number) =>
    calls.filter((c) => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  const monthCalls = calls
    .filter((c) => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="hud w-[420px] max-w-full rounded-2xl border border-fg/15 p-6 shadow-2xl" style={{ background: "rgb(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg/70">
            <Icon.calendar size={15} className="text-accent" /> Meetings {isAdmin && <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] text-accent">admin · all members</span>}
          </h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setMonthStart(new Date(year, month - 1, 1))} className="grid h-7 w-7 place-items-center rounded-md border border-fg/10 text-fg/55 hover:border-accent/40 hover:text-accent">
              <Icon.arrow size={13} className="rotate-180" />
            </button>
            <span className="w-28 text-center font-mono text-[12px] text-fg">{monthStart.toLocaleString("en-GB", { month: "long", year: "numeric" })}</span>
            <button onClick={() => setMonthStart(new Date(year, month + 1, 1))} className="grid h-7 w-7 place-items-center rounded-md border border-fg/10 text-fg/55 hover:border-accent/40 hover:text-accent">
              <Icon.arrow size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T2", "F", "S2"].map((d) => (
            <div key={d} className="pb-1 font-mono text-[9px] uppercase text-fg/35">{d.replace("2", "")}</div>
          ))}
          {cells.map((day, i) => {
            const dayCalls = day ? callsOn(day) : [];
            const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();
            return (
              <div key={i} className={`flex h-10 flex-col items-center justify-center rounded-md text-[12px] ${day ? "text-fg/75" : ""} ${isToday ? "border border-accent/50 bg-accent/10" : dayCalls.length ? "bg-fg/[0.04]" : ""}`}>
                {day}
                {dayCalls.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {dayCalls.slice(0, 3).map((c) => (
                      <span key={c.id} className={`h-1.5 w-1.5 rounded-full ${c.type === "group" ? "bg-accent" : "bg-signal"}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 max-h-40 space-y-1.5 overflow-y-auto border-t border-fg/10 pt-3">
          {monthCalls.length === 0 && <div className="font-mono text-[12px] text-fg/40">No meetings this month.</div>}
          {monthCalls.map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-[12px]">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.type === "group" ? "bg-accent" : "bg-signal"}`} />
              <span className="font-mono text-fg/45">{new Date(c.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
              <span className="truncate text-fg/80">{c.title}</span>
              {isAdmin && c.type === "1:1" && <span className="ml-auto shrink-0 font-mono text-[10px] text-signal/80">{c.owner === "me" ? "you" : c.owner ?? "member"}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

function CallRow({ call }: { call: Call }) {
  const { updateCall } = useStore();
  const [changing, setChanging] = useState(false);
  const d = new Date(call.date);
  const isGroup = call.type === "group";

  return (
    <div className="flex items-center gap-5 rounded-lg border border-fg/7 bg-fg/[0.015] p-4">
      <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg border text-center ${isGroup ? "border-accent/30 bg-accent/15" : "border-signal/30 bg-signal/15"}`}>
        <div className={`font-mono text-[10px] uppercase ${isGroup ? "text-accent/80" : "text-signal/90"}`}>{d.toLocaleString("en-GB", { month: "short" })}</div>
        <div className="font-mono text-2xl leading-none text-fg">{d.getDate()}</div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${isGroup ? "bg-accent/15 text-accent" : "bg-signal/15 text-signal"}`}>{isGroup ? "GROUP" : "1:1"}</span>
          <span className="tag">host {call.host}</span>
        </div>
        <div className="mt-1 truncate text-base text-fg">{call.title}</div>
        <div className="font-mono text-[11px] text-fg/40">{d.toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · CET</div>
        {changing && (
          <input
            type="datetime-local"
            defaultValue={toLocalInput(call.date)}
            onChange={(e) => {
              updateCall(call.id, { date: fromLocalInput(e.target.value) });
              setChanging(false);
            }}
            className="mt-2 rounded border border-signal/30 bg-fg/[0.05] px-2 py-1.5 font-mono text-[12px] text-fg outline-none"
          />
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {call.added ? (
          <a href={call.joinUrl || "#"} target="_blank" rel="noreferrer" onClick={(e) => { if (!call.joinUrl) e.preventDefault(); }} className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-4 py-2 text-xs text-accent transition hover:bg-accent/25">
            <Icon.play size={14} /> Join call
          </a>
        ) : (
          <button onClick={() => updateCall(call.id, { added: true })} className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-xs text-accent transition hover:bg-accent/15">
            Add to calendar <Icon.arrow size={14} />
          </button>
        )}
        {call.type === "1:1" && (
          <button onClick={() => setChanging((v) => !v)} className="font-mono text-[11px] text-fg/45 transition hover:text-accent">Request date change</button>
        )}
      </div>
    </div>
  );
}

function CallEdit({ call, onChange, onDelete }: { call: Call; onChange: (p: Partial<Call>) => void; onDelete: () => void }) {
  return (
    <div className="rounded-lg border border-accent/20 bg-accent/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={call.type} onChange={(e) => onChange({ type: e.target.value as Call["type"] })} className="rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 font-mono text-[12px] text-fg outline-none">
          <option value="group">GROUP</option>
          <option value="1:1">1:1</option>
        </select>
        <input type="datetime-local" value={toLocalInput(call.date)} onChange={(e) => onChange({ date: fromLocalInput(e.target.value) })} className="rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 font-mono text-[12px] text-fg outline-none" />
        <button onClick={onDelete} className="ml-auto grid h-8 w-8 place-items-center rounded-md border border-signal/30 font-mono text-signal hover:bg-signal/10">×</button>
      </div>
      <input value={call.title} onChange={(e) => onChange({ title: e.target.value })} className="mt-2 w-full rounded border border-fg/15 bg-fg/[0.05] px-3 py-2 text-sm text-fg outline-none focus:border-accent/50" placeholder="Call title" />
      <input value={call.joinUrl ?? ""} onChange={(e) => onChange({ joinUrl: e.target.value })} className="mt-2 w-full rounded border border-fg/15 bg-fg/[0.05] px-3 py-2 font-mono text-[12px] text-accent outline-none focus:border-accent/50" placeholder="join call link (Zoom / Meet URL)" />
    </div>
  );
}

function RecordingCard({ rec, editing, onChange, onDelete }: { rec: Recording; editing: boolean; onChange: (p: Partial<Recording>) => void; onDelete: () => void }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="w-[300px] shrink-0 overflow-hidden rounded-xl border border-fg/7 bg-fg/[0.015]">
      <div className="relative aspect-video w-full bg-black">
        {play && rec.videoUrl ? (
          <video src={rec.videoUrl} controls autoPlay className="h-full w-full" />
        ) : (
          <button onClick={() => rec.videoUrl && setPlay(true)} className="group relative h-full w-full">
            {rec.videoUrl ? (
              <video src={rec.videoUrl} muted preload="metadata" className="h-full w-full object-cover opacity-60" />
            ) : (
              <div className="grid h-full w-full place-items-center font-mono text-[11px] text-fg/30">no video set</div>
            )}
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-bg/60 text-accent backdrop-blur transition group-hover:scale-110 group-hover:bg-accent/15">
                <Icon.play size={22} />
              </div>
            </div>
            <div className="absolute left-2 top-2 rounded bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent backdrop-blur">{rec.tag}</div>
          </button>
        )}
      </div>
      <div className="p-3">
        {editing ? (
          <div className="space-y-1.5">
            <input value={rec.title} onChange={(e) => onChange({ title: e.target.value })} className="w-full rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 text-[13px] text-fg outline-none" placeholder="Title" />
            <input value={rec.date} onChange={(e) => onChange({ date: e.target.value })} className="w-full rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 font-mono text-[11px] text-fg outline-none" placeholder="YYYY-MM-DD" />
            <input value={rec.videoUrl} onChange={(e) => onChange({ videoUrl: e.target.value })} className="w-full rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 font-mono text-[11px] text-accent outline-none" placeholder="video url" />
            <div className="flex gap-1.5">
              <input value={rec.tag} onChange={(e) => onChange({ tag: e.target.value })} className="w-1/2 rounded border border-fg/15 bg-fg/[0.05] px-2 py-1.5 font-mono text-[11px] text-fg outline-none" placeholder="tag" />
              <button onClick={onDelete} className="w-1/2 rounded border border-signal/30 px-2 py-1.5 font-mono text-[11px] text-signal hover:bg-signal/10">delete</button>
            </div>
          </div>
        ) : (
          <>
            <div className="truncate text-sm text-fg">{rec.title}</div>
            <div className="mt-0.5 font-mono text-[11px] text-fg/40">{new Date(rec.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</div>
          </>
        )}
      </div>
    </div>
  );
}
