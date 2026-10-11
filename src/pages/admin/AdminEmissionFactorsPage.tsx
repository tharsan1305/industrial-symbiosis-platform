import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { EmissionFactor } from '../../types';
import { RoleGuard } from '../../components/common/Guards';
import { Recycle, Save, Edit3, HelpCircle } from 'lucide-react';

export const AdminEmissionFactorsPage: React.FC = () => {
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    adminApi.getEmissionFactors().then(setFactors);
  }, []);

  const handleStartEdit = (ef: EmissionFactor) => {
    setEditingId(ef.id);
    setEditValue(String(ef.factorCo2ePerTon));
  };

  const handleSave = async (id: string) => {
    const num = parseFloat(editValue) || 1.0;
    await adminApi.updateEmissionFactor(id, num);
    setEditingId(null);
    const updated = await adminApi.getEmissionFactors();
    setFactors(updated);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Emission Factor Baseline Calibrator
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Calibrate greenhouse gas (GHG) emission coefficients per metric ton of diverted by-product (tCO2e / MT)
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Feedstock Stream</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Primary Disposal Baseline</th>
                  <th className="py-3 px-4">Circular Substitution</th>
                  <th className="py-3 px-4">Factor (tCO2e / MT)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {factors.map((ef) => (
                  <tr key={ef.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {ef.wasteName}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{ef.category}</td>
                    <td className="py-3 px-4 text-stone-500">{ef.primaryDisposalBaseline}</td>
                    <td className="py-3 px-4 text-stone-500">{ef.circularReplacement}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {editingId === ef.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                        />
                      ) : (
                        `${ef.factorCo2ePerTon} tCO2e`
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === ef.id ? (
                        <button
                          onClick={() => handleSave(ef.id)}
                          className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(ef)}
                          className="p-1.5 text-stone-400 hover:text-emerald-700 cursor-pointer"
                          title="Edit Factor"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
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
