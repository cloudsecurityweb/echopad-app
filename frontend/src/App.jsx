import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { googleAuthConfig } from './config/googleAuthConfig';

// Layout Components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

// Section Components
import Hero from './components/sections/Hero';
import TrustBar from './components/sections/TrustBar';
import AgentsOverview from './components/sections/AgentsOverview';
import Platform from './components/sections/Platform';
import ROI from './components/sections/ROI';
import Contact from './components/sections/Contact';

// Product Components
import ProductDetails from './components/products/ProductDetails';

// Pages
import AIScribe from './pages/ai-scribe/AIScribe';
import AIDocMan from './pages/ai-docman/AIDocMan';
import AIMedicalAssistant from './pages/ai-medical-assistant/AIMedicalAssistant';
import AIReceptionist from './pages/ai-receptionist/AIReceptionist';
import AIAdminAssistant from './pages/ai-admin-assistant/AIAdminAssistant';
import AIReminders from './pages/ai-reminders/AIReminders';
import EchoPadInsights from './pages/echopad-insights/EchoPadInsights';
import Aperio from './pages/aperio/Aperio';
import PrivacyPolicy from './pages/privacy-policy/PrivacyPolicy';
import TermsOfService from './pages/terms-of-service/TermsOfService';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import VerifyEmail from './pages/auth/VerifyEmail';
import AcceptInvitation from './pages/auth/AcceptInvitation';
import VerifyEmailSent from './pages/auth/VerifyEmailSent';
import ResendVerification from './pages/auth/ResendVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import Products from './pages/dashboard/Products';
import ProductsOwned from './pages/dashboard/ProductsOwned';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Subscriptions from './pages/dashboard/Subscriptions';
import Licenses from './pages/dashboard/Licenses';
import Billing from './pages/dashboard/Billing';
import Users from './pages/dashboard/Users';
import Activity from './pages/dashboard/Activity';
import ClientFeedback from './pages/dashboard/ClientFeedback';
import SuperAdminClients from './pages/dashboard/super-admin/Clients';
import ClientDetail from './pages/dashboard/ClientDetail';
import LicenseRequests from './pages/dashboard/super-admin/LicenseRequests';

// Dashboard Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// UI Components
import CookieConsent from './components/ui/CookieConsent';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Utils
import { initGoogleAnalytics } from './utils/analytics';
import { loadIntercomScript, bootIntercomAnonymous, bootIntercom, shutdownIntercom } from './utils/intercom';
import { fetchIntercomIdentity } from './api/intercom.api';
import { useScrollAnimations } from './hooks/useAnimation';
import { initializeConsentManagement, hasConsent } from './utils/cookieConsent';
import { useAuth } from './contexts/AuthContext';

import NotFound from './pages/NotFound';
import HelpCenter from './pages/dashboard/HelpCenter';
import HelpDocDetail from './pages/dashboard/HelpDocDetail';
import ClientManagementPage from './pages/dashboard/super-admin/ClientManagementPage';
import usePageTitle from './hooks/usePageTitle';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  const location = useLocation();
  const PageTitle = usePageTitle('Echopad AI - Healthcare AI Agent Platform | Reduce Costs 60%, Increase Revenue 20%');

  // Initialize scroll animations
  useScrollAnimations();

  // Handle hash navigation - scroll to section when navigating from other pages
  useEffect(() => {
    // Get hash from URL (React Router location.hash or window.location.hash)
    const hash = location.hash || window.location.hash;

    if (hash) {
      // Wait for page to render, then scroll to the hash element
      const scrollToHash = () => {
        // Ensure hash starts with #
        const hashId = hash.startsWith('#') ? hash : `#${hash}`;
        const element = document.querySelector(hashId);

        if (element) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      // Use requestAnimationFrame for better timing, with a small delay
      const frameId = requestAnimationFrame(() => {
        setTimeout(scrollToHash, 50);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {PageTitle}
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <AgentsOverview />
        <ProductDetails />
        <Platform />
        <ROI />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/**
 * Upgrades Intercom to an identity-verified session when the user logs in.
 * Falls back to anonymous mode (launcher still visible) on logout.
 * Must be rendered inside AuthProvider.
 */
function IntercomBootstrap() {
  const { isAuthenticated, userProfile } = useAuth();

  useEffect(() => {
    if (!hasConsent()) return;

    if (isAuthenticated && userProfile?.user) {
      // Upgrade anonymous session → identity-verified session
      fetchIntercomIdentity()
        .then((data) => {
          if (data?.appId && data?.userHash) {
            bootIntercom(data);
          }
        })
        .catch(() => {
          // Identity fetch failed — stay in anonymous mode, launcher still shows
        });
    } else if (!isAuthenticated) {
      // User logged out — revert to anonymous mode so launcher stays visible
      shutdownIntercom({ rebootAnonymous: true });
    }
  }, [isAuthenticated, userProfile]);

  return null;
}

function App({ msalInstance }) {
  // Initialize consent management and conditionally load analytics scripts
  useEffect(() => {
    initializeConsentManagement();

    if (hasConsent()) {
      initGoogleAnalytics();
      loadIntercomScript();
      // Boot in anonymous mode so the launcher icon is always visible
      bootIntercomAnonymous();
    }

    // Deferred initialization — called by CookieConsent when user accepts
    window.initializeAnalytics = () => {
      initGoogleAnalytics();
      loadIntercomScript();
      bootIntercomAnonymous();
    };
  }, []);

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleAuthConfig.clientId}>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <RoleProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ai-scribe" element={<AIScribe />} />
                  <Route path="/ai-docman" element={<AIDocMan />} />
                  <Route path="/ai-medical-assistant" element={<AIMedicalAssistant />} />
                  <Route path="/ai-receptionist" element={<AIReceptionist />} />
                  <Route path="/ai-admin-assistant" element={<AIAdminAssistant />} />
                  <Route path="/ai-reminders" element={<AIReminders />} />
                  <Route path="/echopad-insights" element={<EchoPadInsights />} />
                  <Route path="/aperio" element={<Aperio />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
                  <Route path="/resend-verification" element={<ResendVerification />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/accept-invitation" element={<AcceptInvitation />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="client-admin" element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="productsowned" element={<ProductsOwned />} />
                    <Route path="products" element={<Products />} />
                    <Route path="clients" element={<SuperAdminClients />} />
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="licenses" element={<Licenses />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="help" element={<HelpCenter />} />
                    <Route path="help/:docId" element={<HelpDocDetail />} />
                    <Route path="users" element={<Users />} />
                    <Route path="activity" element={<Activity />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="client-feedback" element={<ClientFeedback />} />
                    <Route path="clients/:id" element={<ClientDetail />} />
                    <Route path="clients/client/:tenantId/:id" element={<ClientManagementPage />} />
                    <Route path="license-requests" element={<LicenseRequests />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <IntercomBootstrap />
                <CookieConsent />
                <ToastContainer position="top-right" autoClose={5000} />
              </BrowserRouter>
            </RoleProvider>
          </AuthProvider>
        </MsalProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
