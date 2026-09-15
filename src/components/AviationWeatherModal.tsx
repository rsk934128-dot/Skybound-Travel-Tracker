import React from 'react';
import { 
  CloudRain, Wind, Compass, Thermometer, Droplets, Eye, 
  AlertTriangle, CheckCircle2, X, Gauge, ShieldAlert, Sparkles 
} from 'lucide-react';
import { WeatherConditions } from '../weatherService';

interface AviationWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherConditions | null;
  radarRadiusKm: number;
}

export const AviationWeatherModal: React.FC<AviationWeatherModalProps> = ({
  isOpen,
  onClose,
  weather,
  radarRadiusKm,
}) => {
  if (!isOpen || !weather) return null;

  // Dhaka Hazrat Shahjalal Int'l (DAC) has single main runway: 14 / 32 (Oriented 140° / 320°)
  // Determine active runway based on headwind
  const windDir = weather.windDirectionDeg;
  const windSpd = weather.windSpeedKnots;

  // Runway 14: heading 140°
  const angleRwy14 = ((windDir - 140) * Math.PI) / 180;
  const headwindRwy14 = Math.round(windSpd * Math.cos(angleRwy14));
  const crosswindRwy14 = Math.round(Math.abs(windSpd * Math.sin(angleRwy14)));

  // Runway 32: heading 320°
  const angleRwy32 = ((windDir - 320) * Math.PI) / 180;
  const headwindRwy32 = Math.round(windSpd * Math.cos(angleRwy32));
  const crosswindRwy32 = Math.round(Math.abs(windSpd * Math.sin(angleRwy32)));

  const activeRunway = headwindRwy14 >= headwindRwy32 ? 'Runway 14' : 'Runway 32';
  const activeHeadwind = Math.max(headwindRwy14, headwindRwy32);
  const activeCrosswind = activeRunway === 'Runway 14' ? crosswindRwy14 : crosswindRwy32;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  এভিয়েশন আবহাওয়া ও রানওয়ে অ্যানালিটিক্স
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  weather.isLive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {weather.isLive ? 'LIVE WX' : 'SIMULATED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                DAC / VGHS • শাহজালাল আন্তর্জাতিক বিমানবন্দর টার্মিনাল এরিয়া
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Real-time Weather Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> বাতাস (Wind)
              </span>
              <span className="text-sm font-bold font-mono text-white block">
                {weather.windDirectionDeg}° / {weather.windSpeedKnots} kt
              </span>
              <span className="text-[10px] text-slate-400">
                দিক: {weather.windDirectionCardinal}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block mb-1 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-400" /> বৃষ্টিপাত
              </span>
              <span className="text-sm font-bold font-mono text-white block">
                {weather.precipitationMm} mm/h
              </span>
              <span className="text-[10px] text-indigo-300">
                {weather.precipitationType === 'none' ? 'বৃষ্টিমুক্ত' : weather.precipitationType}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> তাপমাত্রা
              </span>
              <span className="text-sm font-bold font-mono text-white block">
                {weather.temperatureC}°C
              </span>
              <span className="text-[10px] text-slate-400">
                আর্দ্রতা: {weather.humidityPercent}%
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block mb-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> দৃশ্যমানতা
              </span>
              <span className="text-sm font-bold font-mono text-white block">
                {weather.visibilityKm} km
              </span>
              <span className="text-[10px] text-emerald-300">
                মেঘের ঘনত্ব: {weather.cloudCoverPercent}%
              </span>
            </div>
          </div>

          {/* Active Runway Analysis for DAC (Runway 14/32) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>ঢাকার সক্রিয় রানওয়ে ও উইন্ড-কম্পোনেন্ট বিশ্লেষণ (DAC Runway 14/32)</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              বিমান সবসময় বাতাসের বিপরীত মুখে (Into the Wind) অবতরণ ও উড্ডয়ন করে। বর্তমান বাতাসের অভিমুখ অনুযায়ী সক্রিয় রানওয়ে:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
              <div>
                <span className="text-xs text-slate-400">প্রস্তাবিত রানওয়ে (Active Landing Runway):</span>
                <div className="text-base font-bold text-emerald-300 font-mono flex items-center gap-2 mt-0.5">
                  <span>{activeRunway}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    হেডউইন্ড অনুকূল
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] text-slate-400 block">হেডউইন্ড উপাদান:</span>
                  <span className="text-xs font-mono font-bold text-white">{activeHeadwind} knots</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 block">ক্রসউইন্ড বিচ্যুতি:</span>
                  <span className={`text-xs font-mono font-bold ${activeCrosswind > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeCrosswind} knots
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact on Flights and ETA */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              ফ্লাইট আগমন ও অবতরণ সময়ের (ETA) ওপর প্রভাব
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">💨 টেলউইন্ড (Tailwind):</span>
                <span className="text-slate-300 leading-relaxed">
                  যেসব বিমান বাতাসের প্রবাহের দিকে উড়ছে, তাদের গ্রাউন্ড স্পিড ১০-৩০ কিমি/ঘণ্টা বৃদ্ধি পাবে এবং অবতরণের সময় নির্ধারিত সময়ের ২-৪ মিনিট পূর্বে হতে পারে।
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠️ হেডউইন্ড (Headwind):</span>
                <span className="text-slate-300 leading-relaxed">
                  বাতাসের উল্টো দিক থেকে আসা বিমানগুলোর গতিবেগ কিছুটা কমে যাওয়ায় এন্ট্রি ও অবতরণে সামান্য সময় বিলম্ব ঘটতে পারে।
                </span>
              </div>
              {weather.precipitationType !== 'none' && (
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2">
                  <span className="text-sky-400 font-bold">🌧️ বৃষ্টি ও মেঘপুঞ্জ:</span>
                  <span className="text-slate-300 leading-relaxed">
                    মেঘপুঞ্জ ও বৃষ্টি বলয়ের কারণে এয়ার ট্র্যাফিক কন্ট্রোল (ATC) বিমানগুলোকে সেফটি সেপারেশন দিতে টার্মিনাল রাডার ভেক্টরিং বা হোল্ডিং দিতে পারে।
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Raw METAR String */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400">
            <span className="text-slate-500 block mb-1">Aviation METAR Report:</span>
            <span className="text-sky-300">{weather.metarSummaryBn}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            বুঝেছি (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
