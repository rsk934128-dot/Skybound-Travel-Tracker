import React, { useState, useMemo } from 'react';
import { FlightState } from '../types';
import { 
  calculateFlightAnalytics, 
  formatFlightTime, 
  formatRemainingDurationBn,
  FlightAnalyticsResult 
} from '../flightAnalytics';
import { WeatherConditions } from '../weatherService';
import { 
  Clock, 
  Timer, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Activity, 
  Compass, 
  Wind, 
  ChevronDown, 
  ChevronUp, 
  PlaneLanding, 
  PlaneTakeoff,
  BarChart3,
  Info,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface FlightAnalyticsPanelProps {
  flight: FlightState;
  initiallyExpanded?: boolean;
  weatherData?: WeatherConditions | null;
}

export const FlightAnalyticsPanel: React.FC<FlightAnalyticsPanelProps> = ({
  flight,
  initiallyExpanded = true,
  weatherData,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  // Compute flight analytics with predictive algorithm and wind adjustment
  const analytics: FlightAnalyticsResult = useMemo(() => {
    return calculateFlightAnalytics(flight, weatherData);
  }, [flight, weatherData]);

  const nominalEtaLocalStr = formatFlightTime(
    analytics.estimatedLandingTime,
    analytics.destinationAirport.timezoneOffsetHours
  );
  const windEtaLocalStr = formatFlightTime(
    analytics.windAdjustedLandingTime,
    analytics.destinationAirport.timezoneOffsetHours
  );
  const windEtaBstStr = formatFlightTime(analytics.windAdjustedLandingTime, 6); // Bangladesh Standard Time (UTC+6)
  const staLocalStr = formatFlightTime(
    analytics.scheduledLandingTime,
    analytics.destinationAirport.timezoneOffsetHours
  );

  return (
    <div 
      id={`flight-analytics-${flight.icao24}`}
      className="rounded-2xl border border-indigo-500/30 bg-slate-950/70 overflow-hidden shadow-lg transition-all"
    >
      {/* Clickable Header Bar */}
      <button
        type="button"
        id={`btn-toggle-analytics-${flight.icao24}`}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>ফ্লাইট অ্যানালিটিক্স ও ল্যান্ডিং প্রেডিকশন</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>
                অবতরণ (Wind-Adjusted ETA): <strong className="text-white font-mono">{windEtaLocalStr}</strong>
              </span>
              {analytics.windTimeDeltaMinutes !== 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${analytics.windAdjustedETA.badgeClass}`}>
                  {analytics.windAdjustedETA.deltaMinutes < 0 ? `${analytics.windAdjustedETA.deltaMinutes}m` : `+${analytics.windAdjustedETA.deltaMinutes}m`}
                </span>
              )}
              <span>•</span>
              <span className="text-indigo-300">বাকি: {formatRemainingDurationBn(analytics.windAdjustedRemainingMinutes)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold font-mono flex items-center gap-1 ${analytics.delayStatusBadgeClass}`}>
            {analytics.delayStatus === 'early' ? (
              <TrendingUp className="w-3 h-3 text-teal-400" />
            ) : analytics.delayStatus === 'on-time' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-amber-400" />
            )}
            <span>{analytics.delayStatusLabelBn}</span>
          </span>

          <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Detailed Analytics View */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 pt-1 border-t border-slate-800/80 space-y-3.5 animate-in fade-in duration-200">
          {/* Key Time Matrix Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {/* Wind-Adjusted ETA Card */}
            <div className={`p-2.5 rounded-xl border ${
              analytics.windAdjustedETA.effectType === 'tailwind'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : analytics.windAdjustedETA.effectType === 'headwind'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Wind className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Wind-Adjusted ETA</span>
                </div>
                {analytics.windTimeDeltaMinutes !== 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    analytics.windAdjustedETA.deltaMinutes < 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {analytics.windAdjustedETA.deltaMinutes < 0 ? `${analytics.windAdjustedETA.deltaMinutes} মি.` : `+${analytics.windAdjustedETA.deltaMinutes} মি.`}
                  </span>
                )}
              </div>
              <div className={`font-mono text-sm sm:text-base font-bold ${
                analytics.windAdjustedETA.effectType === 'tailwind'
                  ? 'text-emerald-300'
                  : analytics.windAdjustedETA.effectType === 'headwind'
                  ? 'text-amber-300'
                  : 'text-indigo-300'
              }`}>
                {windEtaLocalStr}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {analytics.destinationAirport.city} সময় ({analytics.destinationAirport.timezoneOffsetHours >= 0 ? `+${analytics.destinationAirport.timezoneOffsetHours}` : analytics.destinationAirport.timezoneOffsetHours} UTC)
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>বিডি: {windEtaBstStr}</span>
                <span className="text-[9px] text-slate-400" title="বাতাসের প্রভাবহীন বেসলাইন">স্বাভাবিক: {nominalEtaLocalStr}</span>
              </div>
            </div>

            {/* Scheduled STA vs Delay */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>নির্ধারিত সময় (STA)</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-slate-200">
                {staLocalStr}
              </div>
              <div className="text-[10px] mt-0.5 flex items-center gap-1">
                <span className="text-slate-400">বিলম্ব/আগে:</span>
                <span className={`font-semibold font-mono ${analytics.delayStatusTextClass}`}>
                  {analytics.predictedDelayMinutes > 0
                    ? `+${analytics.predictedDelayMinutes} মি.`
                    : analytics.predictedDelayMinutes < 0
                    ? `${analytics.predictedDelayMinutes} মি.`
                    : '০ মিনিট (অন-টাইম)'}
                </span>
              </div>
            </div>

            {/* Remaining Distance & Duration */}
            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>অবশিষ্ট পথ ও সময়</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-emerald-300">
                {formatRemainingDurationBn(analytics.windAdjustedRemainingMinutes)}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                দূরত্ব: <strong className="text-slate-200 font-mono">{analytics.remainingDistanceKm.toLocaleString()} km</strong> / {analytics.totalDistanceKm.toLocaleString()} km
              </p>
            </div>
          </div>

          {/* Dynamic Flight Progress Tracker & Top of Descent */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <PlaneTakeoff className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">{analytics.originAirport.code}</span>
                <span className="text-[11px] text-slate-400">({analytics.originAirport.city})</span>
              </div>

              <div className="text-center">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-medium">
                  {analytics.phaseLabelBn}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-semibold text-amber-300">{analytics.destinationAirport.code}</span>
                <span className="text-[11px] text-slate-400">({analytics.destinationAirport.city})</span>
                <PlaneLanding className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            {/* Progress Bar with Top of Descent (TOD) Marker */}
            <div className="relative pt-1 pb-1">
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div 
                  className="h-full bg-linear-to-r from-indigo-500 via-indigo-400 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.progressPercent}%` }}
                />
              </div>

              {/* Progress Pin icon */}
              <div 
                className="absolute top-0 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${analytics.progressPercent}%` }}
              >
                <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md flex items-center justify-center -mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>অগ্রগতি: <strong className="text-indigo-300 font-mono">{analytics.progressPercent}%</strong> সম্পন্ন</span>
              <span>
                {analytics.isDescentInitiated ? (
                  <strong className="text-amber-400">অবতরণ পর্যায় চলমান (Below TOD)</strong>
                ) : (
                  <span>টপ অব ডিসেন্ট (TOD): <strong>{analytics.topOfDescentKmRemaining} km</strong> পূর্বে শুরু</span>
                )}
              </span>
            </div>
          </div>

          {/* Telemetry Factors & Delay Explanation */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>রিয়েল-টাইম প্রেডিকশন ইনসাইটস (Predictive Factors):</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                নির্ভরযোগ্যতা: {analytics.confidencePercent}%
              </span>
            </div>

            <div className="space-y-1.5">
              {analytics.predictiveFactorsBn.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Airline & Route Reliability Benchmark */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                <span>ঐতিহাসিক অন-টাইম রেকর্ড</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-base font-bold text-teal-300">
                  {analytics.historicalOnTimePercent}%
                </span>
                <span className="text-[10px] text-slate-400">রুট এভারেজ</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>বায়ুপ্রবাহ ও গতিবেগ অনুপাত</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-base font-bold text-sky-300">
                  {analytics.speedEfficiencyRatio}x
                </span>
                <span className="text-[10px] text-slate-400">
                  {analytics.speedEfficiencyRatio >= 1 ? 'অনুকূল বায়ুপ্রবাহ' : 'হেডউইন্ড প্রতিরোধ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
