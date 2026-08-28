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
  Shield,
} from "lucide-react";

import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../api/auth.api";
import logo from "../../assets/logo.png";
import { setCartCount } from "../../features/cart/cartSlice";
import { getCart } from "../../api/cart.api";
import { getUnreadCount } from "../../api/notification.api";
import { getMyPlan } from "../../api/plan.api";
import {
  setActivePlan,
  clearActivePlan,
} from "../../features/plans/plansSlice";

/* ============================================================
   SEARCH FORM
   Declared OUTSIDE Navbar to avoid React render warning/error
============================================================ */

const SearchForm = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  mobile = false,
}) => {
  return (
    <form
      onSubmit={handleSearch}
      className={
        mobile
          ? "relative w-full min-w-0"
          : "relative hidden min-w-0 flex-1 md:flex"
      }
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products or categories..."
        aria-label="Search products"
        className="
          w-full
          min-w-0
          rounded-full
          border border-primary-100
          bg-white
          px-4
          py-2.5
          pr-11
          font-body
          text-sm
          text-ink
          outline-none
          transition
          placeholder:text-muted
          focus:border-primary-500
          focus:ring-2
          focus:ring-primary-100
          sm:px-5
        "
      />

      <button
        type="submit"
        aria-label="Search"
        title="Search"
        className="
          absolute
          right-1.5
          top-1/2
          -translate-y-1/2
          rounded-full
          bg-zyqora-gradient
          p-2
          text-white
          transition
          hover:shadow-card-hover
        "
      >
        <Search size={16} />
      </button>
    </form>
  );
};

/* ============================================================
   NAVBAR
============================================================ */

