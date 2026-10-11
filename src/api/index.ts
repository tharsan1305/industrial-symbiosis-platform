import { z } from 'zod';
import {
  apiClient,
  isMockMode,
  setAuthToken,
} from './client';
import {
  IndustryProfile,
  Listing,
  Deal,
  DealStage,
  DealMessage,
  DealRequest,
  RFQItem,
  ReviewItem,
  ComplaintItem,
  NotificationItem,
  EmissionFactor,
  AuditLogItem,
  User,
  OnboardingStatus,
  SavedSearch,
} from '../types';
import {
  mockIndustries,
  mockListings,
  mockDeals,
  mockRequests,
  mockRFQs,
  mockReviews,
  mockComplaints,
  mockNotifications,
  mockEmissionFactors,
  mockAuditLogs,
} from '../mocks/fixtures';

// In-memory state for mock mutations
let currentIndustries = [...mockIndustries];
let currentListings = [...mockListings];
let currentDeals = [...mockDeals];
let currentRequests = [...mockRequests];
let currentRFQs = [...mockRFQs];
let currentReviews = [...mockReviews];
let currentComplaints = [...mockComplaints];
let currentNotifications = [...mockNotifications];
let currentEmissionFactors = [...mockEmissionFactors];
let currentAuditLogs = [...mockAuditLogs];
let currentSavedSearches: SavedSearch[] = [
  { id: 's-1', userId: 'user-01', query: 'Fly Ash', category: 'Combustion By-products', maxDistanceKm: 300, createdAt: '2025-02-01' },
];

const mockDealMessages: Record<string, DealMessage[]> = {
  'deal-active-01': [
    {
      id: 'm-1',
      dealId: 'deal-active-01',
      senderId: 'ind-ponni-sugars',
      senderName: 'Ponni Sugars (Erode) Ltd',
      senderRole: 'seller',
      content: 'We have depithed bagasse ready at yard 3 with moisture tested under 47%.',
      timestamp: '2025-02-10T11:05:00Z',
    },
    {
      id: 'm-2',
      dealId: 'deal-active-01',
      senderId: 'ind-demo-current',
      senderName: 'Kothari Bio-Energy',
      senderRole: 'buyer',
      content: 'We agree on ₹2,400/t. Can you dispatch by next Tuesday?',
      quote: {
        id: 'q-n-1',
        proposedPricePerTon: 2400,
        quantityTons: 250,
        offeredBy: 'buyer',
        senderName: 'Kothari Bio-Energy',
        status: 'accepted',
        notes: 'Agreed final terms for 250 MT batch',
        createdAt: '2025-02-10T11:15:00Z',
      },
      timestamp: '2025-02-10T11:15:00Z',
    },
    {
      id: 'm-3',
      dealId: 'deal-active-01',
      senderId: 'system',
      senderName: 'ReLoop Smart Contract',
      senderRole: 'system',
      content: 'Escrow payment ₹6,00,000 received into trust deposit account. Transporter details unlocked.',
      timestamp: '2025-02-11T09:00:00Z',
    },
    {
      id: 'm-4',
      dealId: 'deal-active-01',
      senderId: 'ind-demo-current',
      senderName: 'Kothari Bio-Energy',
      senderRole: 'buyer',
      content: 'Vehicle TN-33-AU-8890 scheduled with Cauvery Freight. Driver phone provided in dispatch manifest.',
      timestamp: '2025-02-12T15:30:00Z',
    },
  ],
  'deal-negotiation-03': [
    {
      id: 'mn-1',
      dealId: 'deal-negotiation-03',
      senderId: 'ind-demo-current',
      senderName: 'Kothari Bio-Energy',
      senderRole: 'buyer',
      content: 'Hi Srinivasan, we need 150 MT paddy husk delivered to Tiruchirappalli.',
      timestamp: '2025-02-12T08:05:00Z',
    },
    {
      id: 'mn-2',
      dealId: 'deal-negotiation-03',
      senderId: 'ind-thanjavur-delta-rice',
      senderName: 'Cauvery Delta Rice Mill',
      senderRole: 'seller',
      content: 'We can supply at ₹3,500/ton. Moisture is under 10%.',
      quote: {
        id: 'q-neg-2',
        proposedPricePerTon: 3500,
        quantityTons: 150,
        offeredBy: 'seller',
        senderName: 'Cauvery Delta Rice Mill',
        status: 'pending',
        notes: 'Includes packaging in heavy jumbo bags',
        createdAt: '2025-02-12T08:15:00Z',
      },
      timestamp: '2025-02-12T08:15:00Z',
    },
  ],
};

