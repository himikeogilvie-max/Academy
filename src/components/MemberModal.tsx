import { createPortal } from "react-dom";
import { Icon } from "./icons";
import type { Member } from "../data/content";

/**
 * Profile popup shown when clicking a globe beacon or a cohort member.
 * Rendered in a portal on <body> so `fixed` truly centres on the user's
 * screen — ancestor transforms/scroll containers can't drag it around.
 */
export function MemberModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  if (!member) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="hud w-[340px] rounded-2xl border border-fg/15 p-7 text-center shadow-2xl"
        style={{ background: "rgb(var(--card))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-accent/30 bg-accent/5 text-accent">
          <Icon.user size={30} />
        </div>
        <div className="mt-3 text-lg text-fg">{member.name}</div>
        <div className="font-mono text-[12px] text-accent/70">{member.role}</div>
        <div className="mt-1 font-mono text-[11px] text-fg/45">{member.location}</div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-fg/10 px-3 py-1 font-mono text-[10px] text-fg/40">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {member.lat.toFixed(2)}, {member.lng.toFixed(2)}
        </div>
        <div>
          <button onClick={onClose} className="mt-5 rounded-full border border-fg/15 px-5 py-1.5 text-xs text-fg/60 transition hover:border-accent/40 hover:text-accent">
            close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
