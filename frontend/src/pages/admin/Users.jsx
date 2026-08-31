import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Ban,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  createUser,
  deleteUser,
} from "../../api/admin.api";

export default function AdminUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // ==================== CREATE USER STATE ====================
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // ==================== LOAD USERS ====================
  const loadUsers = (searchTerm = "") => {
    setLoading(true);

    getUsers({
      search: searchTerm,
      limit: 50,
    })
      .then((res) => {
        setUsers(res.users || []);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ==================== SEARCH PARAMS ====================
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    setSearch(urlSearch);
    loadUsers(urlSearch);
  }, [searchParams]);

  // ==================== SEARCH ====================
  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(search);
  };

  // ==================== ROLE CHANGE ====================
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      loadUsers(search);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update role"
      );
    }
  };

  // ==================== BAN / UNBAN ====================
  const handleBanToggle = async (id, currentlyBanned) => {
    try {
      await updateUserStatus(id, !currentlyBanned);
      loadUsers(search);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update status"
      );
    }
  };

  // ==================== CREATE USER ====================
  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await createUser(form);

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });

      // Close form
      setShowForm(false);

      // Refresh users list
      loadUsers(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create user"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================== DELETE USER ====================
  const handleDeleteUser = async (id, email) => {
    const confirmed = window.confirm(
      `Delete ${email}? They will need to sign up again to use the platform.`
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);

      // Immediately remove deleted user from UI
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );

      // Optional refresh to keep data completely in sync
      loadUsers(search);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  };

  // ==================== OPEN CREATE FORM ====================
  const handleOpenCreateForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });

    setError("");
    setShowForm(true);
  };

  // ==================== CLOSE CREATE FORM ====================
  const handleCloseCreateForm = () => {
    setShowForm(false);
    setError("");

    setForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <p className="text-muted font-body">
        Loading users...
      </p>
    );
  }

  // ==================== UI ====================
  return (
    <div className="space-y-6">

      {/* ==================== HEADER ==================== */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-ink">
          Users
        </h1>

        {/* Only SUPER_ADMIN can create users */}
        {isSuperAdmin && !showForm && (
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="flex items-center gap-1.5 bg-zyqora-gradient text-white font-display font-semibold text-sm px-4 py-2 rounded-full hover:shadow-card-hover transition"
          >
            <Plus size={16} />
            Add User
          </button>
        )}
      </div>

      {/* ==================== CREATE USER FORM ==================== */}
      {isSuperAdmin && showForm && (
        <div className="bg-white rounded-xl2 shadow-card p-6 max-w-lg">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            Create New User
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleCreateUser}
            className="space-y-4"
          >
            {/* Name */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Full Name"
              required
              className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            />

            {/* Role */}
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 outline-none"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-zyqora-gradient text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Creating..." : "Create User"}
              </button>

              <button
                type="button"
                onClick={handleCloseCreateForm}
                disabled={saving}
                className="text-ink font-display font-semibold text-sm px-5 py-2.5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== SEARCH ==================== */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 max-w-md"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm font-body border border-primary-100 rounded-lg outline-none focus:border-primary-500"
          />
        </div>

        <button
          type="submit"
          className="bg-zyqora-gradient text-white font-display font-semibold text-sm px-4 rounded-lg"
        >
          Search
        </button>
      </form>

      {/* ==================== USERS TABLE ==================== */}
      <div className="bg-white rounded-xl2 shadow-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-primary-100 text-left text-muted">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-primary-50"
              >
                {/* ==================== NAME ==================== */}
                <td className="p-4 font-medium text-ink">
                  {u.name || "-"}
                </td>

                {/* ==================== EMAIL ==================== */}
                <td className="p-4 text-muted">
                  {u.email}
                </td>

                {/* ==================== ROLE ==================== */}
                <td className="p-4">
                  {isSuperAdmin && u.role !== "SUPER_ADMIN" ? (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(
                          u.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-primary-100 px-2 py-1 text-xs font-body outline-none focus:border-primary-500"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span className="text-xs font-semibold bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {u.role}
                    </span>
                  )}
                </td>

                {/* ==================== STATUS ==================== */}
                <td className="p-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.isBanned
                        ? "bg-secondary-100 text-secondary-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>

                {/* ==================== ACTIONS ==================== */}
                <td className="p-4">
                  <div className="flex items-center gap-3">

                    {/* Ban / Unban */}
                    {u.role !== "SUPER_ADMIN" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleBanToggle(
                            u.id,
                            u.isBanned
                          )
                        }
                        className={`flex items-center gap-1 text-xs font-body ${
                          u.isBanned
                            ? "text-green-600"
                            : "text-secondary-600"
                        } hover:underline`}
                      >
                        {u.isBanned ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <Ban size={14} />
                        )}

                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                    )}

                    {/* Delete - SUPER_ADMIN only */}
                    {isSuperAdmin &&
                      u.role !== "SUPER_ADMIN" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteUser(
                              u.id,
                              u.email
                            )
                          }
                          className="text-muted hover:text-secondary-600 transition"
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}

            {/* No users found */}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-muted font-body"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

