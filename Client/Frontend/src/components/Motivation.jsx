import React from "react";

export const Motivation = () => {
  return (
    <div className="w-full max-w-xs   overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <span className="text-sm font-semibold text-gray-800">Focus Room</span>

        <button className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
          ● Live Now
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start px-3 py-1">
        {/* Subject */}
        <p className=" text-xl font-semibold text-blue-500">
          PLACEMENT Preparation
        </p>

        {/* Session Title */}
        <h1 className="text-md font-light text-gray-800">Pomodoro Session</h1>

        {/* Timer */}
        <div className="my-1 flex gap-2  items-center">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Session
          </span>

          <h2 className="text-xs font-bold text-gray-800">25</h2>

          <span className=" text-sm text-gray-400">minutes</span>
        </div>

        {/* Participants */}
        <button className="mb-5 rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-600">
          245
        </button>

        {/* Join Button */}
        <button className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]">
          JOIN ROOM
        </button>
      </div>
    </div>
  );
};
