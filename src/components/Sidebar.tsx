import { NavLink, Link } from "react-router-dom";
import { Icon } from "./icons";

const NAV = [
  { to: "/", label: "Dashboard", icon: Icon.home, end: true },
  { to: "/classroom", label: "Classroom", icon: Icon.grid },
  { to: "/coaching", label: "Meetings", icon: Icon.chat },
  { to: "/links", label: "Link Library", icon: Icon.link },
  { to: "/support", label: "Support", icon: Icon.life },
];

export function Sidebar() {
  return (
    <aside className="relative z-10 flex h-full w-[238px] shrink-0 flex-col border-r border-fg/7 bg-bg/60 backdrop-blur-xl">
      {/* Brand — juice.ext wordmark → dashboard */}
      <Link to="/" className="block px-5 pb-5 pt-7">
        <div className="brand-mark text-[26px] leading-none text-fg">
          juice<span className="text-accent">.</span>ext
        </div>
        <div className="tag mt-1.5">academy</div>
      </Link>

      <div className="mx-5 mb-4 h-px bg-gradient-to-r from-fg/12 to-transparent" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive ? "bg-accent/10 text-fg" : "text-fg/55 hover:bg-fg/[0.04] hover:text-fg"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--accent))]" />}
                <item.icon size={18} className={isActive ? "text-accent" : ""} />
                <span className="flex-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
