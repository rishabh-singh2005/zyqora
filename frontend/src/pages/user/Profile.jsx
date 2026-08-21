import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Download, MapPin } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { getProfile, updateProfile, uploadAvatar, downloadProfilePDF } from "../../api/user.api";
import { authSuccess } from "../../features/auth/authSlice";

export default function Profile() {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setForm({ name: res.user.name || "", address: res.user.address || "" });
        dispatch(authSuccess({ user: res.user, accessToken }));
      })
      .catch((err) => console.error("Failed to load profile:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await updateProfile(form);
      dispatch(authSuccess({ user: res.user, accessToken }));
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await uploadAvatar(formData);
      dispatch(authSuccess({ user: { ...user, profileImageUrl: res.user.profileImageUrl }, accessToken }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadProfilePDF();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "profile.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setMessage("Failed to download profile");
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading profile...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "My Profile" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">My Profile</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-8 space-y-6">
        {/* ==================== AVATAR ==================== */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zyqora-gradient text-white flex items-center justify-center font-display font-bold text-2xl">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 bg-zyqora-gradient text-white rounded-full p-1.5 shadow-soft"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-ink">{user?.name || "User"}</h2>
            <p className="text-sm font-body text-muted">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
              {user?.role}
            </span>
          </div>
        </div>

        {message && (
          <div className="bg-primary-50 text-primary-600 text-sm font-body rounded-lg px-4 py-3">
            {message}
          </div>
        )}

        {/* ==================== EDIT FORM ==================== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-ink">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-ink">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full mt-1 rounded-lg border border-primary-100 bg-gray-50 px-4 py-2.5 font-body text-sm text-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-ink">Address (short)</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="City, State"
              className="w-full mt-1 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="secondary" type="button" onClick={handleDownload}>
              <Download size={16} className="inline mr-1.5" />
              Download Profile
            </Button>
          </div>
        </form>

        {/* ==================== MANAGE ADDRESSES LINK ==================== */}
        <div className="border-t border-primary-100 pt-5">
          <a
            href="/addresses"
            className="flex items-center gap-2 text-sm font-display font-semibold text-primary-600 hover:underline"
          >
            <MapPin size={16} />
            Manage Saved Addresses
          </a>
        </div>
      </div>
    </div>
  );
}
