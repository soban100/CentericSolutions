import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, FileText, MessageSquare, Star, Layers, Info, HelpCircle, GraduationCap, Settings,
  ChevronLeft, ChevronRight, LogOut, Menu, X, Bell,
} from "lucide-react";
import { api } from "../../api";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Students", icon: GraduationCap, path: "/admin/students", notificationKey: "pending_enrollments" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Instructors", icon: Users, path: "/admin/instructors" },
  { label: "Blog", icon: FileText, path: "/admin/blog", notificationKey: "unpublished_posts" },
  { label: "Testimonials", icon: Star, path: "/admin/testimonials" },
  { label: "Messages", icon: MessageSquare, path: "/admin/messages", notificationKey: "unread_messages" },
  { label: "Heroes", icon: Layers, path: "/admin/heroes" },
  { label: "About", icon: Info, path: "/admin/about" },
  { label: "FAQ", icon: HelpCircle, path: "/admin/faq" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

function NotifItem({ icon: Icon, count, label, href, color }) {
  if (!count) return null;
  return (
    <Link to={href} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
      borderRadius: 8, textDecoration: "none", color: "inherit",
      transition: "background .15s",
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#F6F4F0"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={15} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{count} {label}</div>
      </div>
      <span style={{ background: color, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, lineHeight: 1 }}>{count}</span>
    </Link>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      marginLeft: "auto", background: "var(--accent)", color: "#0C1524",
      fontSize: 10.5, fontWeight: 700, lineHeight: 1,
      padding: "2px 6px", borderRadius: 999, minWidth: 18, textAlign: "center",
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SidebarContent({ collapsed, onToggleCollapse, mobile, onClose, notificationCounts }) {
  const location = useLocation();
  const active = (path) => location.pathname === path || (path === "/admin" && location.pathname === "/admin");

  return (
    <>
      <div style={{ padding: collapsed ? "24px 0" : "20px 18px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        {(!collapsed || mobile) && (
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: "#fff", textDecoration: "none" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--secondary)" }} />
            Centeric Solutions
          </Link>
        )}
        {mobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, path, notificationKey }) => (
          <Link key={label} to={path} onClick={onClose} style={{
            display: "flex", alignItems: "center", gap: 12, padding: collapsed && !mobile ? "12px 0" : "10px 14px",
            borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: active(path) ? 700 : 500,
            background: active(path) ? "rgba(255,255,255,.1)" : "transparent",
            color: active(path) ? "#fff" : "rgba(255,255,255,.55)",
            justifyContent: collapsed && !mobile ? "center" : "flex-start",
            transition: "background .15s",
            position: "relative",
          }}>
            <Icon size={18} />
            {(!collapsed || mobile) && <span>{label}</span>}
            {notificationKey && (!collapsed || mobile) && (
              <Badge count={notificationCounts?.[notificationKey]} />
            )}
          </Link>
        ))}
      </nav>

      <div style={{ padding: collapsed && !mobile ? "12px 0" : "12px 14px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,.45)", textDecoration: "none", fontSize: 13, fontWeight: 500, justifyContent: collapsed && !mobile ? "center" : "flex-start" }}>
          <LogOut size={16} />
          {(!collapsed || mobile) && <span>Back to site</span>}
        </Link>
      </div>

      {!mobile && (
        <button onClick={onToggleCollapse}
          style={{
            position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)",
            width: 28, height: 28, borderRadius: "50%",
            background: "#0C1524", border: "2px solid rgba(255,255,255,.12)",
            color: "rgba(255,255,255,.5)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      )}
    </>
  );
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const location = useLocation();

  const pageTitle = SIDEBAR_ITEMS.find((i) => i.path === location.pathname || (location.pathname === "/admin" && i.path === "/admin"))?.label || "Admin";

  const totalUnread = (notificationCounts.unread_messages || 0) + (notificationCounts.pending_enrollments || 0);

  useEffect(() => {
    const fetch = () => {
      api.getNotificationCounts()
        .then(setNotificationCounts)
        .catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showNotifications]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Manrope', system-ui, sans-serif", background: "#F6F4F0" }}>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 199 }} />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="admin-desktop-sidebar" style={{
        width: collapsed ? 72 : 260,
        background: "#0C1524", color: "#fff",
        display: "flex", flexDirection: "column",
        transition: "width .25s ease",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 200,
      }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
          <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} notificationCounts={notificationCounts} />
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <aside className="admin-mobile-sidebar" style={{
          width: 260, background: "#0C1524", color: "#fff",
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 200,
        }}>
          <SidebarContent collapsed={false} mobile onClose={() => setMobileOpen(false)} notificationCounts={notificationCounts} />
        </aside>
      )}

      {/* MAIN */}
      <div className="admin-main" style={{ marginLeft: collapsed ? 72 : 260, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .25s ease", minHeight: "100vh" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #E4E1DA", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5B6172", display: "none", padding: 4 }} className="admin-mobile-toggle">
            <Menu size={22} />
          </button>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#10162A" }}>{pageTitle}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5B6172", padding: 6, borderRadius: 8, position: "relative" }}>
                <Bell size={20} />
                {totalUnread > 0 && (
                  <span style={{
                    position: "absolute", top: 0, right: 0,
                    background: "#c0392b", color: "#fff",
                    fontSize: 9, fontWeight: 700, lineHeight: 1,
                    padding: "2px 5px", borderRadius: 999, minWidth: 16, textAlign: "center",
                  }}>
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  background: "#fff", borderRadius: 12, border: "1px solid #E4E1DA",
                  boxShadow: "0 8px 30px rgba(0,0,0,.1)", width: 300, zIndex: 300,
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #E4E1DA", fontWeight: 700, fontSize: 14 }}>Notifications</div>
                  <div style={{ padding: 8 }}>
                    <NotifItem icon={MessageSquare} count={notificationCounts.unread_messages} label="Unread messages" href="/admin/messages" color="var(--primary)" />
                    <NotifItem icon={GraduationCap} count={notificationCounts.pending_enrollments} label="Pending enrollments" href="/admin/students" color="var(--secondary)" />
                    <NotifItem icon={FileText} count={notificationCounts.unpublished_posts} label="Unpublished posts" href="/admin/blog" color="var(--accent)" />
                  </div>
                  {totalUnread === 0 && (
                    <div style={{ padding: "20px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                      All caught up! No new notifications.
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link to="/" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>View Site</Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-toggle { display: inline-flex !important; }
          .admin-desktop-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-mobile-sidebar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