export default function Navbar() {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const { itemCount } = useSelector(
    (state) => state.cart
  );

  const { planType, expiresAt } = useSelector(
    (state) => state.plan
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef(null);

  /* ============================================================
     UNREAD NOTIFICATIONS
  ============================================================ */

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return undefined;
    }

    let isActive = true;

    getUnreadCount()
      .then((res) => {
        if (isActive) {
          setUnreadCount(res?.count || 0);
        }
      })
      .catch(() => {
        if (isActive) {
          setUnreadCount(0);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, location.pathname]);

  /* ============================================================
     ACTIVE PLAN
  ============================================================ */

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearActivePlan());
      return;
    }

    let isActive = true;

    getMyPlan()
      .then((res) => {
        if (!isActive) return;

        if (
          res?.plan?.planType &&
          res.plan.planType !== "FREE"
        ) {
          dispatch(setActivePlan(res.plan));
        } else {
          dispatch(clearActivePlan());
        }
      })
      .catch(() => {
        if (isActive) {
          dispatch(clearActivePlan());
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, location.pathname, dispatch]);

  /* ============================================================
     CART COUNT
  ============================================================ */

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setCartCount(0));
      return;
    }

    let isActive = true;

    getCart()
      .then((res) => {
        if (!isActive) return;

        const count =
          res?.cart?.items?.reduce(
            (sum, item) => sum + item.quantity,
            0
          ) || 0;

        dispatch(setCartCount(count));
      })
      .catch(() => {
        if (isActive) {
          dispatch(setCartCount(0));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, dispatch]);

  /* ============================================================
     CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  ============================================================ */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ============================================================
     SEARCH
  ============================================================ */

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      navigate(
        `/products?search=${encodeURIComponent(
          trimmedSearch
        )}`
      );
    }
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if API logout fails, clear local state.
    }

    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  };

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        bg-white/70
        backdrop-blur-md
        shadow-soft
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          py-2.5
          sm:px-4
          sm:py-3
          lg:px-6
        "
      >
        {/* ======================================================
            TOP NAVIGATION ROW
        ====================================================== */}

        <div
          className="
            flex
            min-w-0
            w-full
            items-center
            gap-2
            sm:gap-3
            lg:gap-5
          "
        >
          {/* ====================================================
              BACK ARROW
          ==================================================== */}

          {location.pathname !== "/" && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                shrink-0
                items-center
                justify-center
                rounded-full
                p-1
                text-ink
                transition
                hover:bg-primary-50
                hover:text-primary-600
              "
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft
                size={20}
                className="sm:h-[22px] sm:w-[22px]"
              />
            </button>
          )}

          {/* ====================================================
              LOGO
          ==================================================== */}

          <Link
            to="/"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              sm:gap-2
            "
            aria-label="Zyqora Home"
          >
            <img
              src={logo}
              alt="Zyqora"
              className="
                h-9
                w-9
                rounded-xl2
                object-cover
                sm:h-10
                sm:w-10
              "
            />

            <span
              className="
                hidden
                font-display
                text-xl
                font-bold
                tracking-wide
                text-ink
                sm:block
              "
            >
              ZYQORA
            </span>
          </Link>

          {/* ====================================================
              DESKTOP SEARCH
              Hidden below md
          ==================================================== */}

          <SearchForm
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />

          {/* ====================================================
              ADMIN BUTTON
          ==================================================== */}

          {isAuthenticated &&
            (user?.role === "ADMIN" ||
              user?.role === "SUPER_ADMIN") && (
              <Link
                to="/admin"
                aria-label="Admin Panel"
                title="Admin Panel"
                className="
                  group
                  relative
                  flex
                  shrink-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  border
                  border-accent-300/60
                  bg-gradient-to-r
                  from-accent-500
                  via-secondary-500
                  to-accent-500
                  bg-[length:200%_100%]
                  px-2.5
                  py-2
                  text-white
                  shadow-md
                  shadow-accent-500/20
                  transition-all
                  duration-300
                  hover:bg-[position:100%_0]
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  hover:shadow-accent-500/30
                  sm:px-3.5
                "
              >
                <Shield
                  size={16}
                  strokeWidth={2.5}
                  className="
                    shrink-0
                    drop-shadow-sm
                    transition-transform
                    duration-300
                    group-hover:rotate-6
                  "
                />

                <span
                  className="
                    hidden
                    font-display
                    text-xs
                    font-bold
                    tracking-wide
                    xl:inline
                  "
                >
                  {user?.role === "SUPER_ADMIN"
                    ? "SUPER ADMIN"
                    : "ADMIN"}
                </span>
              </Link>
            )}

          {/* ====================================================
              ACTIONS
          ==================================================== */}

          <nav
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
              md:gap-4
              lg:gap-5
            "
            aria-label="User actions"
          >
            {isAuthenticated ? (
              <>
                {/* =================================================
                    ORDERS
                ================================================= */}

                <Link
                  to="/orders"
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-ink
                    transition
                    hover:text-primary-600
                  "
                  aria-label="My Orders"
                  title="My Orders"
                >
                  <Package
                    size={20}
                    className="sm:h-[22px] sm:w-[22px]"
                  />
                </Link>

                {/* =================================================
                    WISHLIST
                ================================================= */}

                <Link
                  to="/wishlist"
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-ink
                    transition
                    hover:text-primary-600
                  "
                  aria-label="Wishlist"
                  title="Wishlist"
                >
                  <Heart
                    size={20}
                    className="sm:h-[22px] sm:w-[22px]"
                  />
                </Link>

                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Link
                  to="/notifications"
                  className="
                    relative
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-ink
                    transition
                    hover:text-primary-600
                  "
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell
                    size={20}
                    className="sm:h-[22px] sm:w-[22px]"
                  />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1.5
                        -top-1.5
                        flex
                        h-4
                        min-w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-secondary-500
                        px-1
                        text-[9px]
                        font-semibold
                        leading-none
                        text-white
                        sm:text-[10px]
                      "
                    >
                      {unreadCount > 9
                        ? "9+"
                        : unreadCount}
                    </span>
                  )}
                </Link>

                {/* =================================================
                    CART
                ================================================= */}

                <Link
                  to="/cart"
                  className="
                    relative
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-ink
                    transition
                    hover:text-primary-600
                  "
                  aria-label="Cart"
                  title="Cart"
                >
                  <ShoppingCart
                    size={20}
                    className="sm:h-[22px] sm:w-[22px]"
                  />

                  {itemCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1.5
                        -top-1.5
                        flex
                        h-4
                        min-w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-secondary-500
                        px-1
                        text-[9px]
                        font-semibold
                        leading-none
                        text-white
                        sm:text-[10px]
                      "
                    >
                      {itemCount > 9
                        ? "9+"
                        : itemCount}
                    </span>
                  )}
                </Link>

                {/* =================================================
                    PLAN BADGE

                    Hidden on very small screens to prevent
                    navbar overflow.
                ================================================= */}

                {planType && (
                  <div
                    title={`${planType} Member — expires ${new Date(
                      expiresAt
                    ).toLocaleString("en-IN")}`}
                    className={`
                      hidden
                      shrink-0
                      items-center
                      gap-1
                      rounded-full
                      px-2
                      py-1
                      text-[10px]
                      font-display
                      font-semibold
                      whitespace-nowrap
                      sm:flex
                      sm:px-2.5
                      sm:text-xs
                      ${
                        planType === "GOLD"
                          ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white"
                          : "bg-primary-100 text-primary-600"
                      }
                    `}
                  >
                    {planType === "GOLD" ? (
                      <Crown size={11} />
                    ) : (
                      <Star size={11} />
                    )}

                    <span>{planType}</span>
                  </div>
                )}

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                <div
                  className="relative shrink-0"
                  ref={menuRef}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMenuOpen((prev) => !prev)
                    }
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-full
                      pl-0.5
                      sm:gap-1.5
                      sm:pl-1
                    "
                    aria-label="Open profile menu"
                    aria-expanded={menuOpen}
                  >
                    {/* Profile Image */}

                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name || "Profile"}
                        className="
                          h-8
                          w-8
                          rounded-full
                          border-2
                          border-primary-100
                          object-cover
                          sm:h-9
                          sm:w-9
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-zyqora-gradient
                          text-sm
                          font-display
                          font-semibold
                          text-white
                          sm:h-9
                          sm:w-9
                        "
                      >
                        {user?.name?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                    )}

                    <ChevronDown
                      size={13}
                      className={`
                        text-muted
                        transition-transform
                        sm:h-[14px]
                        sm:w-[14px]
                        ${
                          menuOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* =================================================
                      DROPDOWN MENU
                  ================================================= */}

                  {menuOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        z-50
                        mt-3
                        w-[min(13rem,calc(100vw-1.5rem))]
                        overflow-hidden
                        rounded-xl2
                        border
                        border-primary-100
                        bg-white
                        py-2
                        shadow-card-hover
                      "
                    >
                      {/* User Info */}

                      <div
                        className="
                          border-b
                          border-primary-100
                          px-4
                          py-2
                        "
                      >
                        <p
                          className="
                            truncate
                            font-display
                            text-sm
                            font-semibold
                            text-ink
                          "
                        >
                          {user?.name || "User"}
                        </p>

                        <p
                          className="
                            truncate
                            font-body
                            text-xs
                            text-muted
                          "
                        >
                          {user?.email}
                        </p>
                      </div>

                      {/* Profile */}

                      <Link
                        to="/profile"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          font-body
                          text-sm
                          text-ink
                          transition
                          hover:bg-primary-50
                        "
                      >
                        <UserIcon size={16} />
                        My Profile
                      </Link>

                      {/* Orders */}

                      <Link
                        to="/orders"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          font-body
                          text-sm
                          text-ink
                          transition
                          hover:bg-primary-50
                        "
                      >
                        <Package size={16} />
                        My Orders
                      </Link>

                      {/* Admin Panel */}

                      {(user?.role === "ADMIN" ||
                        user?.role ===
                          "SUPER_ADMIN") && (
                        <Link
                          to="/admin"
                          onClick={() =>
                            setMenuOpen(false)
                          }
                          className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            font-body
                            text-sm
                            font-medium
                            text-primary-600
                            transition
                            hover:bg-primary-50
                          "
                        >
                          <Shield size={16} />
                          Admin Panel
                        </Link>
                      )}

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-2
                          px-4
                          py-2
                          font-body
                          text-sm
                          text-secondary-600
                          transition
                          hover:bg-secondary-100/50
                        "
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
                {/* =================================================
                    LOGIN
                ================================================= */}

                <Link
                  to="/login"
                  className="
                    whitespace-nowrap
                    font-display
                    text-xs
                    font-semibold
                    text-ink
                    transition
                    hover:text-primary-600
                    sm:text-sm
                  "
                >
                  Login
                </Link>

                {/* =================================================
                    SIGN UP
                ================================================= */}

                <Link
                  to="/signup"
                  className="
                    whitespace-nowrap
                    rounded-full
                    bg-zyqora-gradient
                    px-3.5
                    py-2
                    font-display
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:shadow-card-hover
                    sm:px-5
                    sm:text-sm
                  "
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* ========================================================
            MOBILE SEARCH

            Search moves to second row below md.
            This prevents narrow-screen overflow.
        ======================================================== */}

        <div className="mt-2.5 w-full md:hidden">
          <SearchForm
            mobile
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </header>
  );
}