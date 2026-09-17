import mongoose from "mongoose";

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true },
    topic: String,
    sessionType: {
      type: String,
      enum: ["focus", "short-break", "long-break"],
      default: "focus",
    },
    plannedDurationMinutes: { type: Number, default: 25 },
    status: {
      type: String,
      enum: ["running", "paused", "completed", "cancelled"],
      default: "running",
    },
    startedAt: { type: Date, required: true, default: Date.now },
    pausedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    pauseLog: [
      {
        pausedAt: Date,
        resumedAt: Date,
      },
    ],
    actualMinutes: { type: Number, default: 0 },
    completedCycle: { type: Boolean, default: false },
    _loggedAlready: { type: Boolean, default: false, select: false },
  },
  { timestamps: true },
);

pomodoroSessionSchema.methods.pause = function () {
  if (this.status !== "running") return this;
  this.status = "paused";
  this.pausedAt = new Date();
  return this.save();
};

pomodoroSessionSchema.methods.resume = function () {
  if (this.status !== "paused") return this;
  this.pauseLog.push({ pausedAt: this.pausedAt, resumedAt: new Date() });
  this.pausedAt = null;
  this.status = "running";
  return this.save();
};

pomodoroSessionSchema.methods.complete = function () {
  this.endedAt = new Date();
  this.status = "completed";

  const pausedMs = this.pauseLog.reduce(
    (sum, p) => sum + (new Date(p.resumedAt) - new Date(p.pausedAt)),
    0,
  );

  const totalMs = this.endedAt - this.startedAt - pausedMs;
  this.actualMinutes = Math.max(0, Math.round(totalMs / 60000));
  this.completedCycle = this.actualMinutes >= this.plannedDurationMinutes;

  return this.save();
};

pomodoroSessionSchema.methods.cancel = function () {
  this.status = "cancelled";
  this.endedAt = new Date();
  return this.save();
};

pomodoroSessionSchema.post("save", async function (doc) {
  const StudySession = mongoose.model("StudySession");
  if (
    doc.status === "completed" &&
    doc.sessionType === "focus" &&
    !doc._loggedAlready
  ) {
    await StudySession.create({
      user: doc.user,
      subject: doc.subject,
      topic: doc.topic,
      durationMinutes: doc.actualMinutes,
      date: doc.startedAt,
      completed: doc.completedCycle,
    });

    doc._loggedAlready = true;
    await mongoose
      .model("PomodoroSession")
      .updateOne({ _id: doc._id }, { $set: { _loggedAlready: true } });
  }
});

export const PomodoroSession = mongoose.model(
  "PomodoroSession",
  pomodoroSessionSchema,
);
