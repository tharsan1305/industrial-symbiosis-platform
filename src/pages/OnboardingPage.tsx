import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPicker } from '../components/common/MapPicker';
import { FileUploader } from '../components/common/FileUploader';
import { VerificationDoc } from '../types';
import { industriesApi } from '../api';
import {
  Factory,
  MapPin,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Send,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingPage: React.FC = () => {
  const { profile, user, refreshProfile, setMockVerificationStatus } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: profile?.name || 'Kothari Bio-Energy & Allied Industries',
    category: profile?.category || 'Bio-Energy & Distillery',
    gstin: profile?.gstin || '33AABCK3390D1Z6',
    factoryLicenseNo: profile?.factoryLicenseNo || 'TN-TRY-BIO-2022-0941',
    pcbAuthorizationNo: profile?.pcbAuthorizationNo || 'TNPCB/CO/TRY/HAZ-8821',
    contactPerson: profile?.contactPerson || 'Dr. Anand Kumar, GM Operations',
    phone: profile?.phone || '+91 94880 12345',
    email: profile?.email || user?.email || 'anand.kumar@kotharibio.in',
    district: profile?.district || 'Tiruchirappalli',
    address: profile?.address || 'Kattur Industrial Estate, Lalgudi Road',
    pincode: profile?.pincode || '620019',
    latitude: profile?.latitude || 10.825,
    longitude: profile?.longitude || 78.718,
  });

  const [uploadedDocs, setUploadedDocs] = useState<VerificationDoc[]>(profile?.documents || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const status = profile?.status || 'pending';

  const handleDocUploaded = (doc: VerificationDoc) => {
    setUploadedDocs((prev) => [...prev.filter((d) => d.type !== doc.type), doc]);
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      await industriesApi.submitOnboarding({
        ...formData,
        documents: uploadedDocs,
      });
      await refreshProfile();
      setSubmissionSuccess(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Current verification status bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {status === 'approved' && <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />}
          {status === 'pending' && <Clock className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />}
          {status === 'rejected' && <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Industrial Verification Lifecycle
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                  status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : status === 'rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white mt-1">
              {formData.name}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {status === 'approved' && 'Full platform operations authorized: Marketplace listing, purchase requests, and live RFQs are active.'}
              {status === 'pending' && 'Under active review by the Tamil Nadu Pollution Control Board (TNPCB) compliance desk.'}
              {status === 'rejected' && `Verification rejected: ${profile?.rejectionReason || 'Please review uploaded factory licenses'}`}
            </p>
          </div>
        </div>

        {/* Demo trigger: Simulate instant approval */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-700 pt-3 md:pt-0 md:pl-4">
          <button
            type="button"
            onClick={() => {
              setMockVerificationStatus(status === 'approved' ? 'pending' : 'approved');
            }}
            className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold transition"
          >
            Simulate: Toggle {status === 'approved' ? 'Pending' : 'Approved'}
          </button>
        </div>
      </div>

      {/* 4-Step Stepper Header */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Profile & Identity', icon: Factory },
          { num: 2, label: 'GPS Factory Pin', icon: MapPin },
          { num: 3, label: 'Statutory Uploads', icon: FileCheck2 },
          { num: 4, label: 'Review & Attest', icon: CheckCircle2 },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentStep === s.num
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : currentStep > s.num
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span>Step 0{s.num}</span>
              <s.icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold mt-1 truncate">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Step Content Container */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xs space-y-6">
        {/* Step 1: Industry Profile */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              Step 1: Industrial Entity Details
            </h3>
            <p className="text-xs text-stone-500">
              Enter registered corporate and regulatory identifiers matching your Ministry of Corporate Affairs and state registrar records.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Company / Factory Unit Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Primary Manufacturing Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                >
                  <option value="Sugar Mill">Sugar Mill & Bagasse</option>
                  <option value="Thermal Power">Thermal Power & Fly Ash</option>
                  <option value="Rice Mill">Rice Mill & Biomass Husk</option>
                  <option value="Cement Plant">Cement Plant & Co-processing</option>
                  <option value="Bio-Energy & Distillery">Bio-Energy & Distillery</option>
                  <option value="Chemical">Chemical & Solvents</option>
                  <option value="Brick Kiln">Brick Kiln & AAC Blocks</option>
                  <option value="Paper & Pulp">Paper & Pulp</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  15-Digit GSTIN
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Factory License Number
                </label>
                <input
                  type="text"
                  value={formData.factoryLicenseNo}
                  onChange={(e) => setFormData({ ...formData, factoryLicenseNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  TNPCB Consent Order / Authorization No.
                </label>
                <input
                  type="text"
                  value={formData.pcbAuthorizationNo}
                  onChange={(e) => setFormData({ ...formData, pcbAuthorizationNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Nodal Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Nodal Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Official Communication Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location Picker */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              Step 2: Facility Geospatial Mapping
            </h3>
            <p className="text-xs text-stone-500">
              Pin your plant's truck gate to enable automatic Haversine radius matching and transport tariff calculations for buyers.
            </p>

            <MapPicker
              initialLat={formData.latitude}
              initialLng={formData.longitude}
              onLocationSelect={(loc) => {
                setFormData({
                  ...formData,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  district: loc.district !== 'Custom' ? loc.district : formData.district,
                });
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Plant Address Line
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Postal PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Statutory Document Uploads with SHA-256 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                Step 3: Statutory Document Attestations
              </h3>
              <p className="text-xs text-stone-500">
                Upload official regulatory permits. The browser calculates cryptographic SHA-256 hashes locally to guarantee tamper-proof audit trails for government verifiers.
              </p>
            </div>

            <div className="space-y-6">
              <FileUploader
                label="1. GST Registration Certificate (Form REG-06)"
                description="Official GST certificate proving active taxpayer status in Tamil Nadu."
                docType="gst_certificate"
                onUploaded={handleDocUploaded}
              />

              <FileUploader
                label="2. Factory License or Industrial Department Registration"
                description="Valid Inspectorate of Factories license indicating permitted power and labor."
                docType="factory_license"
                onUploaded={handleDocUploaded}
              />

              <FileUploader
                label="3. TNPCB Consent to Operate (CTO - Air & Water Acts)"
                description="Current pollution control consent order specifying by-product generation schedules."
                docType="pcb_consent_to_operate"
                onUploaded={handleDocUploaded}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              Step 4: Review & Legal Attestation
            </h3>

            {submissionSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Verification Dossier Submitted
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                  Your industry verification docket has been submitted to the TNPCB nodal officer. You will receive real-time notifications as each document is validated.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    Go to Operations Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="text-stone-500 block">Facility Name:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Sector:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">GSTIN:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">{formData.gstin}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Factory License:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">{formData.factoryLicenseNo}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Corridor Location:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{formData.district}, TN ({formData.latitude}, {formData.longitude})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Documents Attached:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {uploadedDocs.length} cryptographic records uploaded
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-amber-700" />
                  <p className="leading-relaxed">
                    By submitting, the authorized signatory certifies under the Environment (Protection) Act, 1986 and Hazardous Wastes Management Rules that all by-product descriptions and quality parameters submitted represent actual unadulterated factory outputs.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        {!submissionSuccess && (
          <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <span>Continue to Step 0{currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Cryptographic Dossier...' : 'Submit Verification Dossier'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
