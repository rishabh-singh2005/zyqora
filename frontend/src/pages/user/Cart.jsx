import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Button from "../../components/common/Button";
import { getCart, updateCartItem, removeCartItem } from "../../api/cart.api";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";




export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loadCart = () => {
    getCart()
      .then((res) => setCart(res.cart))
      .catch((err) => console.error("Failed to load cart:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated]);


  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
  await updateCartItem(productId, quantity);
  loadCart();
  const cartRes = await getCart();
  const count = cartRes.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  dispatch(setCartCount(count));
};

  const handleRemove = async (productId) => {
  await removeCartItem(productId);
  loadCart();

  const cartRes = await getCart();
  const count = cartRes.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  dispatch(setCartCount(count));
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading cart...</p>;
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPct
      ? Math.round(item.product.price - (item.product.price * item.product.discountPct) / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <ShoppingBag size={48} className="mx-auto text-primary-300" />
          <p className="text-muted font-body">Your cart is empty.</p>
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <CartSummary subtotal={subtotal} itemCount={items.length} />
        </div>
      )}
    </div>
  );
}