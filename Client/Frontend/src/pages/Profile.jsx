import React, { useEffect, useState } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe,
  FaEnvelope,
  FaEdit,
  FaHeart,
  FaComment,
  FaFilePdf,
  FaExternalLinkAlt,
  FaFire,
  FaTrophy,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";

import { postUrl } from "../api/Axios";
import { deletePost, setPosts } from "../store/CreateSlice"; // setPosts ko import kiya
import toast from "react-hot-toast";
import EditProfile from "../components/EditProfile";

const TABS = ["Overview", "My Activity", "Achievements", "Saved Items"];

// Skeleton loader card
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">
    <div className="aspect-square w-full bg-slate-200" />
    <div className="p-3.5 flex flex-col gap-2.5">
      <div className="h-3 w-4/5 bg-slate-200 rounded" />
      <div className="h-3 w-3/5 bg-slate-200 rounded" />
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-3 w-8 bg-slate-200 rounded" />
          <div className="h-3 w-8 bg-slate-200 rounded" />
        </div>
        <div className="h-3 w-14 bg-slate-200 rounded" />
      </div>
    </div>
  </div>
);

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  // Redux se posts aur loading state access kar rahe hain
  const userPosts = useSelector((state) => state.post.userPosts);

  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loadingActivity, setLoadingActivity] = useState(false);
  const dispatch = useDispatch();

  const stats = [
    { label: "Posts", value: userPosts?.length || 0 }, // Redux posts length
    { label: "Followers", value: user?.followers?.length || 0 },
    { label: "Following", value: user?.following?.length || 0 },
  ];

  const getUserKaProfile = async () => {
    try {
      setLoadingActivity(true);
      const res = await postUrl.get("/getuserpost");

      // API se data aane ke baad Redux store mein posts save kar rahe hain
      dispatch(setPosts(res?.data?.posts || []));
    } catch (error) {
      dispatch(setPosts([]));
    } finally {
      setLoadingActivity(false);
    }
  };

  // ======------ Handle Delete Function --------==================
  const handleDelete = async (id) => {
    try {
      const res = await postUrl.delete(`/deletepost/${id}`);
      dispatch(deletePost(id));
      toast.success(res.data.message || "Post deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    getUserKaProfile();
  }, [user?.id, dispatch]);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-3 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Header Card */}
      <section className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-linear-to-br from-indigo-500 via-violet-500 to-blue-500">
        <div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="shrink-0 relative">
            <img
              src={user?.img || "/default-avatar.png"}
              alt="Profile Avatar"
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full object-cover ring-4 ring-white/40 shadow-md"
            />
            <button
              type="button"
              aria-label="Upload profile picture"
              className="absolute bottom-0 right-0 bg-white text-indigo-600 p-1.5 sm:p-2 rounded-full shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition-transform"
            >
              <FaCamera className="text-xs sm:text-sm" />
            </button>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white truncate max-w-62.5 sm:max-w-xs md:max-w-md">
                    {user?.username || "User Name"}
                  </h1>
                  <FaCheckCircle className="text-sky-200 text-sm sm:text-base md:text-xl shrink-0" />
                </div>
                <p className="text-indigo-100 text-xs sm:text-sm md:text-base font-medium mt-0.5">
                  {user?.nickname || "Member"}
                </p>
                {user?.education && (
                  <p className="text-indigo-100/90 italic text-xs sm:text-sm mt-1 sm:mt-2 max-w-md">
                    {user?.education}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEdit(true)}
                className="flex items-center cursor-pointer justify-center gap-2 bg-white/95 hover:bg-white text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm transition-colors self-center sm:self-start shrink-0"
              >
                <FaEdit className="text-indigo-500 text-xs sm:text-sm" />
                Edit Profile
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center sm:justify-start gap-5 sm:gap-8 md:gap-10 mt-4 sm:mt-6 flex-wrap">
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-indigo-100 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white px-3 sm:px-6 md:px-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 sm:gap-8 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2.5 sm:py-3 md:py-4 cursor-pointer text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
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
      {(() => {
        if (activeTab === "Overview") {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4">
              <div className="lg:col-span-2 max-w-lg bg-white rounded-2xl shadow-sm border justify-evenly border-slate-200 p-4 sm:p-4">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 mb-3">
                  About Me
                </h2>
                {user?.bio ? (
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    "{user.bio}"
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs sm:text-sm italic mb-4">
                    No bio added yet.
                  </p>
                )}

                <div className="flex flex-col gap-1.5">
                  {user?.location && (
                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                      <FaMapMarkerAlt className="text-indigo-500 shrink-0" />
                      <span className="truncate">{user.location}</span>
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
              {/* Learning Streak ..... */}
              <div className="rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
                    Learning Streak
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Current Streak */}
                    <div className="flex items-center gap-2">
                      <FaFire className="text-orange-500 text-lg sm:text-xl" />
                      <div className="flex items-baseline gap-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                          {user?.currentStreak}
                        </h1>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                          days
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200" />

                    {/* Longest Streak */}
                    <div className="flex items-center gap-2">
                      <FaTrophy className="text-amber-500 text-lg sm:text-xl" />
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                            {user?.longestStreak}
                          </h1>
                          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            days
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Longest</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (activeTab === "My Activity") {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800">
                  My Posts & Activity
                </h2>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  {userPosts?.length || 0} posts
                </span>
              </div>

              {loadingActivity ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : userPosts && userPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
                  {userPosts.map((ele) => {
                    const pdfFileName = ele?.pdf
                      ? ele.pdf.split("/").pop().replace(/^\d+-/, "")
                      : "";

                    return (
                      <div
                        key={ele?._id}
                        className="group h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {/* Media Section: Image or Small PDF Preview Card */}
                        {ele?.img ? (
                          <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                            <img
                              src={ele.img}
                              alt="Post Media"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : ele?.pdf ? (
                          <div className="w-full p-3.5 bg-linear-to-br from-indigo-50 to-rose-50 border-b border-indigo-100 flex items-center gap-3">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm text-rose-500 shrink-0 ring-1 ring-rose-100">
                              <FaFilePdf className="text-lg sm:text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate">
                                {pdfFileName || "Document.pdf"}
                              </p>
                              <span className="text-[10px] text-indigo-500 font-medium">
                                PDF Attached
                              </span>
                            </div>
                            <a
                              href={ele.pdf}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Open PDF"
                              className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition-colors shrink-0"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                            </a>
                          </div>
                        ) : null}

                        {/* Caption & Populated Likes / Comments Info */}
                        <div className="p-3.5 flex flex-col gap-2.5">
                          <p className="text-xs sm:text-[13px] text-slate-700 line-clamp-2 font-medium leading-relaxed">
                            {ele?.caption}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer">
                                <FaHeart className="text-rose-500 text-xl" />
                                {ele?.likes?.length || 0}
                              </span>
                              <span className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors cursor-pointer">
                                <FaComment className="text-gray-500 text-xl" />
                                {ele?.comment?.length || 0}
                              </span>
                              <span
                                onClick={() => handleDelete(ele._id)}
                                className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <MdDelete className="text-gray-500 hover:text-red-500 text-xl" />
                              </span>
                            </div>

                            {ele?.author?.username && (
                              <span className="text-[10px] text-slate-400 font-medium truncate max-w-20">
                                @{ele.author.username}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                  No activity found. Start sharing posts to see them here!
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 text-center text-slate-400 text-xs sm:text-sm">
              {activeTab} coming soon.
            </div>
          );
        }
      })()}

      <EditProfile edit={edit} setEdit={setEdit} />
    </div>
  );
};

export default Profile;
