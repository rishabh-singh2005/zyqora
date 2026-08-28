import { useState } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}