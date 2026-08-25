const steps = [
  {
    number: "01",
    icon: "♙",
    title: "Create Your Learning Profile",
    description:
      "Build your student profile, add your interests and subjects, and discover people who share your learning goals.",
    type: "profile",
  },
  {
    number: "02",
    icon: "?",
    title: "Ask. Answer. Learn.",
    description:
      "Post your academic doubts and get helpful answers from students who understand the topic.",
    type: "doubt",
  },
  {
    number: "03",
    icon: "♧",
    title: "Connect With Like-Minded Students",
    description:
      "Find students with similar interests, follow their learning journey and build meaningful academic connections.",
    type: "connect",
  },
  {
    number: "04",
    icon: "◌",
    title: "Learn Together in Real Time",
    description:
      "Chat with your connections, discuss concepts and collaborate without leaving StudySharp.",
    type: "chat",
  },
  {
    number: "05",
    icon: "◇",
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-sm font-bold text-white">
            AR
          </div>
          <div>
            <b className="block text-sm">Arman Raza</b>
            <span className="text-xs text-[#8a90a6]">B.Tech · 3rd Year</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {["MERN Stack", "DSA", "Web Dev"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#eff0f7] bg-[#f4f5fc] px-2.5 py-1 text-[11px] text-[#565e76]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-4 border-t border-[#eff0f7] pt-3 text-xs">
          <span>
            <b className="block text-sm">128</b>Connections
          </span>
          <span>
            <b className="block text-sm">34</b>Answers
          </span>
          <span>
            <b className="block text-sm">12</b>Day streak
          </span>
        </div>
      </>
    );
  }

  if (type === "doubt") {
    return (
      <>
        <b className="text-[13px] leading-5">
          How does async/await work in JavaScript?
        </b>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-md bg-[#eeebff] px-2 py-1 font-mono text-[10px] text-[#4a3ae0]">
            JavaScript
          </span>
          <span className="rounded-md bg-[#eeebff] px-2 py-1 font-mono text-[10px] text-[#4a3ae0]">
            Programming
          </span>
        </div>
        <div className="mt-4 flex gap-4 border-t border-[#eff0f7] pt-3 text-xs text-[#8a90a6]">
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
            className="absolute left-0 right-0 flex items-center gap-2 rounded-xl border border-[#e7e8f1] bg-white p-2.5 shadow-sm"
            style={{ top: `${index * 54}px`, opacity: 1 - index * 0.15 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-[11px] font-bold text-white">
              {initials}
            </div>
            <div>
              <b className="block text-xs">{name}</b>
              <span className="text-[10px] text-[#8a90a6]">{subject}</span>
            </div>
            <span className="ml-auto rounded-full bg-[#10142a] px-2.5 py-1 text-[10px] font-semibold text-white">
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
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-[#17a167] shadow-[0_0_0_3px_#e8f8f0]" />
          Sara Khan{" "}
          <span className="text-[10px] font-normal text-[#8a90a6]">online</span>
        </div>
        <div className="w-fit rounded-2xl rounded-bl-sm bg-[#f4f5fc] px-3 py-2 text-[11px]">
          Stuck on closures again 😅
        </div>
        <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#4a3ae0] px-3 py-2 text-[11px] text-white">
          Send your code, I'll take a look
        </div>
        <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-[#f4f5fc] px-3 py-2">
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a90a6]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a90a6] [animation-delay:150ms]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a90a6] [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {["Web Development", "AI & Machine Learning", "Data Structures"].map(
        (item, index) => (
          <div className="flex items-center gap-2" key={item}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eeebff] text-[#4a3ae0]">
              {["<>", "⚙", "▥"][index]}
            </span>
            <div>
              <b className="block text-xs">{item}</b>
              <span className="text-[10px] text-[#8a90a6]">
                {["12.4k", "9.1k", "7.8k"][index]} members
              </span>
            </div>
            <span className="ml-auto text-[10px] font-semibold text-[#4a3ae0]">
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
    <section className=" px-5 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-310">
        <div className="mx-auto mb-16 flex max-w-170 flex-col items-center gap-5 text-center">
          <span className="rounded-full bg-[#eeebff] px-4 py-2 font-mono text-xs uppercase tracking-[.14em] text-[#4a3ae0]">
            ● How StudySharp works
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight text-[#10142a] sm:text-4xl">
            Everything you need to learn, connect and grow — in one place.
          </h2>
          <p className="max-w-130 text-base leading-relaxed text-[#565e76]">
            StudySharp brings students together to ask questions, share
            knowledge, discover resources and learn collaboratively.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <article key={step.number} className="group">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7e8f1] bg-white font-mono text-sm text-[#565e76] transition group-hover:bg-[#10142a] group-hover:text-white">
                  {step.number}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeebff] text-xl text-[#4a3ae0]">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold leading-snug text-[#10142a]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#565e76]">
                {step.description}
              </p>

              <div className="mt-5 min-h-47.5 rounded-2xl border border-[#e7e8f1] bg-white p-4 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
                <MockContent type={step.type} />
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-24 overflow-hidden rounded-[28px] bg-[#10142a] px-6 py-16 text-center sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(124,92,255,.35),transparent_45%),radial-gradient(circle_at_85%_100%,rgba(74,58,224,.4),transparent_45%)]" />

          <div className="relative mx-auto flex max-w-125 flex-col items-center gap-4">
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to make learning social?
            </h3>
            <p className="text-sm text-white/70">
              Join students who are learning, sharing and growing together.
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="rounded-full bg-linear-to-r from-[#4a3ae0] to-[#7c5cff] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1"
              >
                Get Started
              </a>
              <a
                href="#"
                className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Explore StudySharp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
