import { useEffect, useState } from "react";
import { BRAND } from "../data/content";

const LINES = [
  "> initializing juice kernel ...",
  "> authenticating member token ......... OK",
  "> loading course manifest [05 modules]",
  "> syncing progress · calibrating globe",
  "> establishing secure uplink ......... OK",
];

/** One-time boot/decrypt screen on first mount. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<string[]>([]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown((s) => [...s, LINES[i]]);
      i++;
      if (i >= LINES.length) {
        clearInterval(id);
        setTimeout(() => setFade(true), 450);
        setTimeout(onDone, 1050);
      }
    }, 260);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">
        <div className="mb-8 text-center">
          <div className="brand-mark text-5xl text-fg">
            juice<span className="text-accent">.</span>ext
            <span className="animate-blink text-accent">_</span>
          </div>
          <div className="tag mt-3">{BRAND.tagline}</div>
        </div>
        <div className="w-[340px] font-mono text-[12px] leading-relaxed text-accent/80">
          {shown.map((l, i) => (
            <div key={i} className="animate-fade-up">{l}</div>
          ))}
        </div>
        <div className="mt-6 h-px w-[340px] overflow-hidden bg-fg/10">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(shown.length / LINES.length) * 100}%`, boxShadow: "0 0 8px rgb(var(--accent))" }} />
        </div>
      </div>
    </div>
  );
}
