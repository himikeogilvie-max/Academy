import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  MODULES,
  LINKS,
  CALLS,
  RECORDINGS,
  MEMBERS,
  PROFILE,
  type Module,
  type Lesson,
  type Step,
  type ResourceLink,
  type Call,
  type Recording,
  type Member,
} from "../data/content";

type LessonProgress = { videoDone: boolean; steps: Record<string, boolean> };
type ProgressMap = Record<string, LessonProgress>;
type Theme = "light" | "warm" | "sand" | "olive" | "sage" | "mocha" | "midnight" | "dark";
type Profile = typeof PROFILE;

type State = {
  modules: Module[];
  links: ResourceLink[];
  calls: Call[];
  recordings: Recording[];
  members: Member[];
  profile: Profile;
  progress: ProgressMap;
  activity: string[];
  editing: boolean;
  theme: Theme;
};

const KEY = "colab-academy-v3";
const uid = (p: string) => p + Math.random().toString(36).slice(2, 8);

function seedActivity(): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < 63; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const day = d.getDay();
    const skip = (day === 0 || day === 6) && Math.random() > 0.35;
    const gap = Math.random() > 0.82;
    if (!skip && !gap) out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function load(): State {
  const base: State = {
    modules: MODULES,
    links: LINKS,
    calls: CALLS,
    recordings: RECORDINGS,
    members: MEMBERS,
    profile: PROFILE,
    progress: {},
    activity: seedActivity(),
    editing: false,
    theme: "light",
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        ...base,
        ...p,
        modules: p.modules ?? base.modules,
        links: p.links ?? base.links,
        calls: p.calls ?? base.calls,
        recordings: p.recordings ?? base.recordings,
        members: p.members ?? base.members,
        profile: p.profile ?? base.profile,
        progress: p.progress ?? {},
        activity: p.activity ?? seedActivity(),
        editing: false,
        theme: p.theme ?? base.theme,
      };
    }
  } catch {
    /* ignore */
  }
  return base;
}

