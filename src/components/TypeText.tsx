import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*/<>{}";

/**
 * Matrix-style self-typing text. Re-types whenever `text` changes
 * (e.g. on screen change). Each character briefly scrambles before it locks.
 */
export function TypeText({
  text,
  speed = 26,
  className = "",
  as: Tag = "span",
  caret = true,
  start = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  as?: any;
  caret?: boolean;
  start?: boolean;
}) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const raf = useRef<number>();

  useEffect(() => {
    if (!start) return;
    setOut("");
    setDone(false);
    let i = 0;
    let last = 0;
    let scramble = 0;

    const tick = (t: number) => {
      if (!last) last = t;
      const elapsed = t - last;
      // scramble the leading char a couple frames before locking it
      if (i < text.length) {
        const locked = text.slice(0, i);
        const next = text[i];
        const ghost = next === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        setOut(locked + ghost);
        if (elapsed >= speed) {
          scramble++;
          if (scramble >= 2) {
            i++;
            scramble = 0;
          }
          last = t;
        }
        raf.current = requestAnimationFrame(tick);
      } else {
        setOut(text);
        setDone(true);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, speed, start]);

  return (
    <Tag className={className}>
      {out}
      {caret && !done && <span className="text-accent animate-blink">▋</span>}
    </Tag>
  );
}
