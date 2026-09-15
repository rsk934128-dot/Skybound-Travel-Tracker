export interface CountryCurrencyMeta {
  countryCode: string;
  currencyCode: string;
  currencyName: string;
  currencyNameBn: string;
  currencySymbol: string;
  defaultRateToBdt: number; // 1 unit of foreign currency = X BDT
  dailyCostBudgetUsd: number;
  dailyCostStandardUsd: number;
  dailyCostLuxuryUsd: number;
  breakdown: {
    hotelPct: number;
    foodPct: number;
    transportPct: number;
    activitiesPct: number;
  };
  moneySavingTipsBn: string[];
}

export const COUNTRY_CURRENCY_DATA: Record<string, CountryCurrencyMeta> = {
  TH: {
    countryCode: 'TH',
    currencyCode: 'THB',
    currencyName: 'Thai Baht',
    currencyNameBn: 'থাই বাথ (THB)',
    currencySymbol: '฿',
    defaultRateToBdt: 3.48, // 1 THB ~ 3.48 BDT
    dailyCostBudgetUsd: 35,
    dailyCostStandardUsd: 85,
    dailyCostLuxuryUsd: 220,
    breakdown: { hotelPct: 40, foodPct: 30, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'ব্যাংককের রাস্তায় ক্যাব না নিয়ে BTS Skytrain ও MRT ব্যবহার করলে সময় ও খরচ দুটোই বাঁচে।',
      'লোকাল স্ট্রিট ফুড ও নাইট মার্কেট অত্যন্ত স্বাস্থ্যকর এবং রেস্তোরাঁর তুলনায় তিনগুণ সাশ্রয়ী।',
      'সুপাররিচ (SuperRich) কারেন্সি এক্সচেঞ্জ বুথে সবচেয়ে সেরা ক্যাশ কনভার্সন রেট পাওয়া যায়।'
    ]
  },
  MY: {
    countryCode: 'MY',
    currencyCode: 'MYR',
    currencyName: 'Malaysian Ringgit',
    currencyNameBn: 'মালয়েশিয়ান রিঙ্গিত (MYR)',
    currencySymbol: 'RM',
    defaultRateToBdt: 27.4, // 1 MYR ~ 27.4 BDT
    dailyCostBudgetUsd: 40,
    dailyCostStandardUsd: 90,
    dailyCostLuxuryUsd: 210,
    breakdown: { hotelPct: 42, foodPct: 28, transportPct: 18, activitiesPct: 12 },
    moneySavingTipsBn: [
      'কুয়ালালামপুরে বিনামূল্যে চলা GO-KL বাস দিয়ে জনপ্রিয় পর্যটন কেন্দ্র ঘুরে দেখা যায়।',
      'Touch \'n Go কার্ড কিনলে গণপরিবহন ও ট্রানজিটে ২০% পর্যন্ত ছাড় পাওয়া যায়।',
      'মামাক (Mamak) স্টলের ঐতিহ্যবাহী রুটি কানাই ও তেহ তারিক অত্যন্ত সুস্বাদু ও বাজেট-বান্ধব।'
    ]
  },
  SG: {
    countryCode: 'SG',
    currencyCode: 'SGD',
    currencyName: 'Singapore Dollar',
    currencyNameBn: 'সিঙ্গাপুর ডলার (SGD)',
    currencySymbol: 'S$',
    defaultRateToBdt: 92.5, // 1 SGD ~ 92.5 BDT
    dailyCostBudgetUsd: 75,
    dailyCostStandardUsd: 175,
    dailyCostLuxuryUsd: 420,
    breakdown: { hotelPct: 50, foodPct: 25, transportPct: 15, activitiesPct: 10 },
    moneySavingTipsBn: [
      'হকার সেন্টারে (Hawker Center) আন্তর্জাতিক মানের মিশেলিন স্টার সমমানের খাবার সুলভ মূল্যে পাওয়া যায়।',
      'ট্যাক্সি এড়িয়ে MRT ও বাস ব্যবহার করুন, সিঙ্গাপুরের পরিবহন নেটওয়ার্ক বিশ্বের অন্যতম সেরা।',
      'হোটেল নির্বাচনের ক্ষেত্রে লিটল ইন্ডিয়া বা গেল্যাং এলাকার হোস্টেল বাজেটবান্ধব।'
    ]
  },
  AE: {
    countryCode: 'AE',
    currencyCode: 'AED',
    currencyName: 'UAE Dirham',
    currencyNameBn: 'ইউএই দিরহাম (AED)',
    currencySymbol: 'د.إ',
    defaultRateToBdt: 33.1, // 1 AED ~ 33.1 BDT
    dailyCostBudgetUsd: 60,
    dailyCostStandardUsd: 150,
    dailyCostLuxuryUsd: 380,
    breakdown: { hotelPct: 45, foodPct: 28, transportPct: 17, activitiesPct: 10 },
    moneySavingTipsBn: [
      'দুবাই মেট্রো গোল্ড/সিলভার Nol Card দিয়ে চমৎকারভাবে পুরো শহর ঘুরে নেওয়া যায়।',
      'দেরা (Deira) ও বার দুবাই এলাকায় কম খরচে চমৎকার হোটেল ও দক্ষিণ এশিয়ান খাবার মেলে।',
      'দুবাই ওয়াটার ক্যানাল ক্রুজে বিলাসবহুল বোটিংয়ের বদলে ১ দিরহামের আব্রা (Abra) কাঠের বোট চড়ুন।'
    ]
  },
  SA: {
    countryCode: 'SA',
    currencyCode: 'SAR',
    currencyName: 'Saudi Riyal',
    currencyNameBn: 'সৌদি রিয়াল (SAR)',
    currencySymbol: '﷼',
    defaultRateToBdt: 32.4, // 1 SAR ~ 32.4 BDT
    dailyCostBudgetUsd: 55,
    dailyCostStandardUsd: 135,
    dailyCostLuxuryUsd: 320,
    breakdown: { hotelPct: 48, foodPct: 26, transportPct: 16, activitiesPct: 10 },
    moneySavingTipsBn: [
      'মক্কা ও মদিনার মধ্যে ভ্রমণের জন্য হারামাইন হাই-স্পিড রেলওয়ে (HHR) আগে থেকে টিকিট বুক করুন।',
      'বাংলাদেশি আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ড এবং ক্যাশ রিয়াল সমানভাবে গৃহীত হয়।',
      'লোকাল আল-বাইক (Albaik) রেস্তোরাঁ পরিবারের জন্য অত্যন্ত জনপ্রিয় ও সাশ্রয়ী।'
    ]
  },
  QA: {
    countryCode: 'QA',
    currencyCode: 'QAR',
    currencyName: 'Qatari Riyal',
    currencyNameBn: 'কাতারি রিয়াল (QAR)',
    currencySymbol: 'ر.ق',
    defaultRateToBdt: 33.3, // 1 QAR ~ 33.3 BDT
    dailyCostBudgetUsd: 65,
    dailyCostStandardUsd: 160,
    dailyCostLuxuryUsd: 360,
    breakdown: { hotelPct: 47, foodPct: 27, transportPct: 16, activitiesPct: 10 },
    moneySavingTipsBn: [
      'দোহা মেট্রো নেটওয়ার্ক হামাদ বিমানবন্দর থেকে সূক ওয়াকিফ ও লুসাইল সিটি পর্যন্ত সংযুক্ত।',
      'সূক ওয়াকিফের ঐতিহ্যবাহী ক্যাফেতে স্থানীয় আরবি খাবার সুলভ মূল্যে পাওয়া যায়।'
    ]
  },
  MV: {
    countryCode: 'MV',
    currencyCode: 'MVR',
    currencyName: 'Maldivian Rufiyaa / USD',
    currencyNameBn: 'মালদ্বীপিয়ান রুফিয়া (MVR) / USD',
    currencySymbol: 'Rf',
    defaultRateToBdt: 7.85, // 1 MVR ~ 7.85 BDT (1 USD ~ 121 BDT widely used)
    dailyCostBudgetUsd: 70,
    dailyCostStandardUsd: 190,
    dailyCostLuxuryUsd: 550,
    breakdown: { hotelPct: 55, foodPct: 22, transportPct: 15, activitiesPct: 8 },
    moneySavingTipsBn: [
      'প্রাইভেট আইল্যান্ড রিসোর্টের বদলে মাফুশি (Maafushi) বা হুলহুমালে লোকাল আইল্যান্ডে থাকুন।',
      'স্পিডবোটের বদলে সরকারি MTCC পাবলিক ফেরি ব্যবহার করলে পরিবহন খরচ ৮০% কমে যায়।',
      'মার্কিন ডলার (USD) প্রতিটি দ্বীপে সরাসরি গ্রহণযোগ্য, ফ্রেশ নোট সাথে রাখা ভালো।'
    ]
  },
  NP: {
    countryCode: 'NP',
    currencyCode: 'NPR',
    currencyName: 'Nepalese Rupee',
    currencyNameBn: 'নেপালি রুপি (NPR)',
    currencySymbol: 'रू',
    defaultRateToBdt: 0.88, // 1 NPR ~ 0.88 BDT
    dailyCostBudgetUsd: 25,
    dailyCostStandardUsd: 60,
    dailyCostLuxuryUsd: 160,
    breakdown: { hotelPct: 38, foodPct: 32, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'কাঠমান্ডুর থামেল (Thamel) এলাকায় দারুণ সব সাশ্রয়ী ব্যাকপ্যাকার হোস্টেল ও গেস্টহাউস রয়েছে।',
      'লোকাল ডাল-ভাত ও মোমো সুস্বাদু, স্বাস্থ্যকর এবং অত্যন্ত সুলভ।',
      'পোখরা যেতে লোকাল টুরিস্ট কোচ নিলে অভ্যন্তরীণ বিমানের চেয়ে অনেক কম খরচে পাহাড়ি সৌন্দর্য উপভোগ করা যায়।'
    ]
  },
  IN: {
    countryCode: 'IN',
    currencyCode: 'INR',
    currencyName: 'Indian Rupee',
    currencyNameBn: 'ভারতীয় রুপি (INR)',
    currencySymbol: '₹',
    defaultRateToBdt: 1.41, // 1 INR ~ 1.41 BDT
    dailyCostBudgetUsd: 30,
    dailyCostStandardUsd: 70,
    dailyCostLuxuryUsd: 180,
    breakdown: { hotelPct: 40, foodPct: 30, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'কলকাতা ও দিল্লিতে মেট্রো কার্ড ব্যবহার করলে জ্যাম ও যাতায়াত খরচ উভয়ই কমে।',
      'দীর্ঘ দূরত্বে ভ্রমণের জন্য ভারতীয় রেলওয়ের IRCTC স্লিপার বা ৩AC ক্লাস সেরা বিকল্প।'
    ]
  },
  TR: {
    countryCode: 'TR',
    currencyCode: 'TRY',
    currencyName: 'Turkish Lira',
    currencyNameBn: 'তুর্কি লিরা (TRY)',
    currencySymbol: '₺',
    defaultRateToBdt: 3.42, // 1 TRY ~ 3.42 BDT
    dailyCostBudgetUsd: 45,
    dailyCostStandardUsd: 110,
    dailyCostLuxuryUsd: 280,
    breakdown: { hotelPct: 45, foodPct: 28, transportPct: 15, activitiesPct: 12 },
    moneySavingTipsBn: [
      'ইস্তাম্বুলকার্ট (Istanbulkart) দিয়ে ট্রাম, মেট্রো, বাস ও বসফরাস ফেরিতে নির্বিঘ্নে ভ্রমণ করা যায়।',
      'গ্র্যান্ড বাজার ও সুলতানাহমেতের পর্যটন রেস্তোরাঁ এড়িয়ে লোকাল লোকান্তা (Lokanta) ক্যাফেতে খান।'
    ]
  },
  ID: {
    countryCode: 'ID',
    currencyCode: 'IDR',
    currencyName: 'Indonesian Rupiah',
    currencyNameBn: 'ইন্দোনেশিয়ান রুপিয়াহ (IDR)',
    currencySymbol: 'Rp',
    defaultRateToBdt: 0.0076, // 1,000 IDR ~ 7.6 BDT
    dailyCostBudgetUsd: 30,
    dailyCostStandardUsd: 75,
    dailyCostLuxuryUsd: 200,
    breakdown: { hotelPct: 42, foodPct: 28, transportPct: 18, activitiesPct: 12 },
    moneySavingTipsBn: [
      'বালিতে স্কুটার ভাড়া নিলে খুব কম খরচে স্বাধীনভাবে দ্বীপের আনাচ-কানাচ ঘুরে দেখা যায়।',
      'লোকাল ওয়ারুং (Warung)-এ নসি গোরিং ও মি গোরিং মাত্র ২-৩ ডলারে পাওয়া যায়।'
    ]
  },
  VN: {
    countryCode: 'VN',
    currencyCode: 'VND',
    currencyName: 'Vietnamese Dong',
    currencyNameBn: 'ভিয়েতনামী ডং (VND)',
    currencySymbol: '₫',
    defaultRateToBdt: 0.0048, // 10,000 VND ~ 48 BDT
    dailyCostBudgetUsd: 30,
    dailyCostStandardUsd: 70,
    dailyCostLuxuryUsd: 190,
    breakdown: { hotelPct: 40, foodPct: 30, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'Grab অ্যাপ দিয়ে মোটরবাইক ট্যাক্সি ডাকলে ট্র্যাফিক জ্যাম ছাড়াই ন্যূনতম খরচে পৌঁছানো যায়।',
      'হ্যানয় ও দা নাংয়ের স্ট্রিট ফুড ও বিখ্যাত এগ কফি বিশ্বের অন্যতম সেরা সাশ্রয়ী অভিজ্ঞতা।'
    ]
  },
  GB: {
    countryCode: 'GB',
    currencyCode: 'GBP',
    currencyName: 'British Pound',
    currencyNameBn: 'ব্রিটিশ পাউন্ড (GBP)',
    currencySymbol: '£',
    defaultRateToBdt: 158.5, // 1 GBP ~ 158.5 BDT
    dailyCostBudgetUsd: 85,
    dailyCostStandardUsd: 210,
    dailyCostLuxuryUsd: 480,
    breakdown: { hotelPct: 52, foodPct: 24, transportPct: 14, activitiesPct: 10 },
    moneySavingTipsBn: [
      'লন্ডনে টিউব (Underground) ও বাসে কনট্যাক্টলেস ব্যাংক কার্ড ট্যাপ করলেই স্বয়ংক্রিয় দৈনিক ভাড়া ক্যাপ হয়ে যায়।',
      'ব্রিটিশ মিউজিয়াম, ন্যাশনাল গ্যালারি ও ন্যাচারাল হিস্ট্রি মিউজিয়াম সম্পূর্ণ ফ্রি!'
    ]
  },
  US: {
    countryCode: 'US',
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    currencyNameBn: 'ইউএস ডলার (USD)',
    currencySymbol: '$',
    defaultRateToBdt: 121.5, // 1 USD ~ 121.5 BDT
    dailyCostBudgetUsd: 90,
    dailyCostStandardUsd: 220,
    dailyCostLuxuryUsd: 500,
    breakdown: { hotelPct: 50, foodPct: 25, transportPct: 15, activitiesPct: 10 },
    moneySavingTipsBn: [
      'নিউইয়র্কে ও সানফ্রান্সিসকোতে সাবওয়ে ৭ দিনের আনলিমিটেড পাস নিলে অনেক খরচ সাশ্রয় হয়।'
    ]
  },
  BT: {
    countryCode: 'BT',
    currencyCode: 'BTN',
    currencyName: 'Bhutanese Ngultrum / INR',
    currencyNameBn: 'ভুটানি এনগুলট্রাম (BTN)',
    currencySymbol: 'Nu.',
    defaultRateToBdt: 1.41,
    dailyCostBudgetUsd: 50,
    dailyCostStandardUsd: 110,
    dailyCostLuxuryUsd: 250,
    breakdown: { hotelPct: 45, foodPct: 25, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'সার্কভুক্ত দেশের নাগরিক হিসেবে বাংলাদেশীদের জন্য ভুটানে বিশেষ ছাড়যুক্ত SDF রেট প্রযোজ্য।'
    ]
  },
  LK: {
    countryCode: 'LK',
    currencyCode: 'LKR',
    currencyName: 'Sri Lankan Rupee',
    currencyNameBn: 'শ্রীলঙ্কান রুপি (LKR)',
    currencySymbol: 'Rs',
    defaultRateToBdt: 0.41,
    dailyCostBudgetUsd: 30,
    dailyCostStandardUsd: 70,
    dailyCostLuxuryUsd: 180,
    breakdown: { hotelPct: 40, foodPct: 30, transportPct: 15, activitiesPct: 15 },
    moneySavingTipsBn: [
      'ক্যান্ডি থেকে এলা ট্রেন যাত্রা অবিশ্বাস্য সুন্দর এবং খরচ মাত্র কয়েকশ রুপি।'
    ]
  },
};

