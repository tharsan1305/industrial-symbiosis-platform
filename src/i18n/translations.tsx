import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta';

export const translations = {
  en: {
    // Navigation & Shell
    brandName: 'ReLoop',
    tagline: 'Circular Industrial Symbiosis',
    marketplace: 'Marketplace',
    listings: 'My Listings',
    dashboard: 'Dashboard',
    deals: 'Deals Room',
    requests: 'Requests',
    rfq: 'RFQs & Quotes',
    symbiosisNetwork: 'Symbiosis Network',
    impactLeaderboard: 'Impact & CSR',
    complaints: 'Disputes & Redressal',
    settings: 'Settings',
    feedback: 'Feedback',
    login: 'Sign In',
    register: 'Register Industry',
    logout: 'Sign Out',
    adminVerification: 'Verification Queue',
    adminComplaints: 'Complaints Board',
    adminFraud: 'Fraud Detection',
    adminAudit: 'Audit Trail',
    adminEmissions: 'Emission Factors',
    adminAnalytics: 'Platform Analytics',
    adminFeedback: 'Feedback Inbox',
    
    // Status & Badges
    statusPending: 'Verification Pending',
    statusApproved: 'TNPCB Approved Industry',
    statusRejected: 'Verification Rejected',
    statusSuspended: 'Account Suspended',
    statusPendingBanner: 'Your industry documents are under verification by the regulatory desk. Listing creation and RFQ submissions are locked until approval.',
    statusRejectedBanner: 'Your verification was rejected: {reason}. Please re-upload updated documents in Onboarding.',
    statusSuspendedBanner: 'Your account has been suspended due to environmental compliance alerts. Contact support.',
    
    // Common Actions
    save: 'Save Changes',
    cancel: 'Cancel',
    submit: 'Submit',
    apply: 'Apply Filters',
    reset: 'Reset',
    upload: 'Upload Document',
    download: 'Download',
    viewDetails: 'View Details',
    sendRequest: 'Send Purchase Request',
    startChat: 'Negotiate Deal',
    makeOffer: 'Submit Counter Offer',
    accept: 'Accept',
    reject: 'Decline',
    withdraw: 'Withdraw',
    completed: 'Completed',
    inProgress: 'In Progress',

    // Marketplace & Filters
    searchPlaceholder: 'Search bagasse, fly ash, press mud, rice husk...',
    allCategories: 'All Categories',
    wasteType: 'Waste / By-product Type',
    hazardousOnly: 'Hazardous (TNPCB Sched)',
    radiusKm: 'Max Radius',
    quantityTons: 'Quantity (Metric Tons)',
    pricePerTon: 'Price per Ton',
    distanceEst: 'Est. Distance',
    transportCostEst: 'Est. Transport Cost',
    symbiosisScore: 'Symbiosis Match',
    digitalPassport: 'Digital Material Passport',
    verifiedSupplier: 'Verified Industry',
    mockBannerTitle: 'DEMO MODE ACTIVE',
    mockBannerDesc: 'Serving Tamil Nadu circular symbiosis live fixtures (Sugar Mills, Power Stations, Rice Mills, Cement Works).',

    // Deal Stages
    stageNegotiation: '1. Negotiation',
    stageAgreed: '2. Terms Agreed',
    stagePaymentConfirmed: '3. Escrow Funded',
    stagePickupScheduled: '4. Pickup Scheduled',
    stageDelivered: '5. In Transit / Delivered',
    stageCompleted: '6. Completed & Certified',
    
    // Impact Metrics
    wasteDiverted: 'Waste Diverted',
    co2Saved: 'CO2e Abated',
    moneySaved: 'Economic Value Created',
    landfillDiverted: 'Landfill Avoided',
    metricTons: 'Metric Tons',
    inrCurrency: '₹',

    // Passport
    batchId: 'Batch Code',
    labNablTested: 'NABL Certified Lab Test',
    provenanceTrail: 'Chain-of-Custody Audit',
    scanToVerify: 'Scan QR to verify material provenance',
  },
  ta: {
    // Navigation & Shell
    brandName: 'ரீலூப் (ReLoop)',
    tagline: 'சுழற்சி தொழிற்துறை பரிமாற்றம்',
    marketplace: 'சந்தைக்களம் (Marketplace)',
    listings: 'என் கழிவுப் பட்டியல்கள்',
    dashboard: 'கட்டுப்பாட்டகம் (Dashboard)',
    deals: 'ஒப்பந்த அறை (Deals Room)',
    requests: 'கோரிக்கைகள்',
    rfq: 'RFQ விலைப்புள்ளிகள்',
    symbiosisNetwork: 'சுழற்சி பிணையம் (Network)',
    impactLeaderboard: 'சுற்றுச்சூழல் தாக்கம் & CSR',
    complaints: 'புகார்கள் & குறைதீர்ப்பு',
    settings: 'அமைப்புகள்',
    feedback: 'கருத்துகள்',
    login: 'உள்நுழைக',
    register: 'தொழிற்சாலை பதிவு',
    logout: 'வெளியேறு',
    adminVerification: 'சரிபார்ப்பு வரிசை',
    adminComplaints: 'புகார் பலகை',
    adminFraud: 'மோசடி தடுப்பு',
    adminAudit: 'தணிக்கை பதிவு',
    adminEmissions: 'உமிழ்வு காரணிகள்',
    adminAnalytics: 'தள பகுப்பாய்வு',
    adminFeedback: 'கருத்துப் பெட்டி',

    // Status & Badges
    statusPending: 'சரிபார்ப்பு நிலுவையில் உள்ளது',
    statusApproved: 'TNPCB அங்கீகரிக்கப்பட்ட ஆலை',
    statusRejected: 'சரிபார்ப்பு நிராகரிக்கப்பட்டது',
    statusSuspended: 'கணக்கு இடைநிறுத்தப்பட்டுள்ளது',
    statusPendingBanner: 'உங்கள் ஆலை ஆவணங்கள் அதிகாரிகளால் சரிபார்க்கப்பட்டு வருகின்றன. ஒப்புதல் கிடைக்கும் வரை கழிவுப் பட்டியல் மற்றும் RFQ சமர்ப்பிப்பு முடக்கப்பட்டுள்ளது.',
    statusRejectedBanner: 'உங்கள் சரிபார்ப்பு நிராகரிக்கப்பட்டது: {reason}. சரியான ஆவணங்களை மீண்டும் பதிவேற்றவும்.',
    statusSuspendedBanner: 'சுற்றுச்சூழல் விதிகள் மீறல் காரணமாக உங்கள் கணக்கு இடைநிறுத்தப்பட்டுள்ளது.',

    // Common Actions
    save: 'மாற்றங்களைச் சேமி',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பி',
    apply: 'வடிகட்டிகளைப் பயன்படுத்து',
    reset: 'மீட்டமை',
    upload: 'ஆவணத்தைப் பதிவேற்று',
    download: 'பதிவிறக்கு',
    viewDetails: 'விவரங்களைப் பார்',
    sendRequest: 'கொள்முதல் கோரிக்கை அனுப்பு',
    startChat: 'ஒப்பந்த பேச்சுவார்த்தை',
    makeOffer: 'மாற்று விலை வழங்கு',
    accept: 'ஏற்றுக்கொள்',
    reject: 'நிராகரி',
    withdraw: 'திரும்பப் பெறு',
    completed: 'முடிவுற்றது',
    inProgress: 'நடைபெறுகிறது',

    // Marketplace & Filters
    searchPlaceholder: 'கரும்பு சக்கை, சாம்பல், உமி, களிம்பு தேடு...',
    allCategories: 'அனைத்துப் பிரிவுகள்',
    wasteType: 'கழிவு / துணைப் பொருள் வகை',
    hazardousOnly: 'அபாயகரமானவை (TNPCB அட்டவணை)',
    radiusKm: 'அதிகபட்ச தூரம் (கிமீ)',
    quantityTons: 'அளவு (மெட்ரிக் டன்)',
    pricePerTon: 'டன் விலை',
    distanceEst: 'தோராய தூரம்',
    transportCostEst: 'போக்குவரத்து செலவு மதிப்பீடு',
    symbiosisScore: 'சுழற்சி பொருத்தம்',
    digitalPassport: 'டிஜிட்டல் பொருள் பாஸ்போர்ட்',
    verifiedSupplier: 'சரிபார்க்கப்பட்ட ஆலை',
    mockBannerTitle: 'மாதிரி இயக்கம் (Demo Mode)',
    mockBannerDesc: 'தமிழ்நாடு சுழற்சி தொழிற்சாலைகள் நேரடி தரவுகள் (சர்க்கரை ஆலைகள், அனல் மின் நிலையங்கள், நெல் ஆலைகள், சிமெண்ட் ஆலைகள்).',

    // Deal Stages
    stageNegotiation: '1. பேச்சுவார்த்தை',
    stageAgreed: '2. நிபந்தனைகள் ஏற்பு',
    stagePaymentConfirmed: '3. தொகை பாதுகாப்பு (Escrow)',
    stagePickupScheduled: '4. ஏற்றுமதி நேரம் நிர்ணயம்',
    stageDelivered: '5. போக்குவரத்து / வழங்கப்பட்டது',
    stageCompleted: '6. முழுமை & சான்றிதழ்',

    // Impact Metrics
    wasteDiverted: 'மீட்கப்பட்ட கழிவுகள்',
    co2Saved: 'தவிர்க்கப்பட்ட CO2e உமிழ்வு',
    moneySaved: 'உருவாக்கப்பட்ட பொருளாதார மதிப்பு',
    landfillDiverted: 'குப்பை மேடு தவிர்ப்பு',
    metricTons: 'மெட்ரிக் டன்கள்',
    inrCurrency: '₹',

    // Passport
    batchId: 'தொகுதி எண் (Batch Code)',
    labNablTested: 'NABL சான்றளிக்கப்பட்ட ஆய்வக சோதனை',
    provenanceTrail: 'மூல இடத் தணிக்கை',
    scanToVerify: 'QR குறியீட்டை ஸ்கேன் செய்து சரிபார்க்கவும்',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string>) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('reloop_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('reloop_lang', lang);
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string>): string => {
    let str = translations[language][key] || translations['en'][key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (amount: number): string => {
    return new Intl.NumberFormat(language === 'ta' ? 'ta-IN' : 'en-IN').format(amount);
  };

  const formatDate = (dateString: string): string => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatCurrency, formatNumber, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
