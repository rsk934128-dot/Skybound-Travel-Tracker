import React, { useState, useEffect } from 'react';
import { listAppFilesFromDrive } from '../driveService';
import { HardDrive, RefreshCw, ExternalLink, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { User } from 'firebase/auth';

interface DriveSavedPanelProps {
  driveToken: string | null;
  user: User | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const DriveSavedPanel: React.FC<DriveSavedPanelProps> = ({
  driveToken,
  user,
  onSignInWithGoogle,
  onSignOut,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    if (!driveToken) return;
    setIsLoading(true);
    try {
      const driveFiles = await listAppFilesFromDrive(driveToken);
      setFiles(driveFiles);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (driveToken) {
      fetchFiles();
    }
  }, [driveToken]);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 p-4 lg:p-6 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Google Drive ট্রাভেল ফাইল ও চেকলিস্ট</span>
            </h2>
            <p className="text-xs text-slate-400">
              অ্যাপ থেকে সরাসরি আপনার গুগল ড্রাইভে সংরক্ষিত ভিসা গাইডলাইন ও ফ্লাইট বিবরণী।
            </p>
          </div>
        </div>

        {user && driveToken ? (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-white block">{user.displayName || user.email}</span>
              <span className="text-[11px] text-emerald-400">Google Drive সংযুক্ত</span>
            </div>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-indigo-500/40"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              onClick={onSignOut}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
            >
              সাইন আউট
            </button>
          </div>
        ) : (
          <div>
            {/* Standard Official GSI Material Style Sign-in Button as mandated */}
            <button
              onClick={onSignInWithGoogle}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs flex items-center gap-2.5 shadow-md transition-all cursor-pointer"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              <span>Google দিয়ে লগইন করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {!driveToken ? (
        <div className="max-w-md mx-auto my-auto text-center bg-slate-850/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          {/* Visual Flatlay Travel Picture Banner */}
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src="/images/travel-drive-banner.jpg"
              alt="Travel Documents and Passports Vault"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-emerald-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> সিকিউর ক্লাউড ট্রাভেল ভল্ট
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-base font-bold text-white mb-2">গুগল ড্রাইভ ট্রাভেল ডকুমেন্ট ব্যাকআপ</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              ভ্রমণের আগে আপনার প্রয়োজনীয় ভিসা রিকোয়ারমেন্টস, চেকলিস্ট ও ট্র্যাক করা ফ্লাইটের নথি সরাসরি আপনার Google Drive অ্যাকাউন্টে ক্লাউড ব্যাকআপ রাখতে গুগল দিয়ে সাইন ইন করুন।
            </p>

            <button
              onClick={onSignInWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              <span>Google অ্যাকাউন্টে কানেক্ট করুন</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Travel Documents Banner Strip */}
          <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <img
              src="/images/travel-drive-banner.jpg"
              alt="Travel Documents Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent flex flex-col justify-center p-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-1">
                Cloud Sync Active • Google Drive
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                আপনার ক্লাউড ট্রাভেল ডায়েরি ও পাসপোর্ট গাইড
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm mt-0.5">
                লাইভ রাডার ও ভিসা চেকলিস্ট থেকে সেভ করা সব ডকুমেন্টস নিরাপদে সংরক্ষিত।
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-medium">
              আপনার ড্রাইভে প্রাপ্ত নথি ({files.length} টি)
            </span>
            <button
              onClick={fetchFiles}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{file.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    তৈরি হয়েছে: {new Date(file.createdTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>ড্রাইভে খুলুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}

          {files.length === 0 && !isLoading && (
            <div className="p-8 text-center bg-slate-850/40 rounded-2xl border border-dashed border-slate-800">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">এখনও কোনো ফাইল ড্রাইভে সেভ করা হয়নি।</p>
              <p className="text-[11px] text-slate-500 mt-1">
                "লাইভ রাডার" বা "ভিসা এক্সপ্লোরার" ট্যাবে গিয়ে কোনো দেশের তথ্যের পাশে থাকা ড্রাইভ আইকনে ক্লিক করুন।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
