import React, { useState } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaGlobe,
  FaEnvelope,
  FaEdit,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import EditProfile from "../components/EditProfile";

const TABS = ["Overview", "My Activity", "Achievements", "Saved Items"];

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.profile.userProfile);

  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const stats = [
    { label: "Posts", value: user?.post?.length || 0 },
    { label: "Followers", value: user?.followers?.length || 0 },
    { label: "Following", value: user?.following?.length || 0 },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-3 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Header Card */}
      <section className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
        <div className="p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          {/* Avatar */}
          <div className="shrink-0 relative">
            <img
              src={user?.img}
              alt="Profile Avatar"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-white/40 shadow-md"
            />
            <button
              type="button"
              aria-label="Upload profile picture"
              className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition-transform"
            >
              <FaCamera className="text-xs sm:text-sm" />
            </button>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-3xl font-bold text-white truncate">
                    {user?.username}
                  </h1>
                  <FaCheckCircle className="text-sky-200 text-base sm:text-xl shrink-0" />
                </div>
                <p className="text-indigo-100 text-sm sm:text-base font-medium mt-0.5">
                  {user?.nickname || "Member"}
                </p>
                {user?.bio && (
                  <p className="text-indigo-100/90 italic text-xs sm:text-sm mt-2 max-w-md">
                    {user?.education}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEdit(true)}
                className="flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors self-center sm:self-start shrink-0"
              >
                <FaEdit className="text-indigo-500" />
                Edit Profile
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-10 mt-5 sm:mt-6 flex-wrap">
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-[11px] sm:text-sm text-indigo-100 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white px-3 sm:px-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 sm:gap-8 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 sm:py-4 cursor-pointer text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* About Me */}
          <div className="lg:col-span-2 max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-3">
              About Me
            </h2>
            {user?.bio ? (
              <p className="text-slate-600 text-sm leading-tight mb-4">
                "{user.bio}"
              </p>
            ) : (
              <p className="text-slate-400 text-sm italic mb-4">
                No bio added yet.
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              {user?.location && (
                <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                  <FaMapMarkerAlt className="text-indigo-500 shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}

              {user?.website && (
                <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                  <FaGlobe className="text-indigo-500 shrink-0" />
                  <span className="truncate">{user.website}</span>
                </div>
              )}
              {user?.email && (
                <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                  <FaEnvelope className="text-indigo-500 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                  <FaCalendarAlt className="text-indigo-500 shrink-0" />
                  <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Overview" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center text-slate-400 text-sm">
          {activeTab} coming soon.
        </div>
      )}

      <EditProfile edit={edit} setEdit={setEdit} />
    </div>
  );
};

export default Profile;
