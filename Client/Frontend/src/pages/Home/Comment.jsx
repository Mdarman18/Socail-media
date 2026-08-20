import { useEffect, useState } from "react";
import { postUrl } from "../../api/Axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  setuserComment,
  clearComment,
  addUpvote,
} from "../../store/CreateSlice";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Comment = ({ showComments, setShowComments, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Redux se comments
  const userComment = useSelector((state) => state.comment.usercomment);

  // Local state for comments to manage votes instantly
  const [comments, setComments] = useState([]);

  // Sync Redux comments to local state
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

  // ==============================
  // ADD COMMENT
  // ==============================
  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const res = await postUrl.post(`/addcomment/${id}`, {
        text: comment,
      });
      toast.success(res.data.message);
      // New comment Redux mein add
      dispatch(addComment(res.data.comment));

      // Input clear
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  // ==============================
  // VOTE (UPVOTE / DOWNVOTE) - Local State Managed
  // ==============================
  const handleVote = async (commentId, type) => {
    // 1. Optimistic Update in Local State
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
      dispatch(
        addUpvote({
          commentId,
          upVote: res.data.upVote,
        }),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      // Revert back local state if API fails
      setComments(userComment || []);
    }
  };

  if (!showComments) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:h-[650px] sm:rounded-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold text-slate-800">Comments</h2>

          <button
            onClick={() => setShowComments(false)}
            className="rounded-full cursor-pointer px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* COMMENTS */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-5 animate-pulse">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <h3 className="font-semibold text-slate-700">
                  No comments data
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Be the first to comment!
                </p>
              </div>
            </div>
          ) : (
            comments.map((item) => (
              <div key={item._id} className="flex gap-3">
                {/* Avatar */}
                <img
                  onClick={() => navigate(`userProfile/${item?.author?._id}`)}
                  src={item.author?.img || ""}
                  alt={item.author?.username || "User"}
                  className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover"
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {item.author?.username || "User"}
                      </span>
                      <p className="mt-1 text-sm text-slate-700">{item.text}</p>
                    </div>

                    {/* Up / Downvote Section */}
                    <div className="flex shrink-0 gap-1.5 items-center rounded-lg px-1.5 py-1">
                      <button
                        onClick={() => handleVote(item._id, "up")}
                        className="flex items-center gap-1 p-1 cursor-pointer text-slate-500 transition"
                        title="Upvote"
                      >
                        <FaArrowUp
                          className="hover:text-violet-600"
                          size={14}
                        />
                        <span className="text-xs font-medium">0</span>
                      </button>

                      <button
                        onClick={() => handleVote(item._id, "down")}
                        className="flex items-center gap-1 p-1 cursor-pointer text-slate-500 transition"
                        title="Downvote"
                      >
                        <FaArrowDown
                          className="hover:text-violet-600"
                          size={14}
                        />
                        <span className="text-xs font-medium">0</span>
                      </button>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "now"}
                    </span>
                    <button className="font-semibold hover:text-slate-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleComment} className="flex items-end gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
              Y
            </div>

            <div className="flex flex-1 items-end rounded-2xl border bg-slate-50 px-4 py-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                rows={1}
                className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm outline-none"
              />
              <span className="ml-2 text-xs text-slate-400">
                {comment.length}/500
              </span>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Comment;
