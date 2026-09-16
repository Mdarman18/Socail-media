import { StudySession } from "../../models/studyTracker/studySession.model.js";
import { User } from "../../models/user.js";


// Manual study session log karna (Yeh DailyGoal aur Streak automatically update karega post hook ke zariye)
export const createStudySession = async (req, res) => {
  try {
    const { subject, topic, durationMinutes, focusRating, mood, notes, relatedTask } = req.body;

    const session = await StudySession.create({
      user: req.user._id,
      subject,
      topic,
      durationMinutes,
      focusRating,
      mood,
      notes,
      relatedTask,
    });

    // User model mein studySessions reference push karna
    await User.findByIdAndUpdate(req.user._id, {
      $push: { studySessions: session._id },
    });

    res.status(201).json({
      success: true,
      message: "Study session logged successfully!",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// User ki saari study history nikalna
export const getStudyHistory = async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.user._id })
      .populate("relatedTask", "title subject")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};