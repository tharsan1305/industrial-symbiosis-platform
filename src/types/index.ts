export type UserRole = 'industry' | 'admin';

export type OnboardingStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  industryId?: string;
  industryName?: string;
  isMfaEnabled?: boolean;
  createdAt: string;
}

export interface IndustryProfile {
  id: string;
  name: string;
  category: 'Sugar Mill' | 'Thermal Power' | 'Rice Mill' | 'Cement Plant' | 'Bio-Energy & Distillery' | 'Chemical' | 'Brick Kiln' | 'Paper & Pulp' | 'Other';
  gstin: string;
  factoryLicenseNo: string;
  pcbAuthorizationNo?: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  phone: string;
  email: string;
  status: OnboardingStatus;
  rejectionReason?: string;
  trustScore: number; // 0 - 100
  badges: ('PCB Verified' | 'ISO 14001' | 'Zero Landfill Partner' | 'Top Recycler' | 'Fast Shipper')[];
  documents: VerificationDoc[];
  totalDivertedTons: number;
  totalCo2SavedTons: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface VerificationDoc {
  id: string;
  type: 'gst_certificate' | 'factory_license' | 'pcb_consent_to_operate' | 'lab_nabl_report';
  name: string;
  size: number;
  sha256: string;
  presignedUrl: string;
  uploadedAt: string;
  status: 'valid' | 'flagged' | 'under_review';
}

export type WasteCategory =
  | 'Agro-Industrial'
  | 'Combustion By-products'
  | 'Mineral & Construction'
  | 'Chemical & Sludge'
  | 'Organic Waste'
  | 'Metal & Foundry';

export type WastePhysicalState = 'Solid' | 'Slurry' | 'Powder' | 'Granular' | 'Liquid';

export interface QualityParameter {
  name: string;
  value: string | number;
  unit: string;
  standardTolerance?: string;
}

export type ListingStatus = 'available' | 'reserved' | 'sold' | 'expired';

export interface Listing {
  id: string;
  title: string;
  wasteName: string;
  category: WasteCategory;
  industryId: string;
  industryName: string;
  sellerDistrict: string;
  sellerState: string;
  latitude: number;
  longitude: number;
  quantityAvailable: number; // in Metric Tons
  minimumOrderQuantity: number;
  pricePerTon: number; // in INR (₹)
  isPriceNegotiable: boolean;
  physicalState: WastePhysicalState;
  isHazardous: boolean;
  pcbScheduleClass?: string; // e.g. "Schedule I - Item 5.1"
  moisturePercentage?: number;
  calorificValueKcalKg?: number;
  ashContentPercentage?: number;
  qualityParameters: QualityParameter[];
  batchCode: string;
  labReportUrl?: string;
  labReportName?: string;
  images: string[];
  status: ListingStatus;
  suggestedApplications: string[];
  suggestedPriceRange: { min: number; max: number };
  co2SavingsFactorTonPerTon: number;
  createdAt: string;
  updatedAt: string;
}

export type DealStage =
  | 'negotiation'
  | 'agreed'
  | 'payment_confirmed'
  | 'pickup_scheduled'
  | 'delivered'
  | 'completed';

export interface QuoteNegotiation {
  id: string;
  proposedPricePerTon: number;
  quantityTons: number;
  offeredBy: 'buyer' | 'seller';
  senderName: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  notes?: string;
  createdAt: string;
}

export interface DealMessage {
  id: string;
  dealId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'system';
  content: string;
  quote?: QuoteNegotiation;
  timestamp: string;
  isOptimistic?: boolean;
}

export interface DealTransporterInfo {
  transporterName: string;
  vehicleRegistrationNo: string;
  driverName: string;
  driverPhone: string;
  pcbTransporterPermitNo?: string;
  scheduledPickupDate: string;
  estimatedDeliveryDate: string;
  gpsTrackingId?: string;
}

export interface Deal {
  id: string;
  listingId: string;
  listingTitle: string;
  wasteName: string;
  batchCode: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  stage: DealStage;
  quantityTons: number;
  agreedPricePerTon: number;
  totalAmount: number;
  transportCostEstimate: number;
  distanceKm: number;
  co2SavedTons: number;
  isHazardous: boolean;
  hazardousManifestVerified: boolean;
  manifestForm10Url?: string;
  paymentStatus: 'pending' | 'escrow_funded' | 'released_to_seller';
  transporterInfo?: DealTransporterInfo;
  reviewedByBuyer: boolean;
  reviewedBySeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DealRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  wasteName: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  proposedQuantityTons: number;
  proposedPricePerTon: number;
  deliveryDistrict: string;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export interface RFQQuote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  offeredPricePerTon: number;
  availableQuantityTons: number;
  deliveryTimelineDays: number;
  leadTime: string;
  labCertificateAvailable: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface RFQItem {
  id: string;
  title: string;
  requiredWasteType: string;
  category: WasteCategory;
  demandedQuantityTons: number;
  targetPricePerTon?: number;
  deliveryDistrict: string;
  creatorId: string;
  creatorName: string;
  specifications: string;
  deadlineDate: string;
  status: 'open' | 'quotes_received' | 'awarded' | 'closed';
  quotes: RFQQuote[];
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  dealId: string;
  targetIndustryId: string;
  reviewerIndustryId: string;
  reviewerName: string;
  overallRating: number; // 1-5
  qualityRating: number;
  quantityAccuracyRating: number;
  onTimeDeliveryRating: number;
  communicationRating: number;
  comment: string;
  createdAt: string;
}

export interface ComplaintItem {
  id: string;
  dealId?: string;
  filedByIndustryId: string;
  filedByName: string;
  againstIndustryId: string;
  againstName: string;
  category: 'Quality Mismatch' | 'Delivery Delay' | 'Hazardous Non-compliance' | 'Quantity Deficit' | 'Payment Issue' | 'Other';
  description: string;
  evidenceFiles: { name: string; url: string; size: string }[];
  status: 'Open' | 'In Review' | 'Resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deal' | 'request' | 'verification' | 'rfq' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  query: string;
  category?: string;
  maxDistanceKm?: number;
  isHazardous?: boolean;
  createdAt: string;
}

export interface SymbiosisNode {
  id: string;
  name: string;
  sector: string;
  type: 'producer' | 'consumer' | 'both';
  district: string;
  x: number;
  y: number;
}

export interface SymbiosisLink {
  id: string;
  source: string;
  target: string;
  material: string;
  annualVolumeTons: number;
  co2SavedAnnualTons: number;
}

export interface EmissionFactor {
  id: string;
  wasteName: string;
  category: WasteCategory;
  primaryDisposalBaseline: string; // e.g., "Landfill Methane" or "Open Burning"
  circularReplacement: string; // e.g., "Coal substitute" or "Virgin Clay substitute"
  factorCo2ePerTon: number; // e.g., 1.45 tCO2e / ton
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
}
