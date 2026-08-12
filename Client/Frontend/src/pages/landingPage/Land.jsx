import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiCompass, FiInfo, FiX } from "react-icons/fi";
import studySharpImage from "../../assets/logo.png";
import Main from "./Main";

const Land = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: <FiHome className="text-lg" /> },
    { label: "Features", icon: <FiCompass className="text-lg" /> },
    { label: "  How it works", icon: <FiCompass className="text-lg" /> },
    { label: "About", icon: <FiInfo className="text-lg" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}
      <nav className="relative flex items-center justify-between  h-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md top-0 z-50 border-b border-gray-100">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={studySharpImage}
            className="h-18 w-auto sm:w-40 sm:h-20 object-contain "
            alt="StudySharp"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5 lg:gap-12 text-gray-700 font-medium">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="relative text-sm lg:text-base hover:text-indigo-600 cursor-pointer transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex cursor-pointer items-center gap-5">
          <Link
            to="/login"
            className="px-4 py-2  rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-medium"
          >
            Sign up
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
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 px-3 sm:px-3 pt-1 z-40">
          <div className="bg-black/50 backdrop-blur-3xl flex flex-col justify-center items-center rounded-2xl shadow-xl border border-gray-100 relative">
            {/* close icon */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/10 transition-colors"
            >
              <FiX className="text-lg text-gray-700" />
            </button>

            {/* Navigation */}
            <div className="flex flex-col gap-3 my-4 w-full px-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm sm:text-base text-gray-700 font-medium cursor-pointer hover:text-indigo-600  active:bg-indigo-100 transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Auth buttons for mobile */}
            <div className="flex gap-3 w-full px-4 pb-4 pt-1">
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 text-sm font-medium"
              >
                Sign up
              </Link>
              <Link
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
      <Main />
    </div>
  );
};

export default Land;
