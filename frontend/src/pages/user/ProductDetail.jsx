import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, Minus, Plus, Heart, Truck, ShieldCheck, RotateCcw, MapPin } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { fetchProductBySlug } from "../../api/product.api";
import { addToCart } from "../../api/cart.api";
import { submitReview } from "../../api/review.api";
import { getAddresses } from "../../api/address.api";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";
import { getCart } from "../../api/cart.api";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProductBySlug(slug)
      .then((res) => setProduct(res.product))
      .catch((err) => console.error("Failed to load product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated) {
      getAddresses().then((res) => {
        setAddresses(res.addresses || []);
        const def = res.addresses?.find((a) => a.isDefault) || res.addresses?.[0];
        setSelectedAddress(def || null);
      });
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (redirectToCheckout = false) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("postLoginRedirect", location.pathname);
      navigate(`/login?from=${encodeURIComponent(location.pathname)}`, {
        state: { from: location.pathname },
      });
      return;
    }

    setAdding(true);
    setMessage("");
    try {
      await addToCart(product.id, quantity);

      const cartRes = await getCart();
      const count = cartRes.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      dispatch(setCartCount(count));

      if (redirectToCheckout) {
        navigate("/checkout");
      } else {
        setMessage("Added to cart!");
        setTimeout(() => setMessage(""), 2500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMsg("");
    try {
      await submitReview(product.id, reviewForm);
      setReviewMsg("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      fetchProductBySlug(slug).then((res) => setProduct(res.product));
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center py-20 text-muted font-body">Product not found.</p>;
  }

  const finalPrice = product.discountPct
    ? Math.round(product.price - (product.price * product.discountPct) / 100)
    : product.price;

  const images = product.images?.length
    ? product.images
    : [{ url: "https://placehold.co/500x500?text=No+Image" }];

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Products", to: "/products" }, { label: product.name }]} />

      <div className="grid md:grid-cols-2 gap-10">
        {/* ==================== IMAGE GALLERY ==================== */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl2 shadow-card p-8 aspect-square flex items-center justify-center">
            <img
              src={images[activeImage].url}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${
                    activeImage === index ? "border-primary-500" : "border-primary-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==================== DETAILS ==================== */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-body text-muted uppercase tracking-wide">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-display font-bold text-ink mt-1">{product.name}</h1>
          </div>

          {avgRating && (
            <div className="flex items-center gap-2">
              <div className="flex text-accent-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(avgRating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted font-body">
                {avgRating} ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-3xl font-display font-bold text-primary-600">
              ₹{finalPrice}
            </span>
            {product.discountPct > 0 && (
              <>
                <span className="text-lg text-muted line-through font-body">₹{product.price}</span>
                <span className="bg-secondary-100 text-secondary-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {product.discountPct}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-muted font-body leading-relaxed">{product.description}</p>

          <p className="text-sm font-body">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-secondary-600 font-medium">Out of Stock</span>
            )}
          </p>

          {/* ==================== QUANTITY ==================== */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-body font-medium text-ink">Quantity</span>
            <div className="flex items-center border border-primary-100 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:text-primary-600 transition"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-body">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 hover:text-primary-600 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* ==================== DELIVERY ==================== */}
          {isAuthenticated && (
            <div className="border border-primary-100 rounded-xl2 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-body font-medium text-ink">
                <MapPin size={16} className="text-primary-500" />
                Deliver to
              </div>
              {addresses.length > 0 ? (
                <select
                  value={selectedAddress?.id || ""}
                  onChange={(e) => setSelectedAddress(addresses.find((a) => a.id === e.target.value))}
                  className="w-full text-sm font-body border border-primary-100 rounded-lg px-3 py-2 outline-none focus:border-primary-500"
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.fullName} — {addr.city}, {addr.postalCode}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-body text-muted">
                  No saved addresses.{" "}
                  <a href="/addresses" className="text-primary-600 hover:underline">
                    Add one
                  </a>
                </p>
              )}
            </div>
          )}

          {message && (
            <p className="text-sm font-body text-primary-600 font-medium">{message}</p>
          )}

          {/* ==================== ACTIONS ==================== */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={adding || product.stock === 0}
              onClick={() => handleAddToCart(false)}
            >
              Add to Cart
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={adding || product.stock === 0}
              onClick={() => handleAddToCart(true)}
            >
              Buy Now
            </Button>
            <button className="border border-primary-100 rounded-full p-3 text-muted hover:text-secondary-500 hover:border-secondary-300 transition">
              <Heart size={20} />
            </button>
          </div>

          {/* ==================== TRUST BADGES ==================== */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary-100">
            {[
              { icon: Truck, label: "Fast Delivery" },
              { icon: ShieldCheck, label: "Secure Payment" },
              { icon: RotateCcw, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon size={20} className="text-primary-500" />
                <span className="text-xs font-body text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== REVIEWS ==================== */}
      <div className="mt-16">
        <h2 className="text-2xl font-display font-bold text-ink mb-4">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white/80 rounded-xl2 shadow-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-accent-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm font-body text-ink">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted font-body mb-8">No reviews yet. Be the first to review this product.</p>
        )}

        {isAuthenticated && (
          <div className="bg-white/80 rounded-xl2 shadow-card p-6 max-w-lg">
            <h3 className="font-display font-semibold text-ink mb-3">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-accent-500"
                  >
                    <Star size={22} fill={star <= reviewForm.rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={3}
                className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition resize-none"
              />
              {reviewMsg && <p className="text-sm font-body text-primary-600">{reviewMsg}</p>}
              <Button variant="primary" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
