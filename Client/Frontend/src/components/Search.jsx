import React, { useState } from "react";
import { FaBell, FaSearch, FaPlus } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/CreateSlice";
import studySharpImage from "../assets/logo.png";
import { NavbarData } from "../data/data"; // Apna data path yahan check kar lena

const Search = () => {
  const [isOpen, setIsopen] = useState(false); // Create Post modal ke liye
  const [menu, setMenu] = useState(false); // Mobile menu toggle ke liye
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full sticky top-0 z-10">
      {/* 1. MOBILE HEADER */}
      <div className="flex  sm:hidden items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 w-full border-b border-slate-200/70 shadow-sm z-50 relative">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={studySharpImage}
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Mobile Actions (Plus button & Menu toggle) */}
        <div className="flex items-center gap-2.5">
          {/* Create Post Button for Mobile */}
          <button
            onClick={() => setIsopen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 active:scale-90 transition-transform duration-150"
          >
            <FaPlus className="text-xs" />
          </button>

          {/* Menu Hamburger / Close Button */}
          <button
            type="button"
            onClick={() => setMenu(!menu)}
            className="relative flex cursor-pointer items-center justify-center w-9 h-9 rounded-full text-slate-800 active:bg-slate-100 transition-colors focus:outline-none"
          >
            <HiMenu
              className={`absolute text-2xl transition-all duration-200 ${
                menu
                  ? "opacity-0 rotate-90 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <HiX
              className={`absolute text-2xl transition-all duration-200 ${
                menu
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-75"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. MOBILE DROPDOWN MENU */}
      <div
        className={`absolute top-full left-0 w-full bg-black/10 backdrop-blur-lg shadow-xl border-b border-slate-200 z-40 sm:hidden flex flex-col p-3 rounded-b-2xl origin-top transition-all duration-200 ease-out ${
          menu
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {NavbarData.map((ele, idx) => {
            const Icon = ele.Icon;
            return (
              <Link
                key={idx}
                to={ele.path}
                onClick={() => setMenu(false)}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-slate-700 active:bg-blue-50 active:text-blue-600 transition-colors"
              >
                {Icon && (
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-active:bg-blue-100 group-active:text-blue-600 transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                )}
                <span className="text-sm font-semibold">{ele.text}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Profile & Logout */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between px-1">
          <div className="flex items-center gap-3 min-w-0">
            <img
              onClick={() => {
                navigate("/profile");
              }}
              src={user?.img || "/default-avatar.png"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
            />
            <span className="text-sm font-semibold text-slate-800 truncate">
              {user?.username || "User"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-full bg-red-50 text-red-600 text-xs font-semibold active:bg-red-100 transition-colors shrink-0"
          >
            <span>Logout</span>
            <LuLogIn className="text-sm" />
          </button>
        </div>
      </div>

      <nav className="hidden sm:flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-4 w-full bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 flex-1 max-w-xs sm:max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <span className="text-slate-400 text-sm sm:text-base">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs sm:text-sm"
          />
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setIsopen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <FaPlus className="text-xs sm:text-sm" />
            <span>Create Post</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-gray-200">
            <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-300">
              <FaBell className="text-lg text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-300 font-medium text-sm sm:text-base"
            >
              <span>Logout</span>
              <LuLogIn className="text-lg" />
            </button>
          </div>
        </div>
      </nav>

      {/* Create Post Modal Component */}
      <CreatePost isOpen={isOpen} setIsopen={setIsopen} />
    </div>
  );
};

export default Search;
