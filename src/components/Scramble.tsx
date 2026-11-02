import { useEffect, useRef, useState } from "react";

const GLYPHS = "0123456789ABCDEF";

/** Decodes a value with a brief scramble animation on mount / value change. */
export function Scramble({ value, className = "", duration = 600 }: { value: string; className?: string; duration?: number }) {
  const [out, setOut] = useState(value);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const reveal = Math.floor(p * value.length);
      let s = value.slice(0, reveal);
      for (let i = reveal; i < value.length; i++) {
        s += value[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(value);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return <span className={className}>{out}</span>;
}

/** Ambient flickering number — slowly mutates a random figure, for HUD texture. */
export function FlickerNumber({ className = "", digits = 6 }: { className?: string; digits?: number }) {
  const [v, setV] = useState(() => randomDigits(digits));
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.4) setV(randomDigits(digits));
    }, 700 + Math.random() * 900);
    return () => clearInterval(id);
  }, [digits]);
  return <span className={className}>{v}</span>;
}

function randomDigits(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}
