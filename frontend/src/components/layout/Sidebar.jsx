import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  ArrowLeftCircle,
  X,
} from "lucide-react";

import logo from "../../assets/logo.png";

const NAV_ITEMS = [
  {
    to: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/admin/products",
    icon: Package,
    label: "Products",
  },
  {
    to: "/admin/categories",
    icon: FolderTree,
    label: "Categories",
  },
  {
    to: "/admin/orders",
    icon: ShoppingBag,
    label: "Orders",
  },
  {
    to: "/admin/coupons",
    icon: Tag,
    label: "Coupons",
  },
  {
    to: "/admin/users",
    icon: Users,
    label: "Users",
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}) {
  const { user } = useSelector(
    (state) => state.auth
  );

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[min(82vw,280px)]
          shrink-0
          flex-col
          overflow-y-auto
          bg-white/95
          backdrop-blur-md
          border-r
          border-primary-100
          p-4
          sm:p-5
          transition-transform
          duration-300
          ease-in-out

          lg:sticky
          lg:top-0
          lg:z-30
          lg:h-screen
          lg:w-64
          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            MOBILE CLOSE BUTTON
        ================================================= */}
        <div className="mb-3 flex justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-primary-100
              text-muted
              transition
              hover:bg-primary-50
              hover:text-ink
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            BRAND
        ================================================= */}
        <div className="flex items-center gap-2 px-2">
          <img
            src={logo}
            alt="Zyqora"
            className="
              h-9
              w-9
              shrink-0
              rounded-xl2
              object-cover
            "
          />

          <div className="min-w-0">
            <p className="font-display font-bold text-ink truncate">
              ZYQORA
            </p>

            <p className="text-xs font-body text-muted truncate">
              {isSuperAdmin
                ? "Super Admin Panel"
                : "Admin Panel"}
            </p>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}
        <nav className="mt-6 flex-1 space-y-1">
          {NAV_ITEMS.map(
            ({
              to,
              icon: Icon,
              label,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-body
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-zyqora-gradient text-white font-medium shadow-sm"
                        : "text-ink hover:bg-primary-50 hover:text-primary-700"
                    }
                  `
                }
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span className="truncate">
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        {/* =================================================
            BACK TO STORE
        ================================================= */}
        <div className="mt-5 border-t border-primary-100 pt-4">
          <Link
            to="/"
            onClick={onClose}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2.5
              text-sm
              font-body
              text-muted
              transition
              hover:bg-primary-50
              hover:text-primary-600
            "
          >
            <ArrowLeftCircle
              size={18}
              className="shrink-0"
            />

            <span>Back to Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}