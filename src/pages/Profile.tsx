import { useRef } from "react";
import { useStore } from "../store/useStore";
import { Page, SectionTitle } from "../components/Page";
import { ProgressBar } from "../components/ProgressRing";
import { Heatmap } from "../components/Heatmap";
import { Editable } from "../components/Editable";
import { Icon } from "../components/icons";

export function Profile() {
  const { modules, moduleStat, activity, resetProgress, profile, updateProfile } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: String(reader.result) });
    reader.readAsDataURL(f);
  };

  return (
    <Page title={profile.name} subtitle={`${profile.role}, ${profile.location}`}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="panel hud col-span-1 p-6 lg:col-span-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-accent/30 bg-accent/5"
              title="Upload / change photo"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-accent">
                  <Icon.user size={30} />
                </span>
              )}
              <span className="absolute inset-0 hidden place-items-center bg-black/55 font-mono text-[9px] uppercase tracking-wider text-white group-hover:grid">
                change
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
            <div className="min-w-0">
              <Editable value={profile.name} onChange={(v) => updateProfile({ name: v })} className="truncate text-lg text-fg" force />
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-fg/55">
                <Editable value={profile.role} onChange={(v) => updateProfile({ role: v })} force />
                <span className="text-fg/30">·</span>
                <Editable value={profile.location} onChange={(v) => updateProfile({ location: v })} force />
              </div>
            </div>
          </div>

          <button onClick={resetProgress} className="mt-6 w-full rounded-lg border border-fg/10 py-2 font-mono text-[11px] text-fg/40 transition hover:border-signal/40 hover:text-signal">
            reset progress
          </button>
        </div>

        <div className="col-span-1 space-y-4 lg:col-span-8">
          <div className="panel p-6">
            <Heatmap activity={activity} />
          </div>

          <div className="panel p-6">
            <SectionTitle>Module Progress</SectionTitle>
            <div className="space-y-4">
              {modules.map((m) => {
                const st = moduleStat(m.id);
                return (
                  <div key={m.id}>
                    <div className="mb-1.5 text-sm text-fg/80">
                      <span className="font-mono text-accent/50">{m.index}</span> · {m.title}
                    </div>
                    <ProgressBar value={st.pct} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
