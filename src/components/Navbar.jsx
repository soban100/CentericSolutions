import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, Settings, User, Lock, Bell, BookOpen, FileText, Star } from "lucide-react";
import { navLinks } from "../data/navLinks";
import { api } from "../api";
import { useSettings } from "../context/SettingsContext";
import ConfirmModal from "./ConfirmModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const LINK_MAP = {
  Home: "/",
  About: "/about",
  Courses: "/courses",
  Instructors: "/instructors",
  Testimonials: "/testimonials",
  Contact: "/contact",
  Blog: "/blog",
};

export default function Navbar({ scrolled, forceDark = false }) {
  const { settings } = useSettings();
  const siteName = settings.site_name || "Centeric Solutions";
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const dark = scrolled || forceDark;

  const loadUser = () => {
    api.getMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setAuthLoaded(true));
  };

  useEffect(() => { loadUser(); }, []);

  const loadNotifications = () => {
    api.getNotifications()
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleMarkRead = (id) => {
    api.markNotificationRead(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = () => {
    api.markAllNotificationsRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try { await api.logout(); } catch {}
    setUser(null);
    setDropdownOpen(false);
    sessionStorage.setItem("transition_reason", "logout");
    navigate("/login");
  };

  const handleEditProfile = () => {
    setDropdownOpen(false);
    setShowEditProfile(true);
  };

  const handleChangePassword = () => {
    setDropdownOpen(false);
    setShowChangePassword(true);
  };

  const handleSaveProfile = async (data) => {
    const result = await api.updateProfile(data);
    setUser(result.user);
    setShowEditProfile(false);
  };

  const handleSavePassword = async (data) => {
    await api.changePassword(data);
    setShowChangePassword(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "14px 0" : "20px 0",
          background: dark ? "rgba(246,244,240,0.9)" : "rgba(0,0,0,0.12)",
          backdropFilter: "blur(10px)",
          borderBottom: dark ? "1px solid #E4E1DA" : "1px solid transparent",
          transition: "background .3s ease, padding .3s ease, border-color .3s ease",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 19, color: "#0C1524", textDecoration: "none" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--secondary)" }} />
            {siteName}
          </Link>

          <ul className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link) => (
              <li key={link}>
                <Link
                  to={LINK_MAP[link] || `/${link.toLowerCase()}`}
                  className="nav-link solid-link"
                  style={{ fontSize: 14.5, fontWeight: 600, color: "#5B6172", textDecoration: "none" }}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {!authLoaded ? null : user ? (
              <>
                <div ref={notifDropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => { setShowNotifDropdown((o) => !o); if (!showNotifDropdown) loadNotifications(); }}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: 6, borderRadius: 8, position: "relative",
                      color: "#5B6172",
                    }}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: "absolute", top: 1, right: 1,
                        background: "#c0392b", color: "#fff",
                        fontSize: 9, fontWeight: 700, lineHeight: 1,
                        padding: "2px 5px", borderRadius: 999, minWidth: 16, textAlign: "center",
                      }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div style={{
                      position: "absolute", top: "100%", right: 0, marginTop: 8,
                      background: "#fff", border: "1px solid #E4E1DA", borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,.08)", width: 340,
                      overflow: "hidden", zIndex: 200,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #E4E1DA" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#10162A" }}>Updates</span>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--primary)", fontWeight: 600, fontFamily: "inherit" }}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ maxHeight: 320, overflowY: "auto", padding: 8 }}>
                        {notifications.length === 0 ? (
                          <div style={{ padding: "24px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No updates yet.</div>
                        ) : (
                          notifications.map((n) => {
                            const ICON_MAP = { new_blog: FileText, new_course: BookOpen, new_testimonial: Star };
                            const COLOR_MAP = { new_blog: "var(--primary)", new_course: "var(--secondary)", new_testimonial: "var(--accent)" };
                            const NotifIcon = ICON_MAP[n.type] || Bell;
                            const iconColor = COLOR_MAP[n.type] || "#5B6172";
                            return (
                              <a key={n.id} href={n.link || "#"}
                                onClick={() => { if (!n.is_read) handleMarkRead(n.id); setShowNotifDropdown(false); }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                                  borderRadius: 8, textDecoration: "none", color: "inherit",
                                  background: n.is_read ? "transparent" : "#F6F4F0",
                                  transition: "background .15s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#F6F4F0"}
                                onMouseLeave={(e) => e.currentTarget.style.background = n.is_read ? "transparent" : "#F6F4F0"}
                              >
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <NotifIcon size={15} color={iconColor} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "#10162A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
                                  {n.body && <div style={{ fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.body}</div>}
                                </div>
                                <div style={{ fontSize: 10.5, color: "#9CA3AF", whiteSpace: "nowrap", flexShrink: 0 }}>
                                  {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </div>
                              </a>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "4px 8px", borderRadius: 8,
                      fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                      color: "#5B6172",
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: user.avatar_url ? `url(${user.avatar_url}) center/cover` : "var(--primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 12, fontWeight: 700,
                    }}>
                      {user.avatar_url ? "" : user.name?.charAt(0).toUpperCase()}
                    </span>
                    {user.name}
                    <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
                  </button>

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "100%", right: 0, marginTop: 8,
                    background: "#fff", border: "1px solid #E4E1DA", borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,.08)", minWidth: 200,
                    overflow: "hidden", zIndex: 200,
                  }}>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} style={dropdownItemStyle}>
                        <Settings size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleEditProfile} style={dropdownBtnStyle}>
                      <User size={15} /> Edit Profile
                    </button>
                    <button onClick={handleChangePassword} style={dropdownBtnStyle}>
                      <Lock size={15} /> Change Password
                    </button>
                    <div style={{ height: 1, background: "#E4E1DA", margin: "4px 0" }} />
                    <button onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }} style={dropdownBtnStyle}>
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
                </>
              ) : (
                <>
                  <Link className="nav-login" to="/login" style={{ fontWeight: 600, fontSize: 14.5, color: "#5B6172", textDecoration: "none" }}>
                    Log in
                  </Link>
                  <Link to="/get-started" className="btn btn-primary" style={{ padding: "11px 20px", fontSize: 14, textDecoration: "none" }}>
                    Get Started
                  </Link>
                </>
              )}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{ display: "none", background: "none", border: "none", color: "#0C1524", padding: 6 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #E4E1DA", padding: "16px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
            {navLinks.map((link) => (
              <Link key={link} to={LINK_MAP[link] || `/${link.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: "#10162A", textDecoration: "none" }}>
                {link}
              </Link>
            ))}
            {user ? (
              <>
                <button onClick={() => { handleEditProfile(); setMobileOpen(false); }} style={mobileBtnStyle}>Edit Profile</button>
                <button onClick={() => { handleChangePassword(); setMobileOpen(false); }} style={mobileBtnStyle}>Change Password</button>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: "#10162A", textDecoration: "none" }}>Admin Panel</Link>
                )}
                <button onClick={() => { setShowLogoutConfirm(true); setMobileOpen(false); }} style={mobileBtnStyle}>Log out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: "#10162A", textDecoration: "none" }}>Log in</Link>
            )}
          </div>
        )}
      </nav>

      {showLogoutConfirm && (
        <ConfirmModal
          title="Log out"
          message="Are you sure you want to log out?"
          confirmLabel="Log out"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showEditProfile && user && (
        <EditProfileModal
          user={user}
          onSave={handleSaveProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal
          onSave={handleSavePassword}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}

const dropdownItemStyle = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "10px 16px", color: "#10162A", textDecoration: "none",
  fontSize: 14, fontWeight: 500,
  transition: "background .1s",
};

const dropdownBtnStyle = {
  ...dropdownItemStyle,
  width: "100%", cursor: "pointer", fontFamily: "inherit", fontSize: 14,
  border: "none", background: "none", textAlign: "left",
};

const mobileBtnStyle = {
  fontWeight: 600, color: "#10162A", textDecoration: "none",
  background: "none", border: "none", fontFamily: "inherit",
  fontSize: "inherit", textAlign: "left", cursor: "pointer", padding: 0,
};
