import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

// ... (keep the icon components as-is)

export default function Footer() {
  return (
    <footer className="mt-20 bg-white/60 backdrop-blur-sm border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex gap-6 font-body text-sm text-muted">
          <Link to="/about" className="hover:text-primary-600 transition">About</Link>
          <Link to="/contact" className="hover:text-primary-600 transition">Contact</Link>
          <Link to="/terms" className="hover:text-primary-600 transition">Terms</Link>
        </div>

        <img src={logo} alt="Zyqora" className="h-10 w-10 rounded-xl2" />

        <div className="flex gap-4 text-ink">
          <a href="#" aria-label="Facebook" className="hover:text-primary-600 transition">f</a>
          <a href="#" aria-label="Instagram" className="hover:text-primary-600 transition">◎</a>
          <a href="#" aria-label="Twitter" className="hover:text-primary-600 transition">𝕏</a>
        </div>
      </div>
    </footer>
  );
}
