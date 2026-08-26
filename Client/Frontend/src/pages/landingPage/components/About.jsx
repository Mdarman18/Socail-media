import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiShare2, FiCompass, FiTrendingUp } from "react-icons/fi";

const orbitNodes = [
  ["Doubts", "50%", "14.6%"],
  ["Answers", "80.7%", "32.3%"],
  ["Connections", "80.7%", "67.7%"],
  ["Messages", "50%", "85.4%"],
  ["Communities", "19.3%", "67.7%"],
  ["Resources", "19.3%", "32.3%"],
];

const values = [
  {
    number: "01",
    title: "Learn together",
    text: "Encourage students to exchange knowledge and help each other understand difficult concepts.",
    icon: <FiUsers className="text-xl text-[#6366f1]" />,
  },
  {
    number: "02",
    title: "Share what you know",
    text: "Turn individual knowledge into something the entire student community can benefit from.",
    icon: <FiShare2 className="text-xl text-[#6366f1]" />,
  },
  {
    number: "03",
    title: "Find your people",
    text: "Connect with students who share your interests, goals and subjects.",
    icon: <FiCompass className="text-xl text-[#6366f1]" />,
  },
  {
    number: "04",
    title: "Keep improving",
    text: "Build consistent learning habits through interaction, discussion and community.",
    icon: <FiTrendingUp className="text-xl text-[#6366f1]" />,
  },
];

export default function About() {
  return (
    <section className="relative px-5 py-16 sm:py-24 lg:py-28 overflow-hidden bg-linear-to-b from-white via-indigo-50/20 to-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
            About StudySharp
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-display">
            Learning becomes better when you don't learn alone.
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-gray-600 font-normal">
            StudySharp is a social learning platform built to make academic
            collaboration easier, more accessible and more engaging for students
            worldwide.
          </p>
        </motion.div>

        {/* Grid Content */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Orbit visual with rotation animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto aspect-square w-full max-w-lg"
          >
            <div className="absolute inset-[18%] rounded-full border border-indigo-100/60 shadow-inner" />
            <div className="absolute inset-[30%] rounded-full border border-dashed border-indigo-200/80" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {orbitNodes.map(([label, left, top]) => (
                <div
                  key={label}
                  className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-gray-100 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-gray-800 shadow-md transition-all hover:scale-105 hover:border-indigo-200 hover:shadow-xl"
                  style={{ left, top }}
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-600 shadow-xs shadow-indigo-300" />
                  {label}
                </div>
              ))}
            </motion.div>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 to-violet-500 text-center text-white shadow-xl shadow-indigo-500/30">
              <strong className="text-xl font-black tracking-wider">S↗</strong>
              <small className="font-mono text-[10px] tracking-widest uppercase opacity-90 mt-0.5">
                StudySharp
              </small>
            </div>

            <span className="absolute left-1/2 top-[16%] h-2.5 w-2.5 animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="absolute right-[19%] top-[32%] h-2.5 w-2.5 animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="absolute bottom-[16%] left-1/2 h-2.5 w-2.5 animate-ping rounded-full bg-violet-400 opacity-75" />
          </motion.div>

          {/* Story and values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-5">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display">
                Built for the way students actually learn.
              </h3>

              <p className="text-base leading-relaxed text-gray-600">
                Students don't learn only from textbooks and classrooms. They
                learn by asking questions, discussing ideas, sharing resources
                and helping each other—while effortlessly tracking their study
                progress in just one click. StudySharp brings these experiences
                together in one connected platform.
              </p>

              <p className="text-base leading-relaxed text-gray-500">
                Whether you're stuck on a difficult concept, looking for study
                partners, sharing useful notes or joining a community around
                your interests, StudySharp gives you a place to learn with
                others.
              </p>
            </div>

            {/* Values Cards with stagger effect */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {values.map(({ number, title, text, icon }, index) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-500 tracking-wider">
                      {number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      {React.cloneElement(icon, {
                        className:
                          "text-lg transition-colors group-hover:text-white",
                      })}
                    </div>
                  </div>

                  <h4 className="mt-4 text-base font-bold text-gray-900 font-display">
                    {title}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-20 overflow-hidden rounded-3xl bg-gray-900 px-6 py-14 text-center sm:px-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.3),transparent_50%),radial-gradient(circle_at_85%_100%,rgba(139,92,246,0.25),transparent_50%)]" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-indigo-300">
              ● Our mission
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Make learning more connected, collaborative and accessible.
            </h3>

            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              StudySharp aims to create a digital space where every student can
              ask questions, share knowledge, find the right people and grow
              together.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
