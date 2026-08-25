import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: FolderTree, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/coupons", icon: Tag, label: "Coupons" },
  { to: "/admin/users", icon: Users, label: "Users" },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 shrink-0 bg-white/80 backdrop-blur-sm border-r border-primary-100 min-h-screen p-5 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <img src={logo} alt="Zyqora" className="h-9 w-9 rounded-xl2" />
        <div>
          <p className="font-display font-bold text-ink">ZYQORA</p>
          <p className="text-xs font-body text-muted">
            {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"} Panel
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition ${
                isActive
                  ? "bg-zyqora-gradient text-white font-medium"
                  : "text-ink hover:bg-primary-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-primary-100">
        <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-body text-muted hover:text-primary-600 transition"
        >
            <ArrowLeftCircle size={18} />
            Back to Store
        </Link>
        </div>
    </aside>
  );
}