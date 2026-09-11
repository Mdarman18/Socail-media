import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Send,
  Heart,
  MessageCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useCommentLogic } from "../../Hooks/useCommentLogic";

const Shimmer = () => (
  <motion.div
    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"
    animate={{ x: ["-100%", "100%"] }}
    transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
  />
);

const CommentSkeleton = () => (
  <div className="flex gap-3 py-3">
    <div className="relative h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
      <Shimmer />
    </div>
    <div className="flex-1 space-y-2">
      <div className="relative h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <Shimmer />
      </div>
      <div className="relative h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <Shimmer />
      </div>
      <div className="relative h-3 w-2/5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <Shimmer />
      </div>
    </div>
  </div>
);

const CommentItem = ({ item, isTop, liked, onLike, onReply, timeAgo }) => {
  const username = item?.author?.username || item?.name || "Anonymous";
  const initial = username.trim().charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 py-3 px-1 rounded-xl transition-colors ${
        isTop
          ? "bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-200 dark:ring-amber-500/30"
          : "hover:bg-gray-50 dark:hover:bg-white/5"
      }`}
    >
      {item?.author?.img ? (
        <img
          src={item?.author?.img}
          alt={username}
          className="h-9 w-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-sm font-semibold">
          {initial}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {username}
          </span>
          {isTop && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 rounded-full">
              Top
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {timeAgo(item?.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5 break-words whitespace-pre-wrap">
          {item?.text}
        </p>

        <div className="flex items-center gap-4 mt-1.5">
          <button
            type="button"
            onClick={() => onLike(item._id)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              liked ? "text-rose-600" : "text-gray-400 hover:text-rose-600"
            }`}
            aria-label="Like"
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            <span>{item?.upvote || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onReply(username)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-600 transition-colors"
            aria-label="Reply"
          >
            <MessageCircle size={16} />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Comment = ({ showComments, setShowComments, id }) => {
  const {
    comment,
    setComment,
    loading,
    comments,
    votedMap,
    textareaRef,
    topCommentId,
    handleComment,
    handleVote,
    autoGrow,
    timeAgo,
  } = useCommentLogic({ showComments, setShowComments, id });

  const [posting, setPosting] = useState(false);

  const close = () => setShowComments(false);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || posting) return;
    setPosting(true);
   
    try {
      await handleComment(e);
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment(e);
    }
  };

  // Like re-uses the existing upvote endpoint under the hood
  const handleLike = (commentId) => {
    handleVote(commentId, "up");
  };

  // No dedicated reply-to-comment endpoint exists yet, so Reply focuses the
  // composer with an @mention prefilled, and it posts through the normal
  // add-comment flow.
  const handleReplyClick = (username) => {
    const mention = `@${username} `;
    setComment((prev) => (prev.startsWith(mention) ? prev : mention));
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const len = textareaRef.current?.value.length || 0;
      textareaRef.current?.setSelectionRange(len, len);
    });
  };

  return (
    <AnimatePresence>
      {showComments && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Comments"
            className="relative w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[80dvh] overscroll-contain"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-2">
              <div className="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquare
                  size={18}
                  className="text-gray-500 dark:text-gray-400"
                />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Comments{" "}
                  <span className="text-gray-400 font-normal">
                    ({comments.length})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-gray-200 transition-colors"
                aria-label="Close comments"
              >
                <X size={18} />
              </button>
            </div>

            {/* Fetch progress indicator */}
            {loading && (
              <div className="relative h-0.5 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-indigo-500 rounded-full"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4">
              {loading ? (
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CommentSkeleton key={i} />
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-14 text-gray-400">
                  <MessageSquare size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    No comments yet
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Be the first to share your thoughts
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence initial={false}>
                    {comments.map((item) => (
                      <CommentItem
                        key={item._id}
                        item={item}
                        isTop={item._id === topCommentId}
                        liked={votedMap[item._id] === "up"}
                        onLike={handleLike}
                        onReply={handleReplyClick}
                        timeAgo={timeAgo}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={submitComment}
              className="border-t border-gray-100 dark:border-gray-800 p-3 flex items-end gap-2 bg-white dark:bg-gray-900"
            >
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={autoGrow}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                rows={1}
                disabled={posting}
                className="flex-1 resize-none max-h-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-base sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!comment.trim() || posting}
                className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-indigo-600 text-white disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700 hover:bg-indigo-700 transition-colors"
                aria-label="Post comment"
              >
                {posting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Comment;