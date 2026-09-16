import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Timer, List, Calendar, CheckSquare, Settings } from "lucide-react";

export default function StudyLayout() {
  const tabs = [
    { name: "Dashboard", path: "/study", icon: <LayoutDashboard size={18} />, exact: true },
    { name: "Timer", path: "/study/timer", icon: <Timer size={18} /> },
    { name: "Sessions", path: "/study/sessions", icon: <List size={18} /> },
    { name: "Goals", path: "/study/goals", icon: <Calendar size={18} /> },
    { name: "Tasks", path: "/study/tasks", icon: <CheckSquare size={18} /> },
    { name: "Settings", path: "/study/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header / Sub-nav */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Tracker</h1>
        </div>
        <div className="px-4 overflow-x-auto flex space-x-1 scrollbar-hide">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                }`
              }
            >
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
