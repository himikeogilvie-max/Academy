import { useEffect, useRef } from "react";

/**
 * Ambient background of faint flickering digits — pure canvas, very cheap.
 * Reads the active theme's --field colour so it adapts to dark / silver.
 */
export function FlickerField({ theme }: { theme: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    const fieldVar = getComputedStyle(document.documentElement).getPropertyValue("--field").trim() || "125 249 200";
    const [fr, fg, fb] = fieldVar.split(/\s+/).map(Number);
    let w = 0;
    let h = 0;
    let cols: { x: number; y: number; v: string; a: number; speed: number }[] = [];
    let raf = 0;

    const spawn = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: String(Math.floor(Math.random() * 10)),
      a: Math.random() * 0.4,
      speed: 0.002 + Math.random() * 0.01,
    });
    const resize = () => {
      w = cvs.width = cvs.offsetWidth * devicePixelRatio;
      h = cvs.height = cvs.offsetHeight * devicePixelRatio;
      const count = Math.floor((cvs.offsetWidth * cvs.offsetHeight) / 14000);
      cols = Array.from({ length: count }, spawn);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${11 * devicePixelRatio}px "JetBrains Mono", monospace`;
      for (const c of cols) {
        c.a += (Math.random() - 0.5) * 0.06;
        if (c.a < 0) {
          Object.assign(c, spawn());
          c.a = 0;
        }
        if (c.a > 0.55) c.a = 0.55;
        if (Math.random() > 0.985) c.v = String(Math.floor(Math.random() * 10));
        ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${c.a * 0.5})`;
        ctx.fillText(c.v, c.x, c.y);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50" />;
}
