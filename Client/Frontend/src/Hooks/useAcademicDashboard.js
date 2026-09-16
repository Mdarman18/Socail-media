import { useSelector } from "react-redux";
import { useDailyGoalsLogic } from "./useDailyGoalsLogic";

export const useAcademicDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { dailyGoals, settings } = useDailyGoalsLogic();

  const dailyGoalData = dailyGoals && dailyGoals.length > 0 ? dailyGoals[0] : null;

  const studiedMinutes = dailyGoalData?.studiedMinutes || 0;
  const targetMinutes = dailyGoalData?.targetMinutes || settings?.dailyGoalMinutes || 60;

  const completedHours = (studiedMinutes / 60).toFixed(1);
  const goalHours = (targetMinutes / 60).toFixed(1);

  const progressPercent = Math.min(
    100,
    targetMinutes > 0 ? Math.round((studiedMinutes / targetMinutes) * 100) : 0
  );

  const firstName = (user?.name && typeof user.name === 'string') ? user.name.split(" ")[0] : (user?.username || "Student");
  console.log(user);


  const remainingHours = Math.max(0, (targetMinutes - studiedMinutes) / 60).toFixed(1);
  const isGoalCompleted = progressPercent >= 100;

  return {
    completedHours,
    goalHours,
    progressPercent,
    firstName,
    remainingHours,
    isGoalCompleted,
    streak: settings?.currentStreak || 0,
    longestStreak: settings?.longestStreak || 0,
    studiedMinutes,
  };
};
