import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { CosmosProvider } from './contexts/CosmosContext';
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
import ReferCare from './pages/refercare/ReferCare';
import PrivacyPolicy from './pages/privacy-policy/PrivacyPolicy';
import TermsOfService from './pages/terms-of-service/TermsOfService';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import VerifyEmail from './pages/auth/VerifyEmail';
import AcceptInvitation from './pages/auth/AcceptInvitation';
import VerifyEmailSent from './pages/auth/VerifyEmailSent';
import Dashboard from './pages/dashboard/Dashboard';
import ClientAdminDashboard from './pages/dashboard/ClientAdminDashboard';
import UserAdminDashboard from './pages/dashboard/UserAdminDashboard';
import Profile from './pages/dashboard/Profile';
import Products from './pages/dashboard/Products';
import YourProducts from './pages/dashboard/YourProducts';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Subscriptions from './pages/dashboard/Subscriptions';
import Licenses from './pages/dashboard/Licenses';
import Billing from './pages/dashboard/Billing';
import Users from './pages/dashboard/Users';
import Activity from './pages/dashboard/Activity';
import ClientFeedback from './pages/dashboard/ClientFeedback';
import ClientDetail from './pages/dashboard/ClientDetail';
import Clients from './pages/dashboard/Clients';

// Dashboard Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// UI Components
import CookieConsent from './components/ui/CookieConsent';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Utils
import { initGoogleAnalytics } from './utils/analytics';
import { initIntercom } from './utils/intercom';
import { useScrollAnimations } from './hooks/useAnimation';
import { initializeConsentManagement, hasConsent } from './utils/cookieConsent';

import NotFound from './pages/NotFound';
import HelpCenter from './pages/dashboard/HelpCenter';
import ClientsSection from './pages/dashboard/super-admin/sections/ClientsSection';

function HomePage() {
  const location = useLocation();

  // Initialize scroll animations
  useScrollAnimations();

  // Initialize analytics and Intercom only if user has consented
  useEffect(() => {
    // Initialize consent management first
    initializeConsentManagement();
    
    // Only initialize analytics if user has given consent
    if (hasConsent()) {
      initGoogleAnalytics();
      initIntercom();
    } else {
      console.log('[Cookie Consent] Analytics blocked - awaiting user consent');
    }
  }, []);

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

function App({ msalInstance }) {
  // Initialize consent management and conditionally initialize analytics
  useEffect(() => {
    // Initialize consent management first - blocks analytics by default
    initializeConsentManagement();
    
    // Only initialize analytics if user has given consent
    if (hasConsent()) {
      initGoogleAnalytics();
      initIntercom();
    } else {
      console.log('[Cookie Consent] Analytics and tracking blocked - awaiting user consent');
    }
    
    // Set up a global function for deferred initialization after consent
    window.initializeAnalytics = () => {
      console.log('[Cookie Consent] User consented - initializing analytics now');
      initGoogleAnalytics();
      initIntercom();
    };
  }, []);

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleAuthConfig.clientId}>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <RoleProvider>
              <CosmosProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ai-scribe" element={<AIScribe />} />
                    <Route path="/ai-agent/ai-scribe" element={<AIScribe />} />
                    <Route path="/ai-agent/ai-docman" element={<AIDocMan />} />
                    <Route path="/ai-agent/ai-medical-assistant" element={<AIMedicalAssistant />} />
                    <Route path="/ai-agent/ai-receptionist" element={<AIReceptionist />} />
                    <Route path="/ai-agent/ai-admin-assistant" element={<AIAdminAssistant />} />
                    <Route path="/ai-agent/ai-reminders" element={<AIReminders />} />
                    <Route path="/echopad-insights" element={<EchoPadInsights />} />
                    <Route path="/ai-agent/refercare" element={<ReferCare />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
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
                      <Route path="super-admin" element={<Profile />} />
                      <Route path="client-admin" element={<ClientAdminDashboard />} />
                      <Route path="user-admin" element={<UserAdminDashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="your-products" element={<YourProducts />} />
                      <Route path="products" element={<Products />} />
                      <Route path="clients" element={<Clients />} />
                      <Route path="subscriptions" element={<Subscriptions />} />
                      <Route path="licenses" element={<Licenses />} />
                      <Route path="billing" element={<Billing />} />
                      <Route path="help" element={<HelpCenter/>} />
                      <Route path="clients" element={<ClientsSection />} />
                      <Route path="users" element={<Users />} />
                      <Route path="activity" element={<Activity />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="client-feedback" element={<ClientFeedback />} />
                      <Route path="clients/:id" element={<ClientDetail />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CookieConsent />
                </BrowserRouter>
              </CosmosProvider>
            </RoleProvider>
          </AuthProvider>
        </MsalProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
