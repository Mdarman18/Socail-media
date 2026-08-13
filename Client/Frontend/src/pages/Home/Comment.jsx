import { useEffect, useState } from "react";
import { postUrl } from "../../api/Axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  setuserComment,
  clearComment,
} from "../../store/CreateSlice";

const Comment = ({ showComments, setShowComments, id }) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  // Redux se comments
  const userComment = useSelector((state) => state.comment.usercomment);

  // ==============================
  // GET COMMENTS
  // ==============================
  useEffect(() => {
    if (!showComments || !id) return;

    const getComments = async () => {
      try {
        const res = await postUrl.get(`/getcomment/${id}`);

        console.log("Comments API:", res.data);

        dispatch(setuserComment(res.data.comments || []));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load comments");
      }
    };

    getComments();

    // Component/post change hone par old comments remove
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

      console.log("Add comment:", res.data);

      toast.success(res.data.message);

      // New comment Redux mein add
      dispatch(addComment(res.data.comment));

      // Input clear
      setComment("");
    } catch (error) {
      console.log("Add comment error:", error);

      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  // ==============================
  // LIKE
  // ==============================
  const handleLike = (commentId) => {
    console.log("Like comment:", commentId);

    // Like API baad mein add kar sakte ho
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
            className="rounded-full px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* COMMENTS */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {userComment.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <h3 className="font-semibold text-slate-700">
                  No comments yet
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Be the first to comment!
                </p>
              </div>
            </div>
          ) : (
            userComment.map((item) => (
              <div key={item._id} className="flex gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
                  {item.author?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {item.author?.username || "User"}
                      </span>

                      <p className="mt-1 text-sm text-slate-700">{item.text}</p>
                    </div>

                    {/* Like */}
                    <button
                      onClick={() => handleLike(item._id)}
                      className="shrink-0 text-lg"
                    >
                      ♡
                    </button>
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
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
              Y
            </div>

            {/* Textarea */}
            <div className="flex flex-1 items-end rounded-2xl border bg-slate-50 px-4 py-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                rows={1}
                className="
                  max-h-24
                  min-h-6
                  flex-1
                  resize-none
                  bg-transparent
                  text-sm
                  outline-none
                "
              />

              <span className="ml-2 text-xs text-slate-400">
                {comment.length}/500
              </span>
            </div>

            {/* Post */}
            <button
              type="submit"
              disabled={!comment.trim()}
              className="
                rounded-xl
                bg-violet-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-violet-700
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
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
