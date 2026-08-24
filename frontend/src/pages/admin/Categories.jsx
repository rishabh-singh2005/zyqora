import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { fetchCategories } from "../../api/product.api";
import { createCategory, updateCategory, deleteCategory } from "../../api/admin.api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = () => {
    fetchCategories()
      .then((res) => setCategories(res.categories || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddForm = () => {
    setName("");
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (category) => {
    setName(category.name);
    setEditingId(category.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }
      setShowForm(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products in it will not be deleted, but may become unlisted.")) return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) return <p className="text-muted font-body">Loading categories...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-ink">Categories</h1>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-zyqora-gradient text-white font-display font-semibold text-sm px-4 py-2 rounded-full hover:shadow-card-hover transition"
          >
            <Plus size={16} />
            Add Category
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl2 shadow-card p-6 max-w-md">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          {error && (
            <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              required
              className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <div className="flex gap-3">
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
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-primary-50">
                <td className="p-4 font-medium text-ink">{cat.name}</td>
                <td className="p-4 text-muted">{cat.slug}</td>
                <td className="p-4 text-muted">{cat.products?.length ?? "-"}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEditForm(cat)} className="text-muted hover:text-primary-600 transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-muted hover:text-secondary-500 transition">
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