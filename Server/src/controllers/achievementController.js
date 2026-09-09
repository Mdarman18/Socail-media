import { UserAchievement } from "../models/userAchievement.js";

export const getMyAchievements = async (req, res, next) => {
  try {
    const achievements = await UserAchievement.find({ user: req.user.id })
      .sort({ unlockedAt: -1 })
      .populate("achievement", "key name description icon")
      .lean();
    return res.status(200).json({ success: true, achievements });
  } catch (error) {
    return next(error);
  }
};
