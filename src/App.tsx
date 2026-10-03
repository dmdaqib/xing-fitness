import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';

// Common Public Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SupportWidget } from './components/common/SupportWidget';
import { FloatingContactBar } from './components/common/FloatingContactBar';
import { FreeTrialModal } from './components/forms/FreeTrialModal';
import { EnquiryModal } from './components/forms/EnquiryModal';
import { OfferPopup } from './components/common/OfferPopup';

// Public Pages (P1/P2 Untouched)
import { HomePage } from './pages/HomePage';
import { WhyChoosePage } from './pages/WhyChoosePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OffersPage } from './pages/OffersPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { BookFreeTrialPage } from './pages/BookFreeTrialPage';

// Auth Pages (P3)
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Member Portal (P3)
import { MemberLayout } from './components/member/MemberLayout';
import { MemberDashboardPage } from './pages/member/MemberDashboardPage';
import { MemberMembershipPage } from './pages/member/MemberMembershipPage';
import { MemberClassBookingPage } from './pages/member/MemberClassBookingPage';
import { MemberTrainerBookingPage } from './pages/member/MemberTrainerBookingPage';
import { MemberWorkoutsPage } from './pages/member/MemberWorkoutsPage';
import { MemberProgressPage } from './pages/member/MemberProgressPage';
import { MemberAttendancePage } from './pages/member/MemberAttendancePage';
import { MemberNotificationsPage } from './pages/member/MemberNotificationsPage';

// Admin Portal (P3)
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminTrialsPage } from './pages/admin/AdminTrialsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminTrainersPage } from './pages/admin/AdminTrainersPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';

function AppContent() {
  const location = useLocation();

  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('Strength Training');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string>('Membership Pricing');

  const handleOpenTrialModal = (goal?: string) => {
    if (goal) setSelectedGoal(goal);
    setTrialModalOpen(true);
  };

  const handleOpenEnquiryModal = (plan?: string) => {
    if (plan) setSelectedPlanForEnquiry(plan);
    setEnquiryModalOpen(true);
  };

  const isPortalOrAuthRoute =
    location.pathname.startsWith('/member') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password');

  return (
    <div className="flex flex-col min-h-screen bg-[#090A0D] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Sticky Global Navigation for public pages */}
      {!isPortalOrAuthRoute && (
        <Navbar onOpenTrialModal={() => handleOpenTrialModal()} />
      )}

      {/* Dynamic Route View */}
      <div className="flex-1">
        <Routes>
          {/* ========================================================= */}
          {/* 7 CORE ARCHITECTURE ROUTES                                */}
          {/* ========================================================= */}
          {/* 1. HOME */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenTrialModal={handleOpenTrialModal}
                onOpenEnquiryModal={handleOpenEnquiryModal}
              />
            }
          />

          {/* 2. WHY CHOOSE XING FITNESS */}
          <Route
            path="/why-xing"
            element={<WhyChoosePage onOpenTrialModal={handleOpenTrialModal} />}
          />
          <Route path="/why-choose-us" element={<Navigate to="/why-xing" replace />} />

          {/* 3. PROGRAMS (Group Classes, Memberships, Outcome Packages) */}
          <Route
            path="/programs"
            element={
              <ProgramsPage
                onOpenTrialModal={handleOpenTrialModal}
                onOpenEnquiryModal={handleOpenEnquiryModal}
              />
            }
          />
          <Route
            path="/programs/:slug"
            element={<ProgramDetailPage onOpenTrialModal={handleOpenTrialModal} />}
          />

          {/* 4. FITNESS BLOG */}
          <Route path="/blog" element={<BlogPage onOpenTrialModal={handleOpenTrialModal} />} />
          <Route path="/blog/:slug" element={<BlogPage onOpenTrialModal={handleOpenTrialModal} />} />

          {/* 5. ABOUT US + TRAINERS */}
          <Route
            path="/about"
            element={
              <AboutPage
                onOpenTrialModal={handleOpenTrialModal}
                onOpenEnquiryModal={handleOpenEnquiryModal}
              />
            }
          />
          <Route path="/trainers" element={<Navigate to="/about#trainers" replace />} />
          <Route path="/trainers/:slug" element={<Navigate to="/about#trainers" replace />} />

          {/* 6. OFFERS */}
          <Route
            path="/offers"
            element={
              <OffersPage
                onOpenTrialModal={handleOpenTrialModal}
                onOpenEnquiryModal={handleOpenEnquiryModal}
              />
            }
          />
          <Route path="/offer" element={<Navigate to="/offers" replace />} />

          {/* 7. CONTACT & FREE TRIAL */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book-free-trial" element={<BookFreeTrialPage />} />

          {/* Clean Aliases & Bookmark Preservation Redirects */}
          <Route path="/membership" element={<Navigate to="/programs#memberships" replace />} />
          <Route path="/facilities" element={<Navigate to="/why-xing" replace />} />
          <Route path="/gallery" element={<Navigate to="/why-xing" replace />} />
          <Route path="/faq" element={<Navigate to="/contact" replace />} />
          <Route path="/classes" element={<Navigate to="/programs#group-classes" replace />} />
          <Route path="/transformations" element={<Navigate to="/about" replace />} />
          <Route path="/fitness-tools" element={<Navigate to="/programs" replace />} />
          <Route path="/fitness-tools/*" element={<Navigate to="/programs" replace />} />
          <Route path="/find-your-program" element={<Navigate to="/programs" replace />} />

          {/* ========================================================= */}
          {/* P3 AUTHENTICATION ROUTES                                  */}
          {/* ========================================================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ========================================================= */}
          {/* P3 MEMBER PLATFORM ROUTES (PROTECTED)                     */}
          {/* ========================================================= */}
          <Route path="/member" element={<Navigate to="/member/dashboard" replace />} />
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberDashboardPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/membership"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberMembershipPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/classes"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberClassBookingPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/trainers"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberTrainerBookingPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/workouts"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberWorkoutsPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/progress"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberProgressPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/attendance"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberAttendancePage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/notifications"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'STAFF', 'ADMIN']}>
                <MemberLayout>
                  <MemberNotificationsPage />
                </MemberLayout>
              </ProtectedRoute>
            }
          />

          {/* ========================================================= */}
          {/* P3 ADMIN MANAGEMENT ROUTES (PROTECTED)                    */}
          {/* ========================================================= */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminMembersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminLeadsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trials"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminTrialsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminBookingsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <AdminPlansPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminTrainersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <AdminLayout>
                  <AdminClassesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <AdminOffersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Footer & Support Widget for public pages */}
      {!isPortalOrAuthRoute && (
        <>
          <Footer onOpenTrialModal={() => handleOpenTrialModal()} />
          <FloatingContactBar />
          <SupportWidget
            onOpenTrial={() => handleOpenTrialModal('Free Trial Pass')}
            onOpenEnquiry={(type) => handleOpenEnquiryModal(type || 'Membership Enquiry')}
          />
          <FreeTrialModal
            isOpen={trialModalOpen}
            onClose={() => setTrialModalOpen(false)}
            preselectedGoal={selectedGoal}
          />
          <EnquiryModal
            isOpen={enquiryModalOpen}
            onClose={() => setEnquiryModalOpen(false)}
            defaultPlan={selectedPlanForEnquiry}
          />
          <OfferPopup
            onOpenEnquiry={(offerValue) => handleOpenEnquiryModal(offerValue)}
          />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
