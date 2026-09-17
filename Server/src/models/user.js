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
      minLength: [6, "Password must be at least 6 characters long"],
      default: null,
      required: function () {
        return !this.googleId && !this.githubId;
      },
    },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    gender: { type: String, enum: ["male", "female"] },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    location: { type: String, default: "" },
    nickname: { type: String, default: "" },
    img: { type: String, default: "" },

    // --- Social & Community References ---
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],

    // ==========================================
    // --- Study Tracker Data References ---
    // User ke tasks aur study logs ko yahan link kar diya gaya hai
    // ==========================================
    tasks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Task" }
    ],
    dailyGoals: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DailyGoal" }
    ],
    studySessions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "StudySession" }
    ],
    pomodoroSessions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PomodoroSession" }
    ],

    // --- Study Tracker Settings & Streaks ---
    dailyGoalMinutes: {
      type: Number,
      default: 60,
    },
    weeklyGoalMinutes: {
      type: Number,
      default: 420,
    },
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
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);