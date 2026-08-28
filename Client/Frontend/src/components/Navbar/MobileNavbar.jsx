import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Flame, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

export default function MobileNavbar() {
  // Redux state
  const user = useSelector((state) => state.auth.user);

  // Navigation
  const navigate = useNavigate();

  // Dummy or placeholder states for notifications
  const [notifications] = useState([]);
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  // Handlers
  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200/80 dark:border-surface-darkBorder px-4 py-3 flex items-center justify-between">
      {/* Brand logo & Streak */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
            S↗
          </div>
          <span className="font-display font-extrabold text-lg text-ink dark:text-white tracking-tight">
            StudySharp
          </span>
        </div>

        <div
          onClick={() => {
            /* Handle Study Modal if needed */
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200/80 dark:border-amber-800 cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{user?.stats?.streak || 0}d</span>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            /* Handle Search Modal */
          }}
          className="p-2 rounded-full text-ink-soft dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-darkBorder transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-full text-ink-soft dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-darkBorder transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white dark:ring-surface-dark" />
          )}
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-full text-ink-soft hover:text-rose-600 hover:bg-rose-50 dark:text-slate-300 dark:hover:bg-rose-950/40 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div onClick={handleNavigateProfile} className="cursor-pointer ml-1">
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
            <img
              src={user?.img || user?.avatar || logo}
              alt={user?.username || user?.name || "User"}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