// Domain: Auth
export const authApi = {
  async login(email: string, _password?: string, _mfaCode?: string): Promise<{ user: User; token: string }> {
    if (isMockMode()) {
      const isAdmin = email.toLowerCase().includes('admin');
      const user: User = {
        id: isAdmin ? 'admin-01' : 'user-01',
        email,
        role: isAdmin ? 'admin' : 'industry',
        industryId: isAdmin ? undefined : 'ind-demo-current',
        industryName: isAdmin ? undefined : 'Kothari Bio-Energy & Allied Industries',
        isMfaEnabled: true,
        createdAt: '2024-04-10T10:00:00Z',
      };
      setAuthToken('mock_jwt_token_reloop_' + user.id);
      return { user, token: 'mock_jwt_token_reloop_' + user.id };
    }
    return apiClient<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: _password, mfaCode: _mfaCode }),
    });
  },

  async register(data: { email: string; industryName: string; category: string; gstin: string }): Promise<{ user: User; token: string }> {
    if (isMockMode()) {
      const newIndId = 'ind-' + Math.random().toString(36).substring(2, 9);
      const newProfile: IndustryProfile = {
        id: newIndId,
        name: data.industryName,
        category: (data.category as any) || 'Other',
        gstin: data.gstin,
        factoryLicenseNo: 'TN-APPL-' + Date.now().toString().slice(-4),
        address: 'Industrial Area',
        district: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        latitude: 13.0827,
        longitude: 80.2707,
        contactPerson: 'Authorized Signatory',
        phone: '+91 98000 00000',
        email: data.email,
        status: 'pending',
        trustScore: 70,
        badges: [],
        documents: [],
        totalDivertedTons: 0,
        totalCo2SavedTons: 0,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      currentIndustries.push(newProfile);

      const user: User = {
        id: 'user-' + Date.now(),
        email: data.email,
        role: 'industry',
        industryId: newIndId,
        industryName: data.industryName,
        isMfaEnabled: false,
        createdAt: new Date().toISOString(),
      };
      setAuthToken('mock_jwt_' + user.id);
      return { user, token: 'mock_jwt_' + user.id };
    }
    return apiClient('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('reloop_auth_token');
    if (!token) return null;
    if (isMockMode()) {
      const isAdmin = token.includes('admin');
      return {
        id: isAdmin ? 'admin-01' : 'user-01',
        email: isAdmin ? 'admin@tnpcb.gov.in' : 'sustainability@kotharibio.in',
        role: isAdmin ? 'admin' : 'industry',
        industryId: isAdmin ? undefined : 'ind-demo-current',
        industryName: isAdmin ? undefined : 'Kothari Bio-Energy & Allied Industries',
        isMfaEnabled: true,
        createdAt: '2024-04-10T10:00:00Z',
      };
    }
    return apiClient<User>('/auth/me');
  },

  async logout(): Promise<void> {
    setAuthToken(null);
  },
};

// Domain: Industries & Onboarding
export const industriesApi = {
  async getProfile(id: string): Promise<IndustryProfile> {
    if (isMockMode()) {
      const ind = currentIndustries.find((i) => i.id === id);
      if (ind) return ind;
      return currentIndustries[0];
    }
    return apiClient<IndustryProfile>(`/industries/${id}`);
  },

  async updateProfile(id: string, data: Partial<IndustryProfile>): Promise<IndustryProfile> {
    if (isMockMode()) {
      const idx = currentIndustries.findIndex((i) => i.id === id);
      if (idx !== -1) {
        currentIndustries[idx] = { ...currentIndustries[idx], ...data };
        return currentIndustries[idx];
      }
      return currentIndustries[0];
    }
    return apiClient<IndustryProfile>(`/industries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async submitOnboarding(data: Partial<IndustryProfile>): Promise<IndustryProfile> {
    if (isMockMode()) {
      const idx = currentIndustries.findIndex((i) => i.id === data.id || i.id === 'ind-demo-current');
      if (idx !== -1) {
        currentIndustries[idx] = {
          ...currentIndustries[idx],
          ...data,
          status: 'pending',
        };
        return currentIndustries[idx];
      }
      return currentIndustries[0];
    }
    return apiClient<IndustryProfile>('/industries/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Domain: Listings & Marketplace
export const listingsApi = {
  async getAll(params?: {
    category?: string;
    wasteName?: string;
    isHazardous?: boolean;
    minPrice?: number;
    maxPrice?: number;
    maxDistanceKm?: number;
    userLat?: number;
    userLng?: number;
    search?: string;
  }): Promise<Listing[]> {
    if (isMockMode()) {
      let filtered = [...currentListings];
      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter((l) => l.category === params.category);
      }
      if (params?.isHazardous !== undefined) {
        filtered = filtered.filter((l) => l.isHazardous === params.isHazardous);
      }
      if (params?.minPrice !== undefined) {
        filtered = filtered.filter((l) => l.pricePerTon >= params.minPrice!);
      }
      if (params?.maxPrice !== undefined) {
        filtered = filtered.filter((l) => l.pricePerTon <= params.maxPrice!);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.wasteName.toLowerCase().includes(q) ||
            l.sellerDistrict.toLowerCase().includes(q) ||
            l.suggestedApplications.some((app) => app.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
    const q = new URLSearchParams(params as any).toString();
    return apiClient<Listing[]>(`/listings?${q}`);
  },

  async getById(id: string): Promise<Listing> {
    if (isMockMode()) {
      const match = currentListings.find((l) => l.id === id);
      if (match) return match;
      return currentListings[0];
    }
    return apiClient<Listing>(`/listings/${id}`);
  },

  async getByBatch(batchCode: string): Promise<Listing | undefined> {
    if (isMockMode()) {
      return currentListings.find((l) => l.batchCode.toLowerCase() === batchCode.toLowerCase());
    }
    return apiClient<Listing>(`/listings/batch/${batchCode}`);
  },

  async create(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    if (isMockMode()) {
      const newListing: Listing = {
        ...data,
        id: 'lst-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      currentListings.unshift(newListing);
      return newListing;
    }
    return apiClient<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Listing>): Promise<Listing> {
    if (isMockMode()) {
      const idx = currentListings.findIndex((l) => l.id === id);
      if (idx !== -1) {
        currentListings[idx] = { ...currentListings[idx], ...data, updatedAt: new Date().toISOString() };
        return currentListings[idx];
      }
      return currentListings[0];
    }
    return apiClient<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    if (isMockMode()) {
      currentListings = currentListings.filter((l) => l.id !== id);
      return;
    }
    return apiClient<void>(`/listings/${id}`, { method: 'DELETE' });
  },

  async getSavedSearches(): Promise<SavedSearch[]> {
    if (isMockMode()) return currentSavedSearches;
    return apiClient<SavedSearch[]>('/listings/saved-searches');
  },

  async saveSearch(query: string, category?: string, isHazardous?: boolean): Promise<SavedSearch> {
    if (isMockMode()) {
      const s: SavedSearch = {
        id: 's-' + Date.now(),
        userId: 'user-01',
        query,
        category,
        isHazardous,
        createdAt: new Date().toISOString(),
      };
      currentSavedSearches.push(s);
      return s;
    }
    return apiClient<SavedSearch>('/listings/saved-searches', {
      method: 'POST',
      body: JSON.stringify({ query, category, isHazardous }),
    });
  },
};

// Domain: Deals & Deal Room
export const dealsApi = {
  async getAll(): Promise<Deal[]> {
    if (isMockMode()) return currentDeals;
    return apiClient<Deal[]>('/deals');
  },

  async getById(id: string): Promise<Deal> {
    if (isMockMode()) {
      const deal = currentDeals.find((d) => d.id === id);
      if (deal) return deal;
      return currentDeals[0];
    }
    return apiClient<Deal>(`/deals/${id}`);
  },

  async updateStage(id: string, stage: DealStage, metadata?: any): Promise<Deal> {
    if (isMockMode()) {
      const idx = currentDeals.findIndex((d) => d.id === id);
      if (idx !== -1) {
        currentDeals[idx] = {
          ...currentDeals[idx],
          stage,
          ...metadata,
          updatedAt: new Date().toISOString(),
        };
        // Log to audit
        currentAuditLogs.unshift({
          id: 'audit-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorEmail: 'kothari.logistics@kotharibio.in',
          actorRole: 'industry',
          action: 'DEAL_STAGE_TRANSITION',
          resourceType: 'Deal',
          resourceId: id,
          details: `Stage updated to ${stage}`,
          ipAddress: '157.48.210.14',
        });
        return currentDeals[idx];
      }
      return currentDeals[0];
    }
    return apiClient<Deal>(`/deals/${id}/stage`, {
      method: 'POST',
      body: JSON.stringify({ stage, metadata }),
    });
  },

  async getMessages(dealId: string): Promise<DealMessage[]> {
    if (isMockMode()) {
      return mockDealMessages[dealId] || [];
    }
    return apiClient<DealMessage[]>(`/deals/${dealId}/messages`);
  },

  async sendMessage(dealId: string, content: string, quote?: any): Promise<DealMessage> {
    if (isMockMode()) {
      const msg: DealMessage = {
        id: 'msg-' + Date.now(),
        dealId,
        senderId: 'ind-demo-current',
        senderName: 'Kothari Bio-Energy & Allied Industries',
        senderRole: 'buyer',
        content,
        quote,
        timestamp: new Date().toISOString(),
      };
      if (!mockDealMessages[dealId]) {
        mockDealMessages[dealId] = [];
      }
      mockDealMessages[dealId].push(msg);
      return msg;
    }
    return apiClient<DealMessage>(`/deals/${dealId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, quote }),
    });
  },

  async acceptQuote(dealId: string, quoteId: string): Promise<void> {
    if (isMockMode()) {
      const msgs = mockDealMessages[dealId] || [];
      const m = msgs.find((x) => x.quote?.id === quoteId);
      if (m && m.quote) {
        m.quote.status = 'accepted';
      }
      const d = currentDeals.find((x) => x.id === dealId);
      if (d) {
        d.stage = 'agreed';
        d.agreedPricePerTon = m?.quote?.proposedPricePerTon || d.agreedPricePerTon;
        d.quantityTons = m?.quote?.quantityTons || d.quantityTons;
        d.totalAmount = d.agreedPricePerTon * d.quantityTons;
      }
      return;
    }
    return apiClient<void>(`/deals/${dealId}/quotes/${quoteId}/accept`, { method: 'POST' });
  },
};

