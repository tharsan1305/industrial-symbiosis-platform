import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { listingsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/translations';
import { StatusChip } from '../components/common/StatusChip';
import { ApprovedGuard } from '../components/common/Guards';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  QrCode,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const ListingsPage: React.FC = () => {
  const { profile } = useAuth();
  const { formatCurrency, formatNumber } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await listingsApi.getAll();
      // Filter to own listings if in industry mode, or display all for demo ease
      setListings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to withdraw this by-product listing from the exchange?')) {
      await listingsApi.delete(id);
      loadListings();
    }
  };

  const filtered = listings.filter((l) => {
    if (activeTab === 'all') return true;
    return l.status === activeTab;
  });

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            My Waste & By-product Listings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your industrial by-product batches, update inventory levels, and download QR passports
          </p>
        </div>

        <ApprovedGuard actionName="Listing Creation">
          <Link
            to="/listings/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Listing
          </Link>
        </ApprovedGuard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        {(['all', 'available', 'reserved', 'sold'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize transition cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Listings Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Batch & Listing Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Available Qty</th>
                <th className="py-3 px-4">Price / MT</th>
                <th className="py-3 px-4">Hazardous</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 dark:text-white block">{item.title}</span>
                    <span className="font-mono text-[10px] text-stone-400">{item.batchCode}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip status={item.status} type="listing" />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                    {formatNumber(item.quantityAvailable)} MT
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-stone-900 dark:text-white">
                    {formatCurrency(item.pricePerTon)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.isHazardous ? (
                      <span className="text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded">
                        TNPCB Sched
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">Non-hazardous</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/passport/${item.batchCode}`}
                        className="p-1.5 hover:bg-stone-100 rounded text-stone-500"
                        title="View Passport"
                      >
                        <QrCode className="w-4 h-4 text-emerald-600" />
                      </Link>
                      <Link
                        to={`/listings/${item.id}`}
                        className="p-1.5 hover:bg-stone-100 rounded text-stone-500"
                        title="View Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/listings/${item.id}/edit`}
                        className="p-1.5 hover:bg-stone-100 rounded text-stone-500"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 hover:bg-rose-50 rounded text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
