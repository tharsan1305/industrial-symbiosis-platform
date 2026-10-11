import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DealRequest } from '../types';
import { requestsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/translations';
import {
  Inbox,
  Send,
  Check,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { profile } = useAuth();
  const { formatCurrency, formatNumber } = useTranslation();
  const [requests, setRequests] = useState<DealRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsApi.getAll();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accepted' | 'rejected' | 'withdrawn') => {
    await requestsApi.updateStatus(id, action);
    loadRequests();
  };

  const incoming = requests.filter(
    (r) => r.receiverId === profile?.id || r.receiverName.includes('Kothari') || r.receiverId === 'ind-ponni-sugars'
  );
  const outgoing = requests.filter(
    (r) => r.senderId === profile?.id || r.senderName.includes('Kothari') || r.senderId === 'ind-seshasayee-paper'
  );

  const displayed = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Purchase Requests & Trade Inquiries
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review incoming procurement requests from regional plants or monitor your submitted inquiries
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Incoming Inquiries ({incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'outgoing'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Outgoing Sent ({outgoing.length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border rounded-2xl p-12 text-center text-xs text-stone-500">
            No {activeTab} inquiries at this moment.
          </div>
        ) : (
          displayed.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-stone-400 font-bold">#{req.id}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-stone-400">· {req.deliveryDistrict}, Tamil Nadu</span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {req.listingTitle}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300">
                  <strong className="text-stone-800 dark:text-stone-200">
                    {activeTab === 'incoming' ? req.senderName : `To: ${req.receiverName}`}
                  </strong>
                  : "{req.notes}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div>
                    <span className="text-stone-500">Proposed Quantity:</span>{' '}
                    <strong className="text-stone-900 dark:text-white">{formatNumber(req.proposedQuantityTons)} MT</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Offered Rate:</span>{' '}
                    <strong className="text-stone-900 dark:text-white">{formatCurrency(req.proposedPricePerTon)} / MT</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Total Lot Value:</span>{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(req.proposedQuantityTons * req.proposedPricePerTon)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {req.status === 'pending' && activeTab === 'incoming' && (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'accepted')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Accept & Open Deal
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}

                {req.status === 'pending' && activeTab === 'outgoing' && (
                  <button
                    onClick={() => handleAction(req.id, 'withdrawn')}
                    className="px-3 py-2 text-stone-500 hover:text-rose-600 rounded-xl text-xs font-semibold transition"
                  >
                    Withdraw
                  </button>
                )}

                {req.status === 'accepted' && (
                  <Link
                    to="/deals"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-200 transition"
                  >
                    <span>View in Deal Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
