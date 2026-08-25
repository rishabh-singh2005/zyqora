import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Tag, ShoppingBag } from "lucide-react";
import Button from "../../components/common/Button";
import ProductCard from "../../components/product/ProductCard";
import { fetchProducts, fetchCategories } from "../../api/product.api";
import heroImage from "../../assets/hero-phone.png";
import PricingPlans from "../../components/product/PricingPlans";

const TRUST_BADGES = [
  { icon: Truck, label: "Fast Delivery" },
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Tag, label: "Best Deals" },
  { icon: ShoppingBag, label: "Wide Collection" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProducts({ limit: 8, sortBy: "createdAt", order: "desc" }),
      fetchCategories(),
    ])
      .then(([productRes, categoryRes]) => {
        setProducts(productRes.products || []);
        setCategories(categoryRes.categories || []);
      })
      .catch((err) => console.error("Failed to load home data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-14">
      
      {/* ==================== HERO ==================== */}
<section>
  <div className="relative min-h-[380px] md:min-h-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-100 via-secondary-100 to-white shadow-soft">

    {/* Decorative background elements */}
    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-secondary-300/20 blur-3xl" />

    {/* Subtle decorative circles */}
    <div className="absolute top-10 right-[32%] h-20 w-20 rounded-full border border-white/60" />
    <div className="absolute bottom-10 right-[28%] h-12 w-12 rounded-full border border-primary-300/30" />

    <div className="relative z-10 flex h-full min-h-[380px] md:min-h-[420px] items-center justify-between px-7 py-10 md:px-12 lg:px-16">

      {/* ==================== CONTENT ==================== */}
      <div className="max-w-xl">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-700">
            Featured Collection
          </span>
        </div>

        <h1 className="text-4xl font-display font-extrabold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
          Trendy Picks.
          <br />
          <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Everyday Essentials.
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
          Discover curated styles, everyday must-haves and trending products —
          refreshed every week.
        </p>

        <div className="mt-7">
          <Link to="/products" className="inline-block">
            <Button
              variant="primary"
              className="
                !rounded-full
                !px-10
                !py-3
                min-w-[230px]
                shadow-lg
                hover:scale-105
                hover:shadow-card-hover
                transition-all
              "
            >
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Small trust line */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted">
          <span>✓ Curated Products</span>
          <span>✓ Fast Delivery</span>
          <span>✓ Secure Payment</span>
        </div>
      </div>

      {/* ==================== HERO IMAGE ==================== */}
      <div className="relative hidden md:flex h-full flex-1 items-center justify-end">

        {/* Image glow */}
        <div className="absolute right-8 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl lg:h-80 lg:w-80" />

        <img
          src={heroImage}
          alt="Shop Zyqora"
          className="relative z-10 h-64 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-105 lg:h-80"
        />
      </div>
    </div>
  </div>
</section>  

      {/* ==================== TRUST BADGES ==================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="bg-white/70 backdrop-blur-sm rounded-xl2 shadow-card p-5 flex flex-col items-center gap-2 text-center"
          >
            <div className="bg-zyqora-gradient text-white rounded-full p-3">
              <Icon size={20} />
            </div>
            <span className="font-display font-medium text-sm text-ink">{label}</span>
          </div>
        ))}
      </section>

      {/* ==================== CATEGORIES ==================== */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-bold text-ink mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="bg-white font-body text-sm text-ink border border-primary-100 rounded-full px-5 py-2 hover:border-primary-500 hover:text-primary-600 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold text-ink">Trending Now</h2>
          <Link to="/products" className="text-sm font-display font-semibold text-primary-600 hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-muted font-body">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted font-body">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <section>
      <PricingPlans />
      </section>
    </div>
  );
}