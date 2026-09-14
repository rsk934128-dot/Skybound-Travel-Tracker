import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  LogOut, HardDrive, CheckCircle2, ShieldCheck, 
  ChevronDown, ExternalLink, Sparkles, User as UserIcon 
} from 'lucide-react';

interface UserProfileMenuProps {
  user: User | null;
  driveToken: string | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onNavigateToDrive: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  driveToken,
  onOpenAuthModal,
  onSignOut,
  onNavigateToDrive,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <button
        id="btn-header-google-login"
        onClick={onOpenAuthModal}
        className="px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer border border-slate-200"
        title="Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন"
      >
        {/* Google 4-Color Icon */}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        <span>Google লগইন</span>
      </button>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'ব্যবহারকারী';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-user-profile-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 transition-all cursor-pointer shadow-sm active:scale-95"
        title={`${displayName} (${user.email})`}
      >
        <div className="relative w-7 h-7 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-sky-500 border border-indigo-400/50 flex items-center justify-center shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1 ring-slate-900" />
        </div>

        <div className="text-left hidden md:block max-w-[100px] truncate">
          <span className="text-xs font-semibold text-slate-100 block truncate leading-tight">
            {firstName}
          </span>
          <span className="text-[10px] text-emerald-400 block font-mono leading-none">
            অনলাইন
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Header */}
          <div className="p-4 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-indigo-600 border border-indigo-400/60 shadow-md shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate block">
                    {displayName}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" title="গুগল ভেরিফায়েড অ্যাকাউন্ট" />
                </div>
                <span className="text-[11px] text-slate-400 truncate block">
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-600/30 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Google অথেন্টিকেশন সক্রিয়
                </span>
              </div>
            </div>
          </div>

          {/* Service Integration Status */}
          <div className="p-3 bg-slate-950/50 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                Google Drive ক্লাউড সিঙ্ক:
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                driveToken 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {driveToken ? 'কানেক্টেড' : 'অনুমোদন প্রয়োজন'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                onNavigateToDrive();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span>আমার Google Drive ফাইলসমূহ</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              id="btn-user-signout"
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-2.5 cursor-pointer mt-1"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট / সাইন আউট করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
