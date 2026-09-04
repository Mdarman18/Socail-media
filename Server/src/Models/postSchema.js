import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["post", "doubt", "resource", "study update"],
    },
    description: {
      type: String,
      required: function () {
        return this.status === "post";
      },
    },
    questionTitle: {
      type: String,
      required: function () {
        return this.status === "doubt";
      },
    },
    questionExplanation: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
      enum: [
        "Data Structures & Algorithms",
        "Web Development",
        "AI & Machine Learning",
        "Database Management Systems",
        "Computer Networks & Security",
        "Cloud & DevOps",
        "Competitive Programming",
        "General Computer Science",
        "other",
      ],
    },
    codeDetails: {
      type: String,
    },
    codeType: {
      type: String,
      enum: ["Java", "Python", "JavaScript", "sql"],
    },
    caption: {
      type: String,
      default: "",
    },
    img: {
      type: String,
    },
    pdf: {
      type: String,
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
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
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
