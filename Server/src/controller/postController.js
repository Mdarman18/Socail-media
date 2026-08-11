import { Comment } from "../Models/commentSchema.js";
import { Post } from "../Models/postSchema.js";
import { User } from "../Models/user.js";
import cloudinary from "../utlis/cloud.js"; // Typo check: utlis -> utils
import sharp from "sharp";

export const addPost = async (req, res) => {
  try {
    const id = req.user.id;
    const img = req.file;
    const { caption } = req.body;

    // 1. Validation: File check
    if (!img) {
      return res.status(400).json({
        success: false,
        message: "Image is required..",
      });
    }

    // 2. Validation: User check
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found..",
      });
    }

    // 3. Image Optimization with Sharp
    let pdfUrl = "";
    let imgUrl = "";
    const type = img.mimetype;
    if (type === "application/pdf") {
      const fileUri = `data:application/pdf;base64,${img.buffer.toString(
        "base64",
      )}`;

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

      // 4. Base64 conversion (Fixed 'image/jpeg')
      const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imgUrl = cloudResponse.secure_url;
    }

    // 5. Database me Post Create karna
    const post = await Post.create({
      caption,
      img: imgUrl,
      pdf: pdfUrl,
      author: id,
    });

    // User ke posts array me post ID push karna (agar relation maintain kar rahe hain)
    user.post.push(post._id);
    await user.save();
    await post.populate("author", "-password");

    // 6. Successful Response Send karna
    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// ====---Profile ---===========
export const getUserProfile = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getUserKapost = async (req, res) => {
  const authorId = req.user.id;
  try {
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,img" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,img",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// =========----Like Controller ------============
export const Like = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Post not found...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const Dislike = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Post not found...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// =======-------Add Comment ----==========

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { text } = req.body;
    console.log(text);

    // Check comment text
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter a comment.",
      });
    }

    // Find post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Create comment
    const newComment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    // Populate author details
    await newComment.populate({
      path: "author",
      select: "username img",
    });

    // Add comment id to post
    post.comment.push(newComment._id);

    // Save updated post
    await post.save();

    // Response
    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// =====-------Get Comment ----=============
export const getComment = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// ========-----------Delete a post --------==============
export const DeletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this post.",
      });
    }

    // Delete post document
    await Post.findByIdAndDelete(postId);

    // Remove post ID from user's posts array
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ======------ handle bookmarked --------=================
export const savedPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
