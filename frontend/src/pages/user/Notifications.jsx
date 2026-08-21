import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import { getNotifications, markAsRead } from "../../api/notification.api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    getNotifications()
      .then((res) => setNotifications(res.notifications || []))
      .catch((err) => console.error("Failed to load notifications:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ==================== MARK ALL UNREAD AS READ ON VISIT ====================
  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.filter((n) => !n.isRead);
      if (unread.length > 0) {
        Promise.all(unread.map((n) => markAsRead(n.id))).then(() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications.length]);

  if (loading) {
    return <p className="text-center py-20 text-muted font-body">Loading notifications...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Notifications" }]} />

      <h1 className="text-2xl font-display font-bold text-ink mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Bell size={48} className="mx-auto text-primary-300" />
          <p className="text-muted font-body">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-xl2 p-4 shadow-card transition ${
                n.isRead ? "bg-white/50" : "bg-white/90 border-l-4 border-primary-500"
              }`}
            >
              <div className={`rounded-full p-2 shrink-0 ${n.isRead ? "bg-gray-100 text-gray-400" : "bg-primary-100 text-primary-600"}`}>
                <Bell size={16} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm text-ink">{n.title}</p>
                <p className="text-sm font-body text-muted mt-0.5">{n.message}</p>
                <p className="text-xs font-body text-muted mt-1">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
