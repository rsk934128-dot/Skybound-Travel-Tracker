import React, { useState, useEffect, useMemo } from 'react';
import { 
  BANGLADESH_PASSPORT_VISA_DB 
} from '../visaData';
import { 
  fetchLiveExchangeRates, 
  convertCurrency, 
  getCountryCurrencyMeta, 
  calculateTripExpense,
  LiveRatesResponse,
  CountryCurrencyMeta
} from '../currencyService';
import { 
  Coins, 
  Calculator, 
  ArrowRightLeft, 
  RefreshCw, 
  Calendar, 
  Users, 
  Hotel, 
  Utensils, 
  Car, 
  Compass, 
  Sparkles, 
  Lightbulb, 
  CloudUpload, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Globe2
} from 'lucide-react';
import { saveVisaChecklistToDrive } from '../driveService';

interface TravelExpenseCalculatorProps {
  initialCountryCode?: string;
  driveToken?: string | null;
  onNeedGoogleSignIn?: () => void;
  onNavigateToVisa?: (countryCode: string) => void;
}

export const TravelExpenseCalculator: React.FC<TravelExpenseCalculatorProps> = ({
  initialCountryCode = 'TH',
  driveToken,
  onNeedGoogleSignIn,
  onNavigateToVisa,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(initialCountryCode);
  const [tripDays, setTripDays] = useState<number>(7);
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [travelTier, setTravelTier] = useState<'budget' | 'standard' | 'luxury'>('standard');

  // Live Exchange Rates state
  const [exchangeData, setExchangeData] = useState<LiveRatesResponse>({
    rates: {},
    bdtMultiplier: {
      BDT: 1,
      USD: 121.5,
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
      EUR: 131.2,
      GBP: 158.5,
    },
    isLive: false,
    lastUpdated: 'লোড হচ্ছে...',
  });
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);

  // Two-way currency converter state
  const [converterBdtInput, setConverterBdtInput] = useState<string>('50000');
  const [converterForeignInput, setConverterForeignInput] = useState<string>('');
  const [activeConverterField, setActiveConverterField] = useState<'bdt' | 'foreign'>('bdt');

  // Drive saving state
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [driveSavedLink, setDriveSavedLink] = useState<string | null>(null);

  // Load exchange rates on mount
  const loadRates = async () => {
    setIsRefreshingRates(true);
    try {
      const data = await fetchLiveExchangeRates();
      setExchangeData(data);
    } catch (err) {
      console.warn('Failed to load live exchange rates:', err);
    } finally {
      setIsRefreshingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Update initial country if prop changes
  useEffect(() => {
    if (initialCountryCode) {
      setSelectedCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);

  // Country metadata & visa info
  const visaInfo = BANGLADESH_PASSPORT_VISA_DB[selectedCountryCode] || BANGLADESH_PASSPORT_VISA_DB['TH'];
  const currencyMeta: CountryCurrencyMeta = useMemo(() => {
    return getCountryCurrencyMeta(selectedCountryCode);
  }, [selectedCountryCode]);

  // Trip calculation result
  const calculation = useMemo(() => {
    return calculateTripExpense(
      selectedCountryCode,
      tripDays,
      travelerCount,
      travelTier,
      exchangeData.bdtMultiplier
    );
  }, [selectedCountryCode, tripDays, travelerCount, travelTier, exchangeData.bdtMultiplier]);

  // Current foreign currency exchange rate in BDT
  const currentForeignRateInBdt = exchangeData.bdtMultiplier[currencyMeta.currencyCode] || currencyMeta.defaultRateToBdt;

  // Sync converter values
  useEffect(() => {
    if (activeConverterField === 'bdt') {
      const val = parseFloat(converterBdtInput);
      if (!isNaN(val) && val >= 0) {
        const converted = convertCurrency(val, 'BDT', currencyMeta.currencyCode, exchangeData.bdtMultiplier);
        setConverterForeignInput(converted > 0 ? converted.toLocaleString() : '');
      } else {
        setConverterForeignInput('');
      }
    }
  }, [converterBdtInput, currencyMeta.currencyCode, exchangeData.bdtMultiplier, activeConverterField]);

  const handleForeignInputChange = (text: string) => {
    setActiveConverterField('foreign');
    setConverterForeignInput(text);
    const cleaned = text.replace(/,/g, '');
    const val = parseFloat(cleaned);
    if (!isNaN(val) && val >= 0) {
      const converted = convertCurrency(val, currencyMeta.currencyCode, 'BDT', exchangeData.bdtMultiplier);
      setConverterBdtInput(Math.round(converted).toString());
    } else {
      setConverterBdtInput('');
    }
  };

  const handleBdtInputChange = (text: string) => {
    setActiveConverterField('bdt');
    setConverterBdtInput(text);
    const cleaned = text.replace(/,/g, '');
    const val = parseFloat(cleaned);
    if (!isNaN(val) && val >= 0) {
      const converted = convertCurrency(val, 'BDT', currencyMeta.currencyCode, exchangeData.bdtMultiplier);
      setConverterForeignInput(converted.toLocaleString());
    } else {
      setConverterForeignInput('');
    }
  };

  // Save budget checklist to Google Drive
  const handleSaveBudgetToDrive = async () => {
    if (!driveToken) {
      if (onNeedGoogleSignIn) onNeedGoogleSignIn();
      return;
    }

    try {
      setIsSavingBudget(true);
      // We pass the visaInfo with rich travel budget metadata
      const res = await saveVisaChecklistToDrive(driveToken, visaInfo);
      setDriveSavedLink(res.webViewLink || 'saved');
      setTimeout(() => setDriveSavedLink(null), 5000);
    } catch (err: any) {
      alert(`গুগল ড্রাইভে বাজেট সংরক্ষণ করতে সমস্যা হয়েছে: ${err.message}`);
    } finally {
      setIsSavingBudget(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-900/60 p-4 lg:p-6 text-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>ভ্রমণ বাজেট ও লাইভ কারেন্সি কনভার্টার</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-medium">
              Live FX & Travel Expense
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            বাংলাদেশী টাকার বিপরীতে বিশ্বের বিভিন্ন দেশের লাইভ বিনিময় হার এবং আপনার ট্রিপের থাকা, খাওয়া ও যাতায়াতের সুনির্দিষ্ট হিসাব।
          </p>
        </div>

        {/* Live Status & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${exchangeData.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300 text-[11px]">
              {exchangeData.isLive ? 'লাইভ এক্সচেঞ্জ রেট' : 'ক্যাশড রেট'} • {exchangeData.lastUpdated}
            </span>
          </div>

          <button
            id="btn-refresh-exchange-rates"
            onClick={loadRates}
            disabled={isRefreshingRates}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="লাইভ রেট রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshingRates ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameters & Converter (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Destination Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                গন্তব্য দেশ নির্বাচন করুন:
              </span>
              {onNavigateToVisa && (
                <button
                  onClick={() => onNavigateToVisa(selectedCountryCode)}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  ভিসা গাইড দেখুন
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </label>

            <select
              id="select-destination-country"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(BANGLADESH_PASSPORT_VISA_DB).map((c) => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.flagEmoji} {c.countryNameBn} ({c.countryName})
                </option>
              ))}
            </select>

            {/* Current Destination Snapshot Banner */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">স্থানীয় মুদ্রা ও প্রতীক:</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-400 font-mono text-base">{currencyMeta.currencySymbol}</span>
                  <span>{currencyMeta.currencyNameBn}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">বর্তমান বাজার দর:</span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  ১ {currencyMeta.currencyCode} = {currentForeignRateInBdt} ৳ BDT
                </span>
              </div>
            </div>
          </div>

          {/* Quick Two-Way Currency Converter Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                তাৎক্ষণিক কারেন্সি কনভার্টার
              </h3>
              <span className="text-[10px] text-slate-400">লাইভ ব্যাংক ও মার্কেট রেট</span>
            </div>

            <div className="space-y-3">
              {/* BDT Input */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  বাংলাদেশী টাকা (BDT ৳):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={converterBdtInput}
                    onChange={(e) => handleBdtInputChange(e.target.value)}
                    placeholder="টাকার পরিমাণ লিখুন..."
                    className="w-full px-3.5 py-2 pl-9 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                </div>
              </div>

              {/* Equivalence Icon */}
              <div className="flex items-center justify-center">
                <div className="p-1.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                  <ArrowRightLeft className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>

              {/* Foreign Currency Input */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {currencyMeta.currencyNameBn} ({currencyMeta.currencyCode} {currencyMeta.currencySymbol}):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={converterForeignInput}
                    onChange={(e) => handleForeignInputChange(e.target.value)}
                    placeholder="স্থানীয় মুদ্রার পরিমাণ লিখুন..."
                    className="w-full px-3.5 py-2 pl-9 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                    {currencyMeta.currencySymbol}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 self-center mr-1">দ্রুত নির্বাচন:</span>
                {['20000', '50000', '100000', '200000'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleBdtInputChange(amt)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 border border-slate-700 font-mono transition-colors"
                  >
                    {Number(amt).toLocaleString()} ৳
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Travel Parameters (Days & Travelers) */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              ট্রিপের সময় ও যাত্রীর সংখ্যা
            </h3>

            {/* Days Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  ভ্রমণের মেয়াদ (দিন):
                </span>
                <span className="font-bold text-white font-mono bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800">
                  {tripDays} দিন
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={tripDays}
                onChange={(e) => setTripDays(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>১ দিন</span>
                <span>৭ দিন (১ সপ্তাহ)</span>
                <span>১৫ দিন</span>
                <span>৩০ দিন (১ মাস)</span>
              </div>
            </div>

            {/* Travelers Count */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  যাত্রী সংখ্যা:
                </span>
                <span className="font-bold text-white font-mono bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800">
                  {travelerCount} জন
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTravelerCount(num)}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      travelerCount === num
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {num} জন {num === 1 ? '(একা)' : num === 2 ? '(যুগল)' : '(দল)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cost Breakdown & Smart Tips (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Travel Style Tier Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              ভ্রমণের ধরন ও লাইফস্টাইল নির্বাচন করুন:
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Budget Tier */}
              <button
                onClick={() => setTravelTier('budget')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  travelTier === 'budget'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-base block mb-1">🎒</span>
                <h4 className="font-bold text-xs sm:text-sm text-white">বাজেট ট্রাভেল</h4>
                <p className="text-[11px] opacity-80 mt-0.5">হোস্টেল, স্ট্রিট ফুড, লোকাল বাস</p>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold block mt-1">
                  ~${currencyMeta.dailyCostBudgetUsd} /দিন
                </span>
              </button>

              {/* Standard Tier */}
              <button
                onClick={() => setTravelTier('standard')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  travelTier === 'standard'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-base block mb-1">🏨</span>
                <h4 className="font-bold text-xs sm:text-sm text-white">স্ট্যান্ডার্ড / পরিবার</h4>
                <p className="text-[11px] opacity-80 mt-0.5">৩-৪★ হোটেল, ক্যাজুয়াল ডাইনিং</p>
                <span className="text-[10px] text-indigo-300 font-mono font-semibold block mt-1">
                  ~${currencyMeta.dailyCostStandardUsd} /দিন
                </span>
              </button>

              {/* Luxury Tier */}
              <button
                onClick={() => setTravelTier('luxury')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  travelTier === 'luxury'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-100 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-base block mb-1">👑</span>
                <h4 className="font-bold text-xs sm:text-sm text-white">লাক্সারি / প্রিমিয়াম</h4>
                <p className="text-[11px] opacity-80 mt-0.5">৫★ রিসোর্ট, ফাইন ডাইন, ক্যাব</p>
                <span className="text-[10px] text-amber-300 font-mono font-semibold block mt-1">
                  ~${currencyMeta.dailyCostLuxuryUsd} /দিন
                </span>
              </button>
            </div>
          </div>

          {/* Grand Total Estimated Expense Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold block">
                  মোট আনুমানিক খরচ ({tripDays} দিন, {travelerCount} জন)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {calculation.grandTotalBdt.toLocaleString()} ৳
                  </span>
                  <span className="text-xs text-slate-400 font-mono">BDT</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">গন্তব্য স্থানীয় মুদ্রায়:</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 block">
                  {currencyMeta.currencySymbol} {calculation.grandTotalForeign.toLocaleString()} {currencyMeta.currencyCode}
                </span>
                <span className="text-[10px] text-slate-400">
                  (প্রতিদিন জনপ্রতি ~${calculation.dailyPerPersonUsd} USD)
                </span>
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                খাত অনুযায়ী আনুমানিক খরচের বিভাজন (Cost Breakdown):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Hotel */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-indigo-400" />
                      হোটেল ও আবাসন:
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {calculation.breakdownBdt.hotel.toLocaleString()} ৳
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${currencyMeta.breakdown.hotelPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    মোট বাজেটের {currencyMeta.breakdown.hotelPct}%
                  </span>
                </div>

                {/* Food */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                      খাবার ও পানীয়:
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {calculation.breakdownBdt.food.toLocaleString()} ৳
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${currencyMeta.breakdown.foodPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    মোট বাজেটের {currencyMeta.breakdown.foodPct}%
                  </span>
                </div>

                {/* Transport */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-sky-400" />
                      লোকাল যাতায়াত:
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {calculation.breakdownBdt.transport.toLocaleString()} ৳
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${currencyMeta.breakdown.transportPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    মোট বাজেটের {currencyMeta.breakdown.transportPct}%
                  </span>
                </div>

                {/* Activities */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      দর্শনীয় স্থান ও এন্ট্রি ফি:
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {calculation.breakdownBdt.activities.toLocaleString()} ৳
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${currencyMeta.breakdown.activitiesPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    মোট বাজেটের {currencyMeta.breakdown.activitiesPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar: Google Drive Save & Visa Guide Navigation */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <button
                id="btn-save-budget-drive"
                onClick={handleSaveBudgetToDrive}
                disabled={isSavingBudget}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                {isSavingBudget ? <span>ড্রাইভে সেভ হচ্ছে...</span> : <span>এই বাজেট Google Drive-এ সেভ করুন</span>}
              </button>

              {onNavigateToVisa && (
                <button
                  onClick={() => onNavigateToVisa(selectedCountryCode)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{visaInfo.countryNameBn}-এর ভিসা রিকোয়ারমেন্টস</span>
                </button>
              )}
            </div>

            {driveSavedLink && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ভিসা গাইড ও ভ্রমণ বাজেট গুগল ড্রাইভে সফলভাবে সংরক্ষিত হয়েছে!</span>
                </div>
                {driveSavedLink !== 'saved' && (
                  <a
                    href={driveSavedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-indigo-300 ml-2 hover:text-white"
                  >
                    ফাইল দেখুন
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Money-Saving Local Tips Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              {visaInfo.countryNameBn} ভ্রমণের জন্য বাজেট সাশ্রয়ী টিপস (Money-Saving Tips):
            </h4>

            <div className="space-y-2">
              {currencyMeta.moneySavingTipsBn.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
