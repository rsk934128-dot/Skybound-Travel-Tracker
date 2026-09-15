import React, { useState } from 'react';
import { FlightState, DestinationVisaInfo } from '../types';
import { BANGLADESH_PASSPORT_VISA_DB, VISA_CATEGORIES_CONFIG } from '../visaData';
import { 
  Plane, ArrowRight, Gauge, Mountain, Compass, ShieldCheck, 
  FileText, CloudUpload, X, CheckCircle2, ChevronRight, ExternalLink,
  Share2, Bell, BellOff, Coins, Building2
} from 'lucide-react';
import { saveVisaChecklistToDrive } from '../driveService';
import { FlightAnalyticsPanel } from './FlightAnalyticsPanel';

interface FlightDetailCardProps {
  flight: FlightState;
  onClose: () => void;
  onOpenFullVisaGuide: (visa: DestinationVisaInfo) => void;
  driveToken: string | null;
  onNeedGoogleSignIn: () => void;
  onShare?: () => void;
  isMonitored?: boolean;
  isMuted?: boolean;
  onToggleMonitor?: (icao24: string) => void;
  onToggleMute?: (icao24: string) => void;
  onOpenExpenseCalculator?: (countryCode: string) => void;
  onOpenAirportGuide?: (iata: string) => void;
}

