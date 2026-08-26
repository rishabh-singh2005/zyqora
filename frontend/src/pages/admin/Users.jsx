import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Ban, ShieldCheck } from "lucide-react";
import { getUsers, updateUserRole, updateUserStatus } from "../../api/admin.api";
import { useSearchParams } from "react-router-dom";
// inside component:

export default function AdminUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const loadUsers = (searchTerm = "") => {
    getUsers({ search: searchTerm, limit: 50 })
      .then((res) => setUsers(res.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
  const urlSearch = searchParams.get("search") || "";
  setSearch(urlSearch);
  loadUsers(urlSearch);
}, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(search);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      loadUsers(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleBanToggle = async (id, currentlyBanned) => {
    try {
      await updateUserStatus(id, !currentlyBanned);
      loadUsers(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p className="text-muted font-body">Loading users...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-ink">Users</h1>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
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
              <tr key={u.id} className="border-b border-primary-50">
                <td className="p-4 font-medium text-ink">{u.name || "-"}</td>
                <td className="p-4 text-muted">{u.email}</td>
                <td className="p-4">
                  {isSuperAdmin && u.role !== "SUPER_ADMIN" ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
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
                <td className="p-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.isBanned ? "bg-secondary-100 text-secondary-600" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="p-4">
                  {u.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => handleBanToggle(u.id, u.isBanned)}
                      className={`flex items-center gap-1 text-xs font-body ${
                        u.isBanned ? "text-green-600" : "text-secondary-600"
                      } hover:underline`}
                    >
                      {u.isBanned ? <ShieldCheck size={14} /> : <Ban size={14} />}
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}