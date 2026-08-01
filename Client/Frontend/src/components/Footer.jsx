import { FiTwitter, FiInstagram, FiGithub, FiLinkedin } from "react-icons/fi";

const linkGroups = [
  
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Signup", href: "/signup" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const socials = [
  { icon: FiTwitter, label: "Twitter", href: "https://twitter.com" },
  { icon: FiInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FiGithub, label: "GitHub", href: "https://github.com" },
  { icon: FiLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400">
      {/* signature accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-violet-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Social<span className="text-violet-400">App</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-xs">
              A place to share what's happening, connect with people, and
              keep the conversation going.
            </p>

            <div className="flex gap-4 mt-5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-violet-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm"
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
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} SocialApp. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">Made for people, not feeds.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;