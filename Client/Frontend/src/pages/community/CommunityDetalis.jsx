import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Users, Shield, Plus } from "lucide-react";

import {
  getCommunityDetailsService,
  joinCommunityService,
} from "../../Service/community";

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  // Function to fetch community details & check membership
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getCommunityDetailsService(id);
      const communityData = data.community;
      setCommunity(communityData);

      // Membership verification check with localstorage/context if available
      const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
      const userJoined = communityData?.members?.some(
        (member) => member._id === currentUserId || member === currentUserId,
      );
      setIsMember(userJoined || false);
    } catch (error) {
      toast.error(
        error.message || "Community details load karne mein error aayi!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  // Handle Join / Leave action logic
  const handleJoin = async () => {
    try {
      setJoining(true);
      const res = await joinCommunityService(id);

      toast.success(
        res.message ||
          (isMember ? "Community chhor di gayi!" : "Community join ho gayi!"),
      );

      // Refresh details to update members list and counts instantly
      await fetchDetails();
    } catch (error) {
      toast.error(error.message || "Error processing request");
    } finally {
      setJoining(false);
    }
  };

  // Loading state view
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Not found fallback view
  if (!community) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="font-bold text-xl text-gray-900 dark:text-slate-100">
          Community Not Found
        </h3>
        <p className="text-xs text-gray-500">
          This hub may have been removed or does not exist.
        </p>
        <button
          onClick={() => navigate("/communities")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Back to Communities
        </button>
      </div>
    );
  }

  const communityPosts = community.posts || [];
  const communityDoubts = community.doubts || [];
  const communityResources = community.resources || [];
  const communityStudents = community.members || [];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate("/communities")}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Communities</span>
      </button>

      {/* Community Banner & Header */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={community.banner || community.img}
            alt={community.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center font-bold text-2xl text-indigo-600 border-4 border-white dark:border-slate-800">
                {community.iconSvg || "⚡"}
              </div>
              <div className="pb-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 mb-1">
                  {community.category || "General"}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {community.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleJoin}
                disabled={joining}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isMember
                    ? "border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {joining
                  ? "Processing..."
                  : isMember
                    ? "Joined ✓"
                    : "Join Community"}
              </button>
              <button
                onClick={() => toast("Post feature coming soon!")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
                Post in Hub
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-4">
            {community.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <b>{community.members ? community.members.length : 0}</b> members
            </span>
            <span>·</span>
            <span>
              <b>{community.postsCount || communityPosts.length}</b> posts
            </span>
            <span>·</span>
            <span>
              <b>{communityDoubts.length}</b> questions
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 gap-6">
        {[
          { id: "feed", label: "Feed & Posts", count: communityPosts.length },
          {
            id: "doubts",
            label: "Doubts & Q&A",
            count: communityDoubts.length,
          },
          {
            id: "resources",
            label: "Resources",
            count: communityResources.length,
          },
          { id: "members", label: "Members", count: communityStudents.length },
          { id: "about", label: "About & Rules" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400"
            }`}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab Content: Feed */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          {communityPosts.length > 0 ? (
            communityPosts.map((post) => (
              <div
                key={post.id || post._id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                  {post.content || post.title}
                </p>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700">
              <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 mb-1">
                No posts in this community yet
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Be the first to share an update or question!
              </p>
              <button
                onClick={() => toast("Post feature coming soon!")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Doubts */}
      {activeTab === "doubts" && (
        <div className="space-y-4">
          {communityDoubts.length > 0 ? (
            communityDoubts.map((doubt) => (
              <div
                key={doubt.id || doubt._id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                  {doubt.title}
                </p>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700">
              <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 mb-1">
                No active questions in this hub
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Stuck on a topic? Ask the members of this hub!
              </p>
              <button
                onClick={() => toast("Doubt feature coming soon!")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
              >
                Ask a Doubt
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Resources */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communityResources.length > 0 ? (
            communityResources.map((res) => (
              <div
                key={res.id || res._id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                  {res.title}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700">
              <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 mb-1">
                No uploaded resources yet
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Share your handwritten notes, cheat sheets, or slides.
              </p>
              <button
                onClick={() => toast("Resource upload coming soon!")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
              >
                Upload Resource
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Members */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityStudents.length > 0 ? (
            communityStudents.map((student) => (
              <div
                key={student.id || student._id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {student.name ? student.name.charAt(0) : "U"}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                    {student.name || "User"}
                  </h5>
                  <p className="text-xs text-gray-500">{student.email || ""}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500">No members found.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: About & Rules */}
      {activeTab === "about" && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              About this Community
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {community.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Community Guidelines & Rules
            </h3>
            <ul className="space-y-2.5">
              {community.rules && community.rules.length > 0 ? (
                community.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                  No specific rules provided.
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Community Moderators
            </h3>
            <div className="flex items-center gap-2">
              {community.moderators && community.moderators.length > 0 ? (
                community.moderators.map((mod, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-200"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{typeof mod === "string" ? mod : mod.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">
                  No moderators listed.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
