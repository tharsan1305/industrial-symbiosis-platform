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

import { AuthGuard } from './components/common/Guards';

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
                    {/* Public Browsing Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/passport/:batchCode" element={<PassportPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/listings/:id" element={<ListingDetailPage />} />
                    <Route path="/industries/:id" element={<IndustryProfilePage />} />
                    <Route path="/impact" element={<ImpactPage />} />

                    {/* Authenticated Industry Routes (Require Login) */}
                    <Route
                      path="/dashboard"
                      element={
                        <AuthGuard>
                          <DashboardPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/onboarding"
                      element={
                        <AuthGuard>
                          <OnboardingPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/listings"
                      element={
                        <AuthGuard>
                          <ListingsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/listings/new"
                      element={
                        <AuthGuard>
                          <ListingFormPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/listings/:id/edit"
                      element={
                        <AuthGuard>
                          <ListingFormPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/requests"
                      element={
                        <AuthGuard>
                          <RequestsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/rfq"
                      element={
                        <AuthGuard>
                          <RfqPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/deals"
                      element={
                        <AuthGuard>
                          <DealsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/deals/:id"
                      element={
                        <AuthGuard>
                          <DealRoomPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/reviews/:dealId"
                      element={
                        <AuthGuard>
                          <ReviewPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/complaints"
                      element={
                        <AuthGuard>
                          <ComplaintsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/network"
                      element={
                        <AuthGuard>
                          <SymbiosisNetworkPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <AuthGuard>
                          <SettingsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/feedback"
                      element={
                        <AuthGuard>
                          <FeedbackPage />
                        </AuthGuard>
                      }
                    />

                    {/* Admin Regulatory Desk Routes (Require Login + Admin Role) */}
                    <Route
                      path="/admin/verification"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminVerificationPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/admin/complaints"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminComplaintsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/admin/fraud"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminFraudPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/admin/audit"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminAuditPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/admin/emission-factors"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminEmissionFactorsPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <AuthGuard allowedRoles={['admin']}>
                          <AdminAnalyticsPage />
                        </AuthGuard>
                      }
                    />

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
