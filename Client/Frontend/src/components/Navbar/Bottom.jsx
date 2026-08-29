import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setIsCreateModalOpen } from "../../store/CreateSlice";

export default function BottomNav() {
  const dispatch = useDispatch();

  // Redux States (fallback to empty array if conversations aren't mapped yet)
  const conversations = useSelector((state) => state.chat?.conversations || []);

  const unreadMessages = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0,
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-200 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-surface-darkBorder px-3 py-2 flex items-center justify-around select-none">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            isActive
              ? "text-brand-600 dark:text-brand-400"
              : "text-ink-faint hover:text-ink dark:hover:text-slate-200"
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      {/* Discover */}
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            isActive
              ? "text-brand-600 dark:text-brand-400"
              : "text-ink-faint hover:text-ink dark:hover:text-slate-200"
          }`
        }
      >
        <Compass className="w-5 h-5" />
        <span>Discover</span>
      </NavLink>

      {/* Center Prominent Create Button */}
      <div className="relative -top-5">
        <button
          type="button"
          onClick={() => dispatch(setIsCreateModalOpen(true))}
          className="w-13 h-13 rounded-full bg-linear-to-tr from-brand-600 to-brand-400 text-blue-600 flex items-center justify-center shadow-lift hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-salte-300 dark:border-surface-dark"
          title="Create Post or Doubt"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Messages */}
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            isActive
              ? "text-brand-600 dark:text-brand-400"
              : "text-ink-faint hover:text-ink dark:hover:text-slate-200"
          }`
        }
      >
        <MessageSquare className="w-5 h-5" />
        <span>Chat</span>
        {unreadMessages > 0 && (
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-dark" />
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            isActive
              ? "text-brand-600 dark:text-brand-400"
              : "text-ink-faint hover:text-ink dark:hover:text-slate-200"
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
