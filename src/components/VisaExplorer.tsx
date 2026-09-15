import React, { useState } from 'react';
import { BANGLADESH_PASSPORT_VISA_DB, VISA_CATEGORIES_CONFIG } from '../visaData';
import { DestinationVisaInfo, VisaCategory } from '../types';
import { 
  Search, Filter, ShieldCheck, FileText, ExternalLink, 
  CloudUpload, CheckCircle2, Share2, Coins, Calculator, ArrowRight
} from 'lucide-react';
import { saveVisaChecklistToDrive } from '../driveService';
import { getCountryCurrencyMeta } from '../currencyService';

interface VisaExplorerProps {
  onSelectCountry?: (visa: DestinationVisaInfo) => void;
  driveToken: string | null;
  onNeedGoogleSignIn: () => void;
  onShareCountry?: (visa: DestinationVisaInfo) => void;
  onOpenExpenseCalculator?: (countryCode: string) => void;
}

export const VisaExplorer: React.FC<VisaExplorerProps> = ({
  onSelectCountry,
  driveToken,
  onNeedGoogleSignIn,
  onShareCountry,
  onOpenExpenseCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<VisaCategory | 'all'>('all');
  const [expandedCountry, setExpandedCountry] = useState<string | null>('TH');
  const [savingToDrive, setSavingToDrive] = useState<string | null>(null);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<string | null>(null);

  const countries = Object.values(BANGLADESH_PASSPORT_VISA_DB);

  const filteredCountries = countries.filter((item) => {
    const matchesCategory = selectedFilter === 'all' || item.visaCategory === selectedFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.countryName.toLowerCase().includes(query) ||
      item.countryNameBn.includes(query) ||
      item.capital.toLowerCase().includes(query) ||
      item.countryCode.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: countries.length,
    'visa-free': countries.filter((c) => c.visaCategory === 'visa-free').length,
    'visa-on-arrival': countries.filter((c) => c.visaCategory === 'visa-on-arrival').length,
    'eta-evisa': countries.filter((c) => c.visaCategory === 'eta-evisa').length,
    'visa-required': countries.filter((c) => c.visaCategory === 'visa-required').length,
  };

  const handleSaveToDrive = async (country: DestinationVisaInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!driveToken) {
      onNeedGoogleSignIn();
      return;
    }

    try {
      setSavingToDrive(country.countryCode);
      const res = await saveVisaChecklistToDrive(driveToken, country);
      setSavedSuccessNotice(`Google Drive-এ সংরক্ষিত হয়েছে: ${res.name}`);
      setTimeout(() => setSavedSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(`গুগল ড্রাইভে সংরক্ষণ করতে সমস্যা হয়েছে: ${err.message}`);
    } finally {
      setSavingToDrive(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-900/60 p-4 lg:p-6 text-slate-100">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛂 পাসপোর্ট ভিসা গাইড ও কালার কোড</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                🇧🇩 বাংলাদেশ পাসপোর্ট
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              মাথার ওপরের প্লেন বা বিশ্বের যেকোনো দেশের সর্বশেষ ভিসা নীতিমালা, আকর্ষণীয় পর্যটন ল্যান্ডমার্ক এবং সরাসরি গুগল ড্রাইভ সেভ সুবিধা।
            </p>
          </div>

          {onOpenExpenseCalculator && (
            <button
              onClick={() => onOpenExpenseCalculator(expandedCountry || 'TH')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>ভ্রমণ বাজেট ও কারেন্সি কনভার্টার</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Visual Hero Banner for Visa Explorer */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 my-4 shadow-lg group">
          <img
            src="/images/visa-explorer.jpg"
            alt="International Visa and Travel Intelligence"
            referrerPolicy="no-referrer"
            className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent flex flex-col justify-center p-5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> আন্তর্জাতিক ভ্রমণ ও পাসপোর্ট নির্দেশিকা
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white max-w-md leading-tight">
              বাংলাদেশী পাসপোর্টের জন্য বিশ্বের জনপ্রিয় দেশসমূহের ভিসা তথ্য
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mt-1 hidden sm:block">
              ভিসা-মুক্ত, অন-অ্যারাইভাল কিংবা ই-ভিসা—প্রতিটি দেশের আকর্ষণীয় পর্যটন স্পট ও আইকনিক ল্যান্ডমার্কসহ বিস্তারিত তথ্য।
            </p>
          </div>
        </div>

        {/* Color Coding Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'visa-free' ? 'all' : 'visa-free')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedFilter === 'visa-free'
                ? 'border-emerald-500 bg-emerald-950/40 shadow-sm'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Visa-Free
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {categoryCounts['visa-free']}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ভিসা মুক্ত প্রবেশাধিকার</p>
          </button>

          <button
            onClick={() => setSelectedFilter(selectedFilter === 'visa-on-arrival' ? 'all' : 'visa-on-arrival')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedFilter === 'visa-on-arrival'
                ? 'border-amber-500 bg-amber-950/40 shadow-sm'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                On Arrival (VoA)
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {categoryCounts['visa-on-arrival']}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">বিমানবন্দরে পৌঁছালে ভিসা</p>
          </button>

          <button
            onClick={() => setSelectedFilter(selectedFilter === 'eta-evisa' ? 'all' : 'eta-evisa')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedFilter === 'eta-evisa'
                ? 'border-sky-500 bg-sky-950/40 shadow-sm'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-sky-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                eVisa / ETA
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                {categoryCounts['eta-evisa']}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">অনলাইনে দ্রুত ই-ভিসা</p>
          </button>

          <button
            onClick={() => setSelectedFilter(selectedFilter === 'visa-required' ? 'all' : 'visa-required')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedFilter === 'visa-required'
                ? 'border-rose-500 bg-rose-950/40 shadow-sm'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-rose-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                Visa Required
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                {categoryCounts['visa-required']}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">পূর্বে দূতাবাস বা এজেন্সিতে আবেদন</p>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="দেশ বা শহরের নাম দিয়ে সার্চ করুন (যেমন: থাইল্যান্ড, নেপাল, Dubai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {selectedFilter !== 'all' && (
          <button
            onClick={() => setSelectedFilter('all')}
            className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>ফিল্টার মুছুন</span>
          </button>
        )}
      </div>

      {/* Alert Banner for Drive Saved Notice */}
      {savedSuccessNotice && (
        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedSuccessNotice}</span>
        </div>
      )}

      {/* Country Cards List */}
      <div className="space-y-3 pb-8">
        {filteredCountries.map((country) => {
          const catConfig = VISA_CATEGORIES_CONFIG[country.visaCategory];
          const isExpanded = expandedCountry === country.countryCode;

          return (
            <div
              key={country.countryCode}
              id={`country-card-${country.countryCode}`}
              onClick={() => setExpandedCountry(isExpanded ? null : country.countryCode)}
              className={`rounded-2xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {/* Destination Photo Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-700/80 shrink-0 bg-slate-900 shadow-md">
                    {country.destinationImage ? (
                      <img
                        src={country.destinationImage}
                        alt={country.countryName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {country.flagEmoji}
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-sm bg-slate-900/80 px-1 py-0.5 rounded-md border border-slate-700/60 shadow-sm leading-none">
                      {country.flagEmoji}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{country.countryNameBn}</h3>
                      <span className="text-xs text-slate-400">({country.countryName})</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>রাজধানী: {country.capital}</span>
                      <span>•</span>
                      <span>{country.region}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${catConfig.colorClass}`}
                  >
                    <span className="text-xs">{catConfig.symbol}</span>
                    <span>{catConfig.labelBn}</span>
                  </span>

                  <button
                    onClick={(e) => handleSaveToDrive(country, e)}
                    disabled={savingToDrive === country.countryCode}
                    title="গুগল ড্রাইভে ভিসা চেকলিস্ট ও গাইডলাইন সেভ করুন"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 text-slate-300 hover:text-indigo-300 transition-colors"
                  >
                    <CloudUpload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detailed Expandable Section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 text-xs space-y-4">
                  {/* Widescreen Scenic Destination Picture Banner */}
                  {country.destinationImage && (
                    <div className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden border border-slate-700/80 shadow-md">
                      <img
                        src={country.destinationImage}
                        alt={country.countryName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-300 bg-slate-900/85 px-2 py-0.5 rounded-md border border-indigo-500/30 shadow-sm">
                            {country.capital} • {country.region}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white mt-1.5 drop-shadow-md flex items-center gap-2">
                            <span>{country.countryNameBn} ({country.countryName})</span>
                            <span className="text-xl">{country.flagEmoji}</span>
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium block mb-1">⏱️ অবস্থানের মেয়াদ:</span>
                      <span className="text-slate-200 font-semibold">{country.stayDurationBn}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">({country.stayDuration})</span>
                    </div>

                    <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium block mb-1">💳 আনুমানিক ফি:</span>
                      <span className="text-slate-200 font-semibold">{country.feeEstimate}</span>
                    </div>
                  </div>

                  {/* Summary Notes */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="text-indigo-400 font-semibold mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      ভিসা সংক্রান্ত মূল নিয়মাবলী
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{country.notesBn}</p>
                    <p className="text-slate-500 text-[11px] mt-1 italic">{country.notes}</p>
                  </div>

                  {/* Documents Checklist */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      ভ্রমণের জন্য আবশ্যক কাগজপত্র (Required Documents)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {country.documentsNeeded.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-850/60 p-2 rounded-lg text-slate-300">
                          <span className="text-emerald-400 font-mono text-[10px] mt-0.5">✓</span>
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Currency & Daily Travel Cost Quick Snapshot */}
                  {(() => {
                    const cMeta = getCountryCurrencyMeta(country.countryCode);
                    return (
                      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 p-3.5 rounded-xl border border-amber-500/30">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-amber-300 font-semibold flex items-center gap-1.5">
                            <Coins className="w-4 h-4 text-amber-400" />
                            মুদ্রা ও দৈনিক ভ্রমণ খরচের ধারণা ({country.countryNameBn})
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                            ১ {cMeta.currencyCode} ≈ {cMeta.defaultRateToBdt} ৳ BDT
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs my-2.5">
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">🎒 বাজেট</span>
                            <span className="font-bold text-white font-mono">~${cMeta.dailyCostBudgetUsd}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">/প্রতিদিন</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <span className="text-[10px] text-indigo-400 block">🏨 স্ট্যান্ডার্ড</span>
                            <span className="font-bold text-white font-mono">~${cMeta.dailyCostStandardUsd}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">/প্রতিদিন</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <span className="text-[10px] text-amber-400 block">👑 লাক্সারি</span>
                            <span className="font-bold text-white font-mono">~${cMeta.dailyCostLuxuryUsd}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">/প্রতিদিন</span>
                          </div>
                        </div>

                        {onOpenExpenseCalculator && (
                          <button
                            onClick={() => onOpenExpenseCalculator(country.countryCode)}
                            className="w-full mt-1 py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>{country.countryNameBn} ভ্রমণ বাজেট ও কারেন্সি কনভার্টারে হিসাব করুন</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Save to Drive Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      onClick={(e) => handleSaveToDrive(country, e)}
                      disabled={savingToDrive === country.countryCode}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                    >
                      <CloudUpload className="w-4 h-4" />
                      {savingToDrive === country.countryCode ? (
                        <span>ড্রাইভে সেভ হচ্ছে...</span>
                      ) : (
                        <span>Google Drive-এ ট্রাভেল ফাইল সেভ করুন</span>
                      )}
                    </button>

                    {onShareCountry && (
                      <button
                        onClick={() => onShareCountry(country)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-sky-400 hover:text-sky-300 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="এই দেশের ভিসা গাইড পিকচার সহ শেয়ার করুন"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>শেয়ার</span>
                      </button>
                    )}

                    {onSelectCountry && (
                      <button
                        onClick={() => onSelectCountry(country)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>রাডারে সংশ্লিষ্ট ফ্লাইট খুঁজুন</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredCountries.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-400 text-sm">কোনো দেশ খুঁজে পাওয়া যায়নি।</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="mt-2 text-xs text-indigo-400 hover:underline"
            >
              সব দেশ প্রদর্শন করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
