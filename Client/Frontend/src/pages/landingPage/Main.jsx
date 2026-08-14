import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import heroImage from "../../assets/logo.png";
import usedLogo from "../../assets/usedlogo.png";
import { images } from "../../data/data";
import doubt from "../../assets/doubt.png";
import { useNavigate } from "react-router-dom";
// import {
//   FaBell,
//   FaFonticonsFi,
//   FaQuestion,
//   FaRegBookmark,
//   FaRegComment,
//   FaRegHeart,
// } from "react-icons/fa";
import {
  FaBell,
  FaRegHeart,
  FaRegComment,
  FaFonticonsFi,
  FaRegBookmark,
  FaQuestion,
  FaHome,
  FaSearch,
  FaUserCircle,
  FaPlus,
} from "react-icons/fa";
import studySharpImage from "../../assets/logo.png";
const Main = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-4 px-4 sm:px-8 lg:px-16 mt-6 md:py-16">
        {/* Left part - text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-5 max-w-xl"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs sm:text-sm font-medium text-indigo-600">
            <FiStar className="text-amber-400 fill-amber-400" />
            The Ultimate Learning Platform
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Learn Together,
            <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Grow
            </span>{" "}
            Together
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-gray-500 max-w-md">
            Connect with peers, share knowledge, and build your skills with
            StudySharp — a community-driven platform made for learners.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            <button
              onClick={() => navigate("/login")}
              className="group px-6 py-3 cursor-pointer rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Get Started
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 py-3 rounded-lg cursor-pointer border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Explore Features
            </button>
          </div>

          {/* Social proof row */}
          <div className="flex items-center gap-3 pt-3">
            <div className="flex -space-x-3">
              {images.map((image, i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`Learner ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Joined by{" "}
              <span className="font-semibold text-gray-800">2,000+</span>{" "}
              learners
            </p>
          </div>
        </motion.div>

        {/* Right part - illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:justify-end lg:py-0"
        >
          <div className="flex w-full max-w-6xl items-center justify-center gap-8 xl:gap-12">
            {/* ================================================= */}
            {/* MOBILE APP PREVIEW */}
            {/* ================================================= */}

            <div className="relative shrink-0">
              {/* Glow */}
              <div className="absolute -inset-6 -z-10 rounded-[4rem] bg-blue-500/10 blur-3xl" />

              {/* Phone */}
              <div
                className="
              relative
              h-162.5
              w-77.5
              overflow-hidden
              rounded-[3rem]
              border-[6px]
              border-gray-900
              bg-white
              shadow-[0_30px_70px_rgba(0,0,0,0.20)]
              sm:h-170
              sm:w-[320px]
            "
              >
                {/* Top Notch */}
                <div className="absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-gray-900" />

                {/* Screen */}
                <div className="flex h-full flex-col bg-[#f8fafc]">
                  {/* ================= HEADER ================= */}
                  <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-4 pb-3 pt-8 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <img
                        src={studySharpImage}
                        alt="StudySharp"
                        className="h-8 w-20 object-contain"
                      />

                      <div className="relative">
                        <FaBell className="text-[17px] text-gray-700" />

                        {/* Notification Dot */}
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                      </div>
                    </div>
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="flex-1 overflow-y-auto px-3 pb-5 pt-3 scrollbar-hide">
                    {/* User + Doubt Tag */}
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={images?.[0]}
                            alt="User"
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-50"
                          />

                          <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                              Arman
                            </h2>

                            <p className="text-[10px] text-gray-400">
                              Asked 2h ago
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-semibold text-blue-600">
                          #doubt
                        </span>
                      </div>
                    </div>

                    {/* ================= QUESTION CARD ================= */}
                    <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                      <h1 className="text-[13px] font-semibold leading-5 text-gray-900">
                        How to approach this programming problem?
                      </h1>

                      <p className="mt-1 text-[10px] leading-4 text-gray-400">
                        Can someone explain the best approach?
                      </p>

                      {/* Doubt Image */}
                      <div className="mt-3 flex h-55 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                        <img
                          src={doubt}
                          alt="Programming doubt"
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-red-500">
                            <FaRegHeart className="text-sm" />
                            <span className="text-[10px] font-medium">23</span>
                          </button>

                          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-blue-500">
                            <FaRegComment className="text-sm" />
                            <span className="text-[10px] font-medium">3</span>
                          </button>
                        </div>

                        <button className="text-gray-500 transition hover:text-blue-500">
                          <FaRegBookmark className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* ================= EXPERT ANSWER ================= */}
                    <div className="mt-3 rounded-2xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 p-4 text-white shadow-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15">
                              <FaQuestion className="text-[10px]" />
                            </span>

                            <span className="text-[10px] font-semibold text-blue-100">
                              StudySharp
                            </span>
                          </div>

                          <h2 className="text-[13px] font-bold">
                            Get unstuck. Learn faster. 🚀
                          </h2>
                        </div>

                        <span className="text-xl">💡</span>
                      </div>

                      <p className="mt-2 text-[10px] leading-4 text-blue-100">
                        Ask your doubt and get clear explanations from the
                        community.
                      </p>

                      <button className="mt-3 w-full rounded-xl bg-white py-2 text-[10px] font-bold text-blue-600 shadow-sm transition hover:bg-blue-50">
                        Ask Your Doubt
                      </button>
                    </div>

                    {/* ================= BOTTOM SPACE ================= */}
                    <div className="h-2" />
                  </div>

                  {/* ================= BOTTOM NAV ================= */}
                  <div className="border-t border-gray-100 bg-white px-4 py-3">
                    <div className="flex items-center justify-between text-gray-400">
                      <button className="text-blue-600">
                        <FaHome className="text-[15px]" />
                      </button>

                      <button className="transition hover:text-gray-700">
                        <FaSearch className="text-[15px]" />
                      </button>

                      <button
                        className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-600
                      text-white
                      shadow-md
                      shadow-blue-200
                    "
                      >
                        <FaPlus className="text-sm" />
                      </button>

                      <button className="transition hover:text-gray-700">
                        <FaRegBookmark className="text-[15px]" />
                      </button>

                      <button className="transition hover:text-gray-700">
                        <FaUserCircle className="text-[17px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT MARKETING PANEL */}
            {/* ================================================= */}

            <div className="hidden max-w-sm flex-1 lg:block">
              {/* Small label */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-blue-600">
                  Learn smarter
                </span>
              </div>

              {/* Feature Items */}
              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex p-4 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FaQuestion className="text-xs" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Ask anything
                    </h3>

                    <p className="text-xs text-slate-800">
                      Share your doubts with the community.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex p-4 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <FaRegComment className="text-sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Learn together
                    </h3>

                    <p className="text-xs text-slate-800">
                      Get explanations and different approaches.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex p-4 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <FaBell className="text-sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Stay updated
                    </h3>

                    <p className="text-xs text-slate-700">
                      Follow useful discussions and answers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
    </div>
  );
};

export default Main;
