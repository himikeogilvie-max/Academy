import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Page } from "../components/Page";
import { ProgressRing, ProgressBar } from "../components/ProgressRing";
import { Editable } from "../components/Editable";
import { Icon } from "../components/icons";

export function Classroom() {
  const { modules, moduleStat, updateModule, addModule, deleteModule, courseStat, editing } = useStore();
  const course = courseStat();

  return (
    <Page
      title="The Curriculum"
      right={
        <div className="panel hidden items-center gap-3 px-4 py-2.5 sm:flex">
          <ProgressRing value={course.pct} size={40} stroke={3} showPct={false} />
          <div className="leading-tight">
            <div className="tag">Course</div>
            <div className="font-mono text-sm">{course.pct}%</div>
          </div>
        </div>
      }
    >
      {editing && (
        <button
          onClick={addModule}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 py-3 font-mono text-[12px] uppercase tracking-wider text-accent transition hover:bg-accent/10"
        >
          + Add new module
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {modules.map((m) => {
          const st = moduleStat(m.id);
          const inner = (
            <>
              {editing && (
                <button
                  onClick={() => deleteModule(m.id)}
                  className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-md border border-signal/30 font-mono text-signal transition hover:bg-signal/10"
                  title="Delete module"
                >
                  ×
                </button>
              )}

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/60">
                    Module {m.index}
                    <span className="text-fg/20">· {m.lessons.length} lessons</span>
                  </div>
                  <Editable as="h3" value={m.title} onChange={(v) => updateModule(m.id, { title: v })} className="text-xl font-medium text-fg" />
                  <Editable as="p" value={m.summary} onChange={(v) => updateModule(m.id, { summary: v })} className="mt-1.5 text-sm text-fg/45" multiline />
                </div>
                <ProgressRing value={st.pct} size={58} stroke={4} label="module" />
              </div>

              <div className="relative mt-5">
                <ProgressBar value={st.pct} />
              </div>

              <div className="relative mt-4 flex items-center justify-end">
                <span className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs text-accent">
                  {st.pct > 0 ? "Continue" : "Start"} <Icon.arrow size={14} />
                </span>
              </div>
            </>
          );
          return editing ? (
            <div key={m.id} className="panel panel-hover hud group relative overflow-hidden p-5">{inner}</div>
          ) : (
            <Link key={m.id} to={`/classroom/${m.id}`} className="panel panel-hover hud group relative block overflow-hidden p-5">
              {inner}
            </Link>
          );
        })}
      </div>
    </Page>
  );
}
