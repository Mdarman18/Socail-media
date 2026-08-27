import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiCompass, FiInfo } from "react-icons/fi";
import studySharpImage from "../assets/logo.png";

export default function GuestNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      label: "Overview",
      path: "/overview/study",
      icon: <FiHome className="text-lg" />,
    },
    {
      label: "How it works",
      path: "/how-it-works",
      icon: <FiCompass className="text-lg" />,
    },
    {
      label: "About",
      path: "/about",
      icon: <FiInfo className="text-lg" />,
    },
  ];

  return (
    <nav className="relative flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md top-0 z-50 border-b border-gray-100">
      {/* Logo */}
      <Link to="/overview/study" className="flex items-center shrink-0">
        <img
          src={studySharpImage}
          className="h-18 w-auto sm:w-40 sm:h-20 object-contain"
          alt="StudySharp"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4 text-gray-700 font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm lg:text-base transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop Auth Button */}
      <div className="hidden md:flex cursor-pointer items-center gap-5">
        <Link
          to="/login"
          className="px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        className="md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span
          className={`w-6 h-0.5 bg-gray-800 transition-transform ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />

        <span
          className={`w-6 h-0.5 bg-gray-800 transition-opacity ${
            menuOpen ? "opacity-0" : ""
          }`}
        />

        <span
          className={`w-6 h-0.5 bg-gray-800 transition-transform ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 px-3 pt-1 z-40">
          <div className="bg-black/80 backdrop-blur-3xl flex flex-col justify-center items-center rounded-2xl shadow-xl border border-gray-100 relative p-4">
            <div className="flex flex-col gap-2 my-4 w-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
