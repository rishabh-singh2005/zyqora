import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../../api/admin.api";

const EMPTY_FORM = { code: "", discountPct: "", maxDiscount: "", minOrderValue: "", expiresAt: "" };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCoupons = () => {
    getAllCoupons()
      .then((res) => setCoupons(res.coupons || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateCoupon(editingId, form);
      } else {
        await createCoupon(form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const openEditForm = (coupon) => {
    setForm({
      code: coupon.code,
      discountPct: coupon.discountPct,
      maxDiscount: coupon.maxDiscount || "",
      minOrderValue: coupon.minOrderValue,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
    });
    setEditingId(coupon.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await deleteCoupon(id);
    loadCoupons();
  };

  if (loading) return <p className="text-muted font-body">Loading coupons...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-ink">Coupons</h1>
        {!showForm && (
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 bg-zyqora-gradient text-white font-display font-semibold text-sm px-4 py-2 rounded-full hover:shadow-card-hover transition"
          >
            <Plus size={16} />
            Add Coupon
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl2 shadow-card p-6">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            {editingId ? "Edit Coupon" : "New Coupon"}
          </h2>
          {error && (
            <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Coupon Code (e.g. SAVE20)"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none uppercase"
            />
            <input
              type="number"
              name="discountPct"
              value={form.discountPct}
              onChange={handleChange}
              placeholder="Discount %"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              type="number"
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
              placeholder="Max Discount (₹, optional)"
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              type="number"
              name="minOrderValue"
              value={form.minOrderValue}
              onChange={handleChange}
              placeholder="Min Order Value (₹)"
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-zyqora-gradient text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setEditingId(null);
                  setShowForm(false);
                }}
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
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Expires</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-primary-50">
                <td className="p-4 font-display font-semibold text-ink">{coupon.code}</td>
                <td className="p-4 text-muted">
                  {coupon.discountPct}% {coupon.maxDiscount ? `(max ₹${coupon.maxDiscount})` : ""}
                </td>
                <td className="p-4 text-muted">₹{coupon.minOrderValue}</td>
                <td className="p-4 text-muted">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEditForm(coupon)} className="text-muted hover:text-primary-600 transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-muted hover:text-secondary-500 transition">
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
