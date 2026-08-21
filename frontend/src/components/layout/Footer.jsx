import footIcon from "../../assets/footIcon.png";

// ==================== SOCIAL ICONS (inline SVG, lucide dropped brand icons) ====================
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.89 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.55.55-1.1.89-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.55-.55-.89-1.1-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.55-.55 1.1-.89 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.4-8.4a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.04a4.28 4.28 0 00-7.29 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 003.43 4.2c-.65.18-1.34.2-1.98.08a4.29 4.29 0 004 2.98A8.58 8.58 0 012 18.4a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.55.84-.6 1.56-1.36 2.13-2.22-.77.34-1.6.57-2.42.67z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-20 bg-white/60 backdrop-blur-sm border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex gap-6 font-body text-sm text-muted">
          <a href="/about" className="hover:text-primary-600 transition">About</a>
          <a href="/contact" className="hover:text-primary-600 transition">Contact</a>
          <a href="/terms" className="hover:text-primary-600 transition">Terms</a>
        </div>

        <img src={footIcon} alt="Zyqora" className="h-10 w-10 rounded-xl2" />

        <div className="flex gap-4 text-ink">
          <a href="#" className="hover:text-primary-600 transition"><FacebookIcon /></a>
          <a href="#" className="hover:text-primary-600 transition"><InstagramIcon /></a>
          <a href="#" className="hover:text-primary-600 transition"><TwitterIcon /></a>
        </div>
      </div>
    </footer>
  );
}