// Domain: Requests & RFQ
export const requestsApi = {
  async getAll(): Promise<DealRequest[]> {
    if (isMockMode()) return currentRequests;
    return apiClient<DealRequest[]>('/requests');
  },

  async create(data: Omit<DealRequest, 'id' | 'status' | 'createdAt'>): Promise<DealRequest> {
    if (isMockMode()) {
      const req: DealRequest = {
        ...data,
        id: 'req-' + Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      currentRequests.unshift(req);
      return req;
    }
    return apiClient<DealRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: 'accepted' | 'rejected' | 'withdrawn'): Promise<DealRequest> {
    if (isMockMode()) {
      const idx = currentRequests.findIndex((r) => r.id === id);
      if (idx !== -1) {
        currentRequests[idx].status = status;
        if (status === 'accepted') {
          // Auto create deal
          const req = currentRequests[idx];
          const newDeal: Deal = {
            id: 'deal-' + Date.now(),
            listingId: req.listingId,
            listingTitle: req.listingTitle,
            wasteName: req.wasteName,
            batchCode: 'RLP-AUTO-' + Date.now().toString().slice(-4),
            buyerId: req.senderId,
            buyerName: req.senderName,
            sellerId: req.receiverId,
            sellerName: req.receiverName,
            stage: 'agreed',
            quantityTons: req.proposedQuantityTons,
            agreedPricePerTon: req.proposedPricePerTon,
            totalAmount: req.proposedQuantityTons * req.proposedPricePerTon,
            transportCostEstimate: 22000,
            distanceKm: 85,
            co2SavedTons: req.proposedQuantityTons * 0.9,
            isHazardous: false,
            hazardousManifestVerified: false,
            paymentStatus: 'pending',
            reviewedByBuyer: false,
            reviewedBySeller: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          currentDeals.unshift(newDeal);
        }
        return currentRequests[idx];
      }
      return currentRequests[0];
    }
    return apiClient<DealRequest>(`/requests/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },
};

export const rfqApi = {
  async getAll(): Promise<RFQItem[]> {
    if (isMockMode()) return currentRFQs;
    return apiClient<RFQItem[]>('/rfq');
  },

  async create(data: Omit<RFQItem, 'id' | 'quotes' | 'status' | 'createdAt'>): Promise<RFQItem> {
    if (isMockMode()) {
      const item: RFQItem = {
        ...data,
        id: 'rfq-' + Date.now(),
        quotes: [],
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      currentRFQs.unshift(item);
      return item;
    }
    return apiClient<RFQItem>('/rfq', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitQuote(rfqId: string, quoteData: any): Promise<void> {
    if (isMockMode()) {
      const rfq = currentRFQs.find((r) => r.id === rfqId);
      if (rfq) {
        rfq.quotes.push({
          id: 'q-' + Date.now(),
          rfqId,
          supplierId: 'ind-demo-current',
          supplierName: 'Kothari Bio-Energy',
          offeredPricePerTon: quoteData.offeredPricePerTon,
          availableQuantityTons: quoteData.availableQuantityTons,
          deliveryTimelineDays: quoteData.deliveryTimelineDays,
          leadTime: `${quoteData.deliveryTimelineDays} days dispatch`,
          labCertificateAvailable: true,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        rfq.status = 'quotes_received';
      }
      return;
    }
    return apiClient<void>(`/rfq/${rfqId}/quotes`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  async acceptQuote(rfqId: string, quoteId: string): Promise<void> {
    if (isMockMode()) {
      const rfq = currentRFQs.find((r) => r.id === rfqId);
      if (rfq) {
        rfq.status = 'awarded';
        rfq.quotes.forEach((q) => {
          q.status = q.id === quoteId ? 'accepted' : 'rejected';
        });
      }
      return;
    }
    return apiClient<void>(`/rfq/${rfqId}/quotes/${quoteId}/accept`, { method: 'POST' });
  },
};

// Domain: Reviews, Complaints & Notifications
export const reviewsApi = {
  async getForIndustry(industryId: string): Promise<ReviewItem[]> {
    if (isMockMode()) {
      return currentReviews.filter((r) => r.targetIndustryId === industryId);
    }
    return apiClient<ReviewItem[]>(`/reviews?targetIndustryId=${industryId}`);
  },

  async create(data: Omit<ReviewItem, 'id' | 'createdAt'>): Promise<ReviewItem> {
    if (isMockMode()) {
      // Check one per deal
      const existing = currentReviews.find((r) => r.dealId === data.dealId);
      if (existing) {
        throw new Error('A review has already been submitted for this deal.');
      }
      const rev: ReviewItem = {
        ...data,
        id: 'rev-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      currentReviews.unshift(rev);
      // Mark deal as reviewed
      const deal = currentDeals.find((d) => d.id === data.dealId);
      if (deal) {
        deal.reviewedByBuyer = true;
      }
      return rev;
    }
    return apiClient<ReviewItem>('/reviews', { method: 'POST', body: JSON.stringify(data) });
  },
};

export const complaintsApi = {
  async getAll(): Promise<ComplaintItem[]> {
    if (isMockMode()) return currentComplaints;
    return apiClient<ComplaintItem[]>('/complaints');
  },

  async create(data: Omit<ComplaintItem, 'id' | 'status' | 'createdAt'>): Promise<ComplaintItem> {
    if (isMockMode()) {
      const c: ComplaintItem = {
        ...data,
        id: 'comp-' + Date.now(),
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      currentComplaints.unshift(c);
      return c;
    }
    return apiClient<ComplaintItem>('/complaints', { method: 'POST', body: JSON.stringify(data) });
  },
};

export const notificationsApi = {
  async getAll(): Promise<NotificationItem[]> {
    if (isMockMode()) return currentNotifications;
    return apiClient<NotificationItem[]>('/notifications');
  },

  async markAsRead(id: string): Promise<void> {
    if (isMockMode()) {
      const n = currentNotifications.find((x) => x.id === id);
      if (n) n.isRead = true;
      return;
    }
    return apiClient<void>(`/notifications/${id}/read`, { method: 'POST' });
  },
};

// Domain: Public & Dashboard Stats
export const publicApi = {
  async getStats() {
    if (isMockMode()) {
      return {
        totalWasteDivertedTons: 254350,
        totalCo2SavedTons: 203480,
        totalEconomicValueInr: 184500000,
        activeIndustriesCount: 42,
        activeListingsCount: 18,
        completedSymbiosisDeals: 164,
      };
    }
    return apiClient<any>('/public/stats');
  },
};

export const dashboardApi = {
  async getDashboardData() {
    if (isMockMode()) {
      return {
        kpis: {
          wasteReducedTons: 18400,
          co2SavedTons: 14720,
          moneySavedInr: 12500000,
          landfillDivertedPercentage: 99.4,
        },
        monthlyTrends: [
          { month: 'Sep', divertedTons: 1200, co2AbatedTons: 960, valueInr: 850000 },
          { month: 'Oct', divertedTons: 1850, co2AbatedTons: 1480, valueInr: 1250000 },
          { month: 'Nov', divertedTons: 2400, co2AbatedTons: 1920, valueInr: 1680000 },
          { month: 'Dec', divertedTons: 2900, co2AbatedTons: 2320, valueInr: 2100000 },
          { month: 'Jan', divertedTons: 3600, co2AbatedTons: 2880, valueInr: 2650000 },
          { month: 'Feb', divertedTons: 4100, co2AbatedTons: 3280, valueInr: 3050000 },
        ],
        recentDeals: currentDeals.slice(0, 4),
        trustScore: 94,
        badges: ['PCB Verified', 'ISO 14001', 'Zero Landfill Partner'],
      };
    }
    return apiClient<any>('/dashboard');
  },
};

// Domain: Admin Desk
export const adminApi = {
  async getVerificationQueue(): Promise<IndustryProfile[]> {
    if (isMockMode()) {
      return currentIndustries;
    }
    return apiClient<IndustryProfile[]>('/admin/verification');
  },

  async updateVerification(id: string, status: OnboardingStatus, reason?: string): Promise<void> {
    if (isMockMode()) {
      const ind = currentIndustries.find((i) => i.id === id);
      if (ind) {
        ind.status = status;
        ind.rejectionReason = reason;
        currentAuditLogs.unshift({
          id: 'audit-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorEmail: 'admin@reloop.eco',
          actorRole: 'admin',
          action: `INDUSTRY_VERIFY_${status.toUpperCase()}`,
          resourceType: 'IndustryProfile',
          resourceId: id,
          details: reason ? `Status changed to ${status}: ${reason}` : `Status changed to ${status}`,
          ipAddress: '14.139.183.2',
        });
      }
      return;
    }
    return apiClient<void>(`/admin/verification/${id}`, {
      method: 'POST',
      body: JSON.stringify({ status, reason }),
    });
  },

  async getEmissionFactors(): Promise<EmissionFactor[]> {
    if (isMockMode()) return currentEmissionFactors;
    return apiClient<EmissionFactor[]>('/admin/emission-factors');
  },

  async updateEmissionFactor(id: string, factor: number): Promise<void> {
    if (isMockMode()) {
      const ef = currentEmissionFactors.find((e) => e.id === id);
      if (ef) {
        ef.factorCo2ePerTon = factor;
        ef.updatedAt = new Date().toISOString().split('T')[0];
      }
      return;
    }
    return apiClient<void>(`/admin/emission-factors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ factorCo2ePerTon: factor }),
    });
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    if (isMockMode()) return currentAuditLogs;
    return apiClient<AuditLogItem[]>('/admin/audit');
  },
};
