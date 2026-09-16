import React, { useEffect, useState } from "react";
import { useStudySessionsLogic } from "../../Hooks/useStudySessionsLogic";
import { Plus, X } from "lucide-react";

export default function SessionsList() {
  const { sessions, loadSessions, logManualSession, loading } = useStudySessionsLogic();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: "", topic: "", durationMinutes: 30, date: "" });

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    logManualSession(formData).then(() => setShowModal(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Study Sessions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Log Session
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading && !sessions?.length ? (
          <div className="p-8 text-center text-gray-500">Loading sessions...</div>
        ) : sessions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Topic</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Duration</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{s.subject}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{s.topic || "-"}</td>
                    <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{s.durationMinutes} min</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(s.date || s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No sessions logged yet — start a Pomodoro to begin.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Log Manual Session</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                <input type="text" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                <input required type="number" min="1" value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50">
                {loading ? "Saving..." : "Save Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
