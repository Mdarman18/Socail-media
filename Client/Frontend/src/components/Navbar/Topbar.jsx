import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Bell,
  MessageSquare,
  Flame,
  Plus,
  Moon,
  Sun,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  setIsSearchModalOpen,
  setIsCreateModalOpen,
  setIsStudyModalOpen,
  setIsHelpModalOpen,
  selectSearchModalOpen,
  selectCreateModalOpen,
  selectStudyModalOpen,
  selectHelpModalOpen,
} from "../../store/CreateSlice";

// import {
//   setIsSearchModalOpen,
//   setIsCreateModalOpen,
//   setIsStudyModalOpen,
//   setIsHelpModalOpen,
//   selectSearchModalOpen,
//   selectCreateModalOpen,
//   selectStudyModalOpen,
//   selectHelpModalOpen,
// } from ""; // Apna sahi path dein

export default function TopNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  // Local/Dummy States
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const notifications = [];
  const conversations = [];

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0,
  );

  const isSearch = useSelector(selectSearchModalOpen);
  console.log("selectSearchModelOpen :-",isSearch);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/80 dark:border-surface-darkBorder px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Global Search Trigger Bar */}
        <div className="flex-1 max-w-xl">
          <div
            onClick={() => dispatch(setIsSearchModalOpen(true))}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-alt dark:bg-surface-darkBorder/60 border border-slate-200/80 dark:border-surface-darkBorder text-ink-faint hover:text-ink dark:hover:text-slate-200 hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-all duration-200 group shadow-sm-soft"
          >
            <Search className="w-4 h-4 text-ink-faint group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
            <span className="text-xs sm:text-sm font-medium flex-1 truncate">
              Search students, doubts, communities, resources...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-white dark:bg-surface-darkCard text-ink-faint border border-slate-200/80 dark:border-slate-800 shadow-sm">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right: Quick Streak Pill, Quick Create, Notifications, Messages, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator Pill */}
          <div
            onClick={() => dispatch(setIsStudyModalOpen(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-300/40 dark:border-amber-700/40 text-amber-600 dark:text-amber-400 text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-sm select-none"
            title="Current Study Streak · Click to Start Session"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{user?.stats?.streak || 0} Days</span>
          </div>

          {/* Create Button (Desktop) */}
          <button
            type="button"
            onClick={() => dispatch(setIsCreateModalOpen(true))}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500 text-brand-600 dark:text-brand-400 hover:bg-brand-100 font-semibold text-xs border border-brand-200/80 dark:border-brand-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>

          {/* Notifications Icon Button */}
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-full text-ink-soft dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-darkBorder transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white dark:ring-surface-dark" />
            )}
          </button>

          {/* User Profile Image with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-surface-darkBorder transition-colors cursor-pointer"
            >
              {/* Avatar ki jagah standard <img> tag */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                <img
                  src={user?.img || "https://via.placeholder.com/150"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
                {/* Online Status Dot */}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-surface-dark" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink-faint hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-darkCard border border-slate-200 dark:border-surface-darkBorder rounded-3xl shadow-xl py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-surface-darkBorder">
                    <p className="text-sm font-bold text-ink dark:text-slate-100 truncate">
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-ink-faint truncate">
                      @{user?.username || "guest"}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-ink-soft dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkBorder hover:text-ink text-left"
                    >
                      <User className="w-4 h-4 text-ink-faint" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/tracker");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-ink-soft dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkBorder hover:text-ink text-left"
                    >
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Study Stats ({user?.stats?.studyHours || 0}h)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-ink-soft dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkBorder hover:text-ink text-left"
                    >
                      <Settings className="w-4 h-4 text-ink-faint" />
                      <span>Settings & Privacy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-ink-soft dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkBorder hover:text-ink text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        {theme === "dark" ? (
                          <Sun className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Moon className="w-4 h-4 text-ink-faint" />
                        )}
                        <span>Dark Mode</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-ink-faint">
                        {theme}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        dispatch(setIsHelpModalOpen(true));
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-ink-soft dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkBorder hover:text-ink text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-ink-faint" />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-surface-darkBorder">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
