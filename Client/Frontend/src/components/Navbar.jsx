import React, { useState } from "react";
import { NavbarData } from "../data/data";
import { useDispatch, useSelector } from "react-redux";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import studySharpImage from "../assets/logo.png";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar Component */}
      <aside
        className={`fixed hidden sm:flex top-0 right-0 z-50  h-screen w-[80%] max-w-72 shrink-0 flex-col justify-between overflow-y-auto bg-white p-0 shadow-2xl transition-transform duration-300 ease-out will-change-transform sm:sticky sm:top-0 sm:py-4 sm:left-0 sm:right-auto sm:w-64 sm:max-w-none sm:translate-x-0 sm:border-r sm:border-amber-500/30 sm:bg-[#d6dbda] sm:p-2 sm:shadow-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } sm:translate-x-0!`}
      >
        <div>
          {/* Header / Logo */}
          <div className="flex items-center  justify-between border-b border-gray-200 px-5  text-lg font-semibold tracking-wide text-slate-800 sm:mb-2 sm:border-none sm:px-3   sm:text-xl sm:font-bold">
            <img
              src={studySharpImage}
              className="rounded-full  h-20  object-cover
            "
              alt=""
            />
            {/* Close icon for mobile inside drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-slate-800 sm:hidden"
            >
              <HiX />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex w-full flex-col sm:gap-2 sm:px-0">
            {NavbarData.map((ele, idx) => {
              const Icon = ele.Icon;
              return (
                <Link
                  key={idx}
                  to={ele.path}
                  onClick={() => setIsOpen(false)}
                  className="group flex w-full cursor-pointer items-center justify-start gap-4 border-b border-gray-100 px-5 py-4 font-medium text-slate-800 transition-colors duration-150 active:bg-gray-100 sm:rounded-xl sm:border-none sm:px-4 sm:py-3 sm:text-white sm:hover:bg-[#76df66] sm:hover:shadow-md sm:active:scale-[0.98]"
                >
                  {Icon && (
                    <span className="text-slate-700 transition-colors sm:group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <span className="text-[15px] font-semibold sm:text-sm">
                    {ele.text}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile & Dark Mode Section */}
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
                <p className="truncate text-sm text-gray-500">@nickname</p>
              </div>
            </div>
          </div>

          <div className="flex h-fit w-full items-center justify-between rounded-full bg-gray-50 p-3 sm:bg-white sm:p-4 sm:shadow-sm">
            <span className="text-lg text-yellow-500">
              {darkMode ? <FaMoon /> : <IoSunny />}
            </span>

            <h2 className="text-sm font-medium text-gray-800">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </h2>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative h-6 w-12 shrink-0 rounded-full transition-all duration-300 ${
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
