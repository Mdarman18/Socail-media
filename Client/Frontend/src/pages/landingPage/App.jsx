import React from "react";
import { motion } from "framer-motion";
import HowItWorks from "./components/HowItWorks";
import StudyTracker from "./components/StudyTracker";
import About from "./components/About";
import CTASection from "./components/CTASection";

// Standard animation variant for smooth fade-in and slide-up effect
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
      >
        <StudyTracker />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15 }}
        variants={sectionVariant}
      >
        <CTASection />
      </motion.div>
    </div>
  );
}
