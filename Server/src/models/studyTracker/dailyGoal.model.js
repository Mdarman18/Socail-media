import mongoose from "mongoose";

const dailyGoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: {
      type: Date,
      required: true,
      set: (v) => {
        const d = new Date(v);
        d.setHours(0, 0, 0, 0);
        return d;
      }
    },
    targetMinutes: { type: Number, required: true },
    studiedMinutes: { type: Number, default: 0 },
    goalAchieved: { type: Boolean, default: false },
    subjectsBreakdown: [
      {
        subject: String,
        minutes: Number
      }
    ]
  },
  { timestamps: true }
);

dailyGoalSchema.index({ user: 1, date: 1 }, { unique: true });

dailyGoalSchema.methods.checkGoal = function () {
  this.goalAchieved = this.studiedMinutes >= this.targetMinutes;
  return this.goalAchieved;
};

export const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema);