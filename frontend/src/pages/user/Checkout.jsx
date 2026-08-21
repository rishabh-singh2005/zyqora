import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapPin, Tag, Plus } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { getCart } from "../../api/cart.api";
import { getAddresses } from "../../api/address.api";
import { applyCoupon } from "../../api/coupon.api";
import { checkout, verifyOrderPayment } from "../../api/order.api";
import { X } from "lucide-react";
import { removeCartItem } from "../../api/cart.api";


export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCart(), getAddresses()])
      .then(([cartRes, addressRes]) => {
        setCart(cartRes.cart);
        setAddresses(addressRes.addresses || []);
        const def = addressRes.addresses?.find((a) => a.isDefault) || addressRes.addresses?.[0];
        if (def) setSelectedAddressId(def.id);
      })
      .catch((err) => console.error("Failed to load checkout data:", err))
      .finally(() => setLoading(false));
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPct
      ? Math.round(item.product.price - (item.product.price * item.product.discountPct) / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discount = couponResult?.discountAmount || 0;
  const shippingFee = subtotal - discount > 2000 ? 0 : 99;
  const total = subtotal - discount + shippingFee;

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponResult(null);
    if (!couponCode.trim()) return;

    try {
      const result = await applyCoupon(couponCode.trim());
      setCouponResult(result);
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
    }
  };

  const handleRemoveItem = async (productId) => {
  await removeCartItem(productId);
  const cartRes = await getCart();
  setCart(cartRes.cart);
    };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    setError("");
    setPlacing(true);

    try {
      // 1. Create order + Razorpay order on backend
      const checkoutRes = await checkout({
        addressId: selectedAddressId,
        couponCode: couponResult?.code || undefined,
      });

      // 2. Open Razorpay checkout widget
      const options = {
        key: checkoutRes.keyId,
        amount: checkoutRes.amount,
        currency: checkoutRes.currency,
        name: "Zyqora",
        description: "Order Payment",
        order_id: checkoutRes.razorpayOrderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#7C3AED" },
        handler: async (response) => {
          try {
            await verifyOrderPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate(`/orders/${checkoutRes.order.id}?success=true`);
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      setPlacing(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading checkout...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted font-body">Your cart is empty.</p>
        <Link to="/products">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* ==================== DELIVERY ADDRESS ==================== */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-ink flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" />
                Delivery Address
              </h2>
              <Link to="/addresses" className="text-sm font-body text-primary-600 hover:underline flex items-center gap-1">
                <Plus size={14} />
                Add New
              </Link>
            </div>

            {addresses.length === 0 ? (
              <p className="text-sm font-body text-muted">
                No saved addresses.{" "}
                <Link to="/addresses" className="text-primary-600 hover:underline">
                  Add one to continue
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 border rounded-xl2 p-4 cursor-pointer transition ${
                      selectedAddressId === addr.id
                        ? "border-primary-500 bg-primary-50/50"
                        : "border-primary-100 hover:border-primary-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-primary-500"
                    />
                    <div className="text-sm font-body">
                      <p className="font-semibold text-ink">
                        {addr.fullName} · {addr.phone}
                      </p>
                      <p className="text-muted">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ==================== ORDER ITEMS ==================== */}
<div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6">
  <h2 className="font-display font-semibold text-lg text-ink mb-4">
    Order Items ({items.length})
  </h2>
  <div className="space-y-3">
    {items.map((item) => {
      const price = item.product.discountPct
        ? Math.round(item.product.price - (item.product.price * item.product.discountPct) / 100)
        : item.product.price;
      return (
        <div key={item.id} className="flex items-center gap-3 text-sm font-body">
          <img
            src={item.product.images?.[0]?.url || "https://placehold.co/60x60?text=No+Image"}
            alt={item.product.name}
            className="w-12 h-12 object-contain bg-primary-50/50 rounded-lg p-1"
          />
          <div className="flex-1">
            <p className="text-ink font-medium">{item.product.name}</p>
            <p className="text-muted">Qty: {item.quantity}</p>
          </div>
          <p className="text-ink font-semibold">₹{price * item.quantity}</p>
          <button
            onClick={() => handleRemoveItem(item.product.id)}
            className="text-muted hover:text-secondary-500 transition shrink-0"
            title="Remove item"
          >
            <X size={16} />
          </button>
        </div>
        );
        })}
        </div>
        </div>
        </div>

        {/* ==================== SUMMARY ==================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6 space-y-4 h-fit">
          <h2 className="font-display font-bold text-lg text-ink">Order Summary</h2>

          {/* ==================== COUPON ==================== */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2 text-sm font-body border border-primary-100 rounded-lg outline-none focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                className="text-sm font-display font-semibold text-primary-600 border border-primary-200 rounded-lg px-4 hover:bg-primary-50 transition"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-secondary-600 font-body">{couponError}</p>}
            {couponResult && (
              <p className="text-xs text-green-600 font-body">
                "{couponResult.code}" applied — you saved ₹{couponResult.discountAmount}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm font-body border-t border-primary-100 pt-3">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
            </div>
          </div>

          <div className="border-t border-primary-100 pt-3 flex justify-between font-display font-bold text-ink">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {error && <p className="text-sm font-body text-secondary-600">{error}</p>}

          <Button
            variant="primary"
            className="w-full"
            disabled={placing || !selectedAddressId}
            onClick={handlePlaceOrder}
          >
            {placing ? "Processing..." : "Place Order & Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}
