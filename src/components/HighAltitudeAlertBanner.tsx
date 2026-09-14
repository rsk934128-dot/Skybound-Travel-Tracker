import React, { useEffect } from 'react';
import { FlightState } from '../types';
import { BANGLADESH_PASSPORT_VISA_DB } from '../visaData';
import { Bell, Plane, ArrowRight, X, Compass, ExternalLink } from 'lucide-react';

export interface AlertBannerItem {
  id: string;
  flight: FlightState;
  timestamp: number;
  altitudeFt: number;
}

interface HighAltitudeAlertBannerProps {
  alerts: AlertBannerItem[];
  onDismiss: (id: string) => void;
  onSelectFlight: (flight: FlightState) => void;
  radarRadiusKm: number;
}

export const HighAltitudeAlertBanner: React.FC<HighAltitudeAlertBannerProps> = ({
  alerts,
  onDismiss,
  onSelectFlight,
  radarRadiusKm,
}) => {
  if (alerts.length === 0) return null;

  // Show the latest alert prominently
  const currentAlert = alerts[0];
  const { flight, altitudeFt } = currentAlert;

  const destCode = flight.estimatedDestination?.countryCode || 'TH';
  const visaInfo = BANGLADESH_PASSPORT_VISA_DB[destCode];

  return (
    <div
      id="high-altitude-alert-container"
      className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/50 rounded-2xl shadow-2xl shadow-indigo-950/60 p-3 sm:p-4 text-slate-100 ring-1 ring-indigo-400/30">
        <div className="flex items-start justify-between gap-3">
          {/* Pulsing Icon */}
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 flex items-center justify-center relative">
            <Bell className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>

          {/* Alert Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                উচ্চ উচ্চতার বিমান সনাক্ত (High Altitude)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                পরিধি: {radarRadiusKm} কিমি
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-white truncate">
                {flight.callsign || 'ফ্লাইট'}
              </h4>
              <span className="text-xs text-slate-400 truncate">
                • {flight.airlineName || 'Commercial Flight'}
              </span>
            </div>

            {/* Telemetry and Destination Details */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 font-mono text-indigo-300 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
                <Plane className="w-3.5 h-3.5 text-indigo-400 rotate-45" />
                <span>{altitudeFt.toLocaleString()} ft</span>
                <span className="text-[10px] text-slate-400">
                  ({Math.round((flight.baroAltitude || 0))}m)
                </span>
              </div>

              {flight.velocity && (
                <div className="text-slate-300 font-mono bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
                  {Math.round(flight.velocity * 1.94384)} kts
                </div>
              )}

              {flight.estimatedDestination && (
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
                  <span>গন্তব্য:</span>
                  <span className="font-semibold text-white">
                    {flight.estimatedDestination.city}
                  </span>
                  {visaInfo && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        visaInfo.visaCategory === 'visa-free'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : visaInfo.visaCategory === 'visa-on-arrival'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : visaInfo.visaCategory === 'eta-evisa'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {visaInfo.flagEmoji} {visaInfo.visaCategory === 'visa-free' ? 'Visa-Free' : visaInfo.visaCategory === 'visa-on-arrival' ? 'VoA' : visaInfo.visaCategory === 'eta-evisa' ? 'eVisa' : 'Required'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                id="btn-alert-track-flight"
                onClick={() => {
                  onSelectFlight(flight);
                  onDismiss(currentAlert.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <span>রাডারে ট্র্যাক ও ভিসা দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-alert-dismiss"
                onClick={() => onDismiss(currentAlert.id)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>

          {/* Close Icon Button */}
          <button
            id="btn-close-alert-banner"
            onClick={() => onDismiss(currentAlert.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="অ্যালার্ট বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
