import React from "react";
import { motion } from "framer-motion";
import {
  User,
  TrendingUp,
  HelpCircle,
  Users,
  MessageSquare,
  Compass,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <User className="w-5 h-5 text-indigo-600" />,
    title: "Create Your Learning Profile",
    description:
      "Build your student profile, add your interests and subjects, and discover people who share your learning goals.",
    type: "profile",
  },
  {
    number: "02",
    icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    title: "Track Your Study Progress",
    description:
      "Log your study hours, maintain daily streaks, and monitor your consistency across different subjects in real time.",
    type: "tracker",
  },
  {
    number: "03",
    icon: <HelpCircle className="w-5 h-5 text-indigo-600" />,
    title: "Ask. Answer. Learn.",
    description:
      "Post your academic doubts and get helpful answers from students who understand the topic.",
    type: "doubt",
  },
  {
    number: "04",
    icon: <Users className="w-5 h-5 text-indigo-600" />,
    title: "Connect With Like-Minded Students",
    description:
      "Find students with similar interests, follow their learning journey and build meaningful academic connections.",
    type: "connect",
  },
  {
    number: "05",
    icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
    title: "Learn Together in Real Time",
    description:
      "Chat with your connections, discuss concepts and collaborate without leaving StudySharp.",
    type: "chat",
  },
  {
    number: "06",
    icon: <Compass className="w-5 h-5 text-indigo-600" />,
    title: "Join Communities. Grow Together.",
    description:
      "Join communities based on subjects, technologies and interests to learn from a wider student network.",
    type: "community",
  },
];

function MockContent({ type }) {
  if (type === "profile") {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-sm font-bold text-white shadow-md">
            AR
          </div>
          <div>
            <b className="block text-sm text-gray-900">Arman Raza</b>
            <span className="text-xs text-gray-500 font-medium">
              B.Tech · 3rd Year
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {["MERN Stack", "DSA", "Web Dev"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-indigo-100 bg-indigo-50/50 px-2.5 py-1 text-[11px] font-medium text-indigo-600"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>
            <b className="block text-sm text-gray-900">128</b>Connections
          </span>
          <span>
            <b className="block text-sm text-gray-900">34</b>Answers
          </span>
          <span>
            <b className="block text-sm text-gray-900">12</b>Day streak
          </span>
        </div>
      </>
    );
  }

  if (type === "tracker") {
    return (
      <>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-800">
            Weekly Activity
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
            🔥 12 Days
          </span>
        </div>

        <div className="mt-3 flex h-20 items-end gap-1.5">
          {[40, 65, 30, 85, 55, 75, 95].map((val, idx) => (
            <div
              key={idx}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <div className="w-full rounded-t bg-gray-100 h-full relative overflow-hidden">
                <motion.div
                  initial={{ height: "0%" }}
                  whileInView={{ height: `${val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="absolute bottom-0 w-full bg-linear-to-t from-indigo-600 to-violet-500 rounded-t"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-500">
          <span>
            Today: <b>3h 40m</b>
          </span>
          <span className="text-indigo-600 font-medium">96% Goal</span>
        </div>
      </>
    );
  }

  if (type === "doubt") {
    return (
      <>
        <b className="text-[13px] leading-5 text-gray-900">
          How does async/await work in JavaScript?
        </b>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-md bg-indigo-50 px-2 py-1 font-mono text-[10px] text-indigo-600 font-semibold">
            JavaScript
          </span>
          <span className="rounded-md bg-indigo-50 px-2 py-1 font-mono text-[10px] text-indigo-600 font-semibold">
            Programming
          </span>
        </div>
        <div className="mt-4 flex gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>♡ 42</span>
          <span>◌ 9 answers</span>
          <span>🔖</span>
        </div>
      </>
    );
  }

  if (type === "connect") {
    return (
      <div className="relative h-40">
        {[
          ["SK", "Sara Khan", "DSA · Java"],
          ["RV", "Rohit Verma", "React · Node"],
          ["PN", "Priya Nair", "System Design"],
        ].map(([initials, name, subject], index) => (
          <div
            key={name}
            className="absolute left-0 right-0 flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition-all hover:border-indigo-200"
            style={{ top: `${index * 54}px`, opacity: 1 - index * 0.15 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-[11px] font-bold text-white shadow-xs">
              {initials}
            </div>
            <div>
              <b className="block text-xs text-gray-900">{name}</b>
              <span className="text-[10px] text-gray-500">{subject}</span>
            </div>
            <span className="ml-auto rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-semibold text-white">
              Follow
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chat") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
          Sara Khan{" "}
          <span className="text-[10px] font-normal text-gray-400">online</span>
        </div>
        <div className="w-fit rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-[11px] text-gray-800">
          Stuck on closures again 😅
        </div>
        <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2 text-[11px] text-white shadow-xs">
          Send your code, I'll take a look
        </div>
        <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2">
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {["Web Development", "AI & Machine Learning", "Data Structures"].map(
        (item, index) => (
          <div className="flex items-center gap-2" key={item}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
              {["<>", "⚙", "▥"][index]}
            </span>
            <div>
              <b className="block text-xs text-gray-900">{item}</b>
              <span className="text-[10px] text-gray-500">
                {["12.4k", "9.1k", "7.8k"][index]} members
              </span>
            </div>
            <span className="ml-auto text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer">
              Join
            </span>
          </div>
        ),
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="px-5 py-20 sm:py-28 lg:py-32 overflow-hidden bg-linear-to-b from-white via-indigo-50/10 to-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
            How StudySharp works
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-display">
            Everything you need to learn, connect and grow — in one place.
          </h2>
          <p className="text-base leading-relaxed text-gray-600">
            StudySharp brings students together to ask questions, share
            knowledge, discover resources and learn collaboratively.
          </p>
        </motion.div>

        {/* Steps Grid - 3 items per row on large screens */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white font-mono text-xs font-bold text-gray-700 shadow-xs transition-all group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900">
                  {step.number}
                </div>
              </div>

              <h3 className="text-lg font-bold leading-snug text-gray-900 font-display">
                {step.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                {step.description}
              </p>

              <div className="mt-auto pt-6">
                <div className="min-h-47.5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-inner">
                  <MockContent type={step.type} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mission / Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mt-24 overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(99,102,241,0.35),transparent_50%),radial-gradient(circle_at_85%_100%,rgba(139,92,246,0.3),transparent_50%)]" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4">
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl font-display">
              Ready to make learning social?
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              Join students who are learning, sharing and growing together.
            </p>

            <div className="mt-3 flex flex-col gap-3.5 sm:flex-row w-full justify-center">
              <a
                href="#"
                className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
              >
                Get Started
              </a>
              <a
                href="#"
                className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10"
              >
                Explore StudySharp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
