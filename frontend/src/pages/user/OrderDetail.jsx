import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Package, MapPin, CreditCard, CheckCircle2, Truck, Home, XCircle } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { getOrderDetail, cancelOrder } from "../../api/order.api";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-primary-100 text-primary-600",
  PROCESSING: "bg-primary-100 text-primary-600",
  SHIPPED: "bg-secondary-100 text-secondary-600",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const STATUS_STEPS = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
const STATUS_ICONS = { PAID: CheckCircle2, PROCESSING: Package, SHIPPED: Truck, DELIVERED: Home };

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get("success") === "true";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrder = () => {
    getOrderDetail(id)
      .then((res) => setOrder(res.order))
      .catch((err) => console.error("Failed to load order:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    setMessage("");
    try {
      await cancelOrder(id);
      loadOrder();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center py-20 text-muted font-body">Order not found.</p>;
  }

  const canCancel = !["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status);
  const isCancelled = ["CANCELLED", "REFUNDED"].includes(order.status);
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "My Orders", to: "/orders" }, { label: `Order #${order.id.slice(0, 8)}` }]} />

      {/* ==================== SUCCESS BANNER ==================== */}
      {justPlaced && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl2 shadow-soft p-6 mb-6 flex items-center gap-4 text-white">
          <div className="bg-white/20 rounded-full p-3">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Order placed successfully!</h2>
            <p className="text-sm opacity-90 font-body">
              Thank you for shopping with Zyqora. A confirmation has been sent to your email.
            </p>
          </div>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm font-body text-muted mt-1">
              Placed on{" "}
              {new Date(order.placedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* ==================== STATUS TRACKER ==================== */}
        {!isCancelled && (
          <div className="flex items-center justify-between mt-8 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-primary-100 -z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-zyqora-gradient -z-0 transition-all duration-500"
              style={{
                width: `${(Math.max(currentStepIndex, 0) / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />
            {STATUS_STEPS.map((step, index) => {
              const Icon = STATUS_ICONS[step];
              const isActive = index <= currentStepIndex;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                      isActive ? "bg-zyqora-gradient text-white" : "bg-white border-2 border-primary-100 text-muted"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-xs font-body ${isActive ? "text-ink font-medium" : "text-muted"}`}
                  >
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2 mt-4 text-gray-500 font-body text-sm">
            <XCircle size={16} />
            This order was {order.status.toLowerCase()}.
          </div>
        )}
      </div>

      {message && (
        <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* ==================== ITEMS ==================== */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6">
            <h2 className="font-display font-semibold text-lg text-ink flex items-center gap-2 mb-4">
              <Package size={18} className="text-primary-500" />
              Items ({order.items.length})
            </h2>
            <div className="divide-y divide-primary-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 text-sm font-body">
                  <div>
                    <p className="text-ink font-medium">{item.name}</p>
                    <p className="text-muted">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="text-ink font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== ADDRESS ==================== */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6">
            <h2 className="font-display font-semibold text-lg text-ink flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-primary-500" />
              Delivery Address
            </h2>
            <p className="text-sm font-body text-ink font-medium">
              {order.address.fullName} · {order.address.phone}
            </p>
            <p className="text-sm font-body text-muted mt-1">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
              {order.address.state} - {order.address.postalCode}
            </p>
          </div>
        </div>

        {/* ==================== PAYMENT SUMMARY ==================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6 space-y-3 h-fit">
          <h2 className="font-display font-semibold text-lg text-ink flex items-center gap-2">
            <CreditCard size={18} className="text-primary-500" />
            Payment Summary
          </h2>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}</span>
            </div>
          </div>
          <div className="border-t border-primary-100 pt-3 flex justify-between font-display font-bold text-lg text-ink">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>

          {canCancel && (
            <Button variant="secondary" className="w-full mt-2" disabled={cancelling} onClick={handleCancel}>
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link to="/orders" className="text-sm font-display font-semibold text-primary-600 hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    </div>
  );
}