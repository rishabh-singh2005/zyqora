import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function CartSummary({ subtotal, itemCount }) {
  const navigate = useNavigate();
  const shippingFee = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6 space-y-4 h-fit">
      <h2 className="font-display font-bold text-lg text-ink">Order Summary</h2>

      <div className="space-y-2 text-sm font-body">
        <div className="flex justify-between text-muted">
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-primary-600">
            Add ₹{2000 - subtotal} more for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-primary-100 pt-3 flex justify-between font-display font-bold text-ink">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <Button
        variant="primary"
        className="w-full"
        disabled={itemCount === 0}
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}