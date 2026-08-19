import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { profileUrl } from "../api/Axios";
import { loginSuccess, setUserProfile } from "../store/CreateSlice";
import {
  MapPin,
  GraduationCap,
  Plus,
  MoreVertical,
  CheckCircle2,
  UserPlus,
  UserCheck,
  Globe,
  Mail,
  Calendar,
  Flame,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile.userProfile);
  const user = useSelector((state) => state.auth.user);
  const follow = useSelector((state) => state.profile.follow);
  const [activeTab, setActiveTab] = useState("Overview");

  // ======----- Handle follow and unfollow user -------===============
  const handleFollowUnfollow = async () => {
    try {
      const res = await profileUrl.post(`/follow/${id}`);
      toast.success(res.data.message);
      dispatch(setUserProfile(res.data.target));
      dispatch(loginSuccess(res.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const getUserKaProfile = async () => {
    try {
      const res = await profileUrl.get(`/get/${id}`);
      dispatch(setUserProfile(res.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getUserKaProfile();
  }, [id]);

  // Dynamic Tabs with Post count from API
  const tabs = [
    { name: "Overview" },
    { name: "Posts", count: userProfile?.post?.length || 0 },
    { name: "Notes", count: 0 },
    { name: "Streaks" },
    { name: "Achievements" },
  ];

  // Skeleton / Loading state Jab tak data load na ho
  if (!userProfile) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 text-center text-gray-500 font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-100 p-2 sm:p-4">
      {/* Banner Container */}
      <div className="relative rounded-2xl bg-linear-to-r from-purple-200 via-purple-300 to-indigo-200 p-4 pt-16 sm:pt-24">
        {/* Background Pattern */}
        <div className="absolute top-4 right-8 opacity-20 pointer-events-none hidden sm:block">
          <div className="grid grid-cols-6 gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          {/* Top Section: Avatar, Name, Buttons */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Image + User Info */}
            <div className="flex flex-col sm:flex-row items-start gap-5 -mt-16 sm:-mt-20">
              <div className="relative">
                <img
                  src={userProfile?.img || ""}
                  alt={userProfile?.username || "Profile"}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
                />
              </div>

              <div className="mt-2 sm:mt-16">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userProfile?.username || "Anonymous User"}
                  </h1>
                </div>
                {userProfile?.nickname && (
                  <p className="text-sm text-gray-500 font-medium">
                    @{userProfile.nickname}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {(() => {
                const isFollowing = userProfile?.followers?.some(
                  (followerId) =>
                    followerId?.toString() === user?._id?.toString(),
                );

                return (
                  <button
                    onClick={handleFollowUnfollow}
                    className={`flex items-center cursor-pointer gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-4xl transition-all shadow-sm ${
                      isFollowing
                        ? "bg-gray-500 hover:bg-gray-700"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                );
              })()}
              <button className="bg-white border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-4xl transition-all">
                Message
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Education & Info Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 pt-1 flex-wrap">
              {userProfile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{userProfile.location}</span>
                </div>
              )}

              {userProfile?.education && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span>{userProfile.education}</span>
                </div>
              )}
            </div>

            {/* Followers / Following Summary */}
            <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-gray-600">
              <div>
                <span className="text-gray-900 font-bold">
                  {userProfile?.followers?.length || 0}
                </span>{" "}
                Followers
              </div>
              <div>
                <span className="text-gray-900 font-bold">
                  {userProfile?.following?.length || 0}
                </span>{" "}
                Following
              </div>
            </div>
          </div>

          {/* Navbar Tabs */}
          <div className="mt-6 border-t border-gray-100 pt-2">
            <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`relative py-3 cursor-pointer text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{tab.name}</span>

                    {tab.count !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content Section */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4 items-start">
              {/* About Me Section */}
              <div className="lg:col-span-2 max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
                <h2 className="text-sm sm:text-sm md:text-xl font-bold text-slate-800 mb-3">
                  About Me
                </h2>
                {userProfile?.bio ? (
                  <p className="text-slate-600 text-xs sm:text-sm leading-tight mb-4">
                    "{userProfile.bio}"
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs sm:text-sm italic mb-4">
                    No bio added yet.
                  </p>
                )}

                <div className="flex flex-col gap-1.5">
                  {userProfile?.location && (
                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                      <MapPin className="text-indigo-500 shrink-0 w-4 h-4" />
                      <span className="truncate">{userProfile.location}</span>
                    </div>
                  )}

                  {userProfile?.website && (
                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                      <Globe className="text-indigo-500 shrink-0 w-4 h-4" />
                      <span className="truncate">{userProfile.website}</span>
                    </div>
                  )}

                  {userProfile?.email && (
                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                      <Mail className="text-indigo-500 shrink-0 w-4 h-4" />
                      <span className="truncate">{userProfile.email}</span>
                    </div>
                  )}

                  {userProfile?.createdAt && (
                    <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                      <Calendar className="text-indigo-500 shrink-0 w-4 h-4" />
                      <span>
                        Joined{" "}
                        {new Date(userProfile.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Streak Section */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
                    Learning Streak
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Current Streak */}
                    <div className="flex items-center gap-2">
                      <Flame className="text-orange-500 text-lg sm:text-xl w-5 h-5" />
                      <div className="flex items-baseline gap-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                          {userProfile?.currentStreak || 0}
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
                      <Trophy className="text-amber-500 text-lg sm:text-xl w-5 h-5" />
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                            {userProfile?.longestStreak || 0}
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
          )}

          {activeTab === "Posts" && (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm border border-purple-50">
              Posts content will appear here.
            </div>
          )}

          {activeTab === "Notes" && (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm border border-purple-50">
              Notes content will appear here.
            </div>
          )}

          {activeTab === "Streaks" && (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm border border-purple-50">
              Streaks content will appear here.
            </div>
          )}

          {activeTab === "Achievements" && (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm border border-purple-50">
              Achievements content will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
