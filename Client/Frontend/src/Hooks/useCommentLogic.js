import { useEffect, useState, useMemo, useRef } from "react";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { postUrl } from "../api/Axios";
import {
  addComment,
  setuserComment,
  clearComment,
  addUpvote,
  addCommentToPost, // 👈 NEW — updates the post's comment count (used by PostSection badge)
} from "../store/auth.slice";

export const timeAgo = (date) => {
  if (!date) return "now";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

export const useCommentLogic = ({ showComments, setShowComments, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [votedMap, setVotedMap] = useState({});
  const textareaRef = useRef(null);

  const userComment = useSelector((state) => state.comment.usercomment);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    setComments(userComment || []);
  }, [userComment, dispatch]);

  // GET COMMENTS
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

  // Lock background scroll
  useEffect(() => {
    if (showComments) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showComments]);

  // ADD COMMENT
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await postUrl.post(`/addcomment/${id}`, { text: comment });
      toast.success(res.data.message);

      dispatch(addComment(res.data.comment)); // updates the comment modal list
      dispatch(addCommentToPost({ postId: id, comment: res.data.comment })); // 👈 NEW — updates the post card's comment badge instantly

      setComment("");

      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  // VOTE (UPVOTE / DOWNVOTE)
  const handleVote = async (commentId, type) => {
    const alreadyVoted = votedMap[commentId];
    if (alreadyVoted === type) return;

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

  return {
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
    navigate,
  };
};
