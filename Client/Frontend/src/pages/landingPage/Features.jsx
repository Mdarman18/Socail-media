import React from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaQuestionCircle,
  FaUsers,
  FaComments,
  FaFileAlt,
  FaTrophy,
  FaFire,
  FaCheckCircle,
} from "react-icons/fa";

const featuresData = [
  {
    icon: <FaChartLine className="text-primary text-2xl" />,
    bgColor: "bg-indigo-50",
    title: "Smart Study Tracker",
    description: "Track daily study hours, topics, and productivity streaks.",
    preview: (
      <div className="flex items-center gap-2">
        <div className="flex items-end gap-1 h-8">
          {[40, 65, 45, 80, 55, 90].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-indigo-200"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 ml-1">
          <FaFire size={11} /> 12 day streak
        </span>
      </div>
    ),
  },
  {
    icon: <FaQuestionCircle className="text-purple-600 text-2xl" />,
    bgColor: "bg-purple-50",
    title: "Doubt Raising & Solving",
    description: "Post academic doubts and get peer solutions.",
    preview: (
      <div className="w-full bg-purple-50/70 border border-purple-100 rounded-lg px-3 py-2">
        <p className="text-xs text-slate-600 italic truncate">
          "Why does recursion cause stack overflow?"
        </p>
        <p className="text-[11px] text-purple-500 font-medium mt-1">
          ✓ Solved in 4 minutes
        </p>
      </div>
    ),
  },
  {
    icon: <FaUsers className="text-primary text-2xl" />,
    bgColor: "bg-indigo-50",
    title: "Peer Networking & Connecting",
    description: "Connect with students and form study groups.",
    preview: (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {[
            "bg-indigo-300",
            "bg-violet-300",
            "bg-indigo-400",
            "bg-violet-400",
          ].map((c, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full ${c} border-2 border-white`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 ml-2">500+ studying now</span>
      </div>
    ),
  },
  {
    icon: <FaComments className="text-purple-600 text-2xl" />,
    bgColor: "bg-purple-50",
    title: "Real-Time Chat & Discussion",
    description: "Discuss concepts directly through real-time messaging.",
    preview: (
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-purple-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </span>
        <span className="text-[11px] text-slate-500">Saiyad is typing</span>
      </div>
    ),
  },
  {
    icon: <FaFileAlt className="text-primary text-2xl" />,
    bgColor: "bg-indigo-50",
    title: "Resource & Notes Sharing",
    description: "Share handwritten notes, cheat sheets, and materials.",
    preview: (
      <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 rounded-lg px-3 py-2 w-fit">
        <div className="w-6 h-7 rounded bg-white border border-indigo-200 flex items-center justify-center">
          <FaFileAlt className="text-indigo-400" size={11} />
        </div>
        <span className="text-xs text-slate-600">DSA_Notes.pdf</span>
        <span className="text-[10px] text-indigo-400 font-medium">
          240 downloads
        </span>
      </div>
    ),
  },
  {
    icon: <FaTrophy className="text-purple-600 text-2xl" />,
    bgColor: "bg-purple-50",
    title: "Badges & Leaderboard",
    description: "Earn achievement badges and rank up by helping others.",
    preview: (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
          <FaTrophy className="text-amber-400" size={11} />
          <span className="text-[11px] font-semibold text-amber-600">
            Top Helper
          </span>
        </div>
        <span className="text-xs text-slate-500">Rank #12 ↑</span>
      </div>
    ),
  },
];

// Parent container - stagger children ke liye
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Har card ka entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function FeaturesSection() {
  return (
    <section className=" text-[#1b1b24] min-h-screen py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-indigo-100/65 text-primary mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">
              WHY CHOOSE STUDYSHARP
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Everything you need to learn, track, and grow together
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            StudySharp combines social networking with academic productivity to
            help you succeed.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_12px_rgba(53,37,205,0.04)] hover:shadow-lg hover:shadow-indigo-500/10 transition-shadow duration-300 group flex flex-col items-start text-left"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5`}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Per-feature unique live preview */}
              <div className="mt-auto pt-4 border-t border-slate-50 w-full">
                {feature.preview}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
