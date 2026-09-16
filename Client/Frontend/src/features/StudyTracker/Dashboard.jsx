import React, { useEffect } from "react";
import { useDailyGoalsLogic } from "../../Hooks/useDailyGoalsLogic";
import { useStudySessionsLogic } from "../../Hooks/useStudySessionsLogic";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, Play, Clock } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { dailyGoals, settings, loadData, loading } = useDailyGoalsLogic();
  const { sessions, loadSessions } = useStudySessionsLogic();

  useEffect(() => {
    loadData();
    loadSessions({ limit: 5 }); // last 5
  }, [loadData, loadSessions]);

  const todayGoal = dailyGoals?.length > 0 ? dailyGoals[0] : null;
  const target = todayGoal?.targetMinutes || settings?.dailyGoalMinutes || 120;
  const studied = todayGoal?.studiedMinutes || 0;
  const progress = Math.min((studied / target) * 100, 100);

  if (loading && !dailyGoals) {
    return <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Today's Progress</h2>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {studied} / {target} mins
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-violet-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {progress >= 100 ? "Goal Achieved! 🎉" : "Keep going!"}
          </p>
        </div>

        {/* Streak Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
          <Flame size={40} className="text-orange-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {settings?.currentStreak || 0} Days
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
          <div className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
            <Trophy size={14} /> Longest: {settings?.longestStreak || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Subjects Breakdown</h2>
          {todayGoal?.subjectsBreakdown?.length > 0 ? (
            <ul className="space-y-3">
              {todayGoal.subjectsBreakdown.map((sb, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{sb.subject}</span>
                  <span className="text-gray-500 dark:text-gray-400">{sb.minutes} mins</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No subjects studied today yet.</p>
          )}
          <button
            onClick={() => navigate("/study/timer")}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-medium transition-colors"
          >
            <Play size={18} /> Start Pomodoro
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Sessions</h2>
            <button
              onClick={() => navigate("/study/sessions")}
              className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              View all
            </button>
          </div>
          {sessions?.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div key={session._id} className="flex items-start justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{session.subject}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{session.topic || "General"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={14} /> {session.durationMinutes}m
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
