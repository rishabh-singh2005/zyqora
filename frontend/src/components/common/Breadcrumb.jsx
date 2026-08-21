import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm font-body text-muted mb-6">
      <Link to="/" className="flex items-center gap-1 hover:text-primary-600 transition">
        <Home size={14} />
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight size={14} />
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-600 transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}