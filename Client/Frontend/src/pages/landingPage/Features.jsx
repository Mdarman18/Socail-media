import React from "react";
import { featurePage } from "../../data/data";
import { motion } from "framer-motion";

// Container animation for staggered grid children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Individual card smooth fade-up animation
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Features = () => {
  return (
    <section className="w-full px-3 py-8 sm:px-5 sm:py-4 md:px-8 lg:px-12 xl:px-16 overflow-hidden">
      {/* Section Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-5 text-center text-2xl font-bold text-gray-800 sm:mb-10 sm:text-3xl"
      >
        Everything You'll Learn
      </motion.h1>

      {/* Feature Cards Grid with Stagger Effect */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featurePage?.map((ele, idx) => {
          const Icon = ele.logo;

          return (
            <motion.div
              variants={cardVariants}
              key={idx}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-amber-500/20 sm:rounded-2xl"
            >
              {/* Content Section */}
              <div className="flex flex-col p-5">
                <div className="flex items-center text-black">
                  <span
                    className={`p-3 rounded-full mb-6 ${ele.iconBg} ${ele.iconColor}`}
                  >
                    <Icon className="text-xl sm:text-2xl" />
                  </span>
                  <div className="flex flex-col p-4">
                    <h3 className="text-lg font-bold text-gray-700">
                      {ele?.text}
                    </h3>
                    <p className="text-sm leading-tight text-gray-600">
                      {ele?.para}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="mt-auto sm:mb-1 sm:p-1 bg-gray-600 rounded-2xl overflow-hidden">
                <img
                  src={ele?.img}
                  alt={ele?.text}
                  className="block rounded-lg  w-full  h-54  object-contain transition-transform duration-500 group-hover:scale-105 md:h-52"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Learning Community & Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-8 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
      >
        <div className="w-full p-5 sm:p-6 md:p-7">
          {/* Header */}
          <div className="mb-6 flex w-full items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl">
              📚
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-500">
                Our Learning Community
              </h3>
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Learn • Share • Grow
              </h2>
            </div>
          </div>

          {/* Stats */}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <div className="flex min-h-30 flex-col justify-center rounded-xl bg-blue-50 p-4 transition-transform duration-300 hover:scale-[1.02]">
              <div className="mb-2 text-2xl">👨‍🎓</div>
              <h3 className="text-2xl font-bold text-blue-600">1K+</h3>
              <p className="mt-1 text-sm font-medium text-gray-600">
                Active Users
              </p>
            </div>

            <div className="flex min-h-30 flex-col justify-center rounded-xl bg-green-50 p-4 transition-transform duration-300 hover:scale-[1.02]">
              <div className="mb-2 text-2xl">💡</div>
              <h3 className="text-2xl font-bold text-green-600">2K+</h3>
              <p className="mt-1 text-sm font-medium text-gray-600">
                Doubts Solved
              </p>
            </div>

            <div className="flex min-h-30 flex-col justify-center rounded-xl bg-purple-50 p-4 transition-transform duration-300 hover:scale-[1.02]">
              <div className="mb-2 text-2xl">📝</div>
              <h3 className="text-2xl font-bold text-purple-600">1K+</h3>
              <p className="mt-1 text-sm font-medium text-gray-600">
                Blogs & Articles
              </p>
            </div>

            <div className="flex min-h-30 flex-col justify-center rounded-xl bg-pink-50 p-4 transition-transform duration-300 hover:scale-[1.02]">
              <div className="mb-2 text-2xl">🎬</div>
              <h3 className="text-2xl font-bold text-pink-600">5K+</h3>
              <p className="mt-1 text-sm font-medium text-gray-600">
                Educational Reels
              </p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center font-medium leading-relaxed text-gray-600 text-md">
            "Every question you ask brings you one step closer to understanding.
            Keep learning, keep asking, and keep growing."
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Ask doubts • Share knowledge • Learn together
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
