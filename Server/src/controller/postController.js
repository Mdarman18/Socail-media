import { Comment } from "../Models/commentSchema.js";
import { Post } from "../Models/postSchema.js";
import { User } from "../Models/user.js";
import cloudinary from "../utlis/cloud.js";
import sharp from "sharp";
import customError from "../utlis/errorHandling.js";

// ===================== ADD POST =====================
export const addPost = async (req, res, next) => {
  try {
    const id = req.user.id;
    const img = req.file;
    const { caption } = req.body;

    // 1. Validation: File check
    if (!img) {
      throw new customError("Image is required..", 400);
    }

    // 2. Validation: User check
    const user = await User.findById(id);
    if (!user) {
      throw new customError("User not found..", 404);
    }

    // 3. Image Optimization with Sharp / PDF Upload
    let pdfUrl = "";
    let imgUrl = "";
    const type = img.mimetype;

    if (type === "application/pdf") {
      const fileUri = `data:application/pdf;base64,${img.buffer.toString("base64")}`;

      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        resource_type: "raw",
        folder: "posts/pdfs",
        public_id: `${Date.now()}-${img.originalname.replace(/\.pdf$/i, "")}.pdf`,
      });

      pdfUrl = cloudResponse.secure_url;
    } else {
      const optimizedBuffer = await sharp(img.buffer)
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

    // 4. Database me Post Create karna
    const post = await Post.create({
      caption,
      img: imgUrl,
      pdf: pdfUrl,
      author: id,
    });

    user.post.push(post._id);
    await user.save();
    await post.populate("author", "-password");

    // 5. Successful Response Send karna
    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET USER PROFILE POSTS =====================
export const getUserProfile = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username img" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
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

// ===================== GET SINGLE USER POSTS =====================
export const getUserKapost = async (req, res, next) => {
  try {
    const authorId = req.user.id;

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username img" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
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
