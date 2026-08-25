export default function CTASection() {
  return (
    <section className=" px-5 py-20 text-center sm:py-28 lg:py-32">
      <div className="mx-auto max-w-310">
        <h2 className="mx-auto max-w-150 font-['Lexend'] text-3xl font-bold leading-tight tracking-tight text-[#10142a] sm:text-4xl">
          Your next learning connection is one click away.
        </h2>

        <p className="mt-4 text-base leading-relaxed text-[#565e76]">
          Ask a question. Share an idea. Meet someone who can help you learn
          better.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-[#4a3ae0] to-[#7c5cff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(74,58,224,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(74,58,224,0.5)]"
          >
            Join StudySharp
          </a>

          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-[#e7e8f1] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#10142a] transition hover:-translate-y-0.5 hover:border-[#10142a]"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
