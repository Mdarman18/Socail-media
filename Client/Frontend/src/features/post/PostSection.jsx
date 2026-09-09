import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiFileText,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";

// Components
import AcademicDashboard from "../../pages/Home/Dashboards";
import Comment from "./Comment";
import { Motivation } from "../../components/Motivation";
import Suggest from "../../components/Suggest";

// Redux Actions & APIs
import { likePost, setPosts } from "../../store/auth.slice";
import { dislikePostApi, getAllPosts, likePostApi } from "../../api/post.api";

// ===============================
// POST SKELETON (Loading State)
// ===============================
const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 flex-col md:flex-row">
      <div className="grow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-2 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="h-56 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/50" />
        <div className="space-y-2.5 pt-2">
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

// ===============================
// POST SECTION MAIN COMPONENT
// ===============================
export function PostSection() {
  const [activeFeedTab, setActiveFeedTab] = useState("all");

  // --- INLINED LOGIC START ---
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const user = useSelector((state) => state.auth.user);

  // Local States
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [copiedId, setCopiedId] = useState(null); // Tracks which code snippet was copied

  // Handle Code Copy
  const handleCopyCode = (code, postId) => {
    navigator.clipboard.writeText(code);
    setCopiedId(postId);
    toast.success("Code copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Handle Like / Dislike
  const handleLikeButton = async (postId) => {
    try {
      const currentPost = userPosts?.find((post) => post._id === postId);
      const isLiked = currentPost?.likes?.some(
        (likeId) => likeId.toString() === user?._id?.toString(),
      );

      let updatedPostData;
      if (!isLiked) {
        updatedPostData = await likePostApi(postId);
      } else {
        updatedPostData = await dislikePostApi(postId);
      }
      dispatch(likePost(updatedPostData));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Handle Comment
  const handleComment = (postId) => {
    setId(postId);
    setShowComments(true);
  };

  // Get All Posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const posts = await getAllPosts();
      dispatch(setPosts(posts));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Time formatting helper
  const getTimeAgo = (createdAt) => {
    const difference = new Date() - new Date(createdAt);
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `Just now`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // File formatting helper
  const getFormattedFileName = (pdfPath) => {
    return pdfPath
      ?.split("/")
      .pop()
      ?.replace(/^\d+-/, "")
      ?.replace(".pdf", "")
      ?.replace(/_/g, " ");
  };

  // Check if liked helper
  const checkIfLiked = (postLikes) => {
    return postLikes?.some(
      (likeId) => likeId.toString() === user?._id?.toString(),
    );
  };
  // --- INLINED LOGIC END ---

  const feedTabs = [
    { id: "all", label: "All Feed" },
    { id: "communities", label: "My Communities" },
    { id: "study_updates", label: "Study Updates" },
    { id: "doubts_preview", label: "Academic Doubts" },
  ];

  // Dynamic user profile object passed to Academic Dashboard
  const dashboardUser = {
    name: user?.username || "Alex Johnson",
    avatar:
      user?.img ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    stats: {
      streak: 5,
      longestStreak: 12,
      todayGoalHours: 4,
      todayCompletedMinutes: 180,
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-8">
      {/* 1. DASHBOARD ON TOP (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        <AcademicDashboard
          user={dashboardUser}
          onStartSession={() => alert("Start session clicked")}
          onAskDoubt={() => alert("Ask doubt clicked")}
        />
      </motion.div>

      {/* 2. MAIN CONTENT SPLIT (Feed + Sidebar) */}
      <div className="flex w-full gap-8 justify-between items-start">
        {/* LEFT COLUMN: FEED */}
        <div className="flex flex-1 flex-col gap-6 w-full max-w-[700px]">
          {/* Feed Tabs Container */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {feedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeedTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeFeedTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                      : "bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Feed List */}
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            ) : userPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20"
              >
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    No posts available
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm">
                    Your feed is looking a little empty. Be the first one to
                    share a study update or ask a doubt!
                  </p>
                </div>
              </motion.div>
            ) : (
              userPosts.map((ele, index) => {
                const fileName = getFormattedFileName(ele?.pdf);
                const isLiked = checkIfLiked(ele?.likes);

                return (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={ele._id}
                    className="group bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 flex gap-4 flex-col hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 dark:hover:border-indigo-900/30"
                  >
                    {/* POST HEADER */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={ele.author?.img || "/default-avatar.png"}
                          alt={ele.author?.username || "author"}
                          onClick={() =>
                            navigate(`/userProfile/${ele?.author?._id}`)
                          }
                          className="w-11 h-11 rounded-full border-2 border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-all object-cover cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition-colors cursor-pointer">
                            {ele?.author?.username || "User"}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {getTimeAgo(ele?.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors cursor-pointer">
                        <FiMoreHorizontal className="text-lg" />
                      </button>
                    </div>

                    {/* POST CONTENT AREA */}
                    <div className="flex flex-col gap-3 mt-2">
                      {/* SUBJECT BADGE */}
                      {ele?.subject && (
                        <div className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide rounded-full w-fit">
                          {ele?.subject}
                        </div>
                      )}

                      {/* CAPTION / TITLE */}
                      {(ele?.captions || ele?.title || ele?.questionTitle) && (
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
                          {ele?.caption || ele?.title || ele?.questionTitle}
                        </h2>
                      )}

                      {/* DESCRIPTION / EXPLANATION */}
                      {(ele?.description || ele?.questionExplanation) && (
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {ele?.description || ele?.questionExplanation}
                        </p>
                      )}

                      {/* CODE SNIPPET WITH COPY BUTTON */}
                      {ele?.codeDetails && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-inner">
                          <div className="bg-gray-200/60 dark:bg-gray-900 px-4 py-2.5 text-xs font-bold text-gray-500 tracking-wider uppercase flex justify-between items-center">
                            <span>{ele?.codeType || "Code Snippet"}</span>
                            <button
                              onClick={() =>
                                handleCopyCode(ele.codeDetails, ele._id)
                              }
                              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors normal-case font-medium cursor-pointer bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-xs"
                            >
                              {copiedId === ele._id ? (
                                <>
                                  <FiCheck className="text-emerald-500" />
                                  <span className="text-emerald-500 text-xs">
                                    Copied!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiCopy />
                                  <span className="text-xs">Copy code</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-5 text-sm overflow-x-auto bg-slate-800 text-white dark:text-gray-200 font-mono leading-relaxed">
                            <code>{ele?.codeDetails}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* MEDIA SECTION (Image or PDF) */}
                    {(ele?.img || ele?.pdf) && (
                      <div className="mt-3">
                        {ele?.img ? (
                          <div className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                            <img
                              src={ele?.img}
                              alt="Post Media"
                              className="max-h-[28rem] w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                          </div>
                        ) : ele?.pdf ? (
                          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-fit pr-10 cursor-pointer group/pdf">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0 group-hover/pdf:scale-110 transition-transform">
                              <FiFileText className="text-2xl" />
                            </div>
                            <a
                              href={ele?.pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col"
                            >
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/pdf:text-indigo-600 transition-colors line-clamp-1">
                                {fileName || "Document.pdf"}
                              </span>
                              <span className="text-xs font-medium text-gray-500 mt-0.5">
                                View PDF Document
                              </span>
                            </a>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ACTION BAR & FOOTER */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800 mt-4">
                      <div className="flex items-center gap-2">
                        {/* LIKE */}
                        <motion.button
                          onClick={() => handleLikeButton(ele._id)}
                          whileTap={{ scale: 0.85 }}
                          className="flex items-center gap-2 group px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                          <FiHeart
                            className={`h-5 w-5 transition-all duration-300 ${
                              isLiked
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-gray-500 group-hover:text-red-500 dark:text-gray-400"
                            }`}
                            strokeWidth={isLiked ? 0 : 2}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              isLiked
                                ? "text-red-500"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {ele?.likes?.length || 0}
                          </span>
                        </motion.button>

                        {/* COMMENT */}
                        <button
                          onClick={() => handleComment(ele._id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <FiMessageCircle className="h-5 w-5" />
                          <span className="text-sm font-semibold">
                            {ele?.comment?.length || 0}
                          </span>
                        </button>

                        {/* SEND */}
                        <button className="p-2 ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer">
                          <FiSend className="h-5 w-5" />
                        </button>
                      </div>

                      {/* BOOKMARK */}
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer">
                        <FiBookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="sticky top-6 h-fit hidden lg:flex flex-col gap-6 w-80 shrink-0">
          <Comment
            showComments={showComments}
            setShowComments={setShowComments}
            id={id}
          />
          <Motivation />
          <Suggest />
        </div>
      </div>
    </div>
  );
}
