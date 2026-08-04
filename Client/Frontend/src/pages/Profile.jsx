import React from "react";
import {
  FaEdit,
  FaUser,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";

const Profile = () => {
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-slate-50 flex flex-col gap-4">
      {/* 1. Header Container */}
      <div className="sm:flex hidden flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Profile Info Section */}
        <div className="flex items-center gap-3.5">
          {/* Avatar Icon Container */}
          <div className="p-3 bg-amber-100 text-amber-700 rounded-full shrink-0">
            <FaUser className="text-xl sm:text-2xl" />
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your profile and track your progress
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="self-start sm:self-center w-fit shrink-0">
          <button className="flex items-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold text-sm sm:text-base px-6 sm:px-8 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            <FaEdit className="text-base sm:text-lg" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* 2. Main Profile Card Section */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-6 p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Profile Image */}
        <div className="shrink-0 relative group">
          {/* Profile Image */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt="Profile Avatar"
            className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-amber-100 shadow-md"
          />

          {/* Add / Edit Image Button */}
          <button
            type="button"
            aria-label="Upload profile picture"
            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 sm:p-1 cursor-pointer rounded-full border-2 border-white shadow-md transition-all duration-200 active:scale-90"
          >
            <FaPlus className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* User Details */}
        <div className="flex flex-1 flex-col text-center md:text-left gap-3 w-full min-w-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              John Doe
            </h1>
            <span className="text-amber-600 font-medium text-sm sm:text-base">
              @johndoe_dev
            </span>
          </div>

          {/* Roles / Titles (Badges) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs sm:text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
              Full Stack Developer
            </span>
            <span className="text-xs sm:text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
              AI Explorer
            </span>
          </div>

          {/* Bio / Description */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl break-words">
            Passionate software developer interested in web development and
            UI/UX design. Always learning new technologies and building cool
            projects.
          </p>

          {/* Meta Info Badges / Metadata */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
            {/* Location */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 text-xs sm:text-sm">
              <FaMapMarkerAlt className="text-amber-500 shrink-0" />
              <span>Jaipur, India</span>
            </div>

            {/* Education */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 text-xs sm:text-sm">
              <FaGraduationCap className="text-amber-500 shrink-0" />
              <span>B.Tech (CSE)</span>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 text-xs sm:text-sm">
              <FaCalendarAlt className="text-amber-500 shrink-0" />
              <span>Joined August 2024</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
