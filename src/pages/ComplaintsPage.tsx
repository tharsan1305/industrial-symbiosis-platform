import React, { useState, useEffect } from 'react';
import { complaintsApi } from '../api';
import { ComplaintItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/translations';
import { FileUploader } from '../components/common/FileUploader';
import {
  AlertOctagon,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  ShieldAlert,
} from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [category, setCategory] = useState<ComplaintItem['category']>('Quality Mismatch');
  const [againstName, setAgainstName] = useState('Salem Chemical Solvents Works');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintsApi.getAll();
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await complaintsApi.create({
        filedByIndustryId: profile?.id || 'ind-demo-current',
        filedByName: profile?.name || 'Kothari Bio-Energy',
        againstIndustryId: 'ind-target-01',
        againstName,
        category,
        description,
        evidenceFiles,
      });
      setShowModal(false);
      loadComplaints();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Dispute Resolution & Grievance Redressal
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            File non-compliance grievances, report moisture/chemical lab mismatches, or escalate hazardous transit violations
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4" />
          File Grievance / Dispute
        </button>
      </div>

      {/* Complaints list */}
      <div className="space-y-4">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                  Case #{c.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'In Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  [{c.category}]
                </span>
              </div>
              <span className="text-xs text-stone-400">Filed {new Date(c.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong className="text-stone-900 dark:text-white">Against {c.againstName}:</strong> {c.description}
            </p>

            {c.resolutionNotes && (
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  TNPCB Nodal Officer Action:
                </span>
                {c.resolutionNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* File Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-lg w-full p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                File Grievance with Regulatory Desk
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Dispute Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                >
                  <option value="Quality Mismatch">Feedstock Quality / Assay Mismatch</option>
                  <option value="Delivery Delay">Fleet Transit Delay</option>
                  <option value="Hazardous Non-compliance">Hazardous Non-compliance / Manifest Defect</option>
                  <option value="Quantity Deficit">Weighbridge Weight Discrepancy</option>
                  <option value="Payment Issue">Escrow / Commercial Settlement Dispute</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Entity / Facility Against
                </label>
                <input
                  type="text"
                  required
                  value={againstName}
                  onChange={(e) => setAgainstName(e.target.value)}
                  placeholder="e.g. Salem Chemical Solvents Works"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Factual Summary of Non-compliance
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State batch numbers, weighbridge slips, moisture variance readings..."
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold"
                >
                  {isSubmitting ? 'Registering...' : 'File Dispute Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
