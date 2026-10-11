import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { AuditLogItem } from '../../types';
import { RoleGuard } from '../../components/common/Guards';
import { FileCheck2, Download, Search, Filter } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getAuditLogs().then(setLogs);
  }, []);

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor Email', 'Role', 'Action', 'Resource', 'Resource ID', 'Details', 'IP Address'];
    const rows = logs.map((l) => [
      l.timestamp,
      l.actorEmail,
      l.actorRole,
      l.action,
      l.resourceType,
      l.resourceId,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reloop_regulatory_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              Regulatory Audit Trail & Tamper Log
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Immutable logging of all contract stage updates, RFQ bids, and compliance actions
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Log (CSV)
          </button>
        </div>

        {/* Filter input */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action name, user email, or event details..."
            className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
          />
        </div>

        {/* Audit Table */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 text-stone-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-stone-800 dark:text-stone-200 font-sans">
                      {log.actorEmail}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400 font-sans">
                      {log.resourceType}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300 font-sans max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-stone-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
