import { PomodoroSession } from "../../models/studyTracker/pomodoroSession.model.js";
import { User } from "../../models/user.js";
// Pomodoro timer start karna
export const startPomodoro = async (req, res) => {
  try {
    const { subject, topic, sessionType, plannedDurationMinutes } = req.body;

    const session = await PomodoroSession.create({
      user: req.user._id,
      subject,
      topic,
      sessionType: sessionType || "focus",
      plannedDurationMinutes: plannedDurationMinutes || 25,
      status: "running",
      startedAt: new Date(),
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { pomodoroSessions: session._id },
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Timer Pause karna
export const pausePomodoro = async (req, res) => {
  try {
    const session = await PomodoroSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    await session.pause();
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Timer Resume karna
export const resumePomodoro = async (req, res) => {
  try {
    const session = await PomodoroSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    await session.resume();
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Timer Complete karna (Yeh automatic StudySession create karega model post hook se)
export const completePomodoro = async (req, res) => {
  try {
    const session = await PomodoroSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    await session.complete();
    res.status(200).json({ success: true, message: "Pomodoro completed & logged!", data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Timer Cancel karna
export const cancelPomodoro = async (req, res) => {
  try {
    const session = await PomodoroSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    await session.cancel();
    res.status(200).json({ success: true, message: "Pomodoro cancelled", data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Elapsed time fetch karna
export const getPomodoroElapsed = async (req, res) => {
  try {
    const session = await PomodoroSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    let elapsedMs = 0;
    const now = new Date();

    const pausedMs = session.pauseLog.reduce((sum, p) => {
      const end = p.resumedAt ? new Date(p.resumedAt) : now;
      return sum + (end - new Date(p.pausedAt));
    }, 0);

    if (session.status === "completed" || session.status === "cancelled") {
      elapsedMs = new Date(session.endedAt || now) - new Date(session.startedAt) - pausedMs;
    } else {
      elapsedMs = now - new Date(session.startedAt) - pausedMs;
      if (session.status === "paused" && session.pausedAt) {
        elapsedMs -= (now - new Date(session.pausedAt));
      }
    }

    const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    res.status(200).json({ success: true, elapsedSeconds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};