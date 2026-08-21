import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return <p className="text-muted font-body py-10 text-center">Loading products...</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted font-body">No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}