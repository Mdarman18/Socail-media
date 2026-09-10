import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postUrl } from "../../api/Axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  setuserComment,
  clearComment,
  addUpvote,
} from "../../store/auth.slice";
import {
  X,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircleQuestion,
  Send,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const timeAgo = (date) => {
  if (!date) return "now";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const Comment = ({ showComments, setShowComments, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [votedMap, setVotedMap] = useState({}); // { [commentId]: 'up' | 'down' }
  const textareaRef = useRef(null);

  const userComment = useSelector((state) => state.comment.usercomment);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(userComment || []);
  }, [userComment]);

  // ==============================
  // GET COMMENTS
  // ==============================
  useEffect(() => {
    if (!showComments || !id) return;

    const getComments = async () => {
      setLoading(true);
      try {
        const res = await postUrl.get(`/getcomment/${id}`);
        dispatch(setuserComment(res.data.comments || []));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    getComments();
    return () => {
      dispatch(clearComment());
    };
  }, [showComments, id, dispatch]);

  // Lock background scroll while the sheet/modal is open
  useEffect(() => {
    if (showComments) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showComments]);

  // ==============================
  // ADD COMMENT
  // ==============================
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await postUrl.post(`/addcomment/${id}`, { text: comment });
      toast.success(res.data.message);
      dispatch(addComment(res.data.comment));
      setComment("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  // ==============================
  // VOTE (UPVOTE / DOWNVOTE) - Local State Managed
  // ==============================
  const handleVote = async (commentId, type) => {
    const alreadyVoted = votedMap[commentId];
    if (alreadyVoted === type) return; // avoid double-firing the same vote

    setVotedMap((prev) => ({ ...prev, [commentId]: type }));

    setComments((prevComments) =>
      prevComments.map((item) => {
        if (item._id === commentId) {
          const currentUpvotes = item.upvote || 0;
          return {
            ...item,
            upvote:
              type === "up"
                ? currentUpvotes + 1
                : Math.max(0, currentUpvotes - 1),
          };
        }
        return item;
      }),
    );

    try {
      const res = await postUrl.post(`/upvote/${commentId}`);
      toast.success(res.data.message);
      dispatch(addUpvote({ commentId, upVote: res.data.upVote }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setComments(userComment || []);
      setVotedMap((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    }
  };

  // Highlight the most-upvoted comment as "Most Helpful" — a small nod to the
  // doubt-solving nature of this thread, StackOverflow-style.
  const topCommentId = useMemo(() => {
    if (!comments.length) return null;
    const top = [...comments].sort(
      (a, b) => (b.upvote || 0) - (a.upvote || 0),
    )[0];
    return top?.upvote > 0 ? top._id : null;
  }, [comments]);

  const autoGrow = (e) => {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
  };

  return (
    <AnimatePresence>
      {showComments && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowComments(false)}
        >
          <motion.div
            className="flex h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/5 sm:h-160 sm:rounded-3xl"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-2.5 sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-slate-200" />
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                  <MessageCircleQuestion
                    size={18}
                    className="text-violet-600"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight text-slate-800">
                    Discussion
                  </h2>
                  <p className="text-xs text-slate-400">
                    {comments.length > 0
                      ? `${comments.length} ${comments.length === 1 ? "reply" : "replies"}`
                      : "Help solve this doubt"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowComments(false)}
                aria-label="Close comments"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X size={20} strokeWidth={2.25} />
              </button>
            </div>

            {/* COMMENTS */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              {loading ? (
                <div className="animate-pulse space-y-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-28 rounded bg-slate-100" />
                        <div className="h-3.5 w-full rounded bg-slate-100" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                    <Sparkles size={28} className="text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-slate-700">
                    No replies yet
                  </h3>
                  <p className="mt-1 max-w-55 text-sm text-slate-400">
                    Be the first to help solve this doubt.
                  </p>
                </div>
              ) : (
                comments.map((item) => {
                  const voted = votedMap[item._id];
                  const isTop = item._id === topCommentId;
                  return (
                    <div key={item._id} className="flex gap-3">
                      <img
                        onClick={() =>
                          navigate(`userProfile/${item?.author?._id}`)
                        }
                        src={item.author?.img || ""}
                        alt={item.author?.username || "User"}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover ring-2 ring-transparent transition hover:ring-violet-200"
                      />

                      <div className="min-w-0 flex-1">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 ${
                            isTop
                              ? "bg-violet-50 ring-1 ring-violet-100"
                              : "bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-800">
                                {item.author?.username || "User"}
                              </span>
                              {isTop && (
                                <span className="flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                                  <Sparkles size={10} /> Most helpful
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-700">
                            {item.text}
                          </p>
                        </div>

                        {/* Meta + vote row */}
                        <div className="mt-1.5 flex items-center gap-1 px-1">
                          <span className="text-xs text-slate-400">
                            {timeAgo(item.createdAt)}
                          </span>
                          <span className="text-slate-300">·</span>
                          <button className="text-xs font-semibold text-slate-500 hover:text-violet-600">
                            Reply
                          </button>

                          <div className="ml-auto flex items-center gap-0.5 rounded-full bg-slate-50 p-0.5">
                            <button
                              onClick={() => handleVote(item._id, "up")}
                              title="Upvote"
                              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                                voted === "up"
                                  ? "bg-violet-600 text-white"
                                  : "text-slate-500 hover:bg-slate-100"
                              }`}
                            >
                              <ArrowBigUp
                                size={14}
                                fill={voted === "up" ? "currentColor" : "none"}
                              />
                              {item.upvote || 0}
                            </button>

                            <button
                              onClick={() => handleVote(item._id, "down")}
                              title="Downvote"
                              className={`flex items-center rounded-full p-1.5 transition cursor-pointer ${
                                voted === "down"
                                  ? "bg-slate-700 text-white"
                                  : "text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              <ArrowBigDown
                                size={14}
                                fill={
                                  voted === "down" ? "currentColor" : "none"
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* INPUT */}
            <div className="border-t border-slate-100 bg-white p-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:p-4">
              <form onSubmit={handleComment} className="flex items-end gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-violet-700 text-sm font-semibold text-white">
                  Y
                </div>

                <div className="flex flex-1 items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100">
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={autoGrow}
                    placeholder="Add your answer..."
                    maxLength={500}
                    rows={1}
                    className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  <span className="shrink-0 pb-0.5 text-[11px] text-slate-400">
                    {comment.length}/500
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Comment;
