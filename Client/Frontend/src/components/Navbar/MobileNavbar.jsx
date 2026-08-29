import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Flame,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  Home,
  Compass,
  MessageSquare,
  HelpCircle,
  Activity,
  FolderGit2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import { setIsSearchModalOpen, logout } from "../../store/CreateSlice";

export default function MobileNavbar() {
  // Redux state
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  // Navigation
  const navigate = useNavigate();

  // Dropdown states & refs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Dummy or placeholder states for notifications
  const [notifications] = useState([]);
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 w-full bg-slate-800 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200/80 dark:border-surface-darkBorder px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 shadow-sm">
      {/* Brand logo & Streak */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-1.5 cursor-pointer truncate"
        >
          <span className="font-display font-extrabold text-base sm:text-lg text-white dark:text-white tracking-tight truncate">
            StudySharp
          </span>
        </div>

        <div
          onClick={() => {
            /* Handle Study Modal if needed */
          }}
          className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-bold border border-amber-200/80 dark:border-amber-800 cursor-pointer shrink-0"
        >
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>{user?.stats?.streak || 0}d</span>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => dispatch(setIsSearchModalOpen(true))}
          className="p-1.5 sm:p-2 rounded-full text-slate-300 dark:text-slate-300 hover:bg-slate-700 dark:hover:bg-surface-darkBorder transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative p-1.5 sm:p-2 rounded-full text-slate-300 dark:text-slate-300 hover:bg-slate-700 dark:hover:bg-surface-darkBorder transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-slate-800 dark:ring-surface-dark" />
          )}
        </button>

        {/* Feature Menu Toggle Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:bg-slate-700 dark:hover:bg-surface-darkBorder transition-colors"
            title="Menu"
          >
            {isMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Feature Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Quick Navigation
              </div>

              <button
                onClick={() => handleNavigate("/home")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Home className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavigate("/messages")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Doubt & Q & A</span>
              </button>

              <button
                onClick={() => handleNavigate("/profile")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Study Tracker</span>
              </button>

              <button
                onClick={() => handleNavigate("/discover")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <FolderGit2 className="w-4 h-4 text-blue-500" />
                <span>Resource</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1" />

              <button
                onClick={() => handleNavigate("/settings")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar with Dropdown */}
        <div className="relative ml-0.5 sm:ml-1" ref={dropdownRef}>
          <div
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
              setIsMenuOpen(false);
            }}
            className="cursor-pointer relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-slate-600 dark:bg-slate-700 shrink-0"
          >
            <img
              src={user?.img || user?.avatar || logo}
              alt={user?.username || user?.name || "User"}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-800 dark:ring-surface-dark" />
          </div>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
              {/* User Info Header in Dropdown */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                  {user?.name || user?.username || "User"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || "studysharp@user.com"}
                </p>
              </div>

              <button
                onClick={() => handleNavigate("/settings")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Settings</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
