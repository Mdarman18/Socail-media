import mongoose from "mongoose";

const reputationTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ["accepted_answer"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

reputationTransactionSchema.index(
  { user: 1, sourceType: 1, sourceId: 1 },
  { unique: true },
);

export const ReputationTransaction = mongoose.model(
  "ReputationTransaction",
  reputationTransactionSchema,
);
