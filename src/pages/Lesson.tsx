import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import { ProgressRing } from "../components/ProgressRing";
import { Editable } from "../components/Editable";
import { TypeText } from "../components/TypeText";
import { Icon } from "../components/icons";

export function Lesson() {
  const { moduleId, lessonId } = useParams();
  const { modules, lessonStat, toggleStep, setVideoDone, updateLesson, updateStep, patchStep, addStep, deleteStep, deleteLesson, editing, progress } =
    useStore();
  const nav = useNavigate();

  const m = modules.find((x) => x.id === moduleId);
  const lesson = m?.lessons.find((l) => l.id === lessonId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [watched, setWatched] = useState(0);
  const [playing, setPlaying] = useState(false);

  const stat = lesson ? lessonStat(lesson.id) : null;

  // reset watch meter when navigating between lessons
  useEffect(() => {
    setWatched(stat?.videoDone ? 100 : 0);
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const { prev, nextLesson } = useMemo(() => {
    if (!m || !lesson) return { prev: null, nextLesson: null };
    const idx = m.lessons.findIndex((l) => l.id === lesson.id);
    return {
      prev: idx > 0 ? m.lessons[idx - 1] : null,
      nextLesson: idx < m.lessons.length - 1 ? m.lessons[idx + 1] : null,
    };
  }, [m, lesson]);

  if (!m || !lesson || !stat) return <div className="p-10 font-mono text-fg/50">Lesson not found.</div>;

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    setWatched((w) => Math.max(w, pct));
    if (pct >= 98 && !stat.videoDone) setVideoDone(lesson.id, true);
  };

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-7">
      {/* breadcrumb */}
      <div className="mb-5 flex items-center gap-2 font-mono text-[11px] text-fg/40">
        <Link to="/classroom" className="hover:text-accent">Classroom</Link>
        <span>/</span>
        <Link to={`/classroom/${m.id}`} className="hover:text-accent">{m.title}</Link>
        <span>/</span>
        <span className="truncate text-accent/70">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT — video + meta */}
        <div className="col-span-1 lg:col-span-8">
          {/* Video frame */}
          <div className="panel hud group relative overflow-hidden p-0">
            {stat.videoDone && (
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                <Icon.check size={12} /> watched
              </div>
            )}
            <div className="relative aspect-video w-full bg-black">
              <video
                key={lesson.videoUrl}
                ref={videoRef}
                src={lesson.videoUrl}
                className="h-full w-full"
                controls
                playsInline
                onTimeUpdate={onTime}
                onEnded={() => setVideoDone(lesson.id, true)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              {/* scanline accent */}
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-30 mix-blend-screen">
                <div className="absolute left-0 right-0 h-24 animate-scan bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
              </div>
            </div>
          </div>

          {/* Title + description */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/60">
              {lesson.duration}
            </div>
            {editing ? (
              <Editable as="h1" value={lesson.title} onChange={(v) => updateLesson(lesson.id, { title: v })} className="text-2xl font-medium text-fg md:text-3xl" />
            ) : (
              <TypeText as="h1" text={lesson.title} className="text-2xl font-medium text-fg md:text-3xl" speed={20} />
            )}
            <Editable
              as="p"
              value={lesson.description}
              onChange={(v) => updateLesson(lesson.id, { description: v })}
              className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/55 selectable"
              multiline
            />

            {/* edit-mode: change video source */}
            {editing && (
              <div className="panel mt-4 p-3">
                <div className="tag mb-1">Video source URL</div>
                <input
                  defaultValue={lesson.videoUrl}
                  onBlur={(e) => updateLesson(lesson.id, { videoUrl: e.target.value })}
                  className="w-full rounded border border-fg/10 bg-fg/[0.05] px-3 py-2 font-mono text-[12px] text-accent outline-none focus:border-accent/50"
                  placeholder="https://...mp4 or embed url"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    defaultValue={lesson.duration}
                    onBlur={(e) => updateLesson(lesson.id, { duration: e.target.value })}
                    className="w-28 rounded border border-fg/10 bg-fg/[0.05] px-3 py-1.5 font-mono text-[12px] text-fg/70 outline-none focus:border-accent/50"
                    placeholder="duration"
                  />
                  <span className="self-center font-mono text-[10px] text-fg/30">edits autosave to this device</span>
                </div>
                <button
                  onClick={() => {
                    deleteLesson(m.id, lesson.id);
                    nav(`/classroom/${m.id}`);
                  }}
                  className="mt-3 rounded-lg border border-signal/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-signal transition hover:bg-signal/10"
                >
                  Delete this lesson
                </button>
              </div>
            )}
          </div>

          {/* nav prev/next */}
          <div className="mt-7 flex items-center justify-between border-t border-fg/7 pt-5">
            {prev ? (
              <Link to={`/classroom/${m.id}/${prev.id}`} className="flex items-center gap-2 font-mono text-[12px] text-fg/45 hover:text-accent">
                <Icon.arrow size={14} className="rotate-180" /> {prev.title}
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link to={`/classroom/${m.id}/${nextLesson.id}`} className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-sm text-accent hover:bg-accent/15">
                Next lesson <Icon.arrow size={14} />
              </Link>
            ) : (
              <button onClick={() => nav(`/classroom`)} className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-sm text-accent hover:bg-accent/15">
                Finish module <Icon.check size={14} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — progress + steps */}
        <div className="col-span-1 lg:col-span-4">
          {/* Lesson completion */}
          <div className="panel hud relative flex items-center gap-4 p-5">
            <ProgressRing value={stat.pct} size={68} stroke={4} label="lesson" />
            <div>
              <div className="tag">Lesson progress</div>
              <div className="font-mono text-lg text-fg">{stat.complete ? "COMPLETE" : `${stat.pct}%`}</div>
              <div className="mt-0.5 font-mono text-[11px] text-fg/40">
                video {stat.videoDone ? "✓" : "—"} · steps {stat.stepsDone}/{stat.stepsTotal}
              </div>
            </div>
          </div>

          {/* Steps — assets live per-step */}
          <div className="panel mt-4 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg/50">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-accent" /> Steps
              </h3>
              <span className="font-mono text-[11px] text-accent/70">{stat.stepsDone}/{stat.stepsTotal}</span>
            </div>

            <div className="space-y-2">
              {lesson.steps.map((s) => {
                const done = !!progress[lesson.id]?.steps?.[s.id];
                return (
                  <div
                    key={s.id}
                    className={`group rounded-lg border p-3 transition ${
                      done ? "border-accent/25 bg-accent/[0.06]" : "border-fg/7 bg-fg/[0.015] hover:border-fg/15"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(lesson.id, s.id)}
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                          done ? "border-accent bg-accent text-bg" : "border-fg/25 text-transparent hover:border-accent/60"
                        }`}
                      >
                        <Icon.check size={13} />
                      </button>
                      <Editable
                        value={s.label}
                        onChange={(v) => updateStep(lesson.id, s.id, v)}
                        className={`min-w-0 flex-1 text-sm ${done ? "text-fg/45 line-through" : "text-fg/80"}`}
                        multiline
                      />
                      {editing && (
                        <button
                          onClick={() => deleteStep(lesson.id, s.id)}
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-fg/15 text-fg/40 transition hover:border-signal/50 hover:text-signal"
                          title="Delete step"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* attachment, related to this step */}
                    {!editing && s.attachment?.name && (
                      <a
                        href={s.attachment.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          if (!s.attachment?.url || s.attachment.url === "#") e.preventDefault();
                        }}
                        className="ml-8 mt-2 inline-flex items-center gap-1.5 rounded-md border border-fg/10 bg-fg/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-fg/60 transition hover:border-accent/40 hover:text-accent"
                      >
                        <Icon.paperclip size={12} /> {s.attachment.name}
                        <span className="text-fg/30">↓</span>
                      </a>
                    )}
                    {editing && (
                      <div className="ml-8 mt-2 flex gap-1.5">
                        <input
                          value={s.attachment?.name ?? ""}
                          onChange={(e) => patchStep(lesson.id, s.id, { attachment: { name: e.target.value, url: s.attachment?.url ?? "" } })}
                          placeholder="asset name"
                          className="w-1/2 rounded border border-fg/10 bg-fg/[0.05] px-2 py-1.5 font-mono text-[11px] text-fg/80 outline-none focus:border-accent/50"
                        />
                        <input
                          value={s.attachment?.url ?? ""}
                          onChange={(e) => patchStep(lesson.id, s.id, { attachment: { name: s.attachment?.name ?? "", url: e.target.value } })}
                          placeholder="asset link"
                          className="w-1/2 rounded border border-fg/10 bg-fg/[0.05] px-2 py-1.5 font-mono text-[11px] text-accent outline-none focus:border-accent/50"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {editing && (
              <button
                onClick={() => addStep(lesson.id)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-accent/40 py-2 font-mono text-[11px] uppercase tracking-wider text-accent transition hover:bg-accent/10"
              >
                + Add step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
