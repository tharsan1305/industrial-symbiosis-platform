import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n/translations';
import { AppShell } from './components/common/AppShell';
import { ErrorBoundary } from './components/common/EmptyState';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingFormPage } from './pages/ListingFormPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { RequestsPage } from './pages/RequestsPage';
import { RfqPage } from './pages/RfqPage';
import { DealsPage } from './pages/DealsPage';
import { DealRoomPage } from './pages/DealRoomPage';
import { ReviewPage } from './pages/ReviewPage';
import { IndustryProfilePage } from './pages/IndustryProfilePage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { SymbiosisNetworkPage } from './pages/SymbiosisNetworkPage';
import { ImpactPage } from './pages/ImpactPage';
import { SettingsPage } from './pages/SettingsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { PassportPage } from './pages/PassportPage';

// Admin Pages
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminFraudPage } from './pages/admin/AdminFraudPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminEmissionFactorsPage } from './pages/admin/AdminEmissionFactorsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <BrowserRouter>
                <AppShell>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/passport/:batchCode" element={<PassportPage />} />

                    {/* Authenticated Industry Routes */}
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/listings" element={<ListingsPage />} />
                    <Route path="/listings/new" element={<ListingFormPage />} />
                    <Route path="/listings/:id/edit" element={<ListingFormPage />} />
                    <Route path="/listings/:id" element={<ListingDetailPage />} />
                    <Route path="/requests" element={<RequestsPage />} />
                    <Route path="/rfq" element={<RfqPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/deals/:id" element={<DealRoomPage />} />
                    <Route path="/reviews/:dealId" element={<ReviewPage />} />
                    <Route path="/industries/:id" element={<IndustryProfilePage />} />
                    <Route path="/complaints" element={<ComplaintsPage />} />
                    <Route path="/network" element={<SymbiosisNetworkPage />} />
                    <Route path="/impact" element={<ImpactPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />

                    {/* Admin Regulatory Desk Routes */}
                    <Route path="/admin/verification" element={<AdminVerificationPage />} />
                    <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                    <Route path="/admin/fraud" element={<AdminFraudPage />} />
                    <Route path="/admin/audit" element={<AdminAuditPage />} />
                    <Route path="/admin/emission-factors" element={<AdminEmissionFactorsPage />} />
                    <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppShell>
                <PwaInstallPrompt />
              </BrowserRouter>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
