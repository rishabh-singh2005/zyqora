import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { getWishlist, removeFromWishlist } from "../../api/wishlist.api";
import { addToCart, getCart } from "../../api/cart.api";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadWishlist = () => {
    getWishlist()
      .then((res) => setItems(res.wishlist || []))
      .catch((err) => console.error("Failed to load wishlist:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    loadWishlist();
  };

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
    const cartRes = await getCart();
    const count = cartRes.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    dispatch(setCartCount(count));
    loadWishlist();
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading wishlist...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Wishlist" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Heart size={48} className="mx-auto text-primary-300" />
          <p className="text-muted font-body">Your wishlist is empty.</p>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product;
            const image = product.images?.[0]?.url || "https://placehold.co/300x300?text=No+Image";
            const finalPrice = product.discountPct
              ? Math.round(product.price - (product.price * product.discountPct) / 100)
              : product.price;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl2 shadow-card hover:shadow-card-hover transition overflow-hidden"
              >
                <Link to={`/products/${product.slug}`}>
                  <div className="bg-primary-50/50 aspect-square flex items-center justify-center p-6">
                    <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-display font-semibold text-ink truncate hover:text-primary-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-display font-bold text-primary-600">₹{finalPrice}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1 !py-2 text-xs"
                      onClick={() => handleMoveToCart(product.id)}
                    >
                      Move to Cart
                    </Button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="border border-primary-100 rounded-full p-2 text-muted hover:text-secondary-500 hover:border-secondary-300 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
