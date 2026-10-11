import React, { useState, useEffect } from 'react';
import { RFQItem, WasteCategory } from '../types';
import { rfqApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/translations';
import { ApprovedGuard } from '../components/common/Guards';
import {
  FileQuestion,
  PlusCircle,
  CheckCircle2,
  Clock,
  Check,
  Building,
  ShieldCheck,
  TrendingDown,
  X,
} from 'lucide-react';

export const RfqPage: React.FC = () => {
  const { profile } = useAuth();
  const { formatCurrency, formatNumber } = useTranslation();
  const [rfqs, setRfqs] = useState<RFQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [requiredWasteType, setRequiredWasteType] = useState('Fly Ash (Class F)');
  const [category, setCategory] = useState<WasteCategory>('Combustion By-products');
  const [demandedQuantityTons, setDemandedQuantityTons] = useState(500);
  const [targetPricePerTon, setTargetPricePerTon] = useState(650);
  const [deliveryDistrict, setDeliveryDistrict] = useState(profile?.district || 'Ariyalur');
  const [specifications, setSpecifications] = useState('Blaine Fineness > 320 m²/kg, LOI < 2.0%');
  const [deadlineDate, setDeadlineDate] = useState('2025-03-15');

  useEffect(() => {
    loadRfqs();
  }, []);

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const data = await rfqApi.getAll();
      setRfqs(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    await rfqApi.create({
      title,
      requiredWasteType,
      category,
      demandedQuantityTons,
      targetPricePerTon,
      deliveryDistrict,
      creatorId: profile?.id || 'ind-demo-current',
      creatorName: profile?.name || 'Kothari Bio-Energy',
      specifications,
      deadlineDate,
    });
    setShowCreateModal(false);
    loadRfqs();
  };

  const handleAcceptQuote = async (rfqId: string, quoteId: string) => {
    await rfqApi.acceptQuote(rfqId, quoteId);
    loadRfqs();
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Requests for Quotation (RFQ) & Reverse Bidding
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Broadcast bulk feedstock demand to regional producers and compare side-by-side commercial tenders
          </p>
        </div>

        <ApprovedGuard actionName="Posting RFQ">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Publish New RFQ Tender
          </button>
        </ApprovedGuard>
      </div>

      {/* RFQ List */}
      <div className="space-y-6">
        {rfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-stone-400 font-bold">#{rfq.id}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      rfq.status === 'awarded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rfq.status === 'quotes_received'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rfq.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-stone-500">· Deadline: {rfq.deadlineDate}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                  {rfq.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 block">Demanded Volume:</span>
                <span className="text-lg font-black text-stone-900 dark:text-white">
                  {formatNumber(rfq.demandedQuantityTons)} MT
                </span>
                {rfq.targetPricePerTon && (
                  <span className="text-[11px] text-stone-500 block">
                    Target: {formatCurrency(rfq.targetPricePerTon)} / MT
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300">
              <strong className="text-stone-800 dark:text-stone-200">Specification:</strong> {rfq.specifications} (Delivery to {rfq.deliveryDistrict}, TN)
            </p>

            {/* Side-by-Side Incoming Quotes Comparison Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>Received Supplier Bids ({rfq.quotes.length})</span>
                <span className="text-[11px] text-stone-400 font-normal">Side-by-side commercial comparison</span>
              </div>

              {rfq.quotes.length === 0 ? (
                <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-center text-xs text-stone-500">
                  No supplier quotes submitted yet. Regional producers have been notified.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-stone-50/50 dark:bg-stone-800/40 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                    <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4">Supplier Entity</th>
                        <th className="py-2.5 px-4">Offered Price / MT</th>
                        <th className="py-2.5 px-4">Available Qty</th>
                        <th className="py-2.5 px-4">Lead Time / Dispatch</th>
                        <th className="py-2.5 px-4">Lab Testing</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                      {rfq.quotes.map((q) => (
                        <tr key={q.id} className="hover:bg-white dark:hover:bg-stone-800 transition">
                          <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                            {q.supplierName}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-stone-900 dark:text-white">
                            {formatCurrency(q.offeredPricePerTon)}
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-700">
                            {formatNumber(q.availableQuantityTons)} MT
                          </td>
                          <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                            {q.leadTime}
                          </td>
                          <td className="py-3 px-4">
                            {q.labCertificateAvailable ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" /> NABL Attached
                              </span>
                            ) : (
                              <span className="text-stone-400 text-[11px]">Pending</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                q.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : q.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {q.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {q.status === 'pending' && rfq.status !== 'awarded' && (
                              <button
                                onClick={() => handleAcceptQuote(rfq.id, q.id)}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                Accept Quote
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post RFQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-lg w-full p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Publish RFQ Procurement Tender</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Tender Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monthly Procurement of 800 MT Class-F Dry Silo Fly Ash"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Required Material</label>
                  <input
                    type="text"
                    required
                    value={requiredWasteType}
                    onChange={(e) => setRequiredWasteType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  >
                    <option value="Agro-Industrial">Agro-Industrial</option>
                    <option value="Combustion By-products">Combustion By-products</option>
                    <option value="Mineral & Construction">Mineral & Construction</option>
                    <option value="Chemical & Sludge">Chemical & Sludge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Volume (MT)</label>
                  <input
                    type="number"
                    required
                    value={demandedQuantityTons}
                    onChange={(e) => setDemandedQuantityTons(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Target Price / MT (₹)</label>
                  <input
                    type="number"
                    value={targetPricePerTon}
                    onChange={(e) => setTargetPricePerTon(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Quality Specifications</label>
                <textarea
                  rows={2}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Specify chemical assay tolerances, moisture limits, or loading constraints"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                >
                  Publish Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
