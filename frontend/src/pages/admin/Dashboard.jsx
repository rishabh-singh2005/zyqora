import { useEffect, useState } from "react";
import { Users, ShoppingBag, IndianRupee, Package, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "../../api/admin.api";

const STAT_CARDS = [
  { key: "totalUsers", label: "Total Customers", icon: Users, color: "from-primary-500 to-primary-600" },
  { key: "totalOrders", label: "Total Orders", icon: ShoppingBag, color: "from-secondary-500 to-secondary-600" },
  { key: "totalRevenue", label: "Total Revenue", icon: IndianRupee, color: "from-accent-500 to-accent-600", prefix: "₹" },
  { key: "totalProducts", label: "Active Products", icon: Package, color: "from-primary-600 to-secondary-500" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.stats))
      .catch((err) => console.error("Failed to load dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted font-body">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-ink">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, prefix }) => (
          <div key={key} className="bg-white rounded-xl2 shadow-card p-5">
            <div className={`bg-gradient-to-br ${color} text-white rounded-full p-2.5 w-fit`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-display font-bold text-ink mt-3">
              {prefix}
              {stats?.[key] ?? 0}
            </p>
            <p className="text-sm font-body text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {stats?.lowStockProducts > 0 && (
        <div className="bg-secondary-100 border border-secondary-300 rounded-xl2 p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-secondary-600 shrink-0" />
          <p className="text-sm font-body text-secondary-700">
            <strong>{stats.lowStockProducts}</strong> product{stats.lowStockProducts > 1 ? "s are" : " is"} running low on stock (below 10 units).
          </p>
        </div>
      )}
    </div>
  );
}