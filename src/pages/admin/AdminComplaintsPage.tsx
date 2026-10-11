import React, { useState, useEffect } from 'react';
import { complaintsApi } from '../../api';
import { ComplaintItem } from '../../types';
import { RoleGuard } from '../../components/common/Guards';
import { AlertOctagon, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);

  useEffect(() => {
    complaintsApi.getAll().then(setComplaints);
  }, []);

  const handleResolve = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'Resolved', resolutionNotes: 'Joint sample testing verified. Corrective action order issued.' }
          : c
      )
    );
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Admin Grievance & Dispute Board
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Investigate inter-industry dispute filings, assay mismatches, and compliance alerts
          </p>
        </div>

        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900 dark:text-white">#{c.id}</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-stone-700 dark:text-stone-300">
                  <strong>Complainant:</strong> {c.filedByName} → <strong>Against:</strong> {c.againstName}
                </p>

                <p className="text-stone-600 dark:text-stone-400">"{c.description}"</p>

                {c.resolutionNotes && (
                  <p className="text-emerald-700 font-semibold pt-1 border-t border-stone-100 dark:border-stone-800">
                    Resolution: {c.resolutionNotes}
                  </p>
                )}
              </div>

              {c.status !== 'Resolved' && (
                <button
                  onClick={() => handleResolve(c.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  Mark Case Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};
