import { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { api } from "./api";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Instructors from "./pages/Instructors";
import InstructorDetail from "./pages/InstructorDetail";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import ForgotPassword from "./pages/ForgotPassword";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminInstructors from "./pages/admin/Instructors";
import AdminBlog from "./pages/admin/Blog";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminMessages from "./pages/admin/Messages";
import AdminHeroes from "./pages/admin/Heroes";
import AdminAbout from "./pages/admin/About";
import AdminFAQ from "./pages/admin/FAQ";
import AdminStudents from "./pages/admin/Students";
import AdminSettings from "./pages/admin/Settings";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import "./App.css";

function RouteTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ title: "Centeric Solutions", subtitle: "Technology Academy" });
  const { settings } = useSettings();
  const prevKey = useRef(null);
  const prevPath = useRef(null);

  const siteName = settings.site_name || "Centeric Solutions";
  const siteTagline = settings.site_tagline || "Technology Academy";

  useEffect(() => {
    const authRoutes = ["/login", "/get-started", "/forgot-password"];
    const isFirst = prevKey.current === null;
    const prevWasAuth = prevPath.current && authRoutes.includes(prevPath.current);
    const nowIsAuth = authRoutes.includes(location.pathname);

    let shouldAnimate = isFirst || prevWasAuth || nowIsAuth;

    if (shouldAnimate) {
      let title = siteName;
      let subtitle = siteTagline;

      if (isFirst) {
        title = "Welcome";
        subtitle = `${siteName}  ·  ${siteTagline}`;
      } else if (prevWasAuth && !nowIsAuth) {
        const reason = sessionStorage.getItem("transition_reason");
        if (reason === "logout") {
          title = "Miss you already!";
          subtitle = "Come back soon";
        } else {
          const name = sessionStorage.getItem("user_name");
          title = name ? `Nice to see you again, ${name}` : "Welcome back!";
          subtitle = `${siteName}  ·  ${siteTagline}`;
        }
        sessionStorage.removeItem("transition_reason");
        sessionStorage.removeItem("user_name");
      } else if (nowIsAuth && !isFirst) {
        if (location.pathname === "/login") {
          title = "Please Login";
        } else if (location.pathname === "/get-started") {
          title = "Sign in to Join Us!";
        }
        subtitle = `${siteName}  ·  ${siteTagline}`;
      }

      setLoading(true);
      setMessage({ title, subtitle });
    }

    prevKey.current = location.key;
    prevPath.current = location.pathname;
  }, [location.key, location.pathname, siteName, siteTagline]);

  return (
    <>
      <PageLoader visible={loading} onDone={() => setLoading(false)} title={message.title} subtitle={message.subtitle} />
      {children}
    </>
  );
}

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const authRoutes = ["/login", "/get-started", "/forgot-password"];
  const isAuthPage = authRoutes.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SettingsProvider>
    <RouteTransition>
      <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: "#10162A", background: "#F6F4F0", lineHeight: 1.55 }}>
        {!isAuthPage && <Navbar scrolled={scrolled} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/instructors/:id" element={<InstructorDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
        <Footer />
      </div>
    </RouteTransition>
    </SettingsProvider>
  );
}

function AdminGuard({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.getMe()
      .then((user) => {
        if (user.role === "admin") {
          setStatus("authenticated");
        } else {
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  if (status === "loading") {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#F6F4F0", color: "#5B6172", fontFamily: "'Manrope', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32, height: 32, border: "3px solid #E4E1DA", borderTopColor: "var(--primary)",
            borderRadius: "50%", animation: "admin-spin .6s linear infinite",
            margin: "0 auto 16px",
          }} />
          Verifying access...
        </div>
        <style>{`@keyframes admin-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return children;
}

function AdminSection() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <SettingsProvider>
    <AdminGuard>
      <RouteTransition>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/instructors" element={<AdminInstructors />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/testimonials" element={<AdminTestimonials />} />
            <Route path="/faq" element={<AdminFAQ />} />
            <Route path="/messages" element={<AdminMessages />} />
            <Route path="/heroes" element={<AdminHeroes />} />
            <Route path="/about" element={<AdminAbout />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </AdminLayout>
      </RouteTransition>
    </AdminGuard>
    </SettingsProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminSection />} />
        <Route path="*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}
