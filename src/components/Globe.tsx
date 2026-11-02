import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import type { Member } from "../data/content";

function readAccent(): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "125 249 200";
  const [r, g, b] = v.split(/\s+/).map((n) => Number(n) / 255);
  return [r, g, b];
}

/**
 * Slowly auto-rotating globe (cobe / WebGL). Click & drag to spin.
 * When `onSelectMember` is provided, members render as clickable DOM markers
 * projected onto the sphere (so the visible dot IS the click target).
 */
export function Globe({
  members,
  size = 460,
  theme = "light",
  onSelectMember,
}: {
  members: Member[];
  size?: number;
  theme?: string;
  onSelectMember?: (m: Member) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const widthRef = useRef(size);

  useEffect(() => {
    let phi = 0;
    let width = size;
    widthRef.current = size;
    const accent = readAccent();
    const light = !["dark", "mocha", "midnight"].includes(theme); // dark family gets the dark globe
    const T = 0.25; // tilt (matches cobe theta)
    const K = 0.8; // sphere radius as fraction of half-width (matches cobe's rendered sphere)

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        widthRef.current = width;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: T,
      dark: light ? 0 : 1,
      diffuse: light ? 1.1 : 1.2,
      mapSamples: 17000,
      mapBrightness: light ? 2.2 : 5.5,
      baseColor: light ? [0.62, 0.63, 0.64] : [0.18, 0.2, 0.22],
      markerColor: accent,
      glowColor: light ? [0.9, 0.9, 0.92] : [0.12, 0.18, 0.16],
      // when beacons are interactive the DOM layer draws them; otherwise bake small dots in
      markers: onSelectMember ? [] : members.map((m) => ({ location: [m.lat, m.lng], size: 0.03 })),
      onRender: (state) => {
        if (pointerInteracting.current === null) phi += 0.0015; // 40% slower auto-spin
        state.phi = phi + pointerMovement.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;

        if (onSelectMember) {
          const w = widthRef.current;
          const cx = w / 2;
          const cy = w / 2;
          const R = (w / 2) * K;
          const P = state.phi as number;
          for (let i = 0; i < members.length; i++) {
            const el = dotsRef.current[i];
            if (!el) continue;
            const m = members[i];
            const latR = (m.lat * Math.PI) / 180;
            const lonR = (m.lng * Math.PI) / 180;
            const psi = P + lonR - Math.PI * 1.5; // 0 = front centre
            const x = Math.cos(latR) * Math.sin(psi);
            const y0 = Math.sin(latR);
            const z0 = Math.cos(latR) * Math.cos(psi);
            const y = y0 * Math.cos(T) + z0 * Math.sin(T);
            const z = -y0 * Math.sin(T) + z0 * Math.cos(T);
            const sx = cx + R * x;
            const sy = cy - R * y;
            const vis = z > 0.03;
            el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
            el.style.opacity = vis ? "1" : "0";
            el.style.pointerEvents = vis ? "auto" : "none";
          }
        }
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [members, size, theme, onSelectMember]);

  return (
    <div className="relative" style={{ width: "100%", maxWidth: size, aspectRatio: "1" }}>
      {/* single reticle ring hugging the sphere */}
      <div className="pointer-events-none absolute inset-[2%] rounded-full border border-accent/10" />
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab"
        style={{ contain: "layout paint size" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerMovement.current;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerMovement.current = delta / 200;
          }
        }}
      />
      {/* small pulsing beacons at each member's location — click for profile */}
      {onSelectMember && (
        <div className="pointer-events-none absolute inset-0">
          {members.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => (dotsRef.current[i] = el)}
              onClick={() => onSelectMember(m)}
              title={m.name}
              style={{ position: "absolute", left: 0, top: 0 }}
              className="grid h-4 w-4 place-items-center rounded-full"
            >
              <span className="beacon-ring absolute h-2 w-2 rounded-full bg-accent" style={{ animationDelay: `${(i % 6) * 0.3}s` }} />
              <span className="relative h-[5px] w-[5px] rounded-full bg-accent shadow-[0_0_6px_rgb(var(--accent))]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
