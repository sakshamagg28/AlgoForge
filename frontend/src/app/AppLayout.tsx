import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/topics", label: "Topics" },
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
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-bold text-ink">AlgoForge</p>
            <p className="text-sm text-ink/60">Learn to practice to submit to track</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/65 sm:inline">{user?.username}</span>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
