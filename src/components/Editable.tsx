import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";

/**
 * Inline-editable text. When global Edit mode is on, shows a dashed outline
 * and becomes contentEditable; commits on blur / Enter.
 */
export function Editable({
  value,
  onChange,
  className = "",
  as: Tag = "div",
  multiline = false,
  placeholder = "—",
  force = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  as?: any;
  multiline?: boolean;
  placeholder?: string;
  /** editable even when global Edit mode is off (e.g. user's own settings) */
  force?: boolean;
}) {
  const { editing: globalEditing } = useStore();
  const editing = globalEditing || force;
  const ref = useRef<HTMLElement>(null);
  const [hot, setHot] = useState(false);

  // Preload current text into the field whenever we (re-)enter edit mode or the
  // value changes externally — but never clobber what the user is typing.
  useEffect(() => {
    if (editing && !hot && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, editing, hot]);

  if (!editing) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
        if (node && node.textContent !== value) node.textContent = value;
      }}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className={`${className} rounded outline-none transition-colors ${
        hot ? "bg-accent/10 ring-1 ring-accent/60" : "ring-1 ring-dashed ring-fg/15 hover:ring-accent/40"
      } cursor-text px-1 -mx-1`}
      onFocus={() => setHot(true)}
      onBlur={(e) => {
        setHot(false);
        onChange((e.currentTarget.textContent || "").trim());
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

/** Edit-mode toggle pill used in the top bar. */
export function EditToggle() {
  const { editing, setEditing } = useStore();
  return (
    <button
      onClick={() => setEditing(!editing)}
      className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
        editing ? "border-accent/60 bg-accent/15 text-accent glow" : "border-fg/10 text-fg/55 hover:border-fg/25 hover:text-fg"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${editing ? "bg-accent animate-pulse" : "bg-fg/40"}`} />
      {editing ? "Editing" : "Edit"}
    </button>
  );
}
