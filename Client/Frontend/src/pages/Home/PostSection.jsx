import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { likePost, setPosts } from "../../store/CreateSlice";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { toast } from "react-hot-toast";
import { Motivation } from "../../components/Motivation";
import Suggest from "../../components/Suggest";
import {
  dislikePostApi,
  getAllPosts,
  likePostApi,
} from "../../Service/postService";

// ===============================
// POST SKELETON
// ===============================
const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex gap-4 flex-col md:flex-row">
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-48 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

// ===============================
// POST SECTION
// ===============================
export const PostSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===============================
  // REDUX
  // ===============================
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const user = useSelector((state) => state.auth.user);

  // ===============================
  // STATES
  // ===============================
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [showComments, setShowComments] = useState(false);

  // ===============================
  // HANDLE LIKE / DISLIKE
  // ===============================
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

  // ===============================
  // HANDLE COMMENT
  // ===============================
  const handleComment = (postId) => {
    setId(postId);
    setShowComments(true);
  };

  // ===============================
  // GET ALL POSTS
  // ===============================
  const getPost = async () => {
    try {
      setLoading(true);
      const posts = await getAllPosts();
      dispatch(setPosts(posts));
    } catch (error) {
      console.log("Get Post Error:", error);
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  // ===============================
  // HANDLE DATE/TIME
  // ===============================
  const getTimeAgo = (createdAt) => {
    const difference = new Date() - new Date(createdAt);
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <section className="flex w-full gap-6 justify-between items-start">
      {/* MAIN POSTS SECTION */}
      <div className="flex flex-1 flex-col gap-6 w-full max-w-[700px]">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        ) : userPosts.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center rounded-[1.5rem] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No posts available
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Be the first one to create a post!
              </p>
            </div>
          </div>
        ) : (
          userPosts.map((ele) => {
            const fileName = ele?.pdf
              ?.split("/")
              .pop()
              ?.replace(/^\d+-/, "")
              ?.replace(".pdf", "")
              ?.replace(/_/g, " ");

            const isLiked = ele?.likes?.some(
              (likeId) => likeId.toString() === user?._id?.toString(),
            );

            return (
              <article
                key={ele._id}
                className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300 flex gap-4 flex-col hover:shadow-md"
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
                      className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {ele?.author?.username || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(ele?.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full transition-colors">
                    <FiMoreHorizontal className="text-lg" />
                  </button>
                </div>

                {/* CAPTION / TITLE */}
                {(ele?.caption || ele?.title) && (
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    {ele?.caption || ele?.title}
                  </h2>
                )}

                {/* MEDIA SECTION (Image or PDF) */}
                <div>
                  {ele?.img ? (
                    <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                      <img
                        src={ele?.img}
                        alt="Post"
                        className="max-h-96 w-full object-cover"
                      />
                    </div>
                  ) : ele?.pdf ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors w-fit pr-8">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center shrink-0">
                        <FiFileText className="text-xl" />
                      </div>
                      <a
                        href={ele?.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate"
                      >
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:underline">
                          {fileName || "Document.pdf"}
                        </div>
                        <div className="text-xs text-gray-500">
                          PDF Attachment
                        </div>
                      </a>
                    </div>
                  ) : null}
                </div>

                {/* ACTION BAR & FOOTER */}
                <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800 mt-2">
                  <div className="flex items-center gap-6">
                    {/* LIKE */}
                    <motion.button
                      onClick={() => handleLikeButton(ele._id)}
                      whileTap={{ scale: 0.75 }}
                      animate={
                        isLiked ? { scale: [1, 1.35, 0.95, 1] } : { scale: 1 }
                      }
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex items-center gap-1.5 group p-1"
                    >
                      <FiHeart
                        className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400"
                        }`}
                        strokeWidth={2}
                      />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {ele?.likes?.length || 0}
                      </span>
                    </motion.button>

                    {/* COMMENT */}
                    <button
                      onClick={() => handleComment(ele._id)}
                      className="flex items-center gap-1.5 p-1 text-gray-500 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-400 text-sm font-medium"
                    >
                      <FiMessageCircle className="h-6 w-6" />
                      <span>{ele?.comment?.length || 0}</span>
                    </button>

                    {/* SEND */}
                    <button className="p-1 text-gray-500 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-400">
                      <FiSend className="h-5 w-5" />
                    </button>
                  </div>

                  {/* BOOKMARK */}
                  <button className="p-1 text-gray-500 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-400">
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* RIGHT SIDEBAR / COMMENTS */}
      <Comment
        showComments={showComments}
        setShowComments={setShowComments}
        id={id}
      />
      <div className="sticky top-0 h-fit rounded-2xl hidden lg:flex flex-col gap-4 w-80 text-sm text-gray-500 dark:text-gray-400">
        <Motivation />
        <Suggest />
      </div>
    </section>
  );
};
