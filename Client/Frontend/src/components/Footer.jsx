import { FaHeart, FaTelegram } from "react-icons/fa";
import { FiInstagram, FiGithub, FiLinkedin } from "react-icons/fi";
import { Link } from "react-router-dom";

const linkGroups = [
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Signup", href: "/login" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "" },
      { label: "Terms", href: "" },
    ],
  },
];

const socials = [
  { icon: FaTelegram, label: "Twitter", href: "https://t.me/only_arman18" },
  {
    icon: FiInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/only_arman18/",
  },
  { icon: FiGithub, label: "GitHub", href: "https://github.com/Mdarman18" },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/md-imran-006751392/",
  },
];

const Footer = () => {
  return (
    <footer className="relative bg-linear-to-b from-[#0a0f16] to-[#050809] text-slate-400 overflow-hidden">
      {/* soft steel-blue glow blobs for premium depth */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 bg-sky-600/10 blur-[100px] rounded-full" />
      <div className="pointer-events-none absolute -top-10 right-1/4 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full" />

      {/* signature accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-sky-500 to-cyan-500/60" />

      <div className="relative max-w-7xl mx-auto mt-2 px-6 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Study
              <span className="bg-linear-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Sharp
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xs">
              A place to ask doubts, share knowledge, connect with peers, and
              sharpen your skills together.
            </p>

            <div className="flex gap-3 mt-5 flex-wrap">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-sky-500/60 hover:bg-sky-500/10 hover:shadow-[0_0_14px_rgba(56,189,248,0.35)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.title} className="min-w-28">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-300">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <>
          <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} StudySharp. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Made for people, not feeds.
            </p>
          </div>
        </>
      </div>
    </footer>
  );
};

export default Footer;
