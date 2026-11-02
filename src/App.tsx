import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { StoreProvider, useStore } from "./store/useStore";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Boot } from "./components/Boot";
import { FlickerField } from "./components/FlickerField";

import { Dashboard } from "./pages/Dashboard";
import { Classroom } from "./pages/Classroom";
import { ModulePage } from "./pages/Module";
import { Lesson } from "./pages/Lesson";
import { Coaching } from "./pages/Coaching";
import { Links } from "./pages/Links";
import { Support } from "./pages/Support";
import { Profile } from "./pages/Profile";

/** Slim loading bar that fires on every route change. */
function RouteFx() {
  const loc = useLocation();
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(true);
    const id = setTimeout(() => setOn(false), 650);
    return () => clearTimeout(id);
  }, [loc.pathname]);
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-[2px]">
      <div
        className={`h-full bg-accent transition-all duration-700 ${on ? "w-full opacity-100" : "w-0 opacity-0"}`}
        style={{ boxShadow: "0 0 10px rgb(var(--accent))" }}
      />
    </div>
  );
}

function Shell() {
  const { theme } = useStore();
  const [booted, setBooted] = useState(() => sessionStorage.getItem("booted") === "1");

  return (
    <>
      {!booted && (
        <Boot
          onDone={() => {
            sessionStorage.setItem("booted", "1");
            setBooted(true);
          }}
        />
      )}

      <div className="noise bg-radial relative flex h-screen w-screen overflow-hidden bg-bg">
        <FlickerField theme={theme} />
        <div className="bg-grid pointer-events-none absolute inset-0 z-0" />
        <Sidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <TopBar />
          <RouteFx />
          <main className="no-scrollbar flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/classroom" element={<Classroom />} />
              <Route path="/classroom/:moduleId" element={<ModulePage />} />
              <Route path="/classroom/:moduleId/:lessonId" element={<Lesson />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/links" element={<Links />} />
              <Route path="/support" element={<Support />} />
              <Route path="/profile" element={<Profile />} />
              {/* legacy routes fold into Coaching */}
              <Route path="/calendar" element={<Navigate to="/coaching" replace />} />
              <Route path="/recordings" element={<Navigate to="/coaching" replace />} />
              <Route path="/community" element={<Navigate to="/coaching" replace />} />
              <Route path="/members" element={<Navigate to="/coaching" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
