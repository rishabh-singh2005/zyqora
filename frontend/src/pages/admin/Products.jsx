import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Upload } from "lucide-react";
import { fetchCategories } from "../../api/product.api";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  adjustProductStock,
} from "../../api/admin.api";
import { getAdminProducts } from "../../api/admin.api";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discountPct: "0",
  stock: "",
  categoryId: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFor, setUploadingFor] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const loadData = () => {
  Promise.all([getAdminProducts({ limit: 50 }), fetchCategories()])
    .then(([productRes, categoryRes]) => {
      setProducts(productRes.products || []);
      setCategories(categoryRes.categories || []);
    })
    .finally(() => setLoading(false));
};

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddForm = () => {
  setForm(EMPTY_FORM);
  setEditingId(null);
  setSelectedImages([]);
  setShowForm(true);
  setError("");
};

const openEditForm = (product) => {
  setForm({
    name: product.name,
    description: product.description,
    price: product.price,
    discountPct: product.discountPct,
    stock: product.stock,
    categoryId: product.categoryId,
  });
  setEditingId(product.id);
  setSelectedImages([]);
  setShowForm(true);
  setError("");
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError("");
  try {
    let productId = editingId;

    if (editingId) {
      await updateProduct(editingId, form);
    } else {
      const res = await createProduct(form);
      productId = res.product.id;
    }

    // ==================== UPLOAD SELECTED IMAGES ====================
    if (selectedImages.length > 0 && productId) {
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append("images", file));
      await uploadProductImages(productId, formData);
    }

    setShowForm(false);
    setSelectedImages([]);
    loadData();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to save product");
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this product?")) return;
    await deleteProduct(id);
    loadData();
  };

  const handleImageUpload = async (productId, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFor(productId);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      await uploadProductImages(productId, formData);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploadingFor(null);
    }
  };

  // ==================== STOCK ADJUSTMENT ====================
  const handleStockAdjust = async (productId, change) => {
    try {
      await adjustProductStock(productId, change);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to adjust stock");
    }
  };

  if (loading) return <p className="text-muted font-body">Loading products...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-ink">Products</h1>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-zyqora-gradient text-white font-display font-semibold text-sm px-4 py-2 rounded-full hover:shadow-card-hover transition"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl2 shadow-card p-6">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            {editingId ? "Edit Product" : "New Product"}
          </h2>
          {error && (
            <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              rows={2}
              className="sm:col-span-2 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none resize-none"
            />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              type="number"
              name="discountPct"
              value={form.discountPct}
              onChange={handleChange}
              placeholder="Discount %"
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock Quantity"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            {/* ==================== IMAGE UPLOAD ==================== */}
      <div className="sm:col-span-2">
        <label className="block text-sm font-body font-medium text-ink mb-1.5">
          Product Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setSelectedImages(Array.from(e.target.files))}
          className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-primary-100 file:text-primary-600 file:text-sm file:font-body"
        />
        {selectedImages.length > 0 && (
          <p className="text-xs font-body text-muted mt-1.5">
            {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>



            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-zyqora-gradient text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-ink font-display font-semibold text-sm px-5 py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl2 shadow-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-primary-100 text-left text-muted">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Images</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-primary-50">
                <td className="p-4 font-medium text-ink">{product.name}</td>
                <td className="p-4 text-muted">{product.category?.name}</td>
                <td className="p-4 text-ink">₹{product.price}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStockAdjust(product.id, -1)}
                      className="w-6 h-6 rounded-full border border-primary-100 text-muted hover:border-primary-500 transition"
                    >
                      −
                    </button>
                    <span className={product.stock < 10 ? "text-secondary-600 font-medium" : "text-ink"}>
                      {product.stock}
                    </span>
                    <button
                      onClick={() => handleStockAdjust(product.id, 1)}
                      className="w-6 h-6 rounded-full border border-primary-100 text-muted hover:border-primary-500 transition"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <label className="flex items-center gap-1 text-primary-600 cursor-pointer hover:underline">
                    <Upload size={14} />
                    {uploadingFor === product.id ? "Uploading..." : `${product.images?.length || 0} imgs`}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(product.id, e)}
                    />
                  </label>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEditForm(product)} className="text-muted hover:text-primary-600 transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-muted hover:text-secondary-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}