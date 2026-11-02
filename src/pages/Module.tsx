import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Page } from "../components/Page";
import { ProgressRing } from "../components/ProgressRing";
import { Icon } from "../components/icons";

export function ModulePage() {
  const { moduleId } = useParams();
  const { modules, moduleStat, lessonStat, addLesson, deleteLesson, editing } = useStore();
  const nav = useNavigate();
  const m = modules.find((x) => x.id === moduleId);
  if (!m) return <Page kicker="404" title="Module not found">{null}</Page>;
  const st = moduleStat(m.id);

  return (
    <Page
      kicker={`Module ${m.index}`}
      title={m.title}
      subtitle={m.summary}
      right={<ProgressRing value={st.pct} size={56} stroke={4} label="module" />}
    >
      <Link to="/classroom" className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] text-fg/40 hover:text-accent">
        <Icon.arrow size={14} className="rotate-180" /> All modules
      </Link>

      <div className="space-y-3">
        {m.lessons.map((l, i) => {
          const ls = lessonStat(l.id);
          return (
            <div key={l.id} className="panel panel-hover group flex items-center gap-5 p-4">
              <Link to={`/classroom/${m.id}/${l.id}`} className="flex min-w-0 flex-1 items-center gap-5">
                <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-fg/8 bg-fg/[0.02] font-mono text-sm text-fg/50">
                  {ls.complete ? (
                    <span className="grid h-full w-full place-items-center rounded-lg bg-accent/15 text-accent">
                      <Icon.check size={20} />
                    </span>
                  ) : (
                    <Icon.play size={20} className="text-fg/40 group-hover:text-accent" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="tag">{l.duration}</span>
                    {ls.complete && <span className="tag text-accent/70">· complete</span>}
                  </div>
                  <div className="mt-1 truncate text-base text-fg group-hover:text-accent">{l.title}</div>
                </div>

                <ProgressRing value={ls.pct} size={42} stroke={3} showPct={false} />
              </Link>

              {editing ? (
                <button
                  onClick={() => deleteLesson(m.id, l.id)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-signal/30 font-mono text-signal transition hover:bg-signal/10"
                  title="Delete lesson"
                >
                  ×
                </button>
              ) : (
                <Icon.arrow size={18} className="text-fg/20 transition group-hover:translate-x-1 group-hover:text-accent" />
              )}
            </div>
          );
        })}

        {m.lessons.length === 0 && !editing && <div className="panel p-8 text-center font-mono text-sm text-fg/40">No lessons yet.</div>}

        {editing && (
          <button
            onClick={() => {
              const id = addLesson(m.id);
              nav(`/classroom/${m.id}/${id}`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 py-3 font-mono text-[12px] uppercase tracking-wider text-accent transition hover:bg-accent/10"
          >
            + Add lesson / video
          </button>
        )}
      </div>
    </Page>
  );
}
