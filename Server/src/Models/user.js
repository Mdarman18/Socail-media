import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,

      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 6,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    githubId: {
      type: String,
      default: null,
    },
    gender: { type: String, enum: ["male", "female"] },
    bio: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    nickname: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    savedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
