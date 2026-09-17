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
      required: false,
    },
    codeType: {
      type: String,
      required: false,
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

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ community: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
