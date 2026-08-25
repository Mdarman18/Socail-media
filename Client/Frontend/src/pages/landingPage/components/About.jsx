const orbitNodes = [
  ["Doubts", "50%", "14.6%"],
  ["Answers", "80.7%", "32.3%"],
  ["Connections", "80.7%", "67.7%"],
  ["Messages", "50%", "85.4%"],
  ["Communities", "19.3%", "67.7%"],
  ["Resources", "19.3%", "32.3%"],
];

const values = [
  [
    "01",
    "Learn together",
    "Encourage students to exchange knowledge and help each other understand difficult concepts.",
    "👥",
  ],
  [
    "02",
    "Share what you know",
    "Turn individual knowledge into something the entire student community can benefit from.",
    "↗",
  ],
  [
    "03",
    "Find your people",
    "Connect with students who share your interests, goals and subjects.",
    "◎",
  ],
  [
    "04",
    "Keep improving",
    "Build consistent learning habits through interaction, discussion and community.",
    "↗",
  ],
];

export default function About() {
  return (
    <section className=" px-5 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-310">
        <div className="mx-auto mb-16 flex max-w-170 flex-col items-center gap-5 text-center">
          <span className="rounded-full bg-[#eeebff] px-4 py-2 font-mono text-xs uppercase tracking-[.14em] text-[#4a3ae0]">
            ● About StudySharp
          </span>

          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#10142a] sm:text-4xl">
            Learning becomes better when you don't learn alone.
          </h2>

          <p className="max-w-130 text-base leading-relaxed text-[#565e76]">
            StudySharp is a social learning platform built to make academic
            collaboration easier, more accessible and more engaging for
            students.
          </p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
          {/* Orbit visual */}
          <div className="relative mx-auto aspect-square w-full max-w-120">
            <div className="absolute inset-[18%] rounded-full border border-[#e7e8f1]" />
            <div className="absolute inset-[30%] rounded-full border border-dashed border-[#dcdcf0]" />

            <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] text-center text-white shadow-[0_18px_40px_-12px_rgba(74,58,224,.5)]">
              <strong className="font-display text-lg">S↗</strong>
              <small className="font-mono text-[9px] opacity-80">
                StudySharp
              </small>
            </div>

            {orbitNodes.map(([label, left, top]) => (
              <div
                key={label}
                className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[#e7e8f1] bg-white px-3 py-2 text-xs font-semibold text-[#10142a] shadow-sm transition hover:scale-105 hover:shadow-lg"
                style={{ left, top }}
              >
                <span className="h-2 w-2 rounded-full bg-[#4a3ae0]" />
                {label}
              </div>
            ))}

            <span className="absolute left-1/2 top-[16%] h-2 w-2 animate-ping rounded-full bg-[#7c5cff]" />
            <span className="absolute right-[19%] top-[32%] h-2 w-2 animate-ping rounded-full bg-[#7c5cff]" />
            <span className="absolute bottom-[16%] left-1/2 h-2 w-2 animate-ping rounded-full bg-[#7c5cff]" />
          </div>

          {/* Story and values */}
          <div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold leading-tight text-[#10142a]">
                Built for the way students actually learn.
              </h3>

              <p className="text-[15px] leading-7 text-[#565e76]">
                Students don't learn only from textbooks and classrooms. They
                learn by asking questions, discussing ideas, sharing resources
                and helping each other. StudySharp brings these experiences
                together in one connected platform.
              </p>

              <p className="text-[15px] leading-7 text-[#565e76]">
                Whether you're stuck on a difficult concept, looking for study
                partners, sharing useful notes or joining a community around
                your interests, StudySharp gives you a place to learn with
                others.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {values.map(([number, title, text, icon]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-[#e7e8f1] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="font-mono text-[11px] text-[#8a90a6]">
                    {number}
                  </div>

                  <div className="my-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eeebff] text-lg text-[#4a3ae0]">
                    {icon}
                  </div>

                  <h4 className="font-display text-sm font-semibold text-[#10142a]">
                    {title}
                  </h4>

                  <p className="mt-2 text-xs leading-relaxed text-[#565e76]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="relative mt-24 overflow-hidden rounded-[28px] bg-[#0c0f22] px-6 py-16 text-center sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,92,255,.3),transparent_45%),radial-gradient(circle_at_85%_100%,rgba(74,58,224,.35),transparent_45%)]" />

          <div className="relative mx-auto flex max-w-160 flex-col items-center gap-4">
            <span className="rounded-full bg-[#7c5cff29] px-4 py-2 font-mono text-xs uppercase tracking-[.14em] text-[#b8acff]">
              ● Our mission
            </span>

            <h3 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Make learning more connected, collaborative and accessible.
            </h3>

            <p className="text-base leading-relaxed text-white/60">
              StudySharp aims to create a digital space where every student can
              ask questions, share knowledge, find the right people and grow
              together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
