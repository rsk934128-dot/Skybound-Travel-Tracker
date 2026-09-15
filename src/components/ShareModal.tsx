import React, { useState } from 'react';
import { 
  X, Share2, Copy, Check, ExternalLink, Download, 
  Send, MessageCircle, Twitter, Facebook, Linkedin, 
  Mail, Sparkles, Image as ImageIcon, Plane
} from 'lucide-react';
import { FlightState } from '../types';
import { calculateFlightAnalytics, formatFlightTime } from '../flightAnalytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFlight?: FlightState | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  selectedFlight,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<'radar' | 'visa'>('radar');
  const [shareFlightContext, setShareFlightContext] = useState<boolean>(Boolean(selectedFlight));

  if (!isOpen) return null;

  // Canonical share URL
  const appBaseUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') || window.location.origin.includes('run.app') 
        ? window.location.origin 
        : 'https://ais-pre-5v6mmcr2hcxp6l55u6th5s-622126518866.asia-east1.run.app')
    : 'https://ais-pre-5v6mmcr2hcxp6l55u6th5s-622126518866.asia-east1.run.app';

  const shareUrl = appBaseUrl;

  const bannerImgSrc = selectedBanner === 'radar' 
    ? '/images/og-share-banner.jpg' 
    : '/images/og-visa-banner.jpg';

  // Construct sharing text
  let shareTitle = 'Skybound & Travel Tracker 🇧🇩 - লাইভ ফ্লাইট রাডার ও ভিসা গাইড';
  let shareText = 'মাথার ওপর দিয়ে উড়ে যাওয়া বিমান লাইভ ট্র্যাক করুন এবং গন্তব্যের বাংলাদেশী পাসপোর্ট ভিসা নিয়ম ও ট্রাভেল রিকোয়ারমেন্টস জানুন।';

  if (shareFlightContext && selectedFlight) {
    const flightName = selectedFlight.callsign || selectedFlight.airlineName || 'বিমান';
    const dest = selectedFlight.estimatedDestination?.city || 'আন্তর্জাতিক গন্তব্য';
    const analytics = calculateFlightAnalytics(selectedFlight);
    const etaStr = formatFlightTime(
      analytics.estimatedLandingTime,
      analytics.destinationAirport.timezoneOffsetHours
    );

    shareTitle = `🛫 Skybound-এ ট্র্যাক করছি: ${flightName} ➔ ${dest} (ETA: ${etaStr})`;
    shareText = `আমি লাইভ রাডারে ${flightName} বিমানটি ট্র্যাক করছি! গন্তব্য: ${dest}, আনুমানিক অবতরণ (ETA): ${etaStr} [${analytics.delayStatusLabelBn}]। আপনার মাথার ওপর দিয়ে এখন কোন বিমান উড়ছে দেখতে ক্লিক করুন:`;
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

  // Social Links
  const socialPlatforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-400 text-white',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.debug('Native share dismissed or aborted:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Subtle Glow Accents */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>সোশ্যাল মিডিয়ায় শেয়ার করুন</span>
              <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-normal">
                পিকচার প্রিভিউ সহ 🖼️
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              শেয়ার লিংকের সাথে আকর্ষনীয় ব্যানার ছবি ও বিবরণ যুক্ত থাকবে
            </p>
          </div>
        </div>

        {/* Dynamic Flight Toggle (if active flight exists) */}
        {selectedFlight && (
          <div className="mb-4 p-2.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Plane className="w-4 h-4 text-indigo-400" />
              <span>
                বর্তমানে নির্বাচিত বিমান: <strong>{selectedFlight.callsign}</strong> ({selectedFlight.estimatedDestination?.city || 'আন্তর্জাতিক'})
              </span>
            </div>
            <button
              onClick={() => setShareFlightContext(!shareFlightContext)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-colors ${
                shareFlightContext 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {shareFlightContext ? '✓ বিমানের বিবরণ সহ' : 'শুধু সাধারণ অ্যাপ'}
            </button>
          </div>
        )}

        {/* Rich Link Preview Card (What people will see on WhatsApp, Facebook, X) */}
        <div className="mb-4 bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg group">
          {/* Banner Selector Pills */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800/80 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> প্রিভিউ ব্যানার সিলেক্ট করুন:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedBanner('radar')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                  selectedBanner === 'radar' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                রাডার ভিউ
              </button>
              <button
                onClick={() => setSelectedBanner('visa')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                  selectedBanner === 'visa' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                ভিসা গাইড
              </button>
            </div>
          </div>

          {/* Card Image */}
          <div className="relative aspect-[1200/630] w-full overflow-hidden bg-slate-900">
            <img
              src={bannerImgSrc}
              alt="Social Share Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2.5 right-2.5">
              <a
                href={bannerImgSrc}
                download="skybound-share-banner.jpg"
                className="inline-flex items-center gap-1 text-[10px] bg-black/70 hover:bg-black/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl border border-white/20 shadow transition-colors"
                title="ব্যানার ছবিটি গ্যালারিতে ডাউনলোড করুন"
              >
                <Download className="w-3 h-3" />
                <span>ছবি ডাউনলোড</span>
              </a>
            </div>
            <div className="absolute bottom-2 left-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-indigo-300 text-[10px] px-2 py-0.5 rounded-md font-mono">
              1200 × 630 HD OpenGraph Card
            </div>
          </div>

          {/* Card Meta Content */}
          <div className="p-3 bg-slate-900/60">
            <p className="text-[11px] text-indigo-400 font-mono uppercase tracking-wider mb-1">
              {new URL(shareUrl).hostname}
            </p>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 mb-1">
              {shareTitle}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {shareText}
            </p>
          </div>
        </div>

        {/* Mobile Native Share Button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            id="btn-native-media-share"
            onClick={handleNativeShare}
            className="w-full mb-4 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            <span>মোবাইলের যেকোনো অ্যাপে শেয়ার করুন (Messenger, Imo, Instagram)</span>
          </button>
        )}

        {/* Social Sharing 1-Click Platform Grid */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            সোশ্যাল মিডিয়া অপশনসমূহ:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.id}
                  id={`share-btn-${platform.id}`}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl ${platform.color} transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm`}
                  title={`${platform.name}-এ শেয়ার করুন`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold tracking-tight">
                    {platform.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-slate-300 font-mono outline-none px-1 overflow-hidden text-ellipsis select-all"
          />
          <button
            id="btn-copy-share-link"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>লিংক কপি</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