// Fallback baseline when a specific country is not indexed above
export const DEFAULT_FALLBACK_CURRENCY_META: CountryCurrencyMeta = {
  countryCode: 'INTL',
  currencyCode: 'USD',
  currencyName: 'US Dollar',
  currencyNameBn: 'ইউএস ডলার (USD)',
  currencySymbol: '$',
  defaultRateToBdt: 121.5,
  dailyCostBudgetUsd: 50,
  dailyCostStandardUsd: 120,
  dailyCostLuxuryUsd: 300,
  breakdown: { hotelPct: 45, foodPct: 25, transportPct: 15, activitiesPct: 15 },
  moneySavingTipsBn: [
    'আন্তর্জাতিক যেকোনো ভ্রমণের সময় স্থানীয় এটিএম থেকে ব্যাংক কার্ড দিয়ে লোকাল কারেন্সি উইথড্র করা সবচেয়ে নিরাপদ।'
  ]
};

export interface LiveRatesResponse {
  rates: Record<string, number>; // Rates relative to BDT (1 BDT = X units)
  bdtMultiplier: Record<string, number>; // 1 unit of currency = X BDT
  isLive: boolean;
  lastUpdated: string;
}

/**
 * Fetch live exchange rates with offline localStorage caching & robust fallback
 */
