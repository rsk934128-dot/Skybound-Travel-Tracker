import React, { useState, useEffect } from 'react';
import { FlightRadar } from './components/FlightRadar';
import { VisaExplorer } from './components/VisaExplorer';
import { FlightDetailCard } from './components/FlightDetailCard';
import { DriveSavedPanel } from './components/DriveSavedPanel';
import { PWAInstallModal } from './components/PWAInstallModal';
import { ShareModal } from './components/ShareModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserProfileMenu } from './components/UserProfileMenu';
import { usePWAInstall } from './hooks/usePWAInstall';
import { fetchLiveOverheadFlights } from './flightService';
import { FlightState, DestinationVisaInfo, UserLocation } from './types';
import { initAuth, googleSignIn, logoutGoogle } from './auth';
import { User } from 'firebase/auth';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  toggleWatchlistFlight,
  toggleMuteFlight,
  NotificationSettings,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from './notificationService';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { TravelExpenseCalculator } from './components/TravelExpenseCalculator';
import { AirportHubGuide } from './components/AirportHubGuide';
import { WeatherConditions, getDhakaTerminalWeatherFallback } from './weatherService';
import { 
  Radar, Globe2, HardDrive, Plane, Search, MapPin, 
  HelpCircle, Sparkles, AlertTriangle, ShieldCheck,
  Download, Smartphone, Share2, CheckCircle2, Coins, Building2
} from 'lucide-react';

