import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  HelpCircle,
  Users,
  Clock,
  MessageSquare,
  Bell,
  Bookmark,
  FileText,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Flame,
  Play,
} from "lucide-react";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  // --- LOGIC HOOK INTEGRATION ---
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Local functional states for UI feature completeness
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Mock states for UI widgets if not managed by Redux yet
  const [notifications] = useState([]);
  const [conversations] = useState([]);
  const [activeSession] = useState({
    isActive: false,
    isPaused: false,
    subject: "",
    elapsedSeconds: 0,
  });

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0,
  );

  const navItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    {
      label: "Discover",
      icon: <Compass className="w-5 h-5" />,
      path: "/discover",
    },
    {
      label: "Doubts & Q&A",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/doubts",
    },
    {
      label: "Communities",
      icon: <Users className="w-5 h-5" />,
      path: "/communities",
    },
    {
      label: "Study Tracker",
      icon: <Clock className="w-5 h-5" />,
      path: "/tracker",
    },
    {
      label: "Messages",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/messages",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/notifications",
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
    { label: "Saved", icon: <Bookmark className="w-5 h-5" />, path: "/saved" },
    {
      label: "Resources",
      icon: <FileText className="w-5 h-5" />,
      path: "/resources",
    },
    { label: "Profile", icon: <User className="w-5 h-5" />, path: "/profile" },
  ];

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  // --- UI RENDER SECTION ---
  return (
    <aside className="hidden sm:bg-[#b3d4ce] lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 dark:bg-surface-dark border-r border-slate-200/80 dark:border-surface-darkBorder py-6 px-4 select-none z-30 justify-between overflow-hidden">
      {/* Brand Logo & Nav Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-3 px-3 cursor-pointer group mb-6 shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-brand-600 to-brand-400 flex items-center justify-center text-gray-700 font-display font-extrabold text-lg shadow-lift group-hover:scale-105 transition-transform">
            S↗
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl text-ink dark:text-white tracking-tight">
                StudySharp
              </span>
            </div>
            <p className="text-[10px] font-mono font-medium text-brand-600 dark:text-brand-400 tracking-wider uppercase">
              Learn · Connect · Grow
            </p>
          </div>
        </div>

        {/* Main Navigation Links with Scroll enabled */}
        <nav className="space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 flex-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/home" &&
                location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={handleCloseMenu}
                className={({ isActive: linkActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                    isActive || linkActive
                      ? "bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 shadow-sm-soft"
                      : "text-ink-soft dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-surface-darkBorder/50 hover:text-ink dark:hover:text-slate-100"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-brand-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Mini Timer Widget & User Profile/Actions */}
      <div className="space-y-3 pt-3 mt-3 border-t border-slate-100 dark:border-surface-darkBorder shrink-0">
        {/* User Mini Profile & Settings Bar - Fixed Overflow */}
        <div className="flex flex-col gap-3 border-t border-gray-200  sm:border-none sm:p-0">
          <div className="flex w-full items-center gap-3 mt-6 rounded-2xl bg-white p-2 sm:p-3 sm:shadow-md">
            <div className="flex items-center gap-2 cursor-pointer  sm:gap-2">
              <img
                src={user?.img || "/default-avatar.png"}
                onClick={() => navigate("/profile")}
                alt="Profile"
                className="h-11 w-11 shrink-0 rounded-full border border-gray-300 object-cover sm:h-16 sm:w-16"
              />

              <div className="min-w-0 ">
                <h1 className="truncate text-[13px] font-semibold sm:text-lg">
                  {user?.username || "User"}
                </h1>
                <p className="truncate text-sm text-gray-500">
                  {user?.nickname}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
