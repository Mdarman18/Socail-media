import { DailyGoal } from "../../models/studyTracker/dailyGoal.model.js";


// Aaj ka ya specific date ka daily goal data get karna
export const getDailyProgress = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let dailyGoal = await DailyGoal.findOne({
      user: req.user._id,
      date: targetDate,
    });

    if (!dailyGoal) {
      return res.status(200).json({
        success: true,
        data: { studiedMinutes: 0, targetMinutes: req.user.dailyGoalMinutes || 60, goalAchieved: false, subjectsBreakdown: [] },
      });
    }

    res.status(200).json({ success: true, data: dailyGoal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};