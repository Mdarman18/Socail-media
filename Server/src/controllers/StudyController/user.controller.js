import { User } from "../../models/user.js";
export const updateStudyGoals = async (req, res) => {
  try {
    const { dailyGoalMinutes, weeklyGoalMinutes } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(dailyGoalMinutes && { dailyGoalMinutes }),
        ...(weeklyGoalMinutes && { weeklyGoalMinutes }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Study goals updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};