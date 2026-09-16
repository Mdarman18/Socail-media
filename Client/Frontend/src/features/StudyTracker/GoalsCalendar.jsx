import React, { useEffect, useState } from "react";
import { useDailyGoalsLogic } from "../../Hooks/useDailyGoalsLogic";

export default function GoalsCalendar() {
  const { dailyGoals, loadData, loading, settings } = useDailyGoalsLogic();
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fallback data if none
  const chartData = (dailyGoals?.length ? dailyGoals : Array(7).fill({ studiedMinutes: 0, date: new Date().toISOString() })).slice(0, 7).reverse();
  const maxMinutes = Math.max(...chartData.map(d => d.studiedMinutes), settings?.dailyGoalMinutes || 120);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activity & Goals</h2>

      {/* Simple Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Last 7 Days</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((d, i) => {
            const heightPercentage = maxMinutes > 0 ? (d.studiedMinutes / maxMinutes) * 100 : 0;
            const isGoalMet = d.goalAchieved || (d.studiedMinutes >= (settings?.dailyGoalMinutes || 120));
            const dateStr = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' });
            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer" onClick={() => setSelectedDay(d)}>
                <div className="relative w-full flex justify-center h-full items-end">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                    {d.studiedMinutes} min
                  </div>
                  <div 
                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${isGoalMet ? 'bg-green-500' : 'bg-violet-400 dark:bg-violet-600'}`}
                    style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{dateStr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Details for {new Date(selectedDay.date).toLocaleDateString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Total Studied: <span className="font-bold">{selectedDay.studiedMinutes}</span> mins
            {selectedDay.goalAchieved && <span className="ml-2 text-green-500 font-medium">Goal Achieved!</span>}
          </p>
          
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subjects Breakdown</h4>
          {selectedDay.subjectsBreakdown?.length > 0 ? (
            <ul className="space-y-2">
              {selectedDay.subjectsBreakdown.map((sb, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <span className="text-gray-800 dark:text-gray-200">{sb.subject}</span>
                  <span className="text-gray-600 dark:text-gray-400">{sb.minutes} mins</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No subjects recorded.</p>
          )}
        </div>
      )}
    </div>
  );
}
