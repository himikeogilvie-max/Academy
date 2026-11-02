import { useStore } from "../store/useStore";
import { Page, SectionTitle } from "../components/Page";
import { Editable } from "../components/Editable";
import { Icon } from "../components/icons";
import { FlickerNumber } from "../components/Scramble";

export function Links() {
  const { links, updateLink, addLink, deleteLink, editing } = useStore();
  const cats = Array.from(new Set(links.map((l) => l.category)));

  return (
    <Page
      title="Link Library"
      subtitle="Tools, models and resources referenced."
      right={
        editing ? (
          <button onClick={addLink} className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-accent transition hover:bg-accent/20">
            + Add link
          </button>
        ) : undefined
      }
    >
      <div className="space-y-7">
        {cats.map((cat) => (
          <div key={cat}>
            <SectionTitle right={<span className="font-mono text-[11px] text-fg/30">{links.filter((l) => l.category === cat).length} tools</span>}>
              {cat}
            </SectionTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {links
                .filter((l) => l.category === cat)
                .map((l) => (
                  <a
                    key={l.id}
                    href={editing ? undefined : l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="panel panel-hover group relative flex items-start gap-3 p-4"
                  >
                    {editing && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteLink(l.id);
                        }}
                        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md border border-signal/30 font-mono text-signal transition hover:bg-signal/10"
                        title="Delete link"
                      >
                        ×
                      </button>
                    )}
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-accent/25 bg-accent/5 text-accent">
                      {l.download ? <Icon.download size={18} /> : <Icon.link size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Editable value={l.name} onChange={(v) => updateLink(l.id, { name: v })} className="text-sm font-medium text-fg group-hover:text-accent" />
                      <Editable value={l.note} onChange={(v) => updateLink(l.id, { note: v })} className="mt-0.5 text-[12px] text-fg/45" multiline />
                      {editing ? (
                        <div className="mt-1 space-y-1">
                          <Editable value={l.url} onChange={(v) => updateLink(l.id, { url: v })} className="font-mono text-[10px] text-accent/60" />
                          <Editable value={l.category} onChange={(v) => updateLink(l.id, { category: v })} className="font-mono text-[10px] text-fg/40" />
                        </div>
                      ) : (
                        <div className="mt-1 truncate font-mono text-[10px] text-fg/25">{l.url.replace(/^https?:\/\//, "")} · <FlickerNumber digits={2} /></div>
                      )}
                    </div>
                    {!editing && (l.download ? <Icon.download size={16} className="text-fg/20 transition group-hover:text-accent" /> : <Icon.external size={15} className="text-fg/20 transition group-hover:text-accent" />)}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