export const FlightDetailCard: React.FC<FlightDetailCardProps> = ({
  flight,
  onClose,
  onOpenFullVisaGuide,
  driveToken,
  onNeedGoogleSignIn,
  onShare,
  isMonitored = false,
  isMuted = false,
  onToggleMonitor,
  onToggleMute,
  onOpenExpenseCalculator,
  onOpenAirportGuide,
}) => {
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveSavedUrl, setDriveSavedUrl] = useState<string | null>(null);

  // Look up destination country visa data
  const destCode = flight.estimatedDestination?.countryCode || 'TH';
  const visaInfo: DestinationVisaInfo =
    BANGLADESH_PASSPORT_VISA_DB[destCode] ||
    BANGLADESH_PASSPORT_VISA_DB['TH']; // fallback

  const catConfig = VISA_CATEGORIES_CONFIG[visaInfo.visaCategory];

  // Altitude in feet and meters
  const altMeters = flight.baroAltitude ?? 0;
  const altFeet = Math.round(altMeters * 3.28084);
  const speedKmh = Math.round((flight.velocity ?? 0) * 3.6);
  const isParked = flight.onGround || altMeters <= 50;

  const handleSaveToDrive = async () => {
    if (!driveToken) {
      onNeedGoogleSignIn();
      return;
    }

    try {
      setIsSavingToDrive(true);
      const res = await saveVisaChecklistToDrive(driveToken, visaInfo, flight);
      setDriveSavedUrl(res.webViewLink || 'saved');
      setTimeout(() => setDriveSavedUrl(null), 5000);
    } catch (err: any) {
      alert(`গুগল ড্রাইভে ফাইল সংরক্ষণে ব্যর্থ: ${err.message}`);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border-t sm:border border-indigo-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 text-slate-100 max-w-xl w-full mx-auto animate-in slide-in-from-bottom-6 duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-white">
                {flight.callsign || flight.icao24}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                ICAO: {flight.icao24}
              </span>
              {flight.flightCategory === 'private' ? (
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono">
                  Private Jet
                </span>
              ) : flight.flightCategory === 'cargo' ? (
                <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono">
                  Cargo
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  Commercial
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{flight.airlineName || 'Commercial Flight'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleMonitor && (
            <button
              id={`btn-toggle-flight-alert-${flight.icao24}`}
              onClick={() => onToggleMonitor(flight.icao24)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isMonitored
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isMonitored ? 'এই বিমানের নোটিফিকেশন বন্ধ করুন' : 'এই বিমানের জন্য নোটিফিকেশন চালু করুন'}
            >
              <Bell className="w-4 h-4" />
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="p-1.5 rounded-full hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              title="এই বিমানের তথ্য ও ভিসা পিকচার সহ শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Flight Route & Destination Scenic Banner */}
      <div className="my-3.5 relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-md">
        {visaInfo.destinationImage && (
          <img
            src={visaInfo.destinationImage}
            alt={flight.estimatedDestination?.city || 'Destination'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-30 brightness-75 scale-105"
          />
        )}
        <div className="relative bg-slate-950/80 backdrop-blur-xs p-3.5">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-xl font-bold font-mono text-indigo-400 block drop-shadow">
                {flight.estimatedOrigin?.code || 'DAC'}
              </span>
              <span className="text-xs text-slate-300 drop-shadow">{flight.estimatedOrigin?.city || 'Dhaka'}</span>
            </div>

            <div className="flex flex-col items-center px-4 flex-1">
              <span className="text-[10px] text-slate-300/80 mb-1 font-mono">
                {isParked ? 'মাটিতে অবস্থানরত (On Ground)' : 'আকাশপথে সক্রিয় (Overhead)'}
              </span>
              <div className="w-full flex items-center gap-1">
                <div className="h-0.5 bg-slate-600 flex-1 relative">
                  {!isParked && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <Plane className="w-4 h-4 text-indigo-400 rotate-90 shrink-0 drop-shadow" />
                <div className="h-0.5 bg-slate-600 flex-1" />
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold font-mono text-amber-400 block drop-shadow">
                {flight.estimatedDestination?.code || 'BKK'}
              </span>
              <span className="text-xs text-slate-200 drop-shadow font-medium">
                {flight.estimatedDestination?.city || 'Bangkok'} {visaInfo.flagEmoji}
              </span>
            </div>
          </div>

          {/* Flight telemetry metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Mountain className="w-3 h-3 text-indigo-400" />
              <span>উচ্চতা</span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {isParked ? '0 ft (মাটিতে)' : `${altFeet.toLocaleString()} ft`}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Gauge className="w-3 h-3 text-indigo-400" />
              <span>গতিবেগ</span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {isParked ? '0 km/h' : `${speedKmh} km/h`}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Compass className="w-3 h-3 text-indigo-400" />
              <span>দিক / Track</span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {flight.trueTrack ? `${Math.round(flight.trueTrack)}°` : 'N/A'}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Flight Analytics & Predictive Arrival Delays Module */}
      <div className="mb-3.5">
        <FlightAnalyticsPanel flight={flight} />
      </div>

      {/* Individual Aircraft Notification Banner Control */}
      {onToggleMonitor && (
        <div className="mb-3.5 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`p-1.5 rounded-xl shrink-0 ${
              isMonitored 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-100 block truncate">
                {isMonitored
                  ? '🔔 এই বিমানের অ্যালার্ট সক্রিয় (Monitored)'
                  : isMuted
                  ? '🔕 এই বিমানটি মিউট করা রয়েছে'
                  : 'এই বিমানের নোটিফিকেশন চান?'}
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                {isMonitored
                  ? 'রাডারে এলেই ব্রাউজার নোটিফিকেশন ও চাইম বাজবে'
                  : isMuted
                  ? 'অন্যান্য বিমান সচল থাকলেও এটি সতর্কতা পাঠাবে না'
                  : 'ঘনঘন অ্যালার্ট এড়াতে নির্দিষ্ট বিমানে নজর রাখুন'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleMonitor(flight.icao24)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isMonitored
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 active:scale-95'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isMonitored ? 'অ্যালার্ট বন্ধ' : 'অ্যালার্ট অন'}</span>
            </button>

            {onToggleMute && (
              <button
                onClick={() => onToggleMute(flight.icao24)}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isMuted ? 'আনমিউট করুন' : 'এই নির্দিষ্ট বিমান মিউট করুন'}
              >
                <BellOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Destination Visa Status Banner (COLOR CODED) */}
      <div className="p-3.5 rounded-2xl border bg-slate-950/60 border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>বাংলাদেশী পাসপোর্টধারীদের জন্য ভিসা তথ্য:</span>
          </div>
          <span className="text-sm">{visaInfo.flagEmoji}</span>
        </div>

        {/* Big Color Coded Visa Badge */}
        <div className={`p-3 rounded-xl border flex items-start gap-3 ${catConfig.colorClass}`}>
          <span className="text-2xl select-none shrink-0">{catConfig.symbol}</span>
          <div>
            <h4 className="font-bold text-sm leading-tight flex items-center gap-2">
              <span>{catConfig.labelBn}</span>
              <span className="text-[11px] opacity-80">({catConfig.labelEn})</span>
            </h4>
            <p className="text-xs mt-1 leading-snug opacity-90">{catConfig.descriptionBn}</p>
            <div className="mt-2 text-[11px] font-medium opacity-90">
              <span>⏱️ অনুমোদিত মেয়াদ: {visaInfo.stayDurationBn}</span>
              <span className="mx-2">•</span>
              <span>ফি: {visaInfo.feeEstimate}</span>
            </div>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => onOpenFullVisaGuide(visaInfo)}
            className="w-full sm:flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-xs text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>ভিসা গাইড</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {onOpenExpenseCalculator && (
            <button
              onClick={() => onOpenExpenseCalculator(destCode)}
              className="w-full sm:w-auto py-2 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="এই দেশের মুদ্রা ও দৈনিক ভ্রমণ খরচ হিসাব করুন"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>বাজেট</span>
            </button>
          )}

          {onOpenAirportGuide && (
            <button
              onClick={() => {
                // Determine hub IATA
                const destIata = flight.estimatedDestination?.city?.toUpperCase() || '';
                let targetIata = 'DAC';
                if (destIata.includes('BANGKOK') || destCode === 'TH') targetIata = 'BKK';
                else if (destIata.includes('KUALA') || destCode === 'MY') targetIata = 'KUL';
                else if (destIata.includes('SINGAPORE') || destCode === 'SG') targetIata = 'SIN';
                else if (destIata.includes('DUBAI') || destCode === 'AE') targetIata = 'DXB';
                onOpenAirportGuide(targetIata);
              }}
              className="w-full sm:w-auto py-2 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="বিমানবন্দরের টার্মিনাল, গেট ও লাউঞ্জ গাইড দেখুন"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>এয়ারপোর্ট হাব</span>
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="w-full sm:w-auto py-2 px-3 bg-slate-800 hover:bg-slate-750 text-xs text-sky-400 hover:text-sky-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="সোশ্যাল মিডিয়া প্ল্যাটফর্মে শেয়ার করুন"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার</span>
            </button>
          )}

          <button
            onClick={handleSaveToDrive}
            disabled={isSavingToDrive}
            className="w-full sm:w-auto py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            {isSavingToDrive ? <span>ড্রাইভে সেভ হচ্ছে...</span> : <span>Google Drive</span>}
          </button>
        </div>

        {/* Success toast inside card */}
        {driveSavedUrl && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ফ্লাইট ও ভিসা সামারি গুগল ড্রাইভে সেভ হয়েছে!</span>
            </div>
            {driveSavedUrl !== 'saved' && (
              <a
                href={driveSavedUrl}
                target="_blank"
                rel="noreferrer"
                className="underline text-indigo-300 ml-2 hover:text-white"
              >
                দেখুন
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
