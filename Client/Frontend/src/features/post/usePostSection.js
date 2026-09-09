import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { likePost, setPosts } from "../../store/auth.slice";
import {
  dislikePostApi,
  getAllPosts,
  likePostApi,
} from "../../api/post.api";

export const usePostSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===============================
  // REDUX STATE
  // ===============================
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const user = useSelector((state) => state.auth.user);

  // ===============================
  // LOCAL STATES
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
  }, [dispatch]);

  // ===============================
  // HANDLE DATE/TIME HELPER
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

  // ===============================
  // FORMAT FILE NAME HELPER
  // ===============================
  const getFormattedFileName = (pdfPath) => {
    return pdfPath
      ?.split("/")
      .pop()
      ?.replace(/^\d+-/, "")
      ?.replace(".pdf", "")
      ?.replace(/_/g, " ");
  };

  // ===============================
  // CHECK IF POST IS LIKED HELPER
  // ===============================
  const checkIfLiked = (postLikes) => {
    return postLikes?.some(
      (likeId) => likeId.toString() === user?._id?.toString(),
    );
  };

  return {
    userPosts,
    user,
    loading,
    id,
    showComments,
    setShowComments,
    handleLikeButton,
    handleComment,
    getTimeAgo,
    getFormattedFileName,
    checkIfLiked,
    navigate,
  };
};
