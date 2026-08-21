import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { getMyOrders } from "../../api/order.api";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-primary-100 text-primary-600",
  PROCESSING: "bg-primary-100 text-primary-600",
  SHIPPED: "bg-secondary-100 text-secondary-600",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading orders...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "My Orders" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Package size={48} className="mx-auto text-primary-300" />
          <p className="text-muted font-body">You haven't placed any orders yet.</p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card hover:shadow-card-hover transition p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-ink">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm font-body text-muted mt-1">
                    {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-display font-bold text-ink mt-2">₹{order.total}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}