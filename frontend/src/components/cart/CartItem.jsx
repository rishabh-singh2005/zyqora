import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item;
  const image = product.images?.[0]?.url || "https://placehold.co/100x100?text=No+Image";
  const finalPrice = product.discountPct
    ? Math.round(product.price - (product.price * product.discountPct) / 100)
    : product.price;

  return (
    <div className="flex items-center gap-4 bg-white/80 rounded-xl2 shadow-card p-4">
      <Link to={`/products/${product.slug}`} className="shrink-0">
        <img
          src={image}
          alt={product.name}
          className="w-20 h-20 object-contain bg-primary-50/50 rounded-lg p-2"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display font-semibold text-ink truncate hover:text-primary-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-body text-muted">{product.category?.name}</p>
        <p className="font-display font-bold text-primary-600 mt-1">₹{finalPrice}</p>
      </div>

      <div className="flex items-center border border-primary-100 rounded-full shrink-0">
        <button
          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
          className="p-2 hover:text-primary-600 transition"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-body text-sm">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          className="p-2 hover:text-primary-600 transition"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-20 text-right font-display font-semibold text-ink shrink-0">
        ₹{finalPrice * quantity}
      </p>

      <button
        onClick={() => onRemove(product.id)}
        className="text-muted hover:text-secondary-500 transition shrink-0"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}