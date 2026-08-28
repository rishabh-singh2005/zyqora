import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Shield,
  Store,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../api/auth.api";
import logo from "../../assets/logo.png";

const SEARCH_SCOPES = [
  { value: "products", label: "Products", path: "/admin/products" },
  { value: "users", label: "Users", path: "/admin/users" },
];

/* ====================================================================
   SearchForm lives OUTSIDE AdminNavbar.
   Defining a component inside another component's body means React
   sees a brand-new component type on every render of the parent,
   so it unmounts/remounts SearchForm (and its <input>) each time —
   that's the "Cannot create components during render" error and why
   autoFocus / typing felt broken. Hoisting it out + passing state in
   as props fixes it.
==================================================================== */
function SearchForm({ scope, setScope, searchTerm, setSearchTerm, onSubmit, className = "", autoFocus = false }) {
  return (
    <form onSubmit={onSubmit} className={`flex gap-2 ${className}`}>
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="rounded-lg border border-primary-100 px-2 py-2 text-sm font-body outline-none focus:border-primary-500 bg-white shrink-0"
      >
        {SEARCH_SCOPES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${scope}...`}
          autoFocus={autoFocus}
          className="w-full rounded-lg border border-primary-100 pl-4 pr-10 py-2 text-sm font-body focus:border-primary-500 outline-none transition"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-zyqora-gradient rounded-full p-1.5 text-white"
        >
          <Search size={14} />
        </button>
      </div>
    </form>
  );
}

export default function AdminNavbar({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scope, setScope] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const target = SEARCH_SCOPES.find((s) => s.value === scope);
    navigate(`${target.path}${searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ""}`);
    setMobileSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // clear local state regardless
    }
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-soft border-b border-primary-100">
      <div className="px-3 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">
        {/* ==================== MOBILE MENU BUTTON ==================== */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open admin menu"
          className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-100 text-ink hover:bg-primary-50 transition"
        >
          <Menu size={19} />
        </button>

        {/* ==================== LOGO ==================== */}
        <Link to="/admin" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zyqora" className="h-9 w-9 rounded-xl2" />
          <span className="font-display font-bold text-lg text-ink hidden sm:block">ZYQORA</span>
        </Link>

        {/* ==================== ADMIN SEARCH (tablet/desktop) ==================== */}
        <SearchForm
          scope={scope}
          setScope={setScope}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearch}
          className="flex-1 max-w-lg hidden md:flex"
        />

        {/* ==================== ACTIONS ==================== */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
            aria-expanded={mobileSearchOpen}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-primary-100 text-ink hover:bg-primary-50 transition"
          >
            {mobileSearchOpen ? <X size={17} /> : <Search size={17} />}
          </button>

          <Link
            to="/"
            title="View Store"
            className="flex items-center gap-1.5 text-sm font-body text-muted hover:text-primary-600 transition"
          >
            <Store size={18} />
            <span className="hidden md:inline">View Store</span>
          </Link>

          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-display font-bold text-white bg-gradient-to-r from-accent-500 to-secondary-500"
            title={user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
          >
            <Shield size={14} />
            <span className="hidden sm:inline">
              {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN"}
            </span>
          </div>

          {/* ==================== PROFILE DROPDOWN ==================== */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1.5">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name || "Profile"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zyqora-gradient text-white flex items-center justify-center font-display font-semibold text-xs">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              <ChevronDown
                size={14}
                className={`hidden sm:block text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl2 shadow-card-hover border border-primary-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-primary-100">
                  <p className="font-display font-semibold text-sm text-ink truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-muted font-body truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-body text-ink hover:bg-primary-50 transition"
                >
                  <UserIcon size={16} />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-secondary-600 hover:bg-secondary-100/50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== MOBILE SEARCH ROW ==================== */}
      {mobileSearchOpen && (
        <div className="px-3 pb-3 md:hidden">
          <SearchForm
            scope={scope}
            setScope={setScope}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={handleSearch}
            autoFocus
          />
        </div>
      )}
    </header>
  );
}