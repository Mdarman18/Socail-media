import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "badge" },
  },
  { timestamps: true },
);

export const Achievement = mongoose.model("Achievement", achievementSchema);
