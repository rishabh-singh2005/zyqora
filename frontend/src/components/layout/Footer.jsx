import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

/* ==================== SOCIAL ICONS ==================== */

const FacebookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.89 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.55.55-1.1.89-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.55-.55-.89-1.1-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.55-.55 1.1-.89 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.4-8.4a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26L22.827 21.75h-6.937l-5.432-7.11-6.21 7.11H.94l7.73-8.835L1.172 2.25h7.113l4.91 6.49 5.049-6.49zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

/* ==================== FOOTER LINKS ==================== */

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", to: "/products" },
    { label: "Pricing Plans", to: "/pricing" },
    { label: "Wishlist", to: "/wishlist" },
  ],

  Account: [
    { label: "My Profile", to: "/profile" },
    { label: "My Orders", to: "/orders" },
    { label: "Saved Addresses", to: "/addresses" },
  ],

  Company: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Terms & Conditions", to: "/terms" },
  ],
};

/* ==================== SOCIAL LINKS ==================== */

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    Icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "#",
    Icon: InstagramIcon,
  },
  {
    label: "X",
    href: "#",
    Icon: TwitterIcon,
  },
];

/* ==================== FOOTER ==================== */

export default function Footer() {
  return (
    <footer className="mt-3 bg-gradient-to-r from-purple-300 via-white to-orange-300 backdrop-blur-sm">
      {/* ==================== MAIN FOOTER ==================== */}
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          py-8 sm:py-10
          grid gap-y-10 gap-x-8
          grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5
        "
      >
        {/* BRAND SECTION */}
        <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl2 bg-black overflow-hidden shrink-0">
              <img
                src={logo}
                alt="Zyqora"
                className="h-10 w-10 rounded-xl2 object-cover scale-[1.3]"
              />
            </div>

            <span className="font-display font-bold text-xl text-ink tracking-wide">
              ZYQORA
            </span>
          </Link>

          {/* Description */}
          <p className="text-sm font-body text-muted max-w-sm leading-6">
            Shop Beyond Ordinary — curated collections, trending must-haves,
            and everyday essentials, delivered straight to your door.
          </p>
        </div>

        {/* LINK COLUMNS */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="col-span-1 space-y-4">
            <h3 className="font-display font-semibold text-sm text-ink uppercase tracking-wide">
              {heading}
            </h3>

            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-body text-muted hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ==================== BOTTOM BAR ==================== */}
      <div className="border-t border-purple-400">
        <div
          className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-4
            flex flex-col gap-4
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          {/* Copyright + Contact Information */}
          <div
            className="
              flex flex-col gap-3
              sm:flex-row sm:flex-wrap sm:items-center
              sm:gap-x-6 sm:gap-y-2
              text-center sm:text-left
            "
          >
            <p className="text-xs font-body text-muted">
              © {new Date().getFullYear()} Zyqora. All rights reserved.
            </p>

            <div
              className="
                flex flex-col gap-2
                sm:flex-row sm:flex-wrap sm:items-center
                justify-center sm:justify-start
                gap-x-20 gap-y-2
                text-sm font-body text-muted
                translate-x-40
              "
            >
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-primary-600 shrink-0" />
                <span className="break-all">support@zyqora.com</span>
              </p>

              <p className="flex items-center justify-center sm:justify-start gap-2">
                <Phone size={15} className="text-primary-600 shrink-0" />
                <span>+91 9876543210</span>
              </p>

              <p className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin size={15} className="text-primary-600 shrink-0" />
                <span>New Delhi, India</span>
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center lg:justify-end gap-3">
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
      </div>
    </footer>
  );
}