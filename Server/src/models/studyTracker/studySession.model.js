import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now, index: true },
    focusRating: { type: Number, min: 1, max: 5 },
    mood: { type: String, enum: ["great", "okay", "tired", "distracted"] },
    completed: { type: Boolean, default: true },
    notes: String,
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  { timestamps: true },
);

studySessionSchema.post("save", async function (doc) {
  const DailyGoal = mongoose.model("DailyGoal");
  const User = mongoose.model("User");

  const dayStart = new Date(doc.date);
  dayStart.setHours(0, 0, 0, 0);

  let dailyGoal = await DailyGoal.findOne({ user: doc.user, date: dayStart });

  if (!dailyGoal) {
    const user = await User.findById(doc.user);
    dailyGoal = new DailyGoal({
      user: doc.user,
      date: dayStart,
      targetMinutes: user ? user.dailyGoalMinutes : 60,
      studiedMinutes: 0,
      subjectsBreakdown: [],
    });
  }

  dailyGoal.studiedMinutes += doc.durationMinutes;

  const existingSubject = dailyGoal.subjectsBreakdown.find(
    (s) => s.subject === doc.subject,
  );
  if (existingSubject) {
    existingSubject.minutes += doc.durationMinutes;
  } else {
    dailyGoal.subjectsBreakdown.push({
      subject: doc.subject,
      minutes: doc.durationMinutes,
    });
  }

  dailyGoal.checkGoal();
  await dailyGoal.save();

  const user = await User.findById(doc.user);
  if (!user) return;

  const today = new Date().setHours(0, 0, 0, 0);
  const last = user.lastActiveDate
    ? new Date(user.lastActiveDate).setHours(0, 0, 0, 0)
    : null;
  const oneDay = 86400000;

  if (last === today) {
    // unchanged
  } else if (last === today - oneDay) {
    user.currentStreak += 1;
  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  user.lastActiveDate = new Date();
  await user.save();
});

export const StudySession = mongoose.model("StudySession", studySessionSchema);
