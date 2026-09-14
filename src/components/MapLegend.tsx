import React, { useState } from 'react';
import { Plane, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export interface MapLegendProps {
  radarRadiusKm?: number;
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ radarRadiusKm = 400, className = '' }) => {
  // Displayed by default so user gets immediate visual orientation
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      id="map-legend"
      aria-label="ম্যাপ ও রাডার প্রতীক নির্দেশিকা"
      className={`absolute bottom-4 left-4 z-20 pointer-events-auto transition-all duration-300 select-none max-w-[calc(100vw-2rem)] ${className}`}
    >
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl p-3 sm:p-3.5 text-slate-100 w-64 sm:w-72">
        {/* Toggle / Header Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">ম্যাপ নির্দেশিকা (Map Legend)</span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {isOpen ? 'বিমান প্রতীক ও ভিসা নির্দেশক' : 'দেখতে ট্যাপ করুন'}
              </span>
            </div>
          </div>

          <button
            id="btn-toggle-map-legend"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isOpen ? 'লিজেন্ড সংকুচিত করুন' : 'লিজেন্ড বড় করুন'}
            aria-expanded={isOpen}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Semi-transparent Body */}
        {isOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-3 text-xs animate-in fade-in duration-200">
            {/* 1. Aircraft Symbols: Commercial vs. Private Planes */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1.5">
                বিমানের প্রতীক (Aircraft Symbols)
              </span>

              <div className="space-y-1.5">
                {/* Commercial Airliner */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/40">
                    <Plane className="w-4 h-4 fill-current rotate-45" />
                  </div>
                  <div className="leading-tight flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-100 font-semibold text-[11px] truncate">বাণিজ্যিক বিমান</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 shrink-0 font-medium">
                        Commercial
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">যাত্রীবাহী নিয়মিত ফ্লাইট</span>
                  </div>
                </div>

                {/* Private Executive Jet */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/40">
                    <Plane className="w-4 h-4 fill-current rotate-45" />
                  </div>
                  <div className="leading-tight flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-teal-200 font-semibold text-[11px] truncate">ব্যক্তিগত জেট</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/25 text-teal-200 border border-teal-500/30 shrink-0 font-medium">
                        Private
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">চার্টার ও বিজনেস জেট</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Color-Coded Visa Status Indicators */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  ভিসা স্ট্যাটাস (Visa Status)
                </span>
                <span className="text-[9px] text-slate-400 font-mono">🇧🇩 পাসপোর্ট</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {/* Green for Visa-Free */}
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-md shadow-emerald-400/60 animate-pulse" />
                    <div>
                      <span className="text-emerald-300 font-semibold text-[11px] block">Green: Visa-Free</span>
                      <span className="text-[10px] text-emerald-400/80 block">ভিসা ছাড়াই প্রবেশ সুবিধা</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shrink-0 font-semibold">
                    মুক্ত
                  </span>
                </div>

                {/* Yellow for Visa on Arrival */}
                <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0 shadow-md shadow-amber-400/60" />
                    <div>
                      <span className="text-amber-300 font-semibold text-[11px] block">Yellow: Visa on Arrival</span>
                      <span className="text-[10px] text-amber-400/80 block">বিমানবন্দরে পৌঁছানোর পর ভিসা</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 shrink-0 font-semibold">
                    অন-অ্যারাইভাল
                  </span>
                </div>

                {/* Red for Visa Required */}
                <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-rose-400 shrink-0 shadow-md shadow-rose-400/60" />
                    <div>
                      <span className="text-rose-300 font-semibold text-[11px] block">Red: Visa Required</span>
                      <span className="text-[10px] text-rose-400/80 block">ভ্রমণের পূর্বে দূতাবাস বা ই-ভিসা</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 shrink-0 font-semibold">
                    আবশ্যক
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Radius and Action Hint */}
            <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate">রাডার পরিধি: {radarRadiusKm} কিমি</span>
              <span className="text-indigo-300 shrink-0 font-medium">বিমানে ট্যাপ করুন ✈️</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MapLegend;
