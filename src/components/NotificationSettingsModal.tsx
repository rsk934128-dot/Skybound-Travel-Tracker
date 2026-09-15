import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertCircle,
  X,
  Plane,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Layers,
  Trash2,
  BellOff,
  Filter,
} from 'lucide-react';
import {
  NotificationSettings,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
} from '../notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onSendTestNotification: () => void;
  onShowDeniedExplanation?: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSendTestNotification,
  onShowDeniedExplanation,
}) => {
  const [testSent, setTestSent] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      onUpdateSettings({ ...settings, enabled: true });
    } else if (res === 'denied' && onShowDeniedExplanation) {
      onShowDeniedExplanation();
    }
  };

  const handleTest = () => {
    onSendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleRemoveWatchlist = (icao: string) => {
    const nextList = (settings.watchlistIcaos || []).filter((id) => id !== icao);
    onUpdateSettings({ ...settings, watchlistIcaos: nextList });
  };

  const handleRemoveMuted = (icao: string) => {
    const nextMuted = (settings.mutedIcaos || []).filter((id) => id !== icao);
    onUpdateSettings({ ...settings, mutedIcaos: nextMuted });
  };

  const watchlistCount = settings.watchlistIcaos?.length || 0;
  const mutedCount = settings.mutedIcaos?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        id="notification-settings-modal"
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ফ্লাইট নোটিফিকেশন সেটিংস</h3>
              <p className="text-xs text-slate-400">ব্যক্তিগত ও সার্বিক বিমান সতর্কবার্তা নিয়ন্ত্রণ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Visual Avionics Radar Telemetry Picture Banner */}
          <div className="relative w-full h-24 sm:h-28 rounded-2xl overflow-hidden border border-slate-800 shadow-inner shrink-0">
            <img
              src="/images/flight-telemetry.jpg"
              alt="Avionics Telemetry Radar Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono font-bold text-sky-300 flex items-center gap-1.5 drop-shadow">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Overhead Flight Alerts & Individual Aircraft Filtering
              </span>
            </div>
          </div>

          {/* Browser Permission Status */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ব্রাউজার Notification API স্ট্যাটাস:</span>
              {permission === 'granted' ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  অনুমোদিত (Granted)
                </span>
              ) : permission === 'denied' ? (
                <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  ব্লক করা (Denied)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  অনুমতি আবশ্যক
                </span>
              )}
            </div>

            {permission !== 'granted' && isNotificationSupported() && (
              <button
                id="btn-request-notification-permission"
                onClick={handleRequestPermission}
                className="w-full mt-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ব্রাউজার নোটিফিকেশন অনুমোদন করুন</span>
              </button>
            )}

            {permission === 'denied' && (
              <div className="pt-1.5 flex flex-col gap-1.5">
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  ⚠️ ব্রাউজার সেটিংসে নোটিফিকেশন ব্লক করা আছে। ইন-অ্যাপ ভিজ্যুয়াল অ্যালার্ট সক্রিয় থাকবে, তবে সিস্টেম পুশ পেতে ব্রাউজার লক আইকনে ক্লিক করে অনুমতি দিন।
                </p>
                {onShowDeniedExplanation && (
                  <button
                    type="button"
                    id="btn-view-denied-help"
                    onClick={onShowDeniedExplanation}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium self-start flex items-center gap-1 cursor-pointer"
                  >
                    <span>কীভাবে ব্রাউজারে অনুমতি চালু করবেন (সহায়তা নির্দেশিকা)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Master Alerts Enabled Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
            <div>
              <span className="font-semibold text-sm text-white block">ফ্লাইট অ্যালার্ট সিস্টেম</span>
              <span className="text-xs text-slate-400 block">
                রাডারে বিমান প্রবেশের রিয়েল-টাইম নোটিফিকেশন চালু/বন্ধ
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-master-alerts"
                type="checkbox"
                checked={settings.enabled}
                onChange={async (e) => {
                  const checked = e.target.checked;
                  onUpdateSettings({ ...settings, enabled: checked });
                  if (checked) {
                    if (permission === 'default') {
                      const res = await requestNotificationPermission();
                      setPermission(res);
                      if (res === 'denied' && onShowDeniedExplanation) {
                        onShowDeniedExplanation();
                      }
                    } else if (permission === 'denied' && onShowDeniedExplanation) {
                      onShowDeniedExplanation();
                    }
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Alert Filtering Mode: All Flights vs Watchlist Only */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>নোটিফিকেশন ফিল্টার মোড (Alert Filter Mode):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Mode 1: All Flights */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, alertMode: 'all_flights' })}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  settings.alertMode === 'all_flights'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-100">সকল ক্রুজিং বিমান</span>
                  </div>
                  {settings.alertMode === 'all_flights' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  উচ্চতা থ্রেশহোল্ড পূরণকারী যেকোনো বিমান রাডারে এলেই নোটিফিকেশন আসবে।
                </p>
              </button>

              {/* Mode 2: Watchlist Only (No overwhelming alerts) */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, alertMode: 'watchlist_only' })}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  settings.alertMode === 'watchlist_only'
                    ? 'bg-amber-600/20 border-amber-500 text-white ring-1 ring-amber-500/50'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">শুধুমাত্র নির্বাচিত বিমান</span>
                  </div>
                  {settings.alertMode === 'watchlist_only' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  ঘনঘন নোটিফিকেশন এড়াতে কেবল আপনার ট্র্যাক করা নির্দিষ্ট বিমানে অ্যালার্ট আসবে।
                </p>
              </button>
            </div>
          </div>

          {/* Altitude Threshold Selection (Applies when all_flights is selected) */}
          <div className={`space-y-2 transition-opacity ${settings.alertMode === 'watchlist_only' ? 'opacity-50' : 'opacity-100'}`}>
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>উচ্চতা থ্রেশহোল্ড (Minimum Altitude):</span>
              <span className="text-indigo-400 font-mono font-bold">
                ≥ {settings.minAltitudeFt.toLocaleString()} ft
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[28000, 30000, 35000].map((alt) => (
                <button
                  key={alt}
                  disabled={settings.alertMode === 'watchlist_only'}
                  onClick={() => onUpdateSettings({ ...settings, minAltitudeFt: alt })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer disabled:cursor-not-allowed ${
                    settings.minAltitudeFt === alt
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold">{(alt / 1000).toFixed(0)}k ft</span>
                  <span className="text-[10px] opacity-75">({Math.round(alt / 3.28084)}m)</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              সাধারণত ৩০,০০০ ফুটের ওপরের বিমানগুলো বাণিজ্যিক জেট ক্রুজিং রুটে থাকে।
            </p>
          </div>

          {/* Individual Aircraft Watchlist & Muted Sections */}
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>ব্যক্তিগত বিমান নোটিফিকেশন তালিকা ({watchlistCount}টি ট্র্যাকড)</span>
              </span>
              {watchlistCount > 0 && (
                <button
                  onClick={() => onUpdateSettings({ ...settings, watchlistIcaos: [] })}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>ক্লিয়ার করুন</span>
                </button>
              )}
            </div>

            {watchlistCount === 0 ? (
              <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                💡 <strong>টিপস:</strong> রাডার ম্যাপে যেকোনো বিমানে ক্লিক করলে যে কার্ডটি আসবে, সেখান থেকে <strong>"🔔 এই বিমানের অ্যালার্ট"</strong> বাটন চেপে মুহূর্তেই নির্দিষ্ট বিমান নোটিফিকেশনে যুক্ত বা মিউট করতে পারবেন।
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {settings.watchlistIcaos.map((icao) => (
                  <span
                    key={icao}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono"
                  >
                    <Plane className="w-3 h-3 text-amber-400" />
                    <span>{icao.toUpperCase()}</span>
                    <button
                      onClick={() => handleRemoveWatchlist(icao)}
                      className="hover:text-rose-400 cursor-pointer transition-colors p-0.5"
                      title="ওয়াচলিস্ট থেকে বাদ দিন"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Muted Flights Section */}
            {mutedCount > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <BellOff className="w-3 h-3 text-rose-400" />
                    <span>মিউট করা বিমান ({mutedCount}টি):</span>
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, mutedIcaos: [] })}
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    আনমিউট করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1">
                  {settings.mutedIcaos.map((icao) => (
                    <span
                      key={icao}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-mono"
                    >
                      <span>{icao.toUpperCase()}</span>
                      <button
                        onClick={() => handleRemoveMuted(icao)}
                        className="hover:text-white cursor-pointer p-0.5"
                        title="আনমিউট করুন"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="font-semibold text-xs text-white block">রাডার অডিও চাইম (Sound)</span>
                <span className="text-[10px] text-slate-400 block">নতুন বিমান এলে মৃদু সংকেত শব্দ</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'অন' : 'মিউট'}
            </button>
          </div>
        </div>

        {/* Footer with Test Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <button
            id="btn-send-test-notification"
            onClick={handleTest}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {testSent ? '✅ নোটিফিকেশন পাঠানো হয়েছে!' : 'পরীক্ষামূলক নোটিফিকেশন টেস্ট করুন (Test Alert)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
