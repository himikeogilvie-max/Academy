// Minimal line-icon set (no dependency). 1.5px stroke, currentColor.
type P = { className?: string; size?: number };
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  home: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.5V20h14V9.5" /><path d="M9.5 20v-5h5v5" /></svg>
  ),
  grid: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
  ),
  calendar: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>
  ),
  play: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M10 8.5 16 12l-6 3.5z" /></svg>
  ),
  chat: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M4 5.5h16v10H8l-4 3.5z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
  ),
  globe: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
  ),
  link: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M9.5 14.5 14.5 9.5" /><path d="M8 12 6 14a3.5 3.5 0 0 0 5 5l2-2" /><path d="M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2" /></svg>
  ),
  life: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="m5.5 5.5 3.6 3.6M14.9 14.9l3.6 3.6M18.5 5.5l-3.6 3.6M9.1 14.9l-3.6 3.6" /></svg>
  ),
  user: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></svg>
  ),
  check: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
  ),
  lock: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><rect x="5" y="10.5" width="14" height="9" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
  ),
  arrow: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  clock: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
  ),
  paperclip: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M20 11.5 11.5 20a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.6 1.6 0 0 1-2.3-2.3l7.4-7.4" /></svg>
  ),
  send: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M4 12 20 4l-6 16-3-7z" /><path d="m11 13 9-9" /></svg>
  ),
  flame: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c2 2 2 4 2 5a6 6 0 0 1-12 0c0-3 2-5 4-7 1.5-1.5 2-3 2-5z" /></svg>
  ),
  download: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M12 4v10" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></svg>
  ),
  external: ({ className, size }: P) => (
    <svg {...base(size)} className={className}><path d="M14 5h5v5" /><path d="M19 5l-8 8" /><path d="M19 13v6H5V5h6" /></svg>
  ),
};
