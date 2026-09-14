import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import WorkSection from './components/WorkSection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';
import AdminDrawer from './components/AdminDrawer';
import AdminLogin from './components/AdminLogin';
import { API_BASE } from './config/api';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication & Stealth Mode State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Video modal state
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: '',
  });

  // Admin / DB drawer state
  const [adminOpen, setAdminOpen] = useState(false);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [profRes, projRes, servRes, testRes] = await Promise.allSettled([
        fetch(`${API_BASE}/profile`).then((r) => r.json()),
        fetch(`${API_BASE}/projects`).then((r) => r.json()),
        fetch(`${API_BASE}/services`).then((r) => r.json()),
        fetch(`${API_BASE}/testimonials`).then((r) => r.json()),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.success) {
        setProfile(profRes.value.data);
      }
      if (projRes.status === 'fulfilled' && projRes.value.success) {
        setProjects(projRes.value.data);
      }
      if (servRes.status === 'fulfilled' && servRes.value.success) {
        setServices(servRes.value.data);
      }
      if (testRes.status === 'fulfilled' && testRes.value.success) {
        setTestimonials(testRes.value.data);
      }
    } catch (error) {
      console.error('Error fetching MERN portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
    setAdminOpen(false);
    setLoginModalOpen(false);
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      window.history.pushState(null, '', '/');
    }
  };

  const handleCloseLogin = () => {
    setLoginModalOpen(false);
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      window.history.pushState(null, '', '/');
    }
  };

  const handleLoginSuccess = (user, token) => {
    setIsAuthenticated(true);
    setAdminUser(user);
    setLoginModalOpen(false);
    setAdminOpen(true);
  };

  // Check saved session on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    if (token) {
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        setIsAuthenticated(true);
        setAdminUser(user);
        fetch(`${API_BASE}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              handleLogout();
            }
          })
          .catch(() => {});
      } catch {
        handleLogout();
      }
    }
  }, []);

  // URL Route Detection for /admin/login, /admin, #/admin/login
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAdminRoute =
        path.includes('/admin') ||
        path.includes('/login') ||
        hash.includes('#admin') ||
        hash.includes('#/admin');

      if (isAdminRoute) {
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
        if (token) {
          setIsAuthenticated(true);
          setAdminOpen(true);
          setLoginModalOpen(false);
        } else {
          setLoginModalOpen(true);
        }
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Stealth Mode: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
        if (token) {
          setIsAuthenticated(true);
          setAdminOpen((prev) => !prev);
          setLoginModalOpen(false);
        } else {
          setLoginModalOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const handleOpenVideo = (videoUrl, title) => {
    setVideoModal({
      isOpen: true,
      videoUrl: videoUrl || '',
      title: title || 'Showreel Preview',
    });
  };

  const handleCloseVideo = () => {
    setVideoModal({
      isOpen: false,
      videoUrl: '',
      title: '',
    });
  };

  return (
    <div className="portfolio-app">
      {/* Smooth Custom Luxury Cursor */}
      <CustomCursor />

      {/* Main Navigation — Admin button is only rendered when authenticated */}
      <Navbar
        profile={profile}
        servicesCount={services?.length || 0}
        isAuthenticated={isAuthenticated}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Hero Section */}
      <Hero profile={profile} onOpenVideo={handleOpenVideo} />

      {/* Stats Bar */}
      <StatsBar profile={profile} />

      {/* Selected Work Portfolio Grid */}
      <WorkSection projects={projects} onOpenVideo={handleOpenVideo} />

      <div className="divider-line" />

      {/* Services Grid (Rendered only when user has added services) */}
      {services && services.length > 0 && (
        <>
          <div className="divider-line" />
          <ServicesSection services={services} />
        </>
      )}

      <div className="divider-line" />

      {/* About Section */}
      <AboutSection profile={profile} />

      {/* Testimonials (Rendered only when client reviews exist) */}
      {testimonials && testimonials.length > 0 && (
        <>
          <div className="divider-line" />
          <TestimonialsSection testimonials={testimonials} />
        </>
      )}

      <div className="divider-line" />

      {/* Contact Section connected to MongoDB */}
      <ContactSection profile={profile} onMessageSent={() => {}} />

      {/* Footer */}
      <Footer profile={profile} />

      {/* Showreel & Project Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />

      {/* Admin / MongoDB Compass Full CMS Console */}
      <AdminDrawer
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onLogout={handleLogout}
        profile={profile}
        projects={projects}
        services={services}
        testimonials={testimonials}
        onRefreshAll={fetchPortfolioData}
      />

      {/* Single Admin Login Page (Accessible via /admin/login or Stealth Mode Ctrl+Shift+A) */}
      <AdminLogin
        isOpen={loginModalOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