export async function fetchLiveExchangeRates(): Promise<LiveRatesResponse> {
  const cacheKey = 'skybound_exchange_rates_v1';
  const cachedStr = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;

  // Build baseline BDT multipliers (1 Foreign Currency = X BDT)
  const baselineBdtMultipliers: Record<string, number> = {
    BDT: 1,
    USD: 121.5,
    EUR: 131.2,
    GBP: 158.5,
    THB: 3.48,
    MYR: 27.4,
    SGD: 92.5,
    AED: 33.1,
    SAR: 32.4,
    QAR: 33.3,
    INR: 1.41,
    NPR: 0.88,
    MVR: 7.85,
    TRY: 3.42,
    IDR: 0.0076,
    VND: 0.0048,
    CAD: 87.2,
    AUD: 78.4,
    JPY: 0.81,
    BTN: 1.41,
    LKR: 0.41,
  };

  // Check if cache is fresh (< 2 hours)
  if (cachedStr) {
    try {
      const parsed = JSON.parse(cachedStr);
      if (Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
        return {
          rates: parsed.rates,
          bdtMultiplier: parsed.bdtMultiplier,
          isLive: true,
          lastUpdated: parsed.lastUpdated,
        };
      }
    } catch {
      // Ignore parse failure
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Free, reliable public exchange rate API
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.BDT) {
        const usdBdt = data.rates.BDT; // e.g. 121.5
        const bdtMultipliers: Record<string, number> = { ...baselineBdtMultipliers, BDT: 1 };
        const ratesRelativeToBdt: Record<string, number> = { BDT: 1 };

        Object.entries(data.rates).forEach(([curr, rateVsUsd]: [string, any]) => {
          // 1 USD = rateVsUsd Foreign Currency
          // 1 USD = usdBdt BDT
          // => 1 Foreign Currency = usdBdt / rateVsUsd BDT
          const rateNum = Number(rateVsUsd);
          if (rateNum > 0) {
            const oneUnitInBdt = Number((usdBdt / rateNum).toFixed(4));
            bdtMultipliers[curr] = oneUnitInBdt;
            ratesRelativeToBdt[curr] = Number((rateNum / usdBdt).toFixed(6));
          }
        });

        const lastUpdated = new Date().toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        // Save to cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              rates: ratesRelativeToBdt,
              bdtMultiplier: bdtMultipliers,
              timestamp: Date.now(),
              lastUpdated,
            })
          );
        }

        return {
          rates: ratesRelativeToBdt,
          bdtMultiplier: bdtMultipliers,
          isLive: true,
          lastUpdated,
        };
      }
    }
  } catch (err) {
    console.warn('Live exchange rate API fetch timed out or offline, using verified baseline rates:', err);
  }

  // Fallback to baseline
  const ratesRelativeToBdt: Record<string, number> = {};
  Object.entries(baselineBdtMultipliers).forEach(([curr, rateToBdt]) => {
    ratesRelativeToBdt[curr] = Number((1 / rateToBdt).toFixed(6));
  });

  return {
    rates: ratesRelativeToBdt,
    bdtMultiplier: baselineBdtMultipliers,
    isLive: false,
    lastUpdated: 'ক্যাশড / বেঞ্চমার্ক রেট',
  };
}

