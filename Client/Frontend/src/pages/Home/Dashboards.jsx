import React from "react";
import { Flame, Clock, Target, Play, Sparkles, HelpCircle } from "lucide-react";

export default function AcademicDashboard({
  user,
  onStartSession,
  onAskDoubt,
}) {
  const completedHours = (user.stats.todayCompletedMinutes / 60).toFixed(1);
  const goalHours = user.stats.todayGoalHours;
  const progressPercent = Math.min(
    100,
    Math.round((user.stats.todayCompletedMinutes / (goalHours * 60)) * 100),
  );

  return (
    <section className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p- shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-mono font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Academic Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user.name.split(" ")[0]} 👋
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Ready to learn something new and crush your study goals today?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartSession}
            className="px-5 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-indigo-600" />
            <span>Start Session</span>
          </button>
          <button
            type="button"
            onClick={onAskDoubt}
            className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/20"
          >
            <HelpCircle className="w-4 h-4 text-indigo-300" />
            <span>Ask Doubt</span>
          </button>
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
        {/* Streak */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Study Streak</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {user.stats.streak} Days
          </p>
          <p className="text-[11px] text-slate-300">
            Longest: {user.stats.longestStreak} days
          </p>
        </div>

        {/* Today's Goal */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Today's Goal</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold">{goalHours} Hours</p>
          <p className="text-[11px] text-slate-300">Target daily focus</p>
        </div>

        {/* Completed Hours */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Completed</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold">{completedHours}h</p>
          <p className="text-[11px] text-slate-300">
            {user.stats.todayCompletedMinutes} minutes logged
          </p>
        </div>

        {/* Goal Progress */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
            <span className="text-purple-300">Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden my-2">
            <div
              className="h-full bg-linear-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-300">
            {progressPercent >= 100
              ? "Goal Completed! 🎯"
              : `${(goalHours - completedHours).toFixed(1)}h remaining`}
          </p>
        </div>
      </div>
    </section>
  );
}
