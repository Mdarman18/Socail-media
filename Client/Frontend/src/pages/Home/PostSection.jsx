import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiFileText,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { postUrl } from "../../api/Axios";
import { setPosts } from "../../store/CreateSlice";

// Single Post Card Component (Fixes state bug for comments)
const PostCard = ({ ele }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const pdfUrl = ele.pdf?.startsWith("data:")
    ? ele.pdf
    : `data:application/pdf;base64,${ele.pdf}`;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:ring-white/5">
      {/* Top Header: Author Info */}
      <div className="p-3 sm:p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={ele.author?.img || "/default-avatar.png"}
              alt={ele.author?.username || "author"}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700 sm:h-10 sm:w-10"
            />
            <span className="truncate text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {ele?.author?.username || "User"}
            </span>
          </div>
          <button className="rounded-full p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <FiMoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Caption / Title Section */}
      {(ele?.caption || ele?.title) && (
        <div className="px-3 pb-3 sm:px-4">
          <h1 className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {ele?.caption || ele?.title}
          </h1>
        </div>
      )}

      {/* Media Section */}
      <div className="overflow-hidden bg-gray-50 dark:bg-gray-800/40">
        {ele?.img ? (
          <img
            src={ele?.img}
            alt="Post"
            className="max-h-120 w-full object-cover"
          />
        ) : ele?.pdf ? (
          <div className="p-3 sm:p-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-750"
            >
              <FiFileText className="h-5 w-5 shrink-0 text-red-500" />
              <span className="truncate">View Attached PDF</span>
            </a>
          </div>
        ) : null}
      </div>

      {/* Action Buttons & Counter */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex items-center gap-4 sm:gap-5">
            <motion.button
              whileTap={{ scale: 1.25 }}
              className="p-1 text-gray-700 transition-colors duration-200 hover:text-red-500 dark:text-gray-300"
            >
              <FiHeart className="h-6 w-6" />
            </motion.button>
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="p-1 text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300"
            >
              <FiMessageCircle className="h-6 w-6" />
            </button>
            <button className="p-1 text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300">
              <FiSend className="h-5 w-5" />
            </button>
          </div>
          <button className="p-1 text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300">
            <FiBookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Likes & Comments Counter */}
        <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span>{ele?.like?.length || 0} likes</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>{ele?.comment?.length || 0} comments</span>
        </div>

        {/* Dynamic Comment Section Box (If toggled) */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Feed Component
export const PostSection = () => {
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await postUrl.get("/allpost");
        dispatch(setPosts(res.data.posts));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPost();
  }, [dispatch]);

  return (
    <section className="flex w-full gap-4 sm:max-w-3xl">
      <div className="flex flex-1 flex-col gap-4 py-2 sm:gap-5 sm:py-4">
        {userPosts.length > 0 ? (
          userPosts.map((ele) => <PostCard key={ele._id} ele={ele} />)
        ) : (
          <div className="py-10 text-center text-sm text-gray-500">
            No posts found.
          </div>
        )}
      </div>

      <aside className="hidden w-64 flex-col gap-4 py-2 sm:flex sm:gap-5 sm:py-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Sidebar Content
        </div>
      </aside>
    </section>
  );
};
