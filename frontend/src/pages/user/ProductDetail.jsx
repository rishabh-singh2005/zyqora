import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";

import { fetchProductBySlug } from "../../api/product.api";
import { addToCart, getCart } from "../../api/cart.api";
import {
  submitReview,
  deleteReview,
} from "../../api/review.api";
import { getAddresses } from "../../api/address.api";
import { addToWishlist } from "../../api/wishlist.api";

import { setCartCount } from "../../features/cart/cartSlice";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // ==================== PRODUCT ====================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== IMAGE GALLERY ====================

  const [activeImage, setActiveImage] = useState(0);

  // ==================== CART ====================

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // ==================== MESSAGE ====================

  const [message, setMessage] = useState("");

  // ==================== ADDRESS ====================

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] =
    useState(null);

  // ==================== REVIEW ====================

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [reviewMsg, setReviewMsg] = useState("");
  const [submittingReview, setSubmittingReview] =
    useState(false);

  // ==================== FETCH PRODUCT ====================

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);

    fetchProductBySlug(slug)
      .then((res) => {
        setProduct(res.product);
      })
      .catch((err) => {
        console.error(
          "Failed to load product:",
          err
        );
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // ==================== SCROLL TO TOP ====================

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [slug]);

  // ==================== FETCH ADDRESSES ====================

  useEffect(() => {
    if (!isAuthenticated) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }

    getAddresses()
      .then((res) => {
        const list = res.addresses || [];

        setAddresses(list);

        const defaultAddress =
          list.find((address) => address.isDefault) ||
          list[0];

        setSelectedAddress(defaultAddress || null);
      })
      .catch((err) => {
        console.error(
          "Failed to load addresses:",
          err
        );
      });
  }, [isAuthenticated]);

  // ==================== MESSAGE HELPER ====================

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ==================== WISHLIST ====================

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    try {
      await addToWishlist(product.id);
      showMessage("Added to wishlist!");
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
          "Failed to add to wishlist"
      );
    }
  };

  // ==================== ADD TO CART ====================

  const handleAddToCart = async (
    redirectToCheckout = false
  ) => {
    if (!isAuthenticated) {
      sessionStorage.setItem(
        "postLoginRedirect",
        location.pathname
      );

      navigate(
        `/login?from=${encodeURIComponent(
          location.pathname
        )}`,
        {
          state: {
            from: location.pathname,
          },
        }
      );

      return;
    }

    if (!product || product.stock <= 0) {
      return;
    }

    setAdding(true);
    setMessage("");

    try {
      await addToCart(product.id, quantity);

      const cartRes = await getCart();

      const count =
        cartRes.cart?.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) || 0;

      dispatch(setCartCount(count));

      if (redirectToCheckout) {
        navigate("/checkout");
      } else {
        showMessage("Added to cart!");
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
          "Failed to add to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // ==================== DELETE REVIEW ====================

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review?")) {
      return;
    }

    try {
      await deleteReview(reviewId);

      const res = await fetchProductBySlug(slug);

      setProduct(res.product);
      setReviewMsg("Review deleted.");
    } catch (err) {
      setReviewMsg(
        err.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  // ==================== SUBMIT REVIEW ====================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.comment.trim()) {
      setReviewMsg("Please write a review.");
      return;
    }

    setSubmittingReview(true);
    setReviewMsg("");

    try {
      await submitReview(product.id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });

      setReviewMsg("Review submitted successfully!");

      setReviewForm({
        rating: 5,
        comment: "",
      });

      const res = await fetchProductBySlug(slug);

      setProduct(res.product);
    } catch (err) {
      setReviewMsg(
        err.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-5 w-52 bg-primary-100 rounded-full mb-8" />

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="h-[520px] rounded-3xl bg-primary-50 border border-primary-100" />

            <div className="space-y-5">
              <div className="h-5 w-32 bg-primary-100 rounded" />
              <div className="h-10 w-3/4 bg-primary-100 rounded" />
              <div className="h-8 w-32 bg-primary-100 rounded" />
              <div className="h-20 bg-primary-100 rounded-2xl" />
              <div className="h-12 bg-primary-100 rounded-2xl" />
              <div className="h-12 bg-primary-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PRODUCT NOT FOUND ====================

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-primary-50 flex items-center justify-center">
            <Package
              size={28}
              className="text-primary-500"
            />
          </div>

          <h2 className="font-display text-2xl font-bold text-ink">
            Product Not Found
          </h2>

          <p className="mt-2 text-sm font-body text-muted">
            The product you're looking for is
            unavailable.
          </p>

          <Link
            to="/products"
            className="inline-flex mt-6 rounded-full bg-zyqora-gradient px-6 py-2.5 text-sm font-display font-semibold text-white hover:shadow-card-hover transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ==================== DERIVED DATA ====================

  const finalPrice = product.discountPct
    ? Math.round(
        product.price -
          (product.price * product.discountPct) / 100
      )
    : product.price;

  const images =
    product.images?.length > 0
      ? product.images
      : [
          {
            url:
              "https://placehold.co/800x800?text=No+Image",
          },
        ];

  const reviews = product.reviews || [];

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  // ==================== IMAGE NAVIGATION ====================

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* ==================== BREADCRUMB ==================== */}

        <div className="mb-6">
          <Breadcrumb
            items={[
              {
                label: "Products",
                to: "/products",
              },
              {
                label: product.name,
              },
            ]}
          />
        </div>

        {/* ==================== PRODUCT CONTENT ==================== */}

        <section className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-start">

          {/* ==================== IMAGE / GALLERY ==================== */}

          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[28px] border border-primary-100 bg-white/80 backdrop-blur-sm shadow-card">

              {/* IMAGE AREA */}
              <div className="relative h-[min(62vh,640px)] min-h-[380px] max-h-[640px] bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20">

                {/* Decorative background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-100/25 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary-100/20 blur-3xl" />
                </div>

                {/* Discount badge */}
                {product.discountPct > 0 && (
                  <div className="absolute left-5 top-5 z-20 flex items-center gap-1.5 rounded-full bg-zyqora-gradient px-3.5 py-1.5 text-xs font-display font-bold text-white shadow-lg">
                    <Sparkles size={13} />
                    {product.discountPct}% OFF
                  </div>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute right-5 top-5 z-20 rounded-full border border-primary-100 bg-white/90 px-3 py-1.5 text-xs font-body font-medium text-muted shadow-sm backdrop-blur-md">
                    {activeImage + 1} / {images.length}
                  </div>
                )}

                {/* Main image */}
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 lg:p-12">
                  <div className="relative flex h-full w-full items-center justify-center">
                    <img
                      src={images[activeImage]?.url}
                      alt={`${product.name} ${activeImage + 1}`}
                      className="relative z-[1] block h-full w-full select-none object-contain object-center drop-shadow-[0_20px_35px_rgba(40,20,80,0.14)] transition-transform duration-500 ease-out hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Previous */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white/90 text-ink shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-600 active:scale-95"
                  >
                    <ChevronLeft size={21} />
                  </button>
                )}

                {/* Next */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white/90 text-ink shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-600 active:scale-95"
                  >
                    <ChevronRight size={21} />
                  </button>
                )}

                
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="border-t border-primary-100 bg-white/70 px-4 py-4 sm:px-6">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <button
                        type="button"
                        key={`${image.url}-${index}`}
                        onClick={() => setActiveImage(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-white transition-all sm:h-20 sm:w-20 ${
                          activeImage === index
                            ? "border-primary-500 shadow-md scale-[1.03]"
                            : "border-primary-100 hover:border-primary-300"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================== DETAILS ==================== */}



          <div className="space-y-6">

            {/* CATEGORY + TITLE */}

            <div>
              {product.category?.name && (
                <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-display font-semibold uppercase tracking-wider text-primary-600">
                  {product.category.name}
                </span>
              )}

              <h1 className="mt-3 font-display text-3xl sm:text-4xl xl:text-[42px] leading-tight font-bold text-ink">
                {product.name}
              </h1>
            </div>

            {/* RATING */}

            <div className="flex items-center gap-3">
              {avgRating ? (
                <>
                  <div className="flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5">
                    <Star
                      size={15}
                      fill="currentColor"
                      className="text-accent-500"
                    />

                    <span className="text-sm font-display font-bold text-ink">
                      {avgRating}
                    </span>
                  </div>

                  <span className="text-sm font-body text-muted">
                    {reviews.length}{" "}
                    {reviews.length === 1
                      ? "review"
                      : "reviews"}
                  </span>
                </>
              ) : (
                <span className="text-sm font-body text-muted">
                  No reviews yet
                </span>
              )}
            </div>

            {/* PRICE */}

            <div className="rounded-2xl border border-primary-100 bg-white/70 p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="font-display text-3xl sm:text-4xl font-bold bg-zyqora-gradient bg-clip-text text-transparent">
                  ₹
                  {finalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>

                {product.discountPct > 0 && (
                  <>
                    <span className="mb-1 text-lg text-muted line-through font-body">
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="mb-1 rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-display font-bold text-secondary-600">
                      Save{" "}
                      {product.discountPct}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}

            <div>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">
                About this product
              </h2>

              <p className="text-sm sm:text-base text-muted font-body leading-7">
                {product.description}
              </p>
            </div>

            {/* STOCK */}

            <div className="flex items-center justify-between rounded-2xl border border-primary-100 bg-white/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className={
                    product.stock > 0
                      ? "text-green-500"
                      : "text-secondary-500"
                  }
                />

                <span
                  className={`text-sm font-display font-semibold ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-secondary-600"
                  }`}
                >
                  {product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {product.stock > 0 && (
                <span className="text-xs font-body text-muted">
                  {product.stock} available
                </span>
              )}
            </div>

            {/* QUANTITY */}

            {product.stock > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-sm text-ink">
                    Quantity
                  </p>

                  <p className="text-xs text-muted font-body mt-0.5">
                    Select quantity
                  </p>
                </div>

                <div className="flex items-center rounded-full border border-primary-100 bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1
                        )
                      )
                    }
                    disabled={quantity <= 1}
                    className="h-10 w-10 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 transition"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-10 text-center text-sm font-display font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stock,
                          quantity + 1
                        )
                      )
                    }
                    disabled={
                      quantity >= product.stock
                    }
                    className="h-10 w-10 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 transition"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* DELIVERY */}

            {isAuthenticated && (
              <div className="rounded-2xl border border-primary-100 bg-white/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-primary-50 flex items-center justify-center">
                      <MapPin
                        size={17}
                        className="text-primary-600"
                      />
                    </div>

                    <div>
                      <p className="font-display font-semibold text-sm text-ink">
                        Deliver to
                      </p>

                      {selectedAddress ? (
                        <p className="mt-1 text-xs font-body text-muted">
                          {selectedAddress.fullName}{" "}
                          — {selectedAddress.city},{" "}
                          {
                            selectedAddress.postalCode
                          }
                        </p>
                      ) : (
                        <p className="mt-1 text-xs font-body text-muted">
                          No saved address selected.
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/addresses"
                    className="shrink-0 text-xs font-display font-semibold text-primary-600 hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                {addresses.length > 0 && (
                  <select
                    value={selectedAddress?.id || ""}
                    onChange={(e) =>
                      setSelectedAddress(
                        addresses.find(
                          (address) =>
                            address.id ===
                            e.target.value
                        )
                      )
                    }
                    className="mt-4 w-full rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    {addresses.map(
                      (address) => (
                        <option
                          key={address.id}
                          value={address.id}
                        >
                          {address.fullName} —{" "}
                          {address.city},{" "}
                          {
                            address.postalCode
                          }
                        </option>
                      )
                    )}
                  </select>
                )}

                {addresses.length === 0 && (
                  <Link
                    to="/addresses"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-display font-semibold text-primary-600 hover:underline"
                  >
                    <Plus size={14} />
                    Add Address
                  </Link>
                )}
              </div>
            )}

            {/* MESSAGE */}

            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
                <CheckCircle2
                  size={17}
                  className="text-primary-600"
                />

                <p className="text-sm font-body font-medium text-primary-700">
                  {message}
                </p>
              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 !rounded-full"
                disabled={
                  adding ||
                  product.stock === 0
                }
                onClick={() =>
                  handleAddToCart(false)
                }
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag size={17} />
                  {adding
                    ? "Adding..."
                    : "Add to Cart"}
                </span>
              </Button>

              <Button
                variant="primary"
                className="flex-1 !rounded-full"
                disabled={
                  adding ||
                  product.stock === 0
                }
                onClick={() =>
                  handleAddToCart(true)
                }
              >
                {adding
                  ? "Processing..."
                  : "Buy Now"}
              </Button>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label="Add to wishlist"
                className="h-11 w-11 shrink-0 rounded-full border border-primary-100 bg-white text-muted flex items-center justify-center hover:border-secondary-300 hover:bg-secondary-50 hover:text-secondary-500 transition"
              >
                <Heart size={19} />
              </button>
            </div>

            {/* TRUST BADGES */}

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 border-t border-primary-100">
              {[
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  text: "Reliable shipping",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Payment",
                  text: "Safe checkout",
                },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  text: "Hassle-free",
                },
              ].map(
                ({
                  icon: Icon,
                  title,
                  text,
                }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white/60 border border-primary-100 px-2 py-4 text-center"
                  >
                    <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center">
                      <Icon
                        size={18}
                        className="text-primary-600"
                      />
                    </div>

                    <p className="text-xs sm:text-sm font-display font-semibold text-ink">
                      {title}
                    </p>

                    <p className="hidden sm:block mt-1 text-[11px] font-body text-muted">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ==================== WHY ZYQORA ==================== */}

        <section className="mt-12 sm:mt-16">
          <div className="rounded-3xl border border-primary-100 bg-white/70 backdrop-blur-sm shadow-card overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-primary-100">
              <p className="text-xs font-display font-semibold uppercase tracking-wider text-primary-600">
                Shopping with confidence
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                Why shop with Zyqora?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure Shopping",
                  text: "Protected checkout experience.",
                },
                {
                  icon: Truck,
                  title: "Reliable Delivery",
                  text: "Products delivered to your door.",
                },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  text: "Simple return process.",
                },
                {
                  icon: Sparkles,
                  title: "Curated Products",
                  text: "Products worth shopping.",
                },
              ].map(
                ({
                  icon: Icon,
                  title,
                  text,
                }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-6 border-b lg:border-b-0 lg:border-r border-primary-100 last:border-0"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon
                        size={19}
                        className="text-primary-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-sm text-ink">
                        {title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 font-body text-muted">
                        {text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

       {/* ==================== REVIEWS ==================== */}

<section className="mt-12 sm:mt-16">

  {/* Section Header */}
  <div className="mb-6">
    <p className="text-xs font-display font-semibold uppercase tracking-wider text-primary-600">
      Customer feedback
    </p>

    <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
      Customer Reviews
    </h2>
  </div>

  {/* ==================== REVIEWS LIST ==================== */}

  {reviews.length > 0 ? (
    <div className="grid md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-primary-100 bg-white/75 p-5 shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">

            {/* Stars */}
            <div className="flex items-center gap-0.5 text-accent-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill={
                    star <= review.rating
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.8}
                />
              ))}
            </div>

            {/* Delete */}
            {review.userId === user?.id && (
              <button
                type="button"
                onClick={() => handleDeleteReview(review.id)}
                className="text-xs font-body text-secondary-500 hover:text-secondary-600 hover:underline transition"
              >
                Delete
              </button>
            )}

          </div>

          {/* Comment */}
          {review.comment && (
            <p className="mt-4 text-sm font-body text-ink leading-6">
              {review.comment}
            </p>
          )}
        </article>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/30 px-6 py-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Star
          size={24}
          className="text-accent-500"
          fill="currentColor"
        />
      </div>

      <p className="mt-4 font-display font-semibold text-ink">
        No reviews yet
      </p>

      <p className="mt-1 text-sm font-body text-muted">
        Be the first customer to review this product.
      </p>
    </div>
  )}

  {/* ==================== REVIEW FORM ==================== */}

  {isAuthenticated && (
    <div className="mt-8 max-w-2xl rounded-3xl border border-primary-100 bg-white/75 shadow-card p-6 sm:p-7">

      <div className="mb-5">
        <p className="text-xs font-display font-semibold uppercase tracking-wider text-primary-600">
          Your experience
        </p>

        <h3 className="mt-1 font-display font-semibold text-lg text-ink">
          Write a Review
        </h3>
      </div>

      <form
        onSubmit={handleSubmitReview}
        className="space-y-5"
      >

        {/* Rating */}
        <div>
          <p className="mb-2 text-sm font-display font-semibold text-ink">
            Your Rating
          </p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewForm({
                    ...reviewForm,
                    rating: star,
                  })
                }
                className="p-1 text-accent-500 hover:scale-110 transition-transform"
                aria-label={`Give ${star} star${
                  star > 1 ? "s" : ""
                }`}
              >
                <Star
                  size={23}
                  fill={
                    star <= reviewForm.rating
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.8}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="review-comment"
            className="block mb-2 text-sm font-display font-semibold text-ink"
          >
            Your Review
          </label>

          <textarea
            id="review-comment"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                comment: e.target.value,
              })
            }
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition"
          />
        </div>

        {/* Message */}
        {reviewMsg && (
          <div className="rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
            <p className="text-sm font-body text-primary-600">
              {reviewMsg}
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          disabled={submittingReview}
          className="!rounded-full px-6"
        >
          {submittingReview
            ? "Submitting..."
            : "Submit Review"}
        </Button>

      </form>
    </div>
  )}

</section>

      </div>
    </main>
  );
}

export default ProductDetail;