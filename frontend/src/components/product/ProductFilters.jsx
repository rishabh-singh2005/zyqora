import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductFilters({ categories, filters, onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  useEffect(() => {
    onFilterChange({ minPrice: priceRange[0], maxPrice: priceRange[1] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* ==================== CATEGORIES ==================== */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-5">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex items-center justify-between w-full font-display font-semibold text-ink"
        >
          Categories
          <ChevronDown
            size={18}
            className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {categoriesOpen && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => onFilterChange({ category: "" })}
              className={`block w-full text-left text-sm font-body px-2 py-1.5 rounded-lg transition ${
                !filters.category
                  ? "bg-primary-50 text-primary-600 font-medium"
                  : "text-muted hover:bg-primary-50/50"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.id })}
                className={`block w-full text-left text-sm font-body px-2 py-1.5 rounded-lg transition ${
                  filters.category === cat.id
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-muted hover:bg-primary-50/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ==================== PRICE RANGE ==================== */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-5">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full font-display font-semibold text-ink"
        >
          Price Range
          <ChevronDown
            size={18}
            className={`transition-transform ${priceOpen ? "rotate-180" : ""}`}
          />
        </button>

        {priceOpen && (
          <div className="mt-4 space-y-3">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-sm font-body text-muted">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}