/**
 * Converts an amount from one currency to another using the live BDT multipliers
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  bdtMultipliers: Record<string, number>
): number {
  if (amount <= 0) return 0;
  if (fromCode === toCode) return amount;

  const fromRateInBdt = bdtMultipliers[fromCode] || 1;
  const toRateInBdt = bdtMultipliers[toCode] || 1;

  // Amount in BDT
  const amountInBdt = amount * fromRateInBdt;
  // Convert from BDT to target currency
  const converted = amountInBdt / toRateInBdt;

  return Number(converted.toFixed(2));
}

/**
 * Get country currency metadata with fallback
 */
export function getCountryCurrencyMeta(countryCode: string): CountryCurrencyMeta {
  return COUNTRY_CURRENCY_DATA[countryCode] || DEFAULT_FALLBACK_CURRENCY_META;
}

export interface TripExpenseCalculation {
  tier: 'budget' | 'standard' | 'luxury';
  tierLabelBn: string;
  days: number;
  travelers: number;
  dailyPerPersonUsd: number;
  dailyTotalBdt: number;
  grandTotalBdt: number;
  grandTotalForeign: number;
  foreignCurrencyCode: string;
  foreignCurrencySymbol: string;
  breakdownBdt: {
    hotel: number;
    food: number;
    transport: number;
    activities: number;
  };
}

