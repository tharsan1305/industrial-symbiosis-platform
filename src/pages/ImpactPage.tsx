import React, { useState } from 'react';
import { mockIndustries } from '../mocks/fixtures';
import { useTranslation } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Leaf,
  Recycle,
  Download,
  Printer,
  ShieldCheck,
  TrendingUp,
  Medal,
  CheckCircle2,
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { profile } = useAuth();
  const { formatNumber, formatDate } = useTranslation();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const leaderboard = [...mockIndustries].sort((a, b) => b.totalCo2SavedTons - a.totalCo2SavedTons);

  return (
    <div className="space-y-8 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Industrial Decarbonization & CSR Impact
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tamil Nadu circular leaderboard and verifiable Green CSR Compliance Certificates
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Award className="w-4 h-4" />
          Generate & Download CSR Certificate
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((ind, idx) => {
          const medalColors = [
            'bg-amber-100 text-amber-800 border-amber-300',
            'bg-slate-100 text-slate-800 border-slate-300',
            'bg-amber-50 text-amber-900 border-amber-200',
          ];
          const rankNames = ['1st Place Champion', '2nd Place Runner', '3rd Place Bronze'];

          return (
            <div
              key={ind.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs relative overflow-hidden space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${medalColors[idx]}`}>
                  Rank #0{idx + 1}
                </span>
                <Medal className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white leading-tight">
                  {ind.name}
                </h3>
                <p className="text-xs text-stone-500">{ind.category} · {ind.district}, TN</p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">CO2e Abated:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatNumber(ind.totalCo2SavedTons)} tCO2e
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Landfill Diverted:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {formatNumber(ind.totalDivertedTons)} MT
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Leaderboard Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-stone-900 dark:text-white">
          Tamil Nadu Industrial Circularity Rankings (FY 2024–25)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Industrial Facility</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Diverted Waste</th>
                <th className="py-3 px-4">CO2e Abated</th>
                <th className="py-3 px-4 text-right">Trust Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {leaderboard.map((ind, idx) => (
                <tr key={ind.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="py-3.5 px-4 font-black text-stone-400">#{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">{ind.name}</td>
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">{ind.category}</td>
                  <td className="py-3.5 px-4 text-stone-500">{ind.district}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                    {formatNumber(ind.totalDivertedTons)} MT
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatNumber(ind.totalCo2SavedTons)} tCO2e
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {ind.trustScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSR Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-2xl w-full p-8 rounded-3xl border-4 border-emerald-600/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start no-print">
              <span className="text-xs font-bold uppercase text-emerald-700">Official Certification Preview</span>
              <button onClick={() => setShowCertificateModal(false)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            {/* Certificate Canvas */}
            <div className="p-8 border-4 border-double border-emerald-800/60 rounded-2xl text-center space-y-6 bg-radial from-emerald-50/20 to-white dark:from-stone-900 dark:to-stone-950">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                  Tamil Nadu Circular Economy & ESG Framework
                </span>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  GREEN CIRCULARITY CERTIFICATE
                </h2>
                <p className="text-[11px] font-mono text-stone-400">
                  CERTIFICATE ID: RLP-CSR-TN-{new Date().getFullYear()}-0988
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <p>This is to certify that</p>
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  {profile?.name || 'Kothari Bio-Energy & Allied Industries'}
                </h3>
                <p>
                  has successfully diverted verified industrial by-products from regional landfills, abating an audited
                </p>
                <div className="py-2">
                  <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    14,720 METRIC TONS OF CO2e
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  in compliance with CPCB Schedule Protocols & ESG Scope 3 GHG Accounting Standards.
                </p>
              </div>

              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                <div className="text-left">
                  <span className="font-bold block text-stone-900 dark:text-white">Dr. S. Jayachandran</span>
                  <span className="text-[10px]">TNPCB Sustainability Registrar</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Digitally Attested</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Certificate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
