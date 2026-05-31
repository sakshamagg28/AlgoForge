import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/topics", label: "Problems" },
  { to: "/companies", label: "Companies" },
  { to: "/notes", label: "Notes" },
  { to: "/revisions", label: "Revision" },
  { to: "/submissions", label: "Submissions" }
];

export function AppLayout() {
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950/95 p-5 lg:block">
        <div>
          <p className="text-2xl font-black text-white">AlgoForge</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-300">Learn Practice Judge</p>
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold text-slate-100">{user?.username}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
          <p className="mt-2 text-xs text-cyan-300">{user?.role ?? "USER"}</p>
          <Button className="mt-4 w-full" type="button" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-black text-white">AlgoForge</p>
            <p className="text-xs text-slate-500">{user?.username}</p>
          </div>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold ${
                  isActive ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="min-h-screen px-4 py-6 lg:ml-64 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
