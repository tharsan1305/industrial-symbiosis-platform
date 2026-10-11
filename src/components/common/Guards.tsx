import React, { ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/translations';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, FileText, ArrowRight, Loader2 } from 'lucide-react';

export const AuthGuard: React.FC<{
  children: ReactNode;
  allowedRoles?: ('industry' | 'admin')[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Checking authorization...</span>
      </div>
    );
  }

  if (!user) {
    // Strictly prevent dashboard or internal portal access without login
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access Restricted: You must sign in to access the Operations Dashboard.',
        }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-amber-800 rounded-3xl text-stone-800 dark:text-stone-200 shadow-lg">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Restricted Portal Access</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This administrative area requires authorized credentials ({allowedRoles.join(' / ')} role).
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                to={user.role === 'admin' ? '/admin/verification' : '/dashboard'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Return to {user.role === 'admin' ? 'Regulatory Desk' : 'Operations Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const RoleGuard = AuthGuard;

export const ApprovedGuard: React.FC<{
  children: ReactNode;
  actionName?: string;
}> = ({ children, actionName = 'this action' }) => {
  const { profile, user } = useAuth();
  const { t } = useTranslation();

  // Admins bypass industry approval guard
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  const status = profile?.status || 'pending';

  if (status !== 'approved') {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
        <div className="flex items-start gap-4">
          {status === 'pending' && <Clock className="w-8 h-8 text-amber-500 shrink-0 mt-1" />}
          {status === 'rejected' && <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0 mt-1" />}
          {status === 'suspended' && <ShieldAlert className="w-8 h-8 text-rose-700 shrink-0 mt-1" />}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Action Restricted
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : status === 'rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-stone-200 text-stone-800'
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
              Industrial Verification Required for {actionName}
            </h3>

            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {status === 'pending' &&
                'Your industry registration is currently undergoing regulatory verification by the environmental desk. Listing creation, purchase requests, and RFQ submissions are locked until compliance documents (GSTIN & PCB Consent Order) are approved.'}
              {status === 'rejected' &&
                `Your registration was rejected: "${profile?.rejectionReason || 'Document verification mismatch'}". Please update your submissions.`}
              {status === 'suspended' &&
                'Your industry account has been temporarily suspended due to compliance alerts. Please contact the administrative desk.'}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition"
              >
                <FileText className="w-4 h-4" />
                Review & Update Verification Documents
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
