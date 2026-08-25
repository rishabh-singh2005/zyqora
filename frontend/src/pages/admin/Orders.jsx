import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/admin.api";

const STATUS_OPTIONS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-primary-100 text-primary-600",
  PROCESSING: "bg-primary-100 text-primary-600",
  SHIPPED: "bg-secondary-100 text-secondary-600",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    getAllOrders({ limit: 50 })
      .then((res) => setOrders(res.orders || []))
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-muted font-body">Loading orders...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-ink">Orders</h1>

      <div className="bg-white rounded-xl2 shadow-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-primary-100 text-left text-muted">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-primary-50">
                <td className="p-4 font-medium text-ink">#{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4 text-muted">{order.user?.email || "-"}</td>
                <td className="p-4 text-muted">
                  {new Date(order.placedAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-4 text-ink">₹{order.total}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-lg border border-primary-100 px-3 py-1.5 text-sm font-body outline-none focus:border-primary-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}