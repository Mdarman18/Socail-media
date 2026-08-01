import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
