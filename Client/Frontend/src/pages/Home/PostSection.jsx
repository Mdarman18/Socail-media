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
import { animate, motion } from "framer-motion";
import { postUrl } from "../../api/Axios";
import { likePost, setPosts } from "../../store/CreateSlice";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";

export const PostSection = () => {
  const navigate = useNavigate();
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const [id, setId] = useState();
  const user = useSelector((state) => state.auth.user);
  // ====------Handle like and unlike button --=======================
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
  // ========-------Handle Comment ----==================
  const handleComment = (id) => {
    setShowComments(!showComments);
    setId(id);
  };
  const getPost = async () => {
    const res = await postUrl.get("/allpost");
    dispatch(setPosts(res.data.posts));
  };

  useEffect(() => {
    getPost();
  }, []);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <>
      <section className="flex w-full gap-4 sm:max-w-3xl">
        <div className="flex flex-1 flex-col gap-4 py-2 sm:gap-5 sm:py-4">
          {userPosts.map((ele) => {
            const fileName = ele?.pdf
              ?.split("/")
              .pop()
              .replace(/^\d+-/, "")
              .replace(".pdf", "")
              .replace(/_/g, " ");
            // ===------- handle like animation =======
            const currentPost = userPosts?.find((post) => post._id === ele._id);

            const isLiked = currentPost?.likes?.some(
              (likeId) => likeId.toString() === user?._id?.toString(),
            );
            return (
              <div
                key={ele._id}
                className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/2 transition-shadow duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:ring-white/2"
              >
                <div className="p-3 sm:p-4">
                  {/* Top Header: Author Info */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={ele.author?.img || "/default-avatar.png"}
                        alt={ele.author?.username || "author"}
                        onClick={() =>
                          navigate(`/userProfile/${ele?.author?._id}`)
                        }
                        className="h-9 cursor-pointer w-9 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700 sm:h-10 sm:w-10"
                      />
                      <span className="truncate text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                        {ele?.author?.username || "User"}
                      </span>
                    </div>
                    <button className="rounded-full p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                      <FiMoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Caption */}
                </div>

                {/* Media Section */}
                <div className="overflow-hidden bg-gray-50 dark:bg-gray-800/40">
                  {ele?.img ? (
                    <img
                      src={ele?.img}
                      alt="Post"
                      className="max-h-120 w-full object-cover"
                    />
                  ) : ele.pdf ? (
                    <div className="p-3 sm:p-4">
                      <a
                        href={ele?.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-750"
                      >
                        <FiFileText className="h-5 w-5 shrink-0 text-red-500" />
                        <span className="truncate">{fileName}</span>
                      </a>
                    </div>
                  ) : (
                    <p className="py-6 text-center text-xs text-gray-400">
                      No media attached
                    </p>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  {/* Action Bar Icons */}
                  {(ele?.caption || ele?.title) && (
                    <div className="mb-3">
                      <h1 className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                        {ele?.caption || ele?.title}
                      </h1>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <motion.button
                        onClick={() => handleLikeButton(ele._id)}
                        whileTap={{ scale: 0.75 }}
                        animate={
                          isLiked
                            ? {
                                scale: [1, 1.35, 0.95, 1],
                              }
                            : { scale: 1 }
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
                      <button
                        onClick={() => {
                          handleComment(ele._id);
                        }}
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

                  {/* Like & Comment Counts */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <span>{ele?.likes?.length || 0} likes</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>{ele?.comment?.length || 0} comments</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="hidden w-64 flex-col gap-4 py-2 sm:flex sm:gap-5 sm:py-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            hlo
          </div>
        </aside>
        <Comment
          showComments={showComments}
          setShowComments={setShowComments}
          id={id}
        />
      </section>
    </>
  );
};
