import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}