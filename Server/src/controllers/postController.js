import { Comment } from "../models/commentSchema.js";
import { Post } from "../models/postSchema.js";
import { User } from "../models/user.js";
import { ReputationTransaction } from "../models/reputationTransaction.js";
import { Notification } from "../models/notification.js";
import { io, userSockets } from "../sockets/socket.js";
import { unlockAchievement } from "../utils/achievements.js";
import cloudinary from "../utils/cloud.js";
import sharp from "sharp";
import customError from "../utils/errorHandling.js";

// ===================== ADD POST =====================
export const addPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const imageFile = req.files?.img?.[0];
    const pdfFile = req.files?.pdf?.[0];

    const {
      status,
      description,
      questionTitle,
      questionExplanation,
      subject,
      codeDetails,
      codeType,
      caption,
      community,
      tags,
    } = req.body;

    // 1. User check
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found..", 404);
    }

    let pdfUrl = "";
    let imgUrl = "";

    // 2. File Upload Handling (Image or PDF)
    if (imageFile || pdfFile) {
      const file = pdfFile || imageFile;
      const mimeType = file.mimetype;

      if (mimeType === "application/pdf") {
        const fileUri = `data:application/pdf;base64,${file.buffer.toString("base64")}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "raw",
          folder: "posts/pdfs",
          public_id: `${Date.now()}-${file.originalname.replace(/\.pdf$/i, "")}.pdf`,
        });

        pdfUrl = cloudResponse.secure_url;
      } else {
        const optimizedBuffer = await sharp(file.buffer)
          .resize({
            width: 800,
            height: 800,
            fit: "inside",
          })
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        imgUrl = cloudResponse.secure_url;
      }
    }

    // 4. Create Post in Database
    const post = await Post.create({
      status,
      description,
      questionTitle,
      questionExplanation,
      subject,
      codeDetails,
      codeType,
      caption: caption || "",
      img: imgUrl,
      pdf: pdfUrl,
      author: userId,
      community: community || null,
      tags: tags,
    });

    user.post.push(post._id);
    await user.save();
    await unlockAchievement(
      userId,
      status === "doubt" ? "first_doubt" : "first_post",
    );

    await post.populate("author", "-password");

    // 5. Send Response
    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET ALL POSTS =====================
export const getUserProfile = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50,
    );
    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "author", select: "username img" })
        .populate({
          path: "comment",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "author",
            select: "username img",
          },
        })
        .lean(),
      Post.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET SINGLE USER POSTS =====================
export const getUserKapost = async (req, res, next) => {
  try {
    const authorId = req.user.id;

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username img" })
      .populate({
        path: "comment",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username img",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== LIKE POST =====================
export const Like = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        returnDocument: "after",
      },
    ).populate("author", "username img");

    if (!updatedPost) {
      throw new customError("Post not found...", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post: updatedPost,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== DISLIKE POST =====================
export const Dislike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: userId,
        },
      },
      { returnDocument: "after" },
    ).populate("author", "username img");

    if (!updatedPost) {
      throw new customError("Post not found...", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post: updatedPost,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== ADD COMMENT =====================
export const addComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      throw new customError("Please enter a comment.", 400);
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("Post not found.", 404);
    }

    const newComment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await newComment.populate({
      path: "author",
      select: "username img",
    });

    post.comment.push(newComment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET COMMENTS =====================
export const getComment = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username img",
      });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== HANDLE UPVOTE =====================
export const handleUpvote = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new customError("Comment not found", 404);
    }

    const alreadyUpvoted = comment.upvote.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyUpvoted) {
      comment.upvote = comment.upvote.filter(
        (id) => id.toString() !== userId.toString(),
      );
      await comment.save();

      return res.status(200).json({
        success: true,
        message: "Upvote removed successfully",
        comment,
      });
    }

    comment.downvote = comment.downvote.filter(
      (id) => id.toString() !== userId.toString(),
    );
    comment.upvote.push(userId);
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment upvoted successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== HANDLE DOWNVOTE =====================
export const handleDownvote = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new customError("Comment not found", 404);
    }

    const alreadyDownvoted = comment.downvote.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyDownvoted) {
      comment.downvote = comment.downvote.filter(
        (id) => id.toString() !== userId.toString(),
      );
      await comment.save();

      return res.status(200).json({
        success: true,
        message: "Downvote removed successfully",
        comment,
      });
    }

    comment.upvote = comment.upvote.filter(
      (id) => id.toString() !== userId.toString(),
    );
    comment.downvote.push(userId);
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment downvoted successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== DELETE POST =====================
export const DeletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("Post not found.", 404);
    }

    if (post.author.toString() !== userId) {
      throw new customError("Unauthorized to delete this post.", 403);
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, { $pull: { post: postId } });
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== SAVE / BOOKMARK POST =====================
export const savedPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("Post not found", 404);
    }

    const user = await User.findById(userId);

    if (user.savedPost.includes(post._id)) {
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            savedPost: post._id,
          },
        },
      );

      return res.status(200).json({
        success: true,
        message: "Post unsaved",
      });
    }

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          savedPost: post._id,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Post saved",
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== ACCEPT / REOPEN DOUBT =====================
export const acceptAnswer = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const post = await Post.findOne({
      _id: postId,
      author: userId,
      status: "doubt",
    });

    if (!post) {
      throw new customError("Only the doubt author can accept an answer", 403);
    }
    if (post.acceptedAnswer) {
      throw new customError("This doubt already has an accepted answer", 409);
    }

    const answer = await Comment.findOne({ _id: commentId, post: postId });
    if (!answer) {
      throw new customError("Answer not found for this doubt", 404);
    }
    if (answer.author.toString() === userId.toString()) {
      throw new customError("You cannot accept your own answer", 400);
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: userId, status: "doubt", acceptedAnswer: null },
      {
        $set: {
          acceptedAnswer: answer._id,
          solved: true,
          solvedAt: new Date(),
        },
      },
      { new: true },
    ).populate({
      path: "acceptedAnswer",
      populate: { path: "author", select: "username img" },
    });

    if (!updatedPost) {
      throw new customError("This doubt was updated already", 409);
    }

    try {
      await ReputationTransaction.create({
        user: answer.author,
        amount: 25,
        reason: "Accepted doubt answer",
        sourceType: "accepted_answer",
        sourceId: answer._id,
      });
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 25 } });
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }

    const notification = await Notification.create({
      recipient: answer.author,
      actor: userId,
      type: "accepted_answer",
      post: post._id,
      comment: answer._id,
      message: "Your answer was accepted",
    });
    const socketId = userSockets[answer.author.toString()];
    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }
    await unlockAchievement(answer.author, "first_doubt_solved");

    return res.status(200).json({
      success: true,
      message: "Answer accepted successfully",
      post: updatedPost,
    });
  } catch (error) {
    return next(error);
  }
};

export const reopenDoubt = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id, status: "doubt" },
      { $set: { acceptedAnswer: null, solved: false, solvedAt: null } },
      { new: true },
    );

    if (!post) {
      throw new customError("Doubt not found or unauthorized", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Doubt reopened successfully",
      post,
    });
  } catch (error) {
    return next(error);
  }
};
