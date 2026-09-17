import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Naya field: Community ki image/banner URL ke liye
    img: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Software Development",
        "Computer Science Core",
        "Emerging Tech",
        "Infrastructure",
        "Systems & Security",
        "Competitions",
        "University Study Circle",
      ],
      default: "Software Development",
    },
    rules: {
      type: [String],
      default: ["Be collaborative and respectful"],
    },
    tags: {
      type: [String],
      default: [],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Community = mongoose.model("Community", communitySchema);
