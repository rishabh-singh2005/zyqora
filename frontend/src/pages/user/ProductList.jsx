import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../../components/product/ProductFilters";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/common/Pagination";
import { fetchProducts, fetchCategories } from "../../api/product.api";
import Breadcrumb from "../../components/common/Breadcrumb";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: searchParams.get("order") || "desc",
    page: searchParams.get("page") || "1",
  };

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.categories || []));
  }, []);

  useEffect(() => {
    fetchProducts({ ...filters, limit: 12 })
      .then((res) => {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, totalPages: 1 });
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilters = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.set("page", "1"); // reset to page 1 on any filter change
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", newPage);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={[{ label: "Products" }]} />
        <h1 className="text-2xl font-display font-bold text-ink">
          {filters.search ? `Results for "${filters.search}"` : "All Products"}
        </h1>

        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split("-");
            updateFilters({ sortBy, order });
          }}
          className="rounded-lg border border-primary-100 px-3 py-2 text-sm font-body outline-none focus:border-primary-500"
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters categories={categories} filters={filters} onFilterChange={updateFilters} />

        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
          <Pagination
            page={Number(pagination.page)}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
