import React from "react";
import { motion } from "framer-motion";

const chartData = [
  ["Mon", 45],
  ["Tue", 70],
  ["Wed", 35],
  ["Thu", 85],
  ["Fri", 60],
  ["Sat", 50],
  ["Sun", 92],
];

const subjects = [
  ["DSA", "7h 10m", 78, "#4a3ae0"],
  ["MERN Projects", "6h 05m", 60, "#7c5cff"],
  ["Aptitude", "3h 15m", 34, "#17a167"],
];

const activities = [
  ["SK", "MD Firdosh", "Studying", "Dynamic Programming", "DSA", "now", true],
  ["RV", "MD Saiyad", "Building", "Auth flow", "MERN Project", "now", true],
  [
    "PN",
    "Nahid Hussain",
    "Completed",
    "System Design",
    "sheet",
    "8m ago",
    false,
  ],
  ["AM", "KHUSI", "Hit a", "15-day streak 🔥", "", "24m ago", false],
  ["DP", "Md Izarail", "Studying", "React Hooks", "Web Dev", "41m ago", false],
];

export default function StudyTracker() {
  return (
    <section className="px-5 py-20 sm:py-28 overflow-hidden bg-white">
      <div className="mx-auto max-w-310">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-xl text-center"
        >
          <span className="inline-flex rounded-full bg-[#eeebff] px-4 py-2 font-mono text-xs uppercase tracking-[.14em] text-[#4a3ae0]">
            ● Stay on track
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-[#10142a] sm:text-4xl">
            Track your own progress. See what others are learning too.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#565e76]">
            Log your study hours, keep your streak alive, and stay motivated by
            watching your friends and community learn in real time.
          </p>
        </motion.div>

        {/* Grid Container */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Card: Progress Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-[#e7e8f1] bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeebff] text-xl text-[#4a3ae0]">
                  ↗
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[#10142a]">
                    Your Progress
                  </h3>
                  <span className="text-xs text-[#8a90a6]">This week</span>
                </div>
              </div>

              <span className="rounded-full bg-[#eeebff] px-3 py-1.5 text-[11px] font-semibold text-[#4a3ae0]">
                🔥 12-day streak
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-6">
              {[
                ["3h 40m", "Studied today"],
                ["18h 20m", "This week"],
                ["96%", "Goal completion"],
              ].map(([value, label], idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                >
                  <b className="block font-display text-xl text-[#10142a]">
                    {value}
                  </b>
                  <span className="text-[11px] text-[#8a90a6]">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* Animated Bar Chart */}
            <div className="mt-7 flex h-28 items-end gap-2">
              {chartData.map(([day, height], index) => (
                <div
                  key={day}
                  className="flex h-full flex-1 flex-col items-center gap-2"
                >
                  <div className="relative h-full w-full max-w-6 overflow-hidden rounded-md bg-[#eff0f7]">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + index * 0.08,
                        ease: "easeOut",
                      }}
                      className="absolute bottom-0 w-full rounded-md bg-linear-to-t from-[#4a3ae0] to-[#7c5cff]"
                    />
                  </div>
                  <span
                    className={`text-[10px] ${
                      index === 6
                        ? "font-semibold text-[#4a3ae0]"
                        : "text-[#8a90a6]"
                    }`}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Subjects Progress Bars */}
            <div className="mt-7 space-y-3">
              {subjects.map(([name, time, progress, color], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="min-w-24 flex-1 text-xs font-medium text-[#10142a]">
                    {name}
                  </span>
                  <div className="h-1.5 flex-[1.4] overflow-hidden rounded-full bg-[#eff0f7]">
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[#8a90a6]">
                    {time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Card: Community Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl border border-[#e7e8f1] bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeebff] text-xl text-[#4a3ae0]">
                  ♧
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[#10142a]">
                    Community Activity
                  </h3>
                  <span className="text-xs text-[#8a90a6]">
                    Your connections, live
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-[#eeebff] px-3 py-1.5 text-[11px] font-semibold text-[#4a3ae0]">
                6 studying now
              </span>
            </div>

            <div className="mt-7 divide-y divide-[#eff0f7]">
              {activities.map(
                (
                  [initials, name, action, subject, category, time, isLive],
                  index,
                ) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-3 py-3 first:pt-0"
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-xs font-bold text-white">
                        {initials}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#17a167] ${
                          isLive ? "animate-pulse" : ""
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#10142a]">
                        {name}
                      </div>
                      <div className="truncate text-[11px] text-[#8a90a6]">
                        {action}{" "}
                        <b className="font-medium text-[#565e76]">{subject}</b>
                        {category && ` · ${category}`}
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-[#8a90a6]">
                      {time}
                    </span>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
