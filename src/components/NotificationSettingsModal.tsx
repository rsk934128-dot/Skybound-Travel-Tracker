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
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSendTestNotification,
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
    }
  };

  const handleTest = () => {
    onSendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        id="notification-settings-modal"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ফ্লাইট নোটিফিকেশন সেটিংস</h3>
              <p className="text-xs text-slate-400">উচ্চ উচ্চতার বিমান রাডারে প্রবেশের অ্যালার্ট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Avionics Radar Telemetry Picture Banner */}
        <div className="relative w-full h-24 sm:h-28 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <img
            src="/images/flight-telemetry.jpg"
            alt="Avionics Telemetry Radar Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3">
            <span className="text-[11px] font-mono font-bold text-sky-300 flex items-center gap-1.5 drop-shadow">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              High-Altitude Cruising & Airspace Radar Monitoring
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
            <p className="text-[11px] text-amber-300/90 leading-relaxed pt-1">
              ⚠️ ব্রাউজার সেটিংসে নোটিফিকেশন ব্লক করা আছে। ইন-অ্যাপ ভিজ্যুয়াল অ্যালার্ট সক্রিয় থাকবে, তবে সিস্টেম পুশ পেতে ব্রাউজার লক আইকনে ক্লিক করে অনুমতি দিন।
            </p>
          )}
        </div>

        {/* Alerts Enabled Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
          <div>
            <span className="font-semibold text-sm text-white block">রিয়েল-টাইম অ্যালার্ট সক্রিয় করুন</span>
            <span className="text-xs text-slate-400 block">
              রাডার পরিধিতে উচ্চতার বিমান এলে তাৎক্ষণিক সতর্কবার্তা
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => onUpdateSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Altitude Threshold Selection */}
        <div className="space-y-2">
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
                onClick={() => onUpdateSettings({ ...settings, minAltitudeFt: alt })}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
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

        {/* Test Alert Button */}
        <div className="pt-2">
          <button
            id="btn-send-test-notification"
            onClick={handleTest}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
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
