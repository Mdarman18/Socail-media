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
import { likePost, setPosts } from "../../store/CreateSlice";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { toast } from "react-hot-toast";
import { Motivation } from "../../components/Motivation";
import Suggest from "../../components/Suggest";

// ===============================
// POST SKELETON
// ===============================

const PostSkeleton = () => {
  return (
    <div className="w-full  rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-2">
              {/* Username */}
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

              {/* Small text */}
              <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {/* More button */}
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="h-72 w-full animate-pulse bg-gray-200 dark:bg-gray-800 sm:h-96" />

      {/* Bottom Section */}
      <div className="p-3 sm:p-4">
        {/* Caption */}
        <div className="mb-4 space-y-2">
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex gap-5">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />

            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />

            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Bookmark */}
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Likes */}
        <div className="mt-3 h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
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

  const [id, setId] = useState();

  const [showComments, setShowComments] = useState(false);

  const [commentText, setCommentText] = useState("");

  // ===============================
  // HANDLE LIKE / DISLIKE
  // ===============================

  const handleLikeButton = async (id) => {
    try {
      const currentPost = userPosts?.find((post) => post._id === id);

      const isLiked = currentPost?.likes?.some(
        (likeId) => likeId.toString() === user?._id?.toString(),
      );

      if (!isLiked) {
        const res = await postUrl.post(`/like/${id}`);

        dispatch(likePost(res.data.post));
      } else {
        const res = await postUrl.post(`/dislike/${id}`);

        dispatch(likePost(res.data.post));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // ===============================
  // HANDLE COMMENT
  // ===============================

  const handleComment = (id) => {
    setShowComments(!showComments);
    setId(id);
  };

  // ===============================
  // GET ALL POSTS
  // ===============================

  const getPost = async () => {
    try {
      // API call start
      setLoading(true);

      const res = await postUrl.get("/allpost");

      // Store posts in Redux
      dispatch(setPosts(res.data.posts));
    } catch (error) {
      console.log("Get Post Error:", error);

      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      // API success/error dono ke baad
      // loading false ho jayegi
      setLoading(false);
    }
  };

  // ===============================
  // GET POSTS ON COMPONENT LOAD
  // ===============================

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

    if (seconds < 60) {
      return `${seconds}s ago`;
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    return `${days}d ago`;
  };
  // ===============================
  // JSX
  // ===============================

  return (
    <>
      <section className="flex w-full gap-4 justify-between">
        {/* =====================================
            MAIN POSTS SECTION
        ===================================== */}

        <div className="flex flex-1 flex-col gap-4 max-w-lg  py-2 sm:gap-5 sm:py-4">
          {/* =====================================
              LOADING SKELETON
          ===================================== */}

          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </>
          ) : userPosts.length === 0 ? (
            /* =====================================
                NO POSTS
            ===================================== */

            <div className="flex min-h-60 items-center justify-center rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
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
            /* =====================================
                ACTUAL POSTS
            ===================================== */

            userPosts.map((ele) => {
              // ===============================
              // PDF FILE NAME
              // ===============================

              const fileName = ele?.pdf
                ?.split("/")
                .pop()
                ?.replace(/^\d+-/, "")
                ?.replace(".pdf", "")
                ?.replace(/_/g, " ");

              // ===============================
              // CURRENT POST
              // ===============================

              const currentPost = userPosts?.find(
                (post) => post._id === ele._id,
              );

              // ===============================
              // CHECK LIKE
              // ===============================

              const isLiked = currentPost?.likes?.some(
                (likeId) => likeId.toString() === user?._id?.toString(),
              );

              // ===============================
              // RETURN POST
              // ===============================

              return (
                <div
                  key={ele._id}
                  className="w-[95%]  overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/2 transition-shadow duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:ring-white/2"
                >
                  {/* =================================
                      POST HEADER
                  ================================= */}

                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between pb-3">
                      {/* AUTHOR */}
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={ele.author?.img || "/default-avatar.png"}
                          alt={ele.author?.username || "author"}
                          onClick={() =>
                            navigate(`/userProfile/${ele?.author?._id}`)
                          }
                          className="h-9 w-9 shrink-0 cursor-pointer rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700 sm:h-10 sm:w-10"
                        />

                        <div className="truncate flex flex-col text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                          {ele?.author?.username || "User"}
                          <span className="font-light text-sm">
                            {" "}
                            {getTimeAgo(ele?.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* MORE BUTTON */}

                      <button className="rounded-full p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <FiMoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* =================================
                      MEDIA SECTION
                  ================================= */}

                  <div className="overflow-hidden bg-gray-50 dark:bg-gray-800/40">
                    {/* IMAGE */}

                    {ele?.img ? (
                      <img
                        src={ele?.img}
                        alt="Post"
                        className="max-h-96 w-full "
                      />
                    ) : ele?.pdf ? (
                      /* PDF */

                      <div className="p-3 sm:p-4">
                        <a
                          href={ele?.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-400"
                        >
                          <FiFileText className="h-5 w-5 shrink-0 text-red-500" />

                          <span className="truncate">{fileName}</span>
                        </a>
                      </div>
                    ) : (
                      /* NO MEDIA */

                      <p className="py-6 text-center text-xs text-gray-400">
                        No media attached
                      </p>
                    )}
                  </div>

                  {/* =================================
                      POST BOTTOM
                  ================================= */}

                  <div className="p-3 sm:p-4">
                    {/* CAPTION */}

                    {(ele?.caption || ele?.title) && (
                      <div className="mb-3">
                        <h1 className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                          {ele?.caption || ele?.title}
                        </h1>
                      </div>
                    )}

                    {/* =================================
                        ACTION BAR
                    ================================= */}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                      <div className="flex items-center gap-4 sm:gap-5">
                        {/* LIKE */}

                        <motion.button
                          onClick={() => handleLikeButton(ele._id)}
                          whileTap={{
                            scale: 0.75,
                          }}
                          animate={
                            isLiked
                              ? {
                                  scale: [1, 1.35, 0.95, 1],
                                }
                              : {
                                  scale: 1,
                                }
                          }
                          transition={{
                            duration: 0.35,
                            ease: "easeOut",
                          }}
                          className="group flex items-center justify-center p-1"
                        >
                          <FiHeart
                            className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                              isLiked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-800 group-hover:text-gray-500 dark:text-gray-200"
                            }`}
                            strokeWidth={2}
                          />
                        </motion.button>

                        {/* COMMENT */}

                        <button
                          onClick={() => {
                            handleComment(ele._id);
                          }}
                          className="p-1 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300"
                        >
                          <FiMessageCircle className="h-6 w-6" />
                        </button>

                        {/* SEND */}

                        <button className="p-1 text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300">
                          <FiSend className="h-5 w-5" />
                        </button>
                      </div>

                      {/* BOOKMARK */}

                      <button className="p-1 text-gray-700 transition-colors duration-200 hover:text-indigo-500 dark:text-gray-300">
                        <FiBookmark className="h-5 w-5" />
                      </button>
                    </div>

                    {/* =================================
                        LIKE & COMMENT COUNT
                    ================================= */}

                    <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <span>{ele?.likes?.length || 0} likes</span>

                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>

                      <span>{ele?.comment?.length || 0} comments</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* =====================================
            RIGHT SIDEBAR
        ===================================== */}
        {/* =====================================
            COMMENT COMPONENT
        ===================================== */}

        <Comment
          showComments={showComments}
          setShowComments={setShowComments}
          id={id}
        />
        <div className="sticky top-0 h-fit rounded-2xl hidden sm:flex flex-col gap-2 max-w-md mr-10 text-sm text-gray-500 dark:text-gray-400">
          <Motivation />
          <Suggest />
        </div>
      </section>
    </>
  );
};
