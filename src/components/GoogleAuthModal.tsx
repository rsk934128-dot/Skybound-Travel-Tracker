import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, HardDrive, Sparkles, 
  AlertCircle, Lock, Cloud, ExternalLink 
} from 'lucide-react';
import { googleSignIn } from '../auth';
import { User } from 'firebase/auth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, accessToken: string) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onSuccess(result.user, result.accessToken);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err?.message?.includes('পপ-আপ')) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          err?.message || 'Google অথেন্টিকেশন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="relative w-full h-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 p-6 flex flex-col justify-end overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-2.5 shadow-lg flex items-center justify-center shrink-0 border border-slate-200">
              {/* Google 4-Color Icon */}
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> অফিসিয়াল গুগল অথেন্টিকেশন
              </span>
              <h3 className="text-lg font-bold text-white">Google অ্যাকাউন্টে লগইন</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            আপনার Google অ্যাকাউন্ট দিয়ে সাইন ইন করে Skybound ট্রাভেল ট্র্যাকারের সকল ক্লাউড ও সিকিউর ফিচার আনলক করুন:
          </p>

          {/* Benefits Grid */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Google Drive অটো ক্লাউড সিঙ্ক</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  মাথার ওপরের বিমানের লাইভ তথ্য ও প্রয়োজনীয় ভিসা রিকোয়ারমেন্টস চেকলিস্ট সরাসরি আপনার গুগল ড্রাইভে এক ক্লিকে সেভ করুন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">১০০% নিরাপদ ও সহজ</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  কোনো পাসওয়ার্ড মনে রাখার দরকার নেই। সরাসরি Google-এর সিকিউর OAuth 2.0 ও Firebase Auth ভেরিফিকেশন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">মাল্টি-ডিভাইস ট্রাভেল হিস্ট্রি</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  মোবাইল, ট্যাবলেট বা কম্পিউটার—যেকোনো ডিভাইসে লগইন করে আপনার সংরক্ষিত ফ্লাইট ফাইল অ্যাক্সেস করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">লগইন ত্রুটি</span>
                <span className="text-[11px] opacity-90">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Google Sign In CTA Button */}
          <div className="pt-2">
            <button
              id="btn-google-auth-login"
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                  <span>Google-এ সংযোগ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>Google দিয়ে সাইন ইন করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Footnote */}
          <div className="text-center pt-1 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400">
              লগইনের মাধ্যমে আপনি কেবল Skybound-এ আপনার ট্রাভেল ফাইল ও ভিসা গাইড ক্লাউডে সংরক্ষণ করার অনুমতি প্রদান করছেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
