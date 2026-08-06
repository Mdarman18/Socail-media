import React, { useState } from "react";
import { NavbarData } from "../data/data";
import { useSelector } from "react-redux";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Header Bar (Menu Toggle Button) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-amber-500/30 bg-[#d6dbda] p-4 sm:hidden">
        <span className="text-xl font-bold tracking-wide text-slate-800">
          Menu
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-slate-800 focus:outline-none"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Backdrop Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
        />
      )}

      {/* Sidebar Component - Ab Fixed/Sticky Hai */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-amber-500/30 bg-[#d6dbda] p-4 transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header / Logo */}
          <div className="mb-6 flex items-center justify-between px-3 py-2 text-xl font-bold tracking-wide text-slate-800">
            <span>Menu</span>
            {/* Close icon for mobile inside drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-slate-800 sm:hidden"
            >
              <HiX />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex w-full flex-col gap-2">
            {NavbarData.map((ele, idx) => {
              const Icon = ele.Icon;
              return (
                <Link
                  key={idx}
                  to={ele.path}
                  onClick={() => setIsOpen(false)}
                  className="group flex w-full cursor-pointer items-center justify-start gap-4 rounded-xl px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-[#76df66] hover:shadow-md"
                >
                  {Icon && (
                    <span className="text-slate-700 transition-colors group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <span className="text-sm font-semibold">{ele.text}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile & Dark Mode Section */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="w-full rounded-2xl bg-white p-3 shadow-md">
            <div className="flex items-center gap-4 cursor-pointer">
              <img
                src={user?.img || "/default-avatar.png"}
                onClick={() => navigate("/profile")}
                alt="Profile"
                className="h-16 w-16 rounded-full border object-cover"
              />

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold">
                  {user?.username || "User"}
                </h1>
                <p className="truncate text-sm text-gray-500">@nickname</p>
              </div>
            </div>
          </div>

          <div className="flex h-fit w-full items-center justify-between rounded-full bg-white p-4 shadow-sm">
            <span className="text-lg text-yellow-500">
              {darkMode ? <FaMoon /> : <IoSunny />}
            </span>

            <h2 className="text-sm font-medium text-gray-800">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </h2>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative h-6 w-12 rounded-full transition-all duration-300 ${
                darkMode ? "bg-violet-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
