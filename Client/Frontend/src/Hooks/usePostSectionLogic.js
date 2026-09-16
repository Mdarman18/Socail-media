import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Redux Actions & APIs
import { likePost, setPosts } from "../store/auth.slice";
import { dislikePostApi, getAllPosts, likePostApi } from "../api/post.api";

export function usePostSectionLogic() {
  const [activeFeedTab, setActiveFeedTab] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const userPosts = useSelector((state) => state.post?.userPosts) || [];
  const user = useSelector((state) => state.auth.user);
  // Local States
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Handle Code Copy
  const handleCopyCode = (code, postId) => {
    navigator.clipboard.writeText(code);
    setCopiedId(postId);
    toast.success("Code copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Handle Like / Dislike
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

  // Handle Comment
  const handleComment = (postId) => {
    setId(postId);
    setShowComments(true);
  };

  // Get All Posts
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

  // Time formatting helper
  const getTimeAgo = (createdAt) => {
    const difference = new Date() - new Date(createdAt);
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `Just now`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // File formatting helper
  const getFormattedFileName = (pdfPath) => {
    return pdfPath
      ?.split("/")
      .pop()
      ?.replace(/^\d+-/, "")
      ?.replace(".pdf", "")
      ?.replace(/_/g, " ");
  };

  // Check if liked helper
  const checkIfLiked = (postLikes) => {
    return postLikes?.some(
      (likeId) => likeId.toString() === user?._id?.toString(),
    );
  };

  // Feed tabs configuration
  const feedTabs = [
    { id: "all", label: "All Feed" },
    { id: "communities", label: "My Communities" },
    { id: "study_updates", label: "Study Updates" },
    { id: "doubts_preview", label: "Academic Doubts" },
  ];

  // Dynamic user profile object passed to Academic Dashboard
  const dashboardUser = {
    name: user?.username || "Alex Johnson",
    avatar:
      user?.img ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    stats: {
      streak: 5,
      longestStreak: 12,
      todayGoalHours: 4,
      todayCompletedMinutes: 180,
    },
  };

  return {
    activeFeedTab,
    setActiveFeedTab,
    navigate,
    userPosts,
    user,
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
  };
}
