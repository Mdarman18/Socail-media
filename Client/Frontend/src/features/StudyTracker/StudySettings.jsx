import React, { useEffect, useState } from "react";
import { useDailyGoalsLogic } from "../../Hooks/useDailyGoalsLogic";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function StudySettings() {
  const { settings, loadData, updateSettings, loading } = useDailyGoalsLogic();
  
  const [formData, setFormData] = useState({
    dailyGoalMinutes: 120,
    weeklyGoalMinutes: 840
  });

  useEffect(() => {
    loadData().then(() => {
      if (settings) {
        setFormData({
          dailyGoalMinutes: settings.dailyGoalMinutes || 120,
          weeklyGoalMinutes: settings.weeklyGoalMinutes || 840
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]); // depend on loadData, populate once settings are available

  // separate effect to sync settings when they arrive (since they are async)
  useEffect(() => {
    if (settings) {
      setFormData({
        dailyGoalMinutes: settings.dailyGoalMinutes || 120,
        weeklyGoalMinutes: settings.weeklyGoalMinutes || 840
      });
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Study Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your daily and weekly study targets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Goal (minutes)
              </label>
              <input 
                type="number" 
                min="10"
                value={formData.dailyGoalMinutes} 
                onChange={(e) => setFormData({...formData, dailyGoalMinutes: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">How many minutes do you aim to study each day?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekly Goal (minutes)
              </label>
              <input 
                type="number" 
                min="60"
                value={formData.weeklyGoalMinutes} 
                onChange={(e) => setFormData({...formData, weeklyGoalMinutes: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">Your total target for the week.</p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Read-only stats block */}
        <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Account Stats</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{settings?.currentStreak || 0} days</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{settings?.longestStreak || 0} days</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Active</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {settings?.lastStudyDate ? new Date(settings.lastStudyDate).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
