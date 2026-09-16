import React, { useState, useEffect } from "react";
import { usePomodoroLogic } from "../../Hooks/usePomodoroLogic";
import { Play, Pause, Square, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PomodoroTimer() {
  const {
    activeSession,
    elapsedSeconds,
    status,
    loading,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
  } = usePomodoroLogic();

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [plannedDuration, setPlannedDuration] = useState(25);

  const [localElapsed, setLocalElapsed] = useState(elapsedSeconds);

  // Sync local timer with Redux state
  useEffect(() => {
    setLocalElapsed(elapsedSeconds);
  }, [elapsedSeconds]);

  // Local ticker for smooth UI
  useEffect(() => {
    let interval;
    if (status === "running") {
      interval = setInterval(() => {
        setLocalElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    startSession({
      subject,
      topic,
      sessionType: "focus",
      plannedDurationMinutes: plannedDuration,
    });
  };

  const handleKeydown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const totalSeconds = activeSession?.plannedDurationMinutes * 60 || plannedDuration * 60;
  const remainingSeconds = Math.max(totalSeconds - localElapsed, 0);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isRunning = status === "running" || status === "paused";

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Pomodoro Timer</h2>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={120 * 2 * Math.PI}
            strokeDashoffset={isRunning ? (120 * 2 * Math.PI) * (1 - remainingSeconds / totalSeconds) : 0}
            className="text-violet-600 transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute text-5xl font-mono font-bold text-gray-800 dark:text-white">
          {formatTime(remainingSeconds)}
        </div>
      </div>

      {/* Setup Form (hidden when running) */}
      {!isRunning && status !== "completed" && (
        <div className="w-full space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Calculus"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min)</label>
              <input
                type="number"
                value={plannedDuration}
                onChange={(e) => setPlannedDuration(Number(e.target.value))}
                min="1"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            role="button"
            tabIndex={0}
            onClick={handleStart}
            onKeyDown={(e) => handleKeydown(e, handleStart)}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} fill="currentColor" /> {loading ? "Starting..." : "Start Timer"}
          </button>
        ) : (
          <>
            {status === "running" ? (
              <button
                role="button"
                tabIndex={0}
                onClick={pauseSession}
                onKeyDown={(e) => handleKeydown(e, pauseSession)}
                disabled={loading}
                className="w-14 h-14 flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full transition-transform active:scale-95 disabled:opacity-50 focus:ring-2 focus:ring-orange-500 outline-none"
                aria-label="Pause timer"
              >
                <Pause size={24} fill="currentColor" />
              </button>
            ) : (
              <button
                role="button"
                tabIndex={0}
                onClick={resumeSession}
                onKeyDown={(e) => handleKeydown(e, resumeSession)}
                disabled={loading}
                className="w-14 h-14 flex items-center justify-center bg-violet-100 hover:bg-violet-200 text-violet-600 rounded-full transition-transform active:scale-95 disabled:opacity-50 focus:ring-2 focus:ring-violet-500 outline-none"
                aria-label="Resume timer"
              >
                <Play size={24} fill="currentColor" />
              </button>
            )}

            <button
              role="button"
              tabIndex={0}
              onClick={completeSession}
              onKeyDown={(e) => handleKeydown(e, completeSession)}
              disabled={loading}
              className="w-14 h-14 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-transform active:scale-95 disabled:opacity-50 focus:ring-2 focus:ring-green-500 outline-none"
              aria-label="Complete session"
            >
              <Square size={24} fill="currentColor" />
            </button>

            <button
              role="button"
              tabIndex={0}
              onClick={cancelSession}
              onKeyDown={(e) => handleKeydown(e, cancelSession)}
              disabled={loading}
              className="w-14 h-14 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-transform active:scale-95 disabled:opacity-50 focus:ring-2 focus:ring-red-500 outline-none"
              aria-label="Cancel session"
            >
              <XCircle size={24} />
            </button>
          </>
        )}
      </div>

      {status === "completed" && (
        <div className="mt-8 text-center text-green-600 dark:text-green-400 font-medium">
          Session Complete! Well done!
        </div>
      )}
    </div>
  );
}
