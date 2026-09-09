import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true },
);

collectionSchema.index({ owner: 1, createdAt: -1 });
collectionSchema.index({ owner: 1, name: 1 }, { unique: true });

export const Collection = mongoose.model("Collection", collectionSchema);
