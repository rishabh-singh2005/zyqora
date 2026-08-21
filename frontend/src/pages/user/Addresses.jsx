import { useEffect, useState } from "react";
import { Plus, Trash2, Star, Edit2 } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../api/address.api";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAddresses = () => {
    getAddresses()
      .then((res) => setAddresses(res.addresses || []))
      .catch((err) => console.error("Failed to load addresses:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (address) => {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    });
    setEditingId(address.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress(form);
      }
      setShowForm(false);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddress(id);
    loadAddresses();
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
    loadAddresses();
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading addresses...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "My Profile", to: "/profile" }, { label: "Addresses" }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-ink">Saved Addresses</h1>
        {!showForm && (
          <Button variant="primary" onClick={openAddForm}>
            <Plus size={16} className="inline mr-1.5" />
            Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            {editingId ? "Edit Address" : "New Address"}
          </h2>
          {error && (
            <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="line1"
              value={form.line1}
              onChange={handleChange}
              placeholder="Address Line 1"
              required
              className="sm:col-span-2 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="line2"
              value={form.line2}
              onChange={handleChange}
              placeholder="Address Line 2 (optional)"
              className="sm:col-span-2 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              className="rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button variant="primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </Button>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-center text-muted font-body py-10">No saved addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm font-body">
                  <p className="font-display font-semibold text-ink">
                    {addr.fullName} · {addr.phone}
                  </p>
                  <p className="text-muted mt-1">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      title="Set as default"
                      className="text-muted hover:text-accent-500 transition"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => openEditForm(addr)}
                    className="text-muted hover:text-primary-600 transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-muted hover:text-secondary-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}