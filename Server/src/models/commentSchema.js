import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    upvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
export const Comment = mongoose.model("Comment", commentSchema);
