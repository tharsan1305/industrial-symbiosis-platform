import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsApi } from '../api';
import { WasteCategory, WastePhysicalState, QualityParameter } from '../types';
import { FileUploader } from '../components/common/FileUploader';
import { ApprovedGuard } from '../components/common/Guards';
import {
  Package,
  ArrowLeft,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const ListingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    wasteName: '',
    category: 'Agro-Industrial' as WasteCategory,
    quantityAvailable: 500,
    minimumOrderQuantity: 20,
    pricePerTon: 2500,
    isPriceNegotiable: true,
    physicalState: 'Solid' as WastePhysicalState,
    isHazardous: false,
    pcbScheduleClass: '',
    moisturePercentage: 45.0,
    calorificValueKcalKg: 1900,
    ashContentPercentage: 2.5,
    suggestedApplications: ['Boiler Fuel', 'Paper Pulp Digestion'],
    batchCode: `RLP-${new Date().getFullYear()}-LOT-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const [qualityParams, setQualityParams] = useState<QualityParameter[]>([
    { name: 'Moisture Content', value: '45.0', unit: '%', standardTolerance: '± 2%' },
    { name: 'Gross Calorific Value', value: '1900', unit: 'kcal/kg', standardTolerance: '≥ 1800' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      listingsApi.getById(id).then((l) => {
        if (l) {
          setFormData({
            title: l.title,
            wasteName: l.wasteName,
            category: l.category,
            quantityAvailable: l.quantityAvailable,
            minimumOrderQuantity: l.minimumOrderQuantity,
            pricePerTon: l.pricePerTon,
            isPriceNegotiable: l.isPriceNegotiable,
            physicalState: l.physicalState,
            isHazardous: l.isHazardous,
            pcbScheduleClass: l.pcbScheduleClass || '',
            moisturePercentage: l.moisturePercentage || 0,
            calorificValueKcalKg: l.calorificValueKcalKg || 0,
            ashContentPercentage: l.ashContentPercentage || 0,
            suggestedApplications: l.suggestedApplications,
            batchCode: l.batchCode,
          });
          setQualityParams(l.qualityParameters || []);
        }
      });
    }
  }, [id]);

  const handleAddParam = () => {
    setQualityParams((prev) => [...prev, { name: '', value: '', unit: '', standardTolerance: '' }]);
  };

  const handleRemoveParam = (index: number) => {
    setQualityParams((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        await listingsApi.update(id, {
          ...formData,
          qualityParameters: qualityParams,
        });
      } else {
        await listingsApi.create({
          ...formData,
          industryId: profile?.id || 'ind-demo-current',
          industryName: profile?.name || 'Kothari Bio-Energy',
          sellerDistrict: profile?.district || 'Tiruchirappalli',
          sellerState: 'Tamil Nadu',
          latitude: profile?.latitude || 10.825,
          longitude: profile?.longitude || 78.718,
          qualityParameters: qualityParams,
          images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'],
          status: 'available',
          suggestedPriceRange: {
            min: Math.round(formData.pricePerTon * 0.9),
            max: Math.round(formData.pricePerTon * 1.15),
          },
          co2SavingsFactorTonPerTon: 0.95,
        });
      }
      navigate('/listings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ApprovedGuard actionName="Listing Publication">
      <div className="max-w-3xl mx-auto space-y-6 py-2">
        <div className="flex items-center justify-between">
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>
          <span className="text-xs font-mono font-bold text-stone-500">
            Batch ID: {formData.batchCode}
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              {isEditing ? 'Edit By-Product Listing' : 'Publish New Industrial By-Product'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Specify chemical assay and batch parameters for buyers across the symbiosis corridor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Moisture-Controlled Depithed Sugarcane Bagasse"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Specific Waste Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.wasteName}
                    onChange={(e) => setFormData({ ...formData, wasteName: e.target.value })}
                    placeholder="Sugarcane Bagasse / Fly Ash / Rice Husk"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Feedstock Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  >
                    <option value="Agro-Industrial">Agro-Industrial</option>
                    <option value="Combustion By-products">Combustion By-products</option>
                    <option value="Mineral & Construction">Mineral & Construction</option>
                    <option value="Chemical & Sludge">Chemical & Sludge</option>
                    <option value="Organic Waste">Organic Waste</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Total Quantity (Metric Tons)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantityAvailable}
                    onChange={(e) => setFormData({ ...formData, quantityAvailable: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Min Order Quantity (MT)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.minimumOrderQuantity}
                    onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Ex-Plant Price per MT (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerTon}
                    onChange={(e) => setFormData({ ...formData, pricePerTon: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Hazardous Classification */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHazardous}
                  onChange={(e) => setFormData({ ...formData, isHazardous: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Regulated under Hazardous and Other Wastes Management Rules (Form 10 Gate Required)
                </span>
              </label>

              {formData.isHazardous && (
                <div className="pt-2">
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    CPCB/TNPCB Schedule & Class Description
                  </label>
                  <input
                    type="text"
                    value={formData.pcbScheduleClass}
                    onChange={(e) => setFormData({ ...formData, pcbScheduleClass: e.target.value })}
                    placeholder="e.g. Schedule I - Category 36.2 (Spent Carbon / Chemical Sludge)"
                    className="w-full px-3.5 py-2 bg-white dark:bg-stone-900 border rounded-xl text-xs dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Dynamic Quality Parameters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-800 dark:text-white uppercase tracking-wider">
                    Chemical & Physical Parameters
                  </h3>
                  <p className="text-[11px] text-stone-500">Provide lab-certified values (moisture, GCV, silica, fineness)</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddParam}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Parameter
                </button>
              </div>

              <div className="space-y-2">
                {qualityParams.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Parameter Name (e.g. Moisture)"
                      value={p.name}
                      onChange={(e) => {
                        const copy = [...qualityParams];
                        copy[idx].name = e.target.value;
                        setQualityParams(copy);
                      }}
                      className="flex-2 px-3 py-1.5 border rounded-lg text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={p.value}
                      onChange={(e) => {
                        const copy = [...qualityParams];
                        copy[idx].value = e.target.value;
                        setQualityParams(copy);
                      }}
                      className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Unit (%)"
                      value={p.unit}
                      onChange={(e) => {
                        const copy = [...qualityParams];
                        copy[idx].unit = e.target.value;
                        setQualityParams(copy);
                      }}
                      className="w-20 px-3 py-1.5 border rounded-lg text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveParam(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
              <Link
                to="/listings"
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Listing' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ApprovedGuard>
  );
};
