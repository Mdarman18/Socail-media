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
      <div className="sm:hidden flex items-center justify-between bg-[#d6dbda] p-4 border-b border-amber-500/30 sticky top-0 z-40">
        <span className="text-xl font-bold text-slate-800 tracking-wide">
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
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#d6dbda] p-4 border-r border-amber-500/30 transition-transform duration-300 ease-in-out sm:translate-x-0 sm:static sm:min-h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div>
          {/* Header / Logo */}
          <div className="mb-6 px-3 py-2 text-xl font-bold text-slate-800 tracking-wide flex justify-between items-center">
            <span>Menu</span>
            {/* Close icon for mobile inside drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-2xl text-slate-800"
            >
              <HiX />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 w-full">
            {NavbarData.map((ele, idx) => {
              const Icon = ele.Icon;
              return (
                <Link
                  key={idx}
                  to={ele.path}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-start gap-4 px-4 py-3 rounded-xl hover:bg-[#76df66] cursor-pointer text-white font-medium transition-all duration-200 hover:shadow-md group"
                >
                  {Icon && (
                    <span className="text-slate-700 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                  )}
                  <span className="text-sm font-semibold">{ele.text}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile & Dark Mode Section */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="w-full rounded-2xl bg-white p-3 shadow-md">
            <div className="flex items-center gap-4 cursor-pointer">
              <img
                src={user?.img}
                onClick={() => navigate("/profile")}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover border"
              />

              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold truncate">
                  {user?.username}
                </h1>
                <p className="text-sm text-gray-500 truncate">@nickname</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-white h-fit flex items-center justify-between p-4 rounded-full shadow-sm">
            <span className="text-yellow-500 text-lg">
              {darkMode ? <FaMoon /> : <IoSunny />}
            </span>

            <h2 className="text-sm font-medium text-gray-800">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </h2>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
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
