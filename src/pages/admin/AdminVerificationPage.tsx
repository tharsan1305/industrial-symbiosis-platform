import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { IndustryProfile, OnboardingStatus } from '../../types';
import { useTranslation } from '../../i18n/translations';
import { RoleGuard } from '../../components/common/Guards';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  ExternalLink,
  X,
  Search,
} from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const { formatNumber } = useTranslation();
  const [queue, setQueue] = useState<IndustryProfile[]>([]);
  const [selectedInd, setSelectedInd] = useState<IndustryProfile | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeDocViewer, setActiveDocViewer] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const data = await adminApi.getVerificationQueue();
    setQueue(data);
    if (data.length > 0 && !selectedInd) {
      setSelectedInd(data[0]);
    }
  };

  const handleUpdateStatus = async (status: OnboardingStatus, reason?: string) => {
    if (!selectedInd) return;
    await adminApi.updateVerification(selectedInd.id, status, reason);
    setShowRejectModal(false);
    setRejectReason('');
    await loadQueue();
    // Update local selection
    setSelectedInd((prev) => (prev ? { ...prev, status, rejectionReason: reason } : null));
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              TNPCB Regulatory Verification Desk
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Audit industrial factory registrations, inspect cryptographic SHA-256 consent orders, and approve exchange trading privileges
            </p>
          </div>
        </div>

        {/* 2-Column Split: Queue List on Left, Document Viewer on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue List (1 col) */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Application Backlog ({queue.length})
            </span>

            <div className="space-y-2 max-h-[640px] overflow-y-auto">
              {queue.map((ind) => {
                const isSelected = selectedInd?.id === ind.id;
                return (
                  <div
                    key={ind.id}
                    onClick={() => setSelectedInd(ind)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-stone-400">
                        {ind.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ind.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ind.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ind.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mt-1 leading-snug">
                      {ind.name}
                    </h4>

                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {ind.district}, TN · GSTIN: <span className="font-mono">{ind.gstin}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier & Document Inspector (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
            {selectedInd ? (
              <div className="space-y-6">
                {/* Header details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <h3 className="text-xl font-black text-stone-900 dark:text-white">
                      {selectedInd.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Factory License: <span className="font-mono font-bold">{selectedInd.factoryLicenseNo}</span> · PCB Consent: {selectedInd.pcbAuthorizationNo || 'Active'}
                    </p>
                  </div>

                  {/* Approve / Reject / Suspend Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus('approved')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Facility
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('suspended', 'Safety Audit Non-compliance')}
                      className="px-3 py-2 text-stone-400 hover:text-stone-700 text-xs font-semibold"
                    >
                      Suspend
                    </button>
                  </div>
                </div>

                {/* Submissions Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">REPRESENTATIVE:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{selectedInd.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">CONTACT PHONE:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{selectedInd.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">CORRIDOR PIN:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">{selectedInd.latitude}, {selectedInd.longitude}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">STATUS:</span>
                    <span className="font-bold text-emerald-700 uppercase">{selectedInd.status}</span>
                  </div>
                </div>

                {/* Documents Viewer List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 dark:text-white uppercase tracking-wider">
                    Uploaded Statutory Regulatory Files ({selectedInd.documents.length})
                  </h4>

                  {selectedInd.documents.length === 0 ? (
                    <div className="p-4 bg-amber-50 text-amber-900 rounded-xl text-xs">
                      No documents attached to this profile. Require uploader in onboarding.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedInd.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 text-xs bg-stone-50/50 dark:bg-stone-800/40"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-700" />
                              <span className="font-bold text-stone-900 dark:text-white">{doc.name}</span>
                              <span className="text-stone-400">({(doc.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            </div>

                            <a
                              href={doc.presignedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Inspect Pre-signed Document
                            </a>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500 bg-white dark:bg-stone-900 p-2 rounded border border-stone-200 dark:border-stone-700 truncate">
                            <span className="font-bold text-stone-700 dark:text-stone-300">SHA-256:</span>
                            <span className="truncate">{doc.sha256}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">Select an applicant to review dossier.</p>
            )}
          </div>
        </div>

        {/* Reject Reason Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-stone-900 max-w-md w-full p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Reject Industry Application
              </h3>
              <p className="text-xs text-stone-500">
                A regulatory explanation reason is required so the facility can correct and re-upload documents.
              </p>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Rejection Reason / Regulatory Defect
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Consent to Operate (CTO) order expired 31 Dec 2024. Please re-upload renewed order."
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!rejectReason.trim()}
                  onClick={() => handleUpdateStatus('rejected', rejectReason)}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};
