import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import Button from "../common/Button";
import { addToCart, getCart } from "../../api/cart.api";
import { setCartCount } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../api/wishlist.api";


export default function ProductCard({ product }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const image = product.images?.[0]?.url || "https://placehold.co/300x300?text=No+Image";
  const finalPrice = product.discountPct
    ? Math.round(product.price - (product.price * product.discountPct) / 100)
    : product.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    setAdding(true);
    setMessage("");
    try {
      await addToCart(product.id, 1);
      const cartRes = await getCart();
      const count = cartRes.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      dispatch(setCartCount(count));
      setMessage("Added!");
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
  e.preventDefault();
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  try {
    await addToWishlist(product.id);
  } catch (err) {
    console.error("Wishlist error:", err.response?.data?.message);
  }
};

  return (
    <div className="group bg-white rounded-xl2 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link to={`/products/${product.slug}`}>
        <div className="relative bg-primary-50/50 aspect-square overflow-hidden">
    <img
      src={image}
      alt={product.name}
      className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
    />

          <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-2 text-muted hover:text-secondary-500 transition">
          <Heart size={16} />
          </button>
        </div>
        
        <div className="p-4 space-y-1">
          <p className="text-xs font-body text-muted uppercase tracking-wide">
            {product.category?.name || "General"}
          </p>
          <h3 className="font-display font-semibold text-ink truncate">{product.name}</h3>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-display font-bold text-primary-600">₹{finalPrice}</span>
            {product.discountPct > 0 && (
              <span className="text-xs text-muted line-through">₹{product.price}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 space-y-1">
        {message && <p className="text-xs font-body text-primary-600 text-center">{message}</p>}
        <Button
          variant="primary"
          className="w-full !py-2 text-sm"
          disabled={adding}
          onClick={handleAddToCart}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}