export default function App() {
  // Navigation tabs: 'radar' | 'visa' | 'expenses' | 'airport' | 'drive'
  const [activeTab, setActiveTab] = useState<'radar' | 'visa' | 'expenses' | 'airport' | 'drive'>('radar');
  const [selectedExpenseCountryCode, setSelectedExpenseCountryCode] = useState<string>('TH');
  const [selectedAirportIata, setSelectedAirportIata] = useState<string>('DAC');
  const [weatherData, setWeatherData] = useState<WeatherConditions | null>(() => getDhakaTerminalWeatherFallback());

  // Flight notification & alert settings
  const [alertSettings, setAlertSettings] = useState<NotificationSettings>(loadNotificationSettings);

  // Browser Notification Permission state & prompt modal
  const [browserNotifPermission, setBrowserNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionModalMode, setPermissionModalMode] = useState<'prompt' | 'denied'>('prompt');

  // Check and prompt permission whenever alert features are toggled
  const promptOrCheckPermission = async () => {
    if (!isNotificationSupported()) return;
    const currentPerm = getNotificationPermission();
    setBrowserNotifPermission(currentPerm);

    if (currentPerm === 'default') {
      try {
        const res = await requestNotificationPermission();
        setBrowserNotifPermission(res);
        if (res === 'denied') {
          setPermissionModalMode('denied');
          setIsPermissionModalOpen(true);
        } else if (res === 'granted') {
          showNotice('success', '🔔 ব্রাউজার নোটিফিকেশন সফলভাবে চালু করা হয়েছে!');
        }
      } catch {
        setPermissionModalMode('prompt');
        setIsPermissionModalOpen(true);
      }
    } else if (currentPerm === 'denied') {
      setPermissionModalMode('denied');
      setIsPermissionModalOpen(true);
    }
  };

  const handleUpdateAlertSettings = async (newSettings: NotificationSettings) => {
    const wasDisabled = !alertSettings.enabled;
    setAlertSettings(newSettings);
    saveNotificationSettings(newSettings);

    // If enabling alert features, prompt for browser permission
    if (newSettings.enabled && wasDisabled) {
      promptOrCheckPermission();
    }
  };

  const handleToggleWatchlist = (icao24: string) => {
    const isAdding = !(alertSettings.watchlistIcaos || []).some(
      (id) => id.toLowerCase() === icao24.toLowerCase()
    );
    const updated = toggleWatchlistFlight(alertSettings, icao24);
    setAlertSettings(updated);

    if (isAdding) {
      promptOrCheckPermission();
    }
  };

  const handleToggleMute = (icao24: string) => {
    const updated = toggleMuteFlight(alertSettings, icao24);
    setAlertSettings(updated);
  };

  const handleModalRequestPermission = async () => {
    try {
      const res = await requestNotificationPermission();
      setBrowserNotifPermission(res);
      if (res === 'granted') {
        setIsPermissionModalOpen(false);
        showNotice('success', '🔔 ব্রাউজার নোটিফিকেশন সফলভাবে অনুমোদিত হয়েছে!');
      } else if (res === 'denied') {
        setPermissionModalMode('denied');
      } else {
        setIsPermissionModalOpen(false);
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      setIsPermissionModalOpen(false);
    }
  };

  const handleClosePermissionModal = () => {
    if (permissionModalMode === 'prompt') {
      sessionStorage.setItem('skybound_notif_prompt_dismissed', 'true');
    } else {
      sessionStorage.setItem('skybound_notif_denied_dismissed', 'true');
    }
    setIsPermissionModalOpen(false);
  };

  // PWA Install & Modal state
  const { canInstall, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // User location (defaults to Dhaka Hazrat Shahjalal Int'l Airport vicinity)
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: 23.8430,
    longitude: 90.3980,
    city: 'Dhaka',
    country: 'Bangladesh',
  });

  const [radarRadiusKm, setRadarRadiusKm] = useState<number>(80);
  const [flights, setFlights] = useState<FlightState[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightState | null>(null);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [isLiveOpenSky, setIsLiveOpenSky] = useState(false);
  const [searchFlightInput, setSearchFlightInput] = useState('');

  // Auth & Google Drive
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);

  // Load flights helper
  const loadOverheadFlights = async (lat: number, lon: number, radius: number) => {
    setIsLoadingFlights(true);
    try {
      const result = await fetchLiveOverheadFlights(lat, lon, radius);
      setFlights(result.flights);
      setIsLiveOpenSky(result.isLiveOpenSky);

      // Auto-select first active flight if none selected
      if (!selectedFlight && result.flights.length > 0) {
        setSelectedFlight(result.flights[0]);
      }
    } catch (err) {
      console.error('Failed to load overhead flights:', err);
    } finally {
      setIsLoadingFlights(false);
    }
  };

  // On initial mount: acquire user GPS if allowed, initialize auth & flight feed
  useEffect(() => {
    // 1. Listen for Firebase Google Auth
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setDriveAccessToken(token);
      },
      () => {
        // Not signed in
      }
    );

    // 2. Request user GPS
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({
            latitude: lat,
            longitude: lon,
            city: 'My Location',
            country: 'Bangladesh',
          });
          loadOverheadFlights(lat, lon, radarRadiusKm);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using default Dhaka coordinates:', err);
          loadOverheadFlights(23.8430, 90.3980, radarRadiusKm);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      loadOverheadFlights(23.8430, 90.3980, radarRadiusKm);
    }

    // 3. Notification permission check on app initialization:
    // If any alert features are enabled, prompt user if permission is 'default',
    // or provide friendly explanation if permission is 'denied'.
    if (isNotificationSupported()) {
      const currentPerm = getNotificationPermission();
      setBrowserNotifPermission(currentPerm);

      const hasAlertFeatures =
        alertSettings.enabled ||
        (alertSettings.watchlistIcaos && alertSettings.watchlistIcaos.length > 0);

      if (hasAlertFeatures) {
        if (currentPerm === 'default') {
          const dismissed = sessionStorage.getItem('skybound_notif_prompt_dismissed');
          if (!dismissed) {
            setPermissionModalMode('prompt');
            setIsPermissionModalOpen(true);
          }
        } else if (currentPerm === 'denied') {
          const dismissed = sessionStorage.getItem('skybound_notif_denied_dismissed');
          if (!dismissed) {
            setPermissionModalMode('denied');
            setIsPermissionModalOpen(true);
          }
        }
      }
    }

    return () => unsubscribe();
  }, []);

  // Periodic real-time radar refresh (every 18 seconds) for continuous live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      loadOverheadFlights(userLocation.latitude, userLocation.longitude, radarRadiusKm);
    }, 18000);
    return () => clearInterval(interval);
  }, [userLocation.latitude, userLocation.longitude, radarRadiusKm]);

  const showNotice = (type: 'success' | 'info', message: string) => {
    setAuthNotice({ type, message });
    setTimeout(() => {
      setAuthNotice((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setDriveAccessToken(token);
    showNotice('success', `Google অ্যাকাউন্টে সফলভাবে লগইন হয়েছে! স্বাগতম, ${user.displayName || 'User'}`);
  };

  const handleSignInGoogle = async () => {
    try {
      const authRes = await googleSignIn();
      if (!authRes) return; // User closed or dismissed the popup
      handleAuthSuccess(authRes.user, authRes.accessToken);
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        alert(`গুগল সাইন ইন সম্পন্ন হয়নি: ${err.message || err}`);
      }
    }
  };

  const handleSignOutGoogle = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setDriveAccessToken(null);
    showNotice('info', 'Google অ্যাকাউন্ট থেকে সফলভাবে লগআউট করা হয়েছে।');
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadarRadiusKm(newRadius);
    loadOverheadFlights(userLocation.latitude, userLocation.longitude, newRadius);
  };

  // Search filter
  const handleFlightSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchFlightInput.trim()) return;
    const q = searchFlightInput.trim().toUpperCase();
    const found = flights.find(
      (f) =>
        f.callsign.toUpperCase().includes(q) ||
        f.icao24.toUpperCase().includes(q) ||
        f.airlineName?.toUpperCase().includes(q) ||
        f.estimatedDestination?.city.toUpperCase().includes(q)
    );

    if (found) {
      setSelectedFlight(found);
      setActiveTab('radar');
    } else {
      alert(`বিমান "${searchFlightInput}" রাডার পরিসীমার মধ্যে পাওয়া যায়নি।`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Main Navigation Bar */}
      <header className="h-16 px-4 lg:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 z-30 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="group relative flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform cursor-pointer"
            title="Skybound অ্যাপ লোগো - ডিভাইসে ইন্সটল করতে ক্লিক করুন"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-indigo-400/40">
              <img
                src="/icon.svg"
                alt="Skybound Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pwa-192x192.png';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Skybound</span>
                <span className="text-indigo-400 font-light">&</span>
                <span>Travel Tracker</span>
              </h1>
              <span className="hidden sm:inline-flex text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-medium">
                Live ADSB & Visa 🇧🇩
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              মাথার ওপর দিয়ে উড়ে যাওয়া বিমান ট্র্যাকিং এবং গন্তব্যের কালার-কোডেড ভিসা গাইড
            </p>
          </div>
        </div>

        {/* Search Bar for Flight / Destination */}
        <form
          onSubmit={handleFlightSearchSubmit}
          className="hidden md:flex items-center relative max-w-xs w-full"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ফ্লাইট নম্বর খুঁজুন (যেমন: BG-047, Biman)..."
            value={searchFlightInput}
            onChange={(e) => setSearchFlightInput(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </form>

        {/* Tab Selector, PWA Install, Social Share & Google Auth */}
        <div className="flex items-center gap-2">
          {/* Social Share Button with Picture Preview */}
          <button
            id="btn-open-share-modal"
            onClick={() => setIsShareModalOpen(true)}
            className="hidden sm:flex px-2.5 py-1.5 rounded-2xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 hover:text-white text-xs font-semibold items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="সোশ্যাল মিডিয়ায় অ্যাপ ও ফ্লাইট শেয়ার করুন (পিকচার সহ)"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">শেয়ার</span>
          </button>

          {/* PWA Install Button for Mobile & Desktop */}
          <button
            id="btn-open-install-modal"
            onClick={() => setIsInstallModalOpen(true)}
            className={`hidden md:flex px-2.5 py-1.5 rounded-2xl border text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer ${
              isInstalled
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-gradient-to-r from-indigo-600/90 to-sky-600/90 hover:from-indigo-600 hover:to-sky-500 text-white border-indigo-400/30 shadow-md shadow-indigo-900/30 active:scale-95'
            }`}
            title={isInstalled ? 'অ্যাপটি ইনস্টল করা হয়েছে' : 'মোবাইল বা কম্পিউটারে অ্যাপ ইনস্টল করুন'}
          >
            {isInstalled ? (
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5 animate-bounce" />
            )}
            <span className="hidden lg:inline">
              {isInstalled ? 'ইনস্টলড' : 'অ্যাপ ইনস্টল'}
            </span>
          </button>

          <nav className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/70 text-xs">
            <button
              id="nav-tab-radar"
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'radar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span className="hidden sm:inline">লাইভ রাডার</span>
            </button>

            <button
              id="nav-tab-visa"
              onClick={() => setActiveTab('visa')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'visa'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span className="hidden sm:inline">ভিসা এক্সপ্লোরার</span>
            </button>

            <button
              id="nav-tab-expenses"
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'expenses'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">বাজেট ও মুদ্রা</span>
            </button>

            <button
              id="nav-tab-airport"
              onClick={() => setActiveTab('airport')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'airport'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">এয়ারপোর্ট হাব</span>
            </button>

            <button
              id="nav-tab-drive"
              onClick={() => setActiveTab('drive')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'drive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span className="hidden sm:inline">Google Drive</span>
              {driveAccessToken && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>
          </nav>

          {/* Google Auth Login & User Profile Dropdown */}
          <UserProfileMenu
            user={currentUser}
            driveToken={driveAccessToken}
            onOpenAuthModal={() => setIsGoogleAuthModalOpen(true)}
            onSignOut={handleSignOutGoogle}
            onNavigateToDrive={() => setActiveTab('drive')}
          />
        </div>
      </header>

      {/* Floating Auth Notification Toast */}
      {authNotice && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-300 pointer-events-none">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
            authNotice.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
              : 'bg-slate-900/95 border-slate-700 text-slate-200'
          }`}>
            <CheckCircle2 className={`w-5 h-5 ${authNotice.type === 'success' ? 'text-emerald-400' : 'text-sky-400'} shrink-0`} />
            <span className="text-xs font-semibold">{authNotice.message}</span>
          </div>
        </div>
      )}

      {/* Main Viewport Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
        {activeTab === 'radar' && (
          <div className="relative w-full h-full">
            <FlightRadar
              flights={flights}
              userLocation={userLocation}
              selectedFlight={selectedFlight}
              onSelectFlight={(flight) => setSelectedFlight(flight)}
              isLoading={isLoadingFlights}
              onRefresh={() => loadOverheadFlights(userLocation.latitude, userLocation.longitude, radarRadiusKm)}
              isLiveOpenSky={isLiveOpenSky}
              radarRadiusKm={radarRadiusKm}
              onChangeRadius={handleRadiusChange}
              alertSettings={alertSettings}
              onUpdateAlertSettings={handleUpdateAlertSettings}
              browserNotifPermission={browserNotifPermission}
              onCheckAndPromptPermission={promptOrCheckPermission}
              onShowDeniedExplanation={() => {
                setPermissionModalMode('denied');
                setIsPermissionModalOpen(true);
              }}
              onWeatherLoaded={(wx) => setWeatherData(wx)}
            />

            {/* Bottom Slide-up Flight Detail Card */}
            {selectedFlight && (
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 pointer-events-none z-30 flex justify-center">
                <div className="pointer-events-auto w-full max-w-xl">
                  <FlightDetailCard
                    flight={selectedFlight}
                    weatherData={weatherData}
                    onClose={() => setSelectedFlight(null)}
                    onOpenFullVisaGuide={(visa) => {
                      setActiveTab('visa');
                    }}
                    onOpenExpenseCalculator={(code) => {
                      setSelectedExpenseCountryCode(code);
                      setActiveTab('expenses');
                    }}
                    onOpenAirportGuide={(iata) => {
                      setSelectedAirportIata(iata);
                      setActiveTab('airport');
                    }}
                    driveToken={driveAccessToken}
                    onNeedGoogleSignIn={() => setIsGoogleAuthModalOpen(true)}
                    onShare={() => setIsShareModalOpen(true)}
                    isMonitored={(alertSettings.watchlistIcaos || []).some(
                      (id) => id.toLowerCase() === selectedFlight.icao24.toLowerCase()
                    )}
                    isMuted={(alertSettings.mutedIcaos || []).some(
                      (id) => id.toLowerCase() === selectedFlight.icao24.toLowerCase()
                    )}
                    onToggleMonitor={handleToggleWatchlist}
                    onToggleMute={handleToggleMute}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'visa' && (
          <VisaExplorer
            onSelectCountry={(visa) => {
              // Switch to radar and filter/highlight flight with that country
              const match = flights.find(
                (f) => f.estimatedDestination?.countryCode === visa.countryCode
              );
              if (match) {
                setSelectedFlight(match);
              }
              setActiveTab('radar');
            }}
            driveToken={driveAccessToken}
            onNeedGoogleSignIn={() => setIsGoogleAuthModalOpen(true)}
            onShareCountry={(visa) => setIsShareModalOpen(true)}
            onOpenExpenseCalculator={(code) => {
              setSelectedExpenseCountryCode(code);
              setActiveTab('expenses');
            }}
          />
        )}

        {activeTab === 'expenses' && (
          <TravelExpenseCalculator
            initialCountryCode={selectedExpenseCountryCode}
            driveToken={driveAccessToken}
            onNeedGoogleSignIn={() => setIsGoogleAuthModalOpen(true)}
            onNavigateToVisa={(code) => {
              setActiveTab('visa');
            }}
          />
        )}

        {activeTab === 'airport' && (
          <AirportHubGuide
            initialAirportIata={selectedAirportIata}
            driveToken={driveAccessToken}
            onNeedGoogleSignIn={() => setIsGoogleAuthModalOpen(true)}
            onNavigateToFlights={(iata) => {
              setActiveTab('radar');
            }}
          />
        )}

        {activeTab === 'drive' && (
          <DriveSavedPanel
            driveToken={driveAccessToken}
            user={currentUser}
            onSignInWithGoogle={() => setIsGoogleAuthModalOpen(true)}
            onSignOut={handleSignOutGoogle}
          />
        )}
      </main>

      {/* Mobile Bottom Quick Bar if card is not open */}
      <div className="sm:hidden flex items-center justify-around py-2 px-1 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'radar' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <Radar className="w-4 h-4" />
          <span>রাডার</span>
        </button>
        <button
          onClick={() => setActiveTab('visa')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'visa' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <Globe2 className="w-4 h-4" />
          <span>ভিসা</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'expenses' ? 'text-amber-400 font-bold' : ''}`}
        >
          <Coins className="w-4 h-4" />
          <span>বাজেট</span>
        </button>
        <button
          onClick={() => setActiveTab('airport')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'airport' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <Building2 className="w-4 h-4" />
          <span>এয়ারপোর্ট</span>
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'drive' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <HardDrive className="w-4 h-4" />
          <span>ড্রাইভ</span>
        </button>
        <button
          id="btn-mobile-share-app"
          onClick={() => setIsShareModalOpen(true)}
          className="flex flex-col items-center gap-1 text-sky-400 font-medium cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>শেয়ার</span>
        </button>
        <button
          id="btn-mobile-install-app"
          onClick={() => setIsInstallModalOpen(true)}
          className={`flex flex-col items-center gap-1 ${isInstalled ? 'text-emerald-400' : 'text-indigo-400 font-medium'}`}
        >
          <Download className="w-4 h-4" />
          <span>{isInstalled ? 'ইনস্টলড' : 'ইন্সটল'}</span>
        </button>
      </div>

      {/* Social Media Share Modal with Picture Cards */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedFlight={selectedFlight}
      />

      {/* PWA Install Guide & App Icon Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={triggerInstall}
        isIOS={isIOS}
        canDirectInstall={canInstall}
        isInstalled={isInstalled}
      />

      {/* Google Authentication Login Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Browser Notification Permission & Friendly Denied Explanation Modal */}
      <NotificationPermissionModal
        isOpen={isPermissionModalOpen}
        mode={permissionModalMode}
        onClose={handleClosePermissionModal}
        onRequestPermission={handleModalRequestPermission}
      />
    </div>
  );
}