/**
 * Calculates estimated trip expense for a selected country and parameters
 */
export function calculateTripExpense(
  countryCode: string,
  days: number,
  travelers: number,
  tier: 'budget' | 'standard' | 'luxury',
  bdtMultipliers: Record<string, number>
): TripExpenseCalculation {
  const meta = getCountryCurrencyMeta(countryCode);
  const usdBdt = bdtMultipliers['USD'] || 121.5;
  const foreignRateInBdt = bdtMultipliers[meta.currencyCode] || meta.defaultRateToBdt;

  let dailyUsd = meta.dailyCostStandardUsd;
  let tierLabelBn = 'স্ট্যান্ডার্ড / পরিবার';

  if (tier === 'budget') {
    dailyUsd = meta.dailyCostBudgetUsd;
    tierLabelBn = 'বাজেট / ব্যাকপ্যাকার';
  } else if (tier === 'luxury') {
    dailyUsd = meta.dailyCostLuxuryUsd;
    tierLabelBn = 'লাক্সারি / প্রিমিয়াম';
  }

  // Cost for all travelers per day in BDT
  // (Double-occupancy discount for 2+ travelers on hotel: 15% discount on hotel part for groups)
  const groupDiscount = travelers > 1 ? 0.90 : 1.0;
  const dailyTotalBdt = Math.round(dailyUsd * usdBdt * travelers * groupDiscount);
  const grandTotalBdt = Math.round(dailyTotalBdt * days);
  const grandTotalForeign = Math.round(grandTotalBdt / foreignRateInBdt);

  const breakdownBdt = {
    hotel: Math.round(grandTotalBdt * (meta.breakdown.hotelPct / 100)),
    food: Math.round(grandTotalBdt * (meta.breakdown.foodPct / 100)),
    transport: Math.round(grandTotalBdt * (meta.breakdown.transportPct / 100)),
    activities: Math.round(grandTotalBdt * (meta.breakdown.activitiesPct / 100)),
  };

  return {
    tier,
    tierLabelBn,
    days,
    travelers,
    dailyPerPersonUsd: dailyUsd,
    dailyTotalBdt,
    grandTotalBdt,
    grandTotalForeign,
    foreignCurrencyCode: meta.currencyCode,
    foreignCurrencySymbol: meta.currencySymbol,
    breakdownBdt,
  };
}