type Ctx = State & {
  setEditing: (v: boolean) => void;
  setTheme: (t: Theme) => void;
  // progress
  toggleStep: (lessonId: string, stepId: string) => void;
  setVideoDone: (lessonId: string, done: boolean) => void;
  resetProgress: () => void;
  // content edits
  updateLesson: (lessonId: string, patch: Partial<Lesson>) => void;
  updateStep: (lessonId: string, stepId: string, label: string) => void;
  patchStep: (lessonId: string, stepId: string, patch: Partial<Step>) => void;
  updateModule: (moduleId: string, patch: Partial<Module>) => void;
  updateLink: (linkId: string, patch: Partial<ResourceLink>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  // create / delete
  addModule: () => void;
  deleteModule: (moduleId: string) => void;
  addLesson: (moduleId: string) => string;
  deleteLesson: (moduleId: string, lessonId: string) => void;
  addStep: (lessonId: string) => void;
  deleteStep: (lessonId: string, stepId: string) => void;
  addLink: () => void;
  deleteLink: (linkId: string) => void;
  addCall: (patch?: Partial<Call>) => void;
  updateCall: (id: string, patch: Partial<Call>) => void;
  deleteCall: (id: string) => void;
  addRecording: () => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  // selectors
  lessonStat: (lessonId: string) => { pct: number; videoDone: boolean; stepsDone: number; stepsTotal: number; complete: boolean };
  moduleStat: (moduleId: string) => { pct: number; done: number; total: number; lessonsComplete: number; lessonsTotal: number };
  courseStat: () => { pct: number; done: number; total: number };
  streak: () => number;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    const { editing, ...persist } = state;
    localStorage.setItem(KEY, JSON.stringify(persist));
  }, [state]);

  // apply theme class to <html>
  useEffect(() => {
    const el = document.documentElement;
    for (const c of Array.from(el.classList)) if (c.startsWith("theme-")) el.classList.remove(c);
    el.classList.add(`theme-${state.theme}`);
  }, [state.theme]);

  const markToday = useCallback((s: State): State => {
    const today = new Date().toISOString().slice(0, 10);
    if (s.activity.includes(today)) return s;
    return { ...s, activity: [...s.activity, today] };
  }, []);

  const lessonById = useCallback(
    (lessonId: string) => {
      for (const m of state.modules) {
        const l = m.lessons.find((x) => x.id === lessonId);
        if (l) return l;
      }
      return undefined;
    },
    [state.modules]
  );

  const toggleStep = useCallback((lessonId: string, stepId: string) => {
    setState((s) => {
      const lp = s.progress[lessonId] ?? { videoDone: false, steps: {} };
      const steps = { ...lp.steps, [stepId]: !lp.steps[stepId] };
      const next = { ...s, progress: { ...s.progress, [lessonId]: { ...lp, steps } } };
      return markToday(next);
    });
  }, [markToday]);

  const setVideoDone = useCallback((lessonId: string, done: boolean) => {
    setState((s) => {
      const lp = s.progress[lessonId] ?? { videoDone: false, steps: {} };
      if (lp.videoDone === done) return s;
      const next = { ...s, progress: { ...s.progress, [lessonId]: { ...lp, videoDone: done } } };
      return done ? markToday(next) : next;
    });
  }, [markToday]);

  const updateLesson = useCallback((lessonId: string, patch: Partial<Lesson>) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) })),
    }));
  }, []);

  const updateStep = useCallback((lessonId: string, stepId: string, label: string) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId ? { ...l, steps: l.steps.map((st) => (st.id === stepId ? { ...st, label } : st)) } : l
        ),
      })),
    }));
  }, []);

  const patchStep = useCallback((lessonId: string, stepId: string, patch: Partial<Step>) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId ? { ...l, steps: l.steps.map((st) => (st.id === stepId ? { ...st, ...patch } : st)) } : l
        ),
      })),
    }));
  }, []);

  const updateModule = useCallback((moduleId: string, patch: Partial<Module>) => {
    setState((s) => ({ ...s, modules: s.modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)) }));
  }, []);

  const updateLink = useCallback((linkId: string, patch: Partial<ResourceLink>) => {
    setState((s) => ({ ...s, links: s.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)) }));
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const addModule = useCallback(() => {
    setState((s) => ({
      ...s,
      modules: [
        ...s.modules,
        { id: uid("m"), index: String(s.modules.length + 1).padStart(2, "0"), title: "New Module", summary: "Describe this module.", lessons: [] },
      ],
    }));
  }, []);

  const deleteModule = useCallback((moduleId: string) => {
    setState((s) => ({ ...s, modules: s.modules.filter((m) => m.id !== moduleId) }));
  }, []);

  const addLesson = useCallback((moduleId: string) => {
    const id = uid("l");
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { id, title: "New Lesson", duration: "00:00", videoUrl: "", description: "Add a description.", steps: [] }] }
          : m
      ),
    }));
    return id;
  }, []);

  const deleteLesson = useCallback((moduleId: string, lessonId: string) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m)),
    }));
  }, []);

  const addStep = useCallback((lessonId: string) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, steps: [...l.steps, { id: uid("s"), label: "New step / task" }] } : l)),
      })),
    }));
  }, []);

  const deleteStep = useCallback((lessonId: string, stepId: string) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, steps: l.steps.filter((st) => st.id !== stepId) } : l)),
      })),
    }));
  }, []);

  const addLink = useCallback(() => {
    setState((s) => ({ ...s, links: [...s.links, { id: uid("lk"), name: "New tool", category: "Misc", url: "https://", note: "What it's for" }] }));
  }, []);

  const deleteLink = useCallback((linkId: string) => {
    setState((s) => ({ ...s, links: s.links.filter((l) => l.id !== linkId) }));
  }, []);

  const addCall = useCallback((patch?: Partial<Call>) => {
    const base: Call = { id: uid("c"), type: "group", title: "New call", date: new Date(Date.now() + 86400000).toISOString(), duration: "90 min", host: "Mike" };
    setState((s) => ({ ...s, calls: [...s.calls, { ...base, ...patch }] }));
  }, []);

  const updateCall = useCallback((id: string, patch: Partial<Call>) => {
    setState((s) => ({ ...s, calls: s.calls.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }, []);

  const deleteCall = useCallback((id: string) => {
    setState((s) => ({ ...s, calls: s.calls.filter((c) => c.id !== id) }));
  }, []);

  const addRecording = useCallback(() => {
    setState((s) => ({
      ...s,
      recordings: [
        { id: uid("r"), title: "New recording", date: new Date().toISOString().slice(0, 10), duration: "60 min", videoUrl: "", tag: "GROUP" },
        ...s.recordings,
      ],
    }));
  }, []);

  const updateRecording = useCallback((id: string, patch: Partial<Recording>) => {
    setState((s) => ({ ...s, recordings: s.recordings.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, []);

  const deleteRecording = useCallback((id: string) => {
    setState((s) => ({ ...s, recordings: s.recordings.filter((r) => r.id !== id) }));
  }, []);

  const resetProgress = useCallback(() => setState((s) => ({ ...s, progress: {} })), []);
  const setEditing = useCallback((v: boolean) => setState((s) => ({ ...s, editing: v })), []);
  const setTheme = useCallback((t: Theme) => setState((s) => ({ ...s, theme: t })), []);

  const lessonStat = useCallback(
    (lessonId: string) => {
      const lesson = lessonById(lessonId);
      const lp = state.progress[lessonId] ?? { videoDone: false, steps: {} };
      const stepsTotal = lesson?.steps.length ?? 0;
      const stepsDone = lesson ? lesson.steps.filter((st) => lp.steps[st.id]).length : 0;
      const total = 1 + stepsTotal;
      const done = (lp.videoDone ? 1 : 0) + stepsDone;
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      return { pct, videoDone: lp.videoDone, stepsDone, stepsTotal, complete: done === total && total > 0 };
    },
    [state.progress, lessonById]
  );

  const moduleStat = useCallback(
    (moduleId: string) => {
      const m = state.modules.find((x) => x.id === moduleId);
      if (!m) return { pct: 0, done: 0, total: 0, lessonsComplete: 0, lessonsTotal: 0 };
      let done = 0;
      let total = 0;
      let lessonsComplete = 0;
      for (const l of m.lessons) {
        const st = lessonStat(l.id);
        done += (st.videoDone ? 1 : 0) + st.stepsDone;
        total += 1 + st.stepsTotal;
        if (st.complete) lessonsComplete++;
      }
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      return { pct, done, total, lessonsComplete, lessonsTotal: m.lessons.length };
    },
    [state.modules, lessonStat]
  );

  const courseStat = useCallback(() => {
    let done = 0;
    let total = 0;
    for (const m of state.modules) {
      const st = moduleStat(m.id);
      done += st.done;
      total += st.total;
    }
    return { pct: total === 0 ? 0 : Math.round((done / total) * 100), done, total };
  }, [state.modules, moduleStat]);

  const streak = useCallback(() => {
    const set = new Set(state.activity);
    let count = 0;
    const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [state.activity]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      setEditing,
      setTheme,
      toggleStep,
      setVideoDone,
      resetProgress,
      updateLesson,
      updateStep,
      patchStep,
      updateModule,
      updateLink,
      updateProfile,
      addModule,
      deleteModule,
      addLesson,
      deleteLesson,
      addStep,
      deleteStep,
      addLink,
      deleteLink,
      addCall,
      updateCall,
      deleteCall,
      addRecording,
      updateRecording,
      deleteRecording,
      lessonStat,
      moduleStat,
      courseStat,
      streak,
    }),
    [
      state, setEditing, setTheme, toggleStep, setVideoDone, resetProgress, updateLesson, updateStep, patchStep, updateModule, updateLink, updateProfile,
      addModule, deleteModule, addLesson, deleteLesson, addStep, deleteStep, addLink, deleteLink, addCall, updateCall, deleteCall,
      addRecording, updateRecording, deleteRecording, lessonStat, moduleStat, courseStat, streak,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
