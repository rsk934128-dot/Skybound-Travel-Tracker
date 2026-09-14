import React from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare, ArrowDown } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isIOS: boolean;
  canDirectInstall: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  canDirectInstall,
  isInstalled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/70 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Logo Display & Identity */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="relative group mb-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/60 shadow-xl shadow-indigo-950/60 ring-4 ring-indigo-500/20 bg-slate-950 flex items-center justify-center">
              <img
                src="/pwa-192x192.png"
                alt="Skybound App Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to SVG if PNG is not ready
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-900 shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>Skybound</span>
            <span className="text-indigo-400 font-light">&</span>
            <span>Travel Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            মোবাইল বা কম্পিউটারের হোমস্ক্রিনে অ্যাপটি ইন্সটল করুন এবং যেকোনো সময় এক ট্যাপে সরাসরি চালু করুন।
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>মোবাইল হোমস্ক্রিনে <strong>অফিসিয়াল অ্যাপ লোগো</strong> ও আইকন প্রদর্শিত হবে</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>ব্রাউজার ফ্রেম ছাড়া পূর্ণাঙ্গ <strong>Standalone অ্যাপ</strong> ইন্টারফেস</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>দ্রুততম লোডিং ও অফলাইন <strong>ক্যাশিং প্রযুক্তি (PWA)</strong></span>
          </div>
        </div>

        {/* Installation Actions */}
        {isInstalled ? (
          <div className="text-center py-2">
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm bg-emerald-950/40 border border-emerald-800/60 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> অ্যাপটি ইতোমধ্যে সফলভাবে ইন্সটল করা রয়েছে!
            </span>
          </div>
        ) : isIOS ? (
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-xs text-slate-300">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5 mb-2">
              <Share className="w-4 h-4" /> iPhone বা iPad এ ইনস্টল করার নিয়ম:
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>
                সাফারি ব্রাউজারের নিচে <strong>Share</strong> (<Share className="w-3.5 h-3.5 inline text-sky-400" />) বাটনে ট্যাপ করুন।
              </li>
              <li>
                মেনু থেকে <strong>Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-indigo-400" />) অপশনটি বেছে নিন।
              </li>
              <li>উপরে ডানে <strong>Add</strong> চাপলেই হোমস্ক্রিনে লোগোটি তৈরি হয়ে যাবে!</li>
            </ol>
            <div className="flex justify-center mt-3 text-slate-500">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        ) : canDirectInstall ? (
          <button
            id="btn-confirm-pwa-install"
            onClick={async () => {
              const installed = await onInstall();
              if (installed) {
                onClose();
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>এখনই মোবাইলে ইনস্টল করুন</span>
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-3">
              আপনার ব্রাউজার মেনু (⋮) ওপেন করে <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> সিলেক্ট করুন।
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              ঠিক আছে
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
