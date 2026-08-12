import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import heroImage from "../../assets/logo.png";
import usedLogo from "../../assets/usedlogo.png";
import { images } from "../../data/data";

const Main = () => {
  return (
    <div className="relative overflow-hidden">
      {/* background gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl -z-10" />

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
            <button className="group px-6 py-3 cursor-pointer rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 relative flex justify-center md:justify-end w-full"
        >
          {/* glow behind image */}
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-indigo-300/30 rounded-full blur-3xl" />

          <img
            src={heroImage}
            alt="Learning illustration"
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md object-contain drop-shadow-xl"
          />

          {/* floating stat card */}
          <div className="hidden sm:flex absolute bottom-4 left-0 md:left-4 bg-white rounded-2xl shadow-lg px-4 py-3 items-center gap-3 border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">95% Success</p>
              <p className="text-xs text-gray-500">Rate this year</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Main;
