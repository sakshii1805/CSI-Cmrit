import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventModal } from './components/admin/in-place/EventModal';
import { AnnouncementModal } from './components/admin/in-place/AnnouncementModal';
import { GalleryModal } from './components/admin/in-place/GalleryModal';
import { AdminSubmissionsDrawer } from './components/admin/in-place/AdminSubmissionsDrawer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { GalleryPage } from './pages/GalleryPage';
import { GalleryDetail } from './pages/GalleryDetail';
import { ChapterHighlights } from './pages/ChapterHighlights';
import { Announcements } from './pages/Announcements';
import { AnnouncementDetails } from './pages/AnnouncementDetails';
import { JoinUs } from './pages/JoinUs';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

// Public Layout with Sticky Navbar, Comprehensive Footer, and Integrated Admin Mode Bar
const PublicLayout: React.FC = () => {
  const { isAdmin } = useAuth();
  const [submissionsDrawerOpen, setSubmissionsDrawerOpen] = useState(false);
  const [submissionsDrawerTab, setSubmissionsDrawerTab] = useState<'applications' | 'contacts' | 'profile'>('applications');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenSubmissions = (e: any) => {
      setSubmissionsDrawerTab(e?.detail?.tab || 'applications');
      setSubmissionsDrawerOpen(true);
    };
    const handleOpenEventModal = () => setEventModalOpen(true);
    const handleOpenAnnouncementModal = () => setAnnouncementModalOpen(true);
    const handleOpenGalleryModal = () => setGalleryModalOpen(true);

    window.addEventListener('csi_open_submissions_drawer', handleOpenSubmissions);
    window.addEventListener('csi_open_event_modal', handleOpenEventModal);
    window.addEventListener('csi_open_announcement_modal', handleOpenAnnouncementModal);
    window.addEventListener('csi_open_gallery_modal', handleOpenGalleryModal);

    return () => {
      window.removeEventListener('csi_open_submissions_drawer', handleOpenSubmissions);
      window.removeEventListener('csi_open_event_modal', handleOpenEventModal);
      window.removeEventListener('csi_open_announcement_modal', handleOpenAnnouncementModal);
      window.removeEventListener('csi_open_gallery_modal', handleOpenGalleryModal);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* In-Place Administrative Modals (Available across all pages when triggered) */}
      {isAdmin && (
        <>
          <EventModal
            isOpen={eventModalOpen}
            onClose={() => setEventModalOpen(false)}
            onSuccess={() => {
              window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'event' } }));
            }}
          />

          <AnnouncementModal
            isOpen={announcementModalOpen}
            onClose={() => setAnnouncementModalOpen(false)}
            onSuccess={() => {
              window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'announcement' } }));
            }}
          />

          <GalleryModal
            isOpen={galleryModalOpen}
            onClose={() => setGalleryModalOpen(false)}
            onSuccess={() => {
              window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'gallery' } }));
            }}
          />

          <AdminSubmissionsDrawer
            isOpen={submissionsDrawerOpen}
            defaultTab={submissionsDrawerTab}
            onClose={() => setSubmissionsDrawerOpen(false)}
          />
        </>
      )}
    </div>
  );
};

// 404 Not Found Page
const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl mb-4 border border-blue-100">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The page you are looking for does not exist or has been relocated.
      </p>
      <a
        href="/"
        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
      >
        Return to Home
      </a>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Integrated Website Layout with In-Place Admin Mode */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:id" element={<GalleryDetail />} />
              <Route path="/highlights" element={<ChapterHighlights />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcements/:id" element={<AnnouncementDetails />} />
              <Route path="/join" element={<JoinUs />} />
              <Route path="/contact" element={<Contact />} />

              {/* Seamless redirection: Any /admin path redirects to the integrated main site */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/admin/profile" element={<Navigate to="/" replace />} />
              <Route path="/admin/settings" element={<Navigate to="/" replace />} />
              <Route path="/admin/security" element={<Navigate to="/" replace />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Standalone Admin Sign In page */}
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
