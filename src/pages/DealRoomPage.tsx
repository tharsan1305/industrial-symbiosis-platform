import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Deal, DealStage } from '../types';
import { dealsApi } from '../api';
import { useTranslation } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import { StageStepper } from '../components/common/StageStepper';
import { ChatPanel } from '../components/common/ChatPanel';
import {
  ShieldCheck,
  Truck,
  DollarSign,
  Download,
  Star,
  CheckCircle2,
  FileText,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  X,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DealRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { formatCurrency, formatNumber, formatDate } = useTranslation();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  // Transporter modal
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [transporterName, setTransporterName] = useState('Cauvery Freight & Logistics TN');
  const [vehicleReg, setVehicleReg] = useState('TN-33-AU-8890');
  const [driverName, setDriverName] = useState('S. Selvam');
  const [driverPhone, setDriverPhone] = useState('+91 98427 12399');
  const [pcbPermit, setPcbPermit] = useState('TNPCB/TRANS/HAZ-991');
  const [pickupDate, setPickupDate] = useState('2025-02-18');

  // Manifest modal
  const [showManifestModal, setShowManifestModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeal(id);
    }
  }, [id]);

  const loadDeal = async (dealId: string) => {
    const data = await dealsApi.getById(dealId);
    setDeal(data);
    setLoading(false);
  };

  if (loading || !deal) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const handleStageTransition = async (nextStage: DealStage) => {
    if (nextStage === 'pickup_scheduled' && !deal.transporterInfo) {
      setShowTransporterModal(true);
      return;
    }

    const updated = await dealsApi.updateStage(deal.id, nextStage);
    setDeal(updated);

    if (nextStage === 'completed') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleSaveTransporter = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await dealsApi.updateStage(deal.id, 'pickup_scheduled', {
      transporterInfo: {
        transporterName,
        vehicleRegistrationNo: vehicleReg,
        driverName,
        driverPhone,
        pcbTransporterPermitNo: deal.isHazardous ? pcbPermit : undefined,
        scheduledPickupDate: pickupDate,
        estimatedDeliveryDate: pickupDate,
      },
    });
    setDeal(updated);
    setShowTransporterModal(false);
  };

  const handleSimulateEscrow = async () => {
    const updated = await dealsApi.updateStage(deal.id, 'payment_confirmed', {
      paymentStatus: 'escrow_funded',
    });
    setDeal(updated);
  };

  const canAdvanceStage = () => {
    if (deal.stage === 'negotiation') return false; // Must accept quote first
    if (deal.stage === 'agreed' && deal.paymentStatus !== 'escrow_funded') return true; // Can fund escrow
    if (deal.isHazardous && !deal.hazardousManifestVerified && deal.stage === 'payment_confirmed') {
      return false; // gate
    }
    return true;
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/deals"
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Deal Room: {deal.wasteName}
            </h1>
            <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded font-bold">
              #{deal.id}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Buyer: <strong>{deal.buyerName}</strong> · Seller: <strong>{deal.sellerName}</strong> · Batch: {deal.batchCode}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManifestModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            View Manifest / Waybill
          </button>
          <Link
            to={`/passport/${deal.batchCode}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold transition"
          >
            <QrCode className="w-4 h-4" />
            Digital Passport
          </Link>
        </div>
      </div>

      {/* Stage Stepper with Regulatory Gate */}
      <StageStepper
        currentStage={deal.stage}
        isHazardous={deal.isHazardous}
        hazardousVerified={deal.hazardousManifestVerified}
        canAdvance={canAdvanceStage()}
        onAdvanceStage={handleStageTransition}
      />

      {/* Main Grid: Live Chat & Contract Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Negotiation Panel (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <ChatPanel
            dealId={deal.id}
            stage={deal.stage}
            counterpartyName={deal.sellerName}
            counterpartyPhone={deal.transporterInfo?.driverPhone}
            counterpartyEmail="sales@ponnisugars.co.in"
            onQuoteAccepted={() => {
              loadDeal(deal.id);
            }}
          />
        </div>

        {/* Contract & Logistics Controls (Right col) */}
        <div className="space-y-4">
          {/* Commercial Summary Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Contract Ledger
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Agreed Lot Volume:</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {formatNumber(deal.quantityTons)} MT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Unit Price:</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {formatCurrency(deal.agreedPricePerTon)} / MT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Logistics Distance:</span>
                <span className="font-bold text-stone-900 dark:text-white">{deal.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">CO2e Scope 3 Abatement:</span>
                <span className="font-bold text-emerald-700">{deal.co2SavedTons} tCO2e</span>
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">Total Lot Settlement:</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(deal.totalAmount)}
                </span>
              </div>
            </div>

            {/* Simulated Escrow Status */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Escrow Security:</span>
                <span
                  className={`font-bold ${
                    deal.paymentStatus === 'escrow_funded'
                      ? 'text-emerald-700'
                      : deal.paymentStatus === 'released_to_seller'
                      ? 'text-blue-700'
                      : 'text-amber-700'
                  }`}
                >
                  {deal.paymentStatus === 'escrow_funded'
                    ? 'Funds Held in Escrow'
                    : deal.paymentStatus === 'released_to_seller'
                    ? 'Disbursed to Seller'
                    : 'Awaiting Funding'}
                </span>
              </div>

              {deal.stage === 'agreed' && deal.paymentStatus === 'pending' && (
                <button
                  type="button"
                  onClick={handleSimulateEscrow}
                  className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Simulate: Fund Escrow Deposit
                </button>
              )}
            </div>
          </div>

          {/* Transporter / Dispatch Details Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Logistics & Fleet Dispatch
              </span>
              <button
                type="button"
                onClick={() => setShowTransporterModal(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {deal.transporterInfo ? 'Edit Transporter' : '+ Assign Vehicle'}
              </button>
            </div>

            {deal.transporterInfo ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Transporter Fleet:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {deal.transporterInfo.transporterName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Vehicle Reg:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {deal.transporterInfo.vehicleRegistrationNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Driver & Contact:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {deal.transporterInfo.driverName} ({deal.transporterInfo.driverPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Scheduled Date:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {deal.transporterInfo.scheduledPickupDate}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                No transport carrier assigned yet. Vehicle details must be logged before dispatch.
              </p>
            )}
          </div>

          {/* Review prompt after completion */}
          {deal.stage === 'completed' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Symbiosis Transaction Completed
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Weight reconciled, digital manifest archived, and carbon savings credited to both facilities.
              </p>
              {!deal.reviewedByBuyer && (
                <Link
                  to={`/reviews/${deal.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition mt-1"
                >
                  <Star className="w-3.5 h-3.5" />
                  Submit Feedback & Rate Supplier
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transporter Assignment Modal */}
      {showTransporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-md w-full p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Log Freight Carrier & Vehicle Allocation
              </h3>
              <button onClick={() => setShowTransporterModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransporter} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Logistics Carrier / Transporter Name
                </label>
                <input
                  type="text"
                  required
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Heavy Vehicle Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  placeholder="TN-33-AU-8890"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Driver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Driver Mobile No.
                  </label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              {deal.isHazardous && (
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    TNPCB Hazardous Waste Transporter Permit No.
                  </label>
                  <input
                    type="text"
                    required
                    value={pcbPermit}
                    onChange={(e) => setPcbPermit(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs font-mono dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Scheduled Factory Loading Date
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransporterModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                >
                  Save Transporter & Schedule Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manifest Modal / Printable Sheet */}
      {showManifestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-2xl w-full p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Government of Tamil Nadu · TNPCB Form 10 Consignment Note
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white mt-0.5">
                  Industrial By-Product Transit Manifest
                </h3>
              </div>
              <button onClick={() => setShowManifestModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print-friendly manifest details */}
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div>
                  <span className="text-stone-400 block text-[10px]">MANIFEST REF:</span>
                  <span className="font-bold text-stone-900 dark:text-white">MNF-{deal.id.toUpperCase()}-2025</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">DIGITAL BATCH:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{deal.batchCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-xl">
                  <span className="text-stone-400 text-[10px] block font-bold">1. SENDER / GENERATOR:</span>
                  <p className="font-bold mt-1 text-stone-900 dark:text-white">{deal.sellerName}</p>
                  <p className="text-stone-500 text-[11px]">Factory Consent Order Validated</p>
                </div>
                <div className="p-3 border rounded-xl">
                  <span className="text-stone-400 text-[10px] block font-bold">2. RECEIVER / CONSUMER:</span>
                  <p className="font-bold mt-1 text-stone-900 dark:text-white">{deal.buyerName}</p>
                  <p className="text-stone-500 text-[11px]">Authorized Recycling Facility</p>
                </div>
              </div>

              <div className="p-3 border rounded-xl">
                <span className="text-stone-400 text-[10px] block font-bold">3. FLEET ALLOCATION:</span>
                <p className="mt-1 text-stone-800 dark:text-stone-200">
                  Vehicle: <strong>{deal.transporterInfo?.vehicleRegistrationNo || 'TN-33-AU-8890'}</strong> · Driver: {deal.transporterInfo?.driverName || 'S. Selvam'}
                </p>
                <p className="text-stone-500 text-[11px]">Carrier: {deal.transporterInfo?.transporterName || 'Cauvery Freight'}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[11px] text-stone-500">Cryptographically signed under IT Act 2000</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Print / Save PDF Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
