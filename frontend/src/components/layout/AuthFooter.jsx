import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

/* ==================== SOCIAL ICONS ==================== */

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.89 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.55.55-1.1.89-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.55-.55-.89-1.1-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.55-.55 1.1-.89 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.4-8.4a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26L22.827 21.75h-6.937l-5.432-7.11-6.21 7.11H.94l7.73-8.835L1.172 2.25h7.113l4.91 6.49 5.049-6.49zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "X", href: "#", Icon: TwitterIcon },
];

const INFO_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Terms & Conditions", to: "/terms" },
];

/* ==================== AUTH FOOTER ==================== */

export default function AuthFooter() {
  return (
    <footer className="mt-3 bg-gradient-to-r from-purple-300 via-white to-orange-300 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col items-center text-center gap-4">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl2 bg-black overflow-hidden shrink-0">
            <img src={logo} alt="Zyqora" className="h-10 w-10 rounded-xl2 object-cover scale-[1.3]" />
          </div>
          <span className="font-display font-bold text-xl text-ink tracking-wide">ZYQORA</span>
        </Link>

        {/* Tagline */}
        <p className="text-sm font-body text-muted max-w-md leading-6">
          Shop Beyond Ordinary — curated collections, trending must-haves, and everyday
          essentials, delivered straight to your door.
        </p>

        {/* Info links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-body text-muted">
          {INFO_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="hover:text-primary-600 transition">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              className="flex items-center justify-center h-9 w-9 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 hover:text-primary-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
          <p className="text-xs font-body text-muted">
            © {new Date().getFullYear()} Zyqora. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs font-body text-muted">
            <p className="flex items-center gap-2">
              <Mail size={13} className="text-primary-600 shrink-0" />
              support@zyqora.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={13} className="text-primary-600 shrink-0" />
              +91 9876543210
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-primary-600 shrink-0" />
              New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}