import React from 'react';
import { 
  Bell, 
  BellOff, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Lock, 
  RefreshCw, 
  Volume2, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  mode: 'prompt' | 'denied';
  onClose: () => void;
  onRequestPermission: () => Promise<void>;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  mode,
  onClose,
  onRequestPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="notification-permission-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
    >
      <div 
        id={mode === 'prompt' ? 'notification-permission-prompt-modal' : 'notification-denied-explanation-modal'}
        className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-4 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              mode === 'prompt'
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 ring-2 ring-indigo-500/20'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 ring-2 ring-rose-500/20'
            }`}>
              {mode === 'prompt' ? (
                <Bell className="w-5 h-5 animate-pulse" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {mode === 'prompt' 
                  ? 'ব্রাউজার নোটিফিকেশন সক্রিয় করুন' 
                  : 'নোটিফিকেশন অনুমতি সংক্রান্ত তথ্য'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'prompt'
                  ? 'উচ্চ উচ্চতার বিমান রাডারে প্রবেশের রিয়েল-টাইম সতর্কবার্তা'
                  : 'ব্রাউজারে নোটিফিকেশন সাময়িকভাবে ব্লক রয়েছে'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-permission-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on mode */}
        {mode === 'prompt' ? (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>ফ্লাইট রাডার অ্যালার্ট সক্রিয় রয়েছে</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                আপনার আকাশসীমায় নির্ধারিত উচ্চতা (যেমন: ৩০,০০০+ ফুট) বা আপনার ওয়াচলিস্টের বিমান প্রবেশের সাথে সাথে আপনার ডিভাইসে পুশ নোটিফিকেশন পৌঁছে যাবে—এমনকি আপনি অন্য ট্যাবে থাকলেও।
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>মাথার ওপর দিয়ে যাওয়া বড় যাত্রীবাহী জেটের তাৎক্ষণিক অ্যালার্ট</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ব্যাকগ্রাউন্ড বা অন্য ট্যাবে থাকলেও দ্রুত অবহিত হওয়া</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>যেকোনো সময় সেটিংস থেকে অ্যালার্ট ফিল্টার বা বন্ধ করার সুবিধা</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                id="btn-confirm-allow-notifications"
                onClick={onRequestPermission}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 active:scale-98"
              >
                <Bell className="w-4 h-4" />
                <span>নোটিফিকেশন অনুমোদন দিন (Allow)</span>
              </button>
              <button
                id="btn-dismiss-notification-prompt"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer text-center"
              >
                পরে করব
              </button>
            </div>
          </div>
        ) : (
          /* Friendly Denied Explanation Mode */
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ব্রাউজার অনুমতি স্থগিত রয়েছে (Permission Denied)</span>
              </div>
              ব্রাউজার সেটিংসে নোটিফিকেশন পারমিশন বন্ধ থাকায় সিস্টেম পুশ নোটিফিকেশন পাঠানো যাচ্ছে না। তবে চিন্তার কোনো কারণ নেই, আপনি খুব সহজেই এটি চালু করতে পারেন।
            </div>

            {/* In-app fallback assurance */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>অ্যাপের ইন-স্ক্রিন অ্যালার্ট এখনো সচল রয়েছে:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                অ্যাপ খোলা থাকা অবস্থায় রাডার স্ক্রিনে ভিজ্যুয়াল ব্যানার এবং অডিও চাইম স্বাভাবিকভাবেই কাজ করবে। কেবল ব্রাউজারের বাইরে সিস্টেম পুশ অ্যালার্ট পেতে নিচের ধাপগুলো অনুসরণ করুন।
              </p>
            </div>

            {/* Step by step guide to unblock */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-white block">
                যেভাবে ব্রাউজারে নোটিফিকেশন অন করবেন (২টি সহজ ধাপ):
              </span>
              
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-slate-700">
                    ১
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">লক আইকনে ক্লিক করুন:</span>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      ব্রাউজারের অ্যাড্রেস বারের বাম পাশে থাকা তালা আইকন (<Lock className="w-3 h-3 inline text-slate-300" />) অথবা সাইট সেটিংস চিহ্নে ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-slate-700">
                    ২
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">"Notifications" অনুমতি দিন:</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <strong>Notifications</strong> অপশনে গিয়ে <strong>"Allow"</strong> নির্বাচন করুন এবং পেজটি রিফ্রেশ করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                id="btn-refresh-after-permission"
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>অনুমতি দেওয়ার পর পেজ রিলোড করুন</span>
              </button>
              <button
                id="btn-dismiss-denied-explanation"
                onClick={onClose}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
