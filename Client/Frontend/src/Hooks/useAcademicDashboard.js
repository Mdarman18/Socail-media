export const useAcademicDashboard = ({ user }) => {
  const completedHours = (user.stats.todayCompletedMinutes / 60).toFixed(1);
  const goalHours = user.stats.todayGoalHours;

  const progressPercent = Math.min(
    100,
    Math.round((user.stats.todayCompletedMinutes / (goalHours * 60)) * 100),
  );

  const firstName = user.name.split(" ")[0];
  const remainingHours = (goalHours - completedHours).toFixed(1);
  const isGoalCompleted = progressPercent >= 100;

  return {
    completedHours,
    goalHours,
    progressPercent,
    firstName,
    remainingHours,
    isGoalCompleted,
  };
};
