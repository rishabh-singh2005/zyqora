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
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary-100 via-secondary-100 to-white rounded-xl2 shadow-soft p-10 flex items-center justify-between overflow-hidden">
          <div className="max-w-md space-y-4 z-10">
            <p className="text-sm font-semibold text-secondary-600 uppercase tracking-wide">
              Featured Collection
            </p>
            <h1 className="text-4xl font-display font-extrabold text-ink leading-tight">
              Trendy Picks & Everyday Essentials
            </h1>
            <p className="text-muted font-body">
              Discover curated styles and trending must-haves, refreshed weekly.
            </p>
            <Button variant="primary">Shop Now</Button>
          </div>
          <img
            src={heroImage}
            alt="Shop Zyqora"
            className="hidden md:block h-64 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="bg-gradient-to-br from-accent-300 to-secondary-300 rounded-xl2 shadow-soft p-8 flex flex-col justify-between text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
              Trendy Decor
            </p>
            <h2 className="text-2xl font-display font-bold mt-2">New Arrivals Collection</h2>
            <p className="text-sm opacity-90 mt-2">
              Fresh styles added weekly. Grab yours before they're gone.
            </p>
          </div>
          <Button variant="secondary" className="mt-6 self-start">
            Shop Now
          </Button>
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