import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Page, SectionTitle } from "../components/Page";
import { ProgressRing, ProgressBar } from "../components/ProgressRing";
import { Heatmap } from "../components/Heatmap";
import { Globe } from "../components/Globe";
import { MemberModal } from "../components/MemberModal";
import { Icon } from "../components/icons";
import { Scramble } from "../components/Scramble";
import type { Member } from "../data/content";

export function Dashboard() {
  const { modules, courseStat, moduleStat, lessonStat, activity, members, calls, profile, theme } = useStore();
  const course = courseStat();
  const [selected, setSelected] = useState<Member | null>(null);

  let next: { mId: string; lId: string; title: string; mod: string } | null = null;
  for (const m of modules) {
    for (const l of m.lessons) {
      if (!lessonStat(l.id).complete) {
        next = { mId: m.id, lId: l.id, title: l.title, mod: m.title };
        break;
      }
    }
    if (next) break;
  }

  // next call = earliest call from the start of today onward (past calls drop off)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const nextCall = [...calls]
    .filter((c) => +new Date(c.date) >= +startOfToday)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];
  const nextCallIsToday = nextCall && new Date(nextCall.date).toDateString() === new Date().toDateString();

  return (
    <Page title={`Welcome back, ${profile.name.split(" ")[0]}`}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="panel hud relative col-span-1 flex items-center gap-5 overflow-hidden p-5 lg:col-span-4">
          <ProgressRing value={course.pct} size={92} stroke={5} label="course" />
          <div>
            <div className="tag">Total completion</div>
            <div className="font-mono text-3xl text-fg">
              <Scramble value={`${course.pct}%`} />
            </div>
            <div className="mt-1 font-mono text-[11px] text-fg/40">{course.done}/{course.total} units cleared</div>
          </div>
        </div>

        <Link to={next ? `/classroom/${next.mId}/${next.lId}` : "/classroom"} className="panel panel-hover group col-span-1 flex items-center justify-between p-5 lg:col-span-5">
          <div className="min-w-0">
            <div className="tag flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Continue lesson
            </div>
            <div className="mt-2 truncate text-lg text-fg">{next ? next.title : "All lessons complete — nice."}</div>
            <div className="truncate font-mono text-[11px] text-fg/40">{next ? next.mod : "Course 100%"}</div>
          </div>
          <div className="ml-4 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/5 text-accent transition group-hover:bg-accent/15">
            <Icon.arrow size={18} />
          </div>
        </Link>

        <div className="panel panel-hover col-span-1 flex flex-col justify-between p-5 lg:col-span-3">
          <Link to="/coaching" className="block">
            <div className="tag flex items-center gap-2">
              <Icon.calendar size={13} className="text-accent" /> Next live call
            </div>
            <div className="mt-2 text-sm text-fg">{nextCall?.title}</div>
            <div className="mt-1 font-mono text-[11px] text-accent/80">
              {nextCall && new Date(nextCall.date).toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
          </Link>
          {nextCallIsToday && (
            <a
              href={nextCall.joinUrl || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => { if (!nextCall.joinUrl) e.preventDefault(); }}
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-4 py-2 text-xs text-accent transition hover:bg-accent/25"
            >
              <Icon.play size={14} /> Join now
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="panel col-span-1 flex flex-col justify-between p-5 lg:col-span-7">
          <Heatmap activity={activity} />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-fg/7 pt-4">
            <Stat label="Modules" value={`${modules.length}`} />
            <Stat label="Lessons done" value={`${modules.reduce((a, m) => a + moduleStat(m.id).lessonsComplete, 0)}/${modules.reduce((a, m) => a + m.lessons.length, 0)}`} />
            <Stat label="Members" value={`${members.length}`} />
          </div>
        </div>

        <div className="panel hud col-span-1 flex flex-col items-center justify-center overflow-hidden p-5 lg:col-span-5">
          <div className="mb-1 flex w-full items-center justify-between">
            <SectionTitle>Global Cohort</SectionTitle>
            <Link to="/coaching" className="font-mono text-[11px] text-accent/70 hover:text-accent">expand →</Link>
          </div>
          <Globe members={members} size={260} theme={theme} onSelectMember={setSelected} />
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle right={<Link to="/classroom" className="font-mono text-[11px] text-accent/70 hover:text-accent">open classroom →</Link>}>Module Progress</SectionTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => {
            const st = moduleStat(m.id);
            return (
              <Link key={m.id} to={`/classroom/${m.id}`} className="panel panel-hover group p-4">
                <div className="flex items-start justify-between">
                  <div className="font-mono text-[11px] text-accent/60">MODULE {m.index}</div>
                  <ProgressRing value={st.pct} size={34} stroke={3} showPct={false} />
                </div>
                <div className="mt-2 text-sm text-fg group-hover:text-accent">{m.title}</div>
                <div className="mt-3">
                  <ProgressBar value={st.pct} />
                  <div className="mt-1.5 font-mono text-[10px] text-fg/35">{st.lessonsComplete}/{st.lessonsTotal} lessons</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <MemberModal member={selected} onClose={() => setSelected(null)} />
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="tag">{label}</div>
      <div className="mt-1 font-mono text-xl text-fg">
        <Scramble value={value} />
      </div>
    </div>
  );
}
