import React from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiFileText,
  FiCopy,
  FiCheck,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

import AcademicDashboard from "../../pages/Home/Dashboards";
import Comment from "./Comment";
import Suggest from "../../components/Suggest";
import { usePostSectionLogic } from "../../Hooks/usePostSectionLogic";

// ===============================
// POST SKELETON (Loading State)
// ===============================
const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 flex-col">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-3 w-24 sm:w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-2 w-14 sm:w-16 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
    </div>
    <div className="h-40 sm:h-56 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/50" />
    <div className="space-y-2.5 pt-2">
      <div className="h-3 w-4/5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="h-3 w-2/5 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
    </div>
  </div>
);

// ===============================
// STATUS BADGE (doubt / solved)
// ===============================
const StatusBadge = ({ status, solved }) => {
  if (status !== "doubt") return null;

  if (solved) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide rounded-full w-fit">
        <FiCheckCircle className="text-sm" />
        Solved
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide rounded-full w-fit animate-pulse">
      <FiHelpCircle className="text-sm" />
      Doubt · Awaiting answer
    </div>
  );
};

// ===============================
// TAGS
// ===============================
const TagList = ({ tags }) => {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

// ===============================
// POST SECTION MAIN COMPONENT
// ===============================
export function PostSection() {
  const {
    activeFeedTab,
    setActiveFeedTab,
    navigate,
    userPosts,
    loading,
    id,
    showComments,
    setShowComments,
    copiedId,
    handleCopyCode,
    handleLikeButton,
    handleComment,
    getTimeAgo,
    getFormattedFileName,
    checkIfLiked,
    feedTabs,
    dashboardUser,
  } = usePostSectionLogic();

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col gap-6 sm:gap-8">
      {/* 1. DASHBOARD */}
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

      {/* 2. MAIN CONTENT: stacks on mobile/tablet, splits on desktop */}
      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 justify-between items-start">
        {/* LEFT COLUMN: FEED */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6 w-full lg:max-w-175">
          {/* Feed Tabs — horizontally scrollable on all screen sizes */}
          <div className="sm:flex hidden items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex  items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {feedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeedTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
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
          <div className="space-y-5 sm:space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            ) : userPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-h-64 sm:min-h-75 items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20"
              >
                <div className="text-center p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
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
                const title = ele?.questionTitle || ele?.title || ele?.caption;
                const body = ele?.questionExplanation || ele?.description;

                return (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    key={ele._id}
                    className="group bg-white dark:bg-gray-900 rounded-2xl sm:rounded-4xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 flex gap-4 flex-col hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:border-indigo-100 dark:hover:border-indigo-900/30"
                  >
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ele.author?.img || "/default-avatar.png"}
                          alt={ele.author?.username || "author"}
                          onClick={() =>
                            navigate(`/userProfile/${ele?.author?._id}`)
                          }
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-all object-cover cursor-pointer shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition-colors cursor-pointer truncate">
                            {ele?.author?.username || "User"}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {getTimeAgo(ele?.createdAt)}
                            {ele?.updatedAt &&
                              ele?.updatedAt !== ele?.createdAt && (
                                <span className="hidden sm:inline">
                                  {" "}
                                  · edited
                                </span>
                              )}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors cursor-pointer shrink-0">
                        <FiMoreHorizontal className="text-lg" />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col gap-2.5 sm:gap-3 mt-1 sm:mt-2">
                      {/* BADGES ROW */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ele?.subject && (
                          <div className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide rounded-full w-fit">
                            {ele.subject}
                          </div>
                        )}
                        <StatusBadge
                          status={ele?.status}
                          solved={ele?.solved}
                        />
                      </div>

                      {title && (
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight wrap-break-word">
                          {title}
                        </h2>
                      )}

                      {body && (
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed wrap-break-word">
                          {body}
                        </p>
                      )}

                      <TagList tags={ele?.tags} />

                      {/* CODE SNIPPET */}
                      {ele?.codeDetails && (
                        <div className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-inner">
                          <div className="bg-gray-200/60 dark:bg-gray-900 px-3 sm:px-4 py-2.5 text-xs font-bold text-gray-500 tracking-wider uppercase flex justify-between items-center gap-2">
                            <span className="truncate">
                              {ele?.codeType || "Code Snippet"}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyCode(ele.codeDetails, ele._id)
                              }
                              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors normal-case font-medium cursor-pointer bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-xs shrink-0"
                            >
                              {copiedId === ele._id ? (
                                <>
                                  <FiCheck className="text-emerald-500" />
                                  <span className="text-emerald-500 text-xs hidden xs:inline">
                                    Copied!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiCopy />
                                  <span className="text-xs hidden xs:inline">
                                    Copy
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 sm:p-5 text-xs sm:text-sm overflow-x-auto bg-slate-800 text-white dark:text-gray-200 font-mono leading-relaxed">
                            <code>{ele?.codeDetails}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* MEDIA */}
                    {(ele?.img || ele?.pdf) && (
                      <div className="mt-1 sm:mt-3">
                        {ele?.img ? (
                          <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                            <img
                              src={ele?.img}
                              alt="Post Media"
                              className="max-h-64 sm:max-h-112 w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                          </div>
                        ) : ele?.pdf ? (
                          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full sm:w-fit sm:pr-10 cursor-pointer group/pdf">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0 group-hover/pdf:scale-110 transition-transform">
                              <FiFileText className="text-xl sm:text-2xl" />
                            </div>
                            <a
                              href={ele?.pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col min-w-0"
                            >
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/pdf:text-indigo-600 transition-colors truncate">
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

                    {/* ACTION BAR */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 sm:pt-5 dark:border-gray-800 mt-3 sm:mt-4">
                      <div className="flex items-center gap-0.5 sm:gap-2">
                        <motion.button
                          onClick={() => handleLikeButton(ele._id)}
                          whileTap={{ scale: 0.85 }}
                          className="flex items-center gap-1.5 sm:gap-2 group px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
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

                        <button
                          onClick={() => handleComment(ele._id)}
                          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <FiMessageCircle className="h-5 w-5" />
                          <span className="text-sm font-semibold">
                            {ele?.comment?.length || 0}
                          </span>
                        </button>

                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer">
                          <FiSend className="h-5 w-5" />
                        </button>
                      </div>

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

        {/* RIGHT COLUMN: sidebar — hidden on mobile, shown as stacked block on tablet+, sticky on desktop */}
        <div className="flex lg:sticky lg:top-6 lg:h-fit flex-col gap-6 w-full lg:w-80 shrink-0">
          <Suggest />
        </div>
      </div>

      <Comment
        showComments={showComments}
        setShowComments={setShowComments}
        id={id}
      />
    </div>
  );
}
