import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  Heart,
  Bell,
  Search,
  ArrowLeft,
  ChevronDown,
  Package,
  LogOut,
  User as UserIcon,
  Crown,
  Star,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../api/auth.api";
import logo from "../../assets/logo.png";
import { setCartCount } from "../../features/cart/cartSlice";
import { getCart } from "../../api/cart.api";
import { getUnreadCount } from "../../api/notification.api";
import { getMyPlan } from "../../api/plan.api";
import { setActivePlan, clearActivePlan } from "../../features/plans/plansSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { itemCount } = useSelector((state) => state.cart);
  const [unreadCount, setUnreadCount] = useState(0);
  const { planType, expiresAt } = useSelector((state) => state.plan);

  // ==================== UNREAD NOTIFICATIONS ====================
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let isActive = true;
    getUnreadCount().then((res) => {
      if (isActive) setUnreadCount(res.count);
    });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, location.pathname]);

  // ==================== ACTIVE PLAN ====================
  useEffect(() => {
    if (isAuthenticated) {
      getMyPlan().then((res) => {
        if (res.plan?.planType && res.plan.planType !== "FREE") {
          dispatch(setActivePlan(res.plan));
        } else {
          dispatch(clearActivePlan());
        }
      });
    } else {
      dispatch(clearActivePlan());
    }
  }, [isAuthenticated, location.pathname]);

  // ==================== CART COUNT ====================
  useEffect(() => {
    if (isAuthenticated) {
      getCart().then((res) => {
        const count = res.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        dispatch(setCartCount(count));
      });
    } else {
      dispatch(setCartCount(0));
    }
  }, [isAuthenticated, dispatch]);

  // ==================== CLOSE DROPDOWN ON OUTSIDE CLICK ====================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // even if the API call fails, clear local state so the UI reflects logged-out
    }
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-5">
        {/* ==================== BACK ARROW ==================== */}
        {location.pathname !== "/" && (
          <button
            onClick={() => navigate(-1)}
            className="text-ink hover:text-primary-600 transition shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
        )}

        {/* ==================== LOGO ==================== */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zyqora" className="h-10 w-10 rounded-xl2" />
          <span className="font-display font-bold text-xl text-ink hidden sm:block">
            ZYQORA
          </span>
        </Link>

        {/* ==================== SEARCH ==================== */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-primary-100 bg-white px-5 py-2.5 pr-11 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-zyqora-gradient rounded-full p-2 text-white"
          >
            <Search size={16} />
          </button>
        </form>

        {/* ==================== ACTIONS ==================== */}
        <nav className="flex items-center gap-5 shrink-0 ml-2">
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="text-ink hover:text-primary-600 transition" aria-label="Wishlist">
                <Heart size={22} />
              </Link>

              <Link to="/notifications" className="relative text-ink hover:text-primary-600 transition" aria-label="Notifications">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-ink hover:text-primary-600 transition" aria-label="Cart">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {/* ==================== PLAN BADGE ==================== */}
              {planType && (
                <div
                  title={`${planType} Member — expires ${new Date(expiresAt).toLocaleString("en-IN")}`}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-display font-semibold ${
                    planType === "GOLD"
                      ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {planType === "GOLD" ? <Crown size={12} /> : <Star size={12} />}
                  <span className="hidden sm:inline">{planType}</span>
                </div>
              )}

              {/* ==================== PROFILE DROPDOWN ==================== */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 pl-1"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name || "Profile"}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-zyqora-gradient text-white flex items-center justify-center font-display font-semibold text-sm">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl2 shadow-card-hover border border-primary-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-primary-100">
                      <p className="font-display font-semibold text-sm text-ink truncate">
                        {user?.name || "User"}
                      </p>
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
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-body text-ink hover:bg-primary-50 transition"
                    >
                      <Package size={16} />
                      My Orders
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
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-display font-semibold text-sm text-ink hover:text-primary-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-display font-semibold text-sm bg-zyqora-gradient text-white rounded-full px-5 py-2 hover:shadow-card-hover transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
