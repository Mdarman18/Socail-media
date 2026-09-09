import { Achievement } from "../models/achievement.js";
import { UserAchievement } from "../models/userAchievement.js";

const definitions = {
  first_post: {
    name: "First Post",
    description: "Created your first learning post.",
    icon: "edit",
  },
  first_doubt: {
    name: "First Doubt",
    description: "Asked your first academic doubt.",
    icon: "help-circle",
  },
  first_doubt_solved: {
    name: "First Solution",
    description: "Accepted your first answer to a doubt.",
    icon: "lightbulb",
  },
};

export const unlockAchievement = async (userId, key) => {
  const definition = definitions[key];
  if (!definition) return null;

  const achievement = await Achievement.findOneAndUpdate(
    { key },
    { $setOnInsert: { key, ...definition } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const unlocked = await UserAchievement.findOneAndUpdate(
    { user: userId, achievement: achievement._id },
    { $setOnInsert: { user: userId, achievement: achievement._id } },
    { upsert: true, new: true, rawResult: true },
  );

  return unlocked.lastErrorObject?.updatedExisting === false
    ? achievement
    : null;
};
