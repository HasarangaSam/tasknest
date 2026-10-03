import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="flex h-full flex-col bg-slate-100">
      {/* Top navigation bar */}
      <header className="flex-none border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
          {/* Brand + nav */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 text-lg font-bold text-blue-600 tracking-tight"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">
                TN
              </span>
              TaskNest
            </NavLink>

            <nav className="flex items-center gap-1">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/tasks" className={navLinkClass}>
                Tasks
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>

              {user?.role === "ADMIN" && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </nav>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 font-medium">{user?.role}</p>
            </div>

            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content area — fills remaining viewport */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
