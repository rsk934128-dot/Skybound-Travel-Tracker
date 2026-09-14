import React, { useEffect, useRef, useState } from 'react';
import { FlightState, UserLocation } from '../types';
import { Plane, Compass, Navigation, Eye, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Layers, Bell, BellRing } from 'lucide-react';
import { MapLegend } from './MapLegend';
import { BANGLADESH_PASSPORT_VISA_DB } from '../visaData';
import { HighAltitudeAlertBanner, AlertBannerItem } from './HighAltitudeAlertBanner';
import { NotificationSettingsModal } from './NotificationSettingsModal';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  NotificationSettings,
  calculateDistanceKm,
  playRadarAlertChime,
  triggerBrowserFlightNotification,
} from '../notificationService';

interface FlightRadarProps {
  flights: FlightState[];
  userLocation: UserLocation;
  selectedFlight: FlightState | null;
  onSelectFlight: (flight: FlightState) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isLiveOpenSky: boolean;
  radarRadiusKm: number;
  onChangeRadius: (km: number) => void;
}

export const FlightRadar: React.FC<FlightRadarProps> = ({
  flights,
  userLocation,
  selectedFlight,
  onSelectFlight,
  isLoading,
  onRefresh,
  isLiveOpenSky,
  radarRadiusKm,
  onChangeRadius,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFlightPaths, setShowFlightPaths] = useState(true);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Notification API & High-Altitude Alert state
  const [alertSettings, setAlertSettings] = useState<NotificationSettings>(loadNotificationSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertBannerItem[]>([]);
  const prevFlightIdsRef = useRef<Set<string>>(new Set());
  const isFirstCheckRef = useRef<boolean>(true);

  // Radar sweep animation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRadarSweepAngle((prev) => (prev + 1.2) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Real-time detection: Alert when high-altitude flight enters predefined radius
  useEffect(() => {
    if (!flights || flights.length === 0) return;

    const currentInRadiusIds = new Set<string>();
    const newHighAltEnteringFlights: FlightState[] = [];

    flights.forEach((flight) => {
      if (flight.latitude === null || flight.longitude === null) return;

      const distKm = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        flight.latitude,
        flight.longitude
      );

      // Check if flight is inside the user's predefined radar radius
      if (distKm <= radarRadiusKm) {
        currentInRadiusIds.add(flight.icao24);

        const altitudeMeters = flight.baroAltitude || flight.geoAltitude || 0;
        const altitudeFt = Math.round(altitudeMeters * 3.28084);

        // High-altitude check (e.g. >= 30,000 ft)
        if (altitudeFt >= alertSettings.minAltitudeFt) {
          // Check if this flight just entered the predefined radius (was NOT in previous radar check)
          if (!isFirstCheckRef.current && !prevFlightIdsRef.current.has(flight.icao24)) {
            newHighAltEnteringFlights.push(flight);
          }
        }
      }
    });

    // Fire notifications for newly entering high-altitude flights
    if (alertSettings.enabled && newHighAltEnteringFlights.length > 0) {
      newHighAltEnteringFlights.forEach((flight) => {
        const altitudeMeters = flight.baroAltitude || flight.geoAltitude || 0;
        const altitudeFt = Math.round(altitudeMeters * 3.28084);

        // 1. Play audio chime if enabled
        if (alertSettings.soundEnabled) {
          playRadarAlertChime();
        }

        // 2. Trigger browser's HTML5 Notification API
        triggerBrowserFlightNotification(flight, radarRadiusKm, (f) => {
          onSelectFlight(f);
        });

        // 3. Render in-app companion alert banner
        const newAlert: AlertBannerItem = {
          id: `${flight.icao24}-${Date.now()}`,
          flight,
          timestamp: Date.now(),
          altitudeFt,
        };
        setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 2)]);
      });
    }

    prevFlightIdsRef.current = currentInRadiusIds;
    isFirstCheckRef.current = false;
  }, [flights, radarRadiusKm, alertSettings, userLocation, onSelectFlight]);

  // Auto-dismiss active in-app alert banner after 8 seconds
  useEffect(() => {
    if (activeAlerts.length === 0) return;
    const timer = setTimeout(() => {
      setActiveAlerts((prev) => prev.slice(1));
    }, 8500);
    return () => clearTimeout(timer);
  }, [activeAlerts]);

  // Test Notification Handler
  const handleSendTestNotification = () => {
    const sampleFlight: FlightState = flights.find(
      (f) => ((f.baroAltitude || 0) * 3.28084) >= alertSettings.minAltitudeFt
    ) || {
      icao24: 'test4b18',
      callsign: 'BBC-047',
      airlineName: 'Biman Bangladesh Airlines',
      originCountry: 'Bangladesh',
      timePosition: Math.floor(Date.now() / 1000),
      lastContact: Math.floor(Date.now() / 1000),
      latitude: userLocation.latitude + 0.12,
      longitude: userLocation.longitude + 0.15,
      baroAltitude: 10600, // 34,776 ft
      onGround: false,
      velocity: 240,
      trueTrack: 125,
      verticalRate: 2.5,
      geoAltitude: 10600,
      squawk: '7700',
      flightCategory: 'commercial',
      estimatedDestination: {
        code: 'BKK',
        city: 'Bangkok',
        country: 'Thailand',
        countryCode: 'TH',
      },
    };

    if (alertSettings.soundEnabled) {
      playRadarAlertChime();
    }

    triggerBrowserFlightNotification(sampleFlight, radarRadiusKm, (f) => {
      onSelectFlight(f);
    });

    const testAlert: AlertBannerItem = {
      id: `test-${Date.now()}`,
      flight: sampleFlight,
      timestamp: Date.now(),
      altitudeFt: Math.round((sampleFlight.baroAltitude || 10600) * 3.28084),
    };
    setActiveAlerts([testAlert]);
  };

  // Canvas drawing for radar display
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadarRadius = Math.min(centerX, centerY) * 0.88 * zoomLevel;

    // Draw background grid rings (concentric distance circles)
    const rings = [0.25, 0.5, 0.75, 1.0];
    ctx.lineWidth = 1;

    rings.forEach((rRatio) => {
      const radius = maxRadarRadius * rRatio;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = rRatio === 1.0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(71, 85, 105, 0.25)';
      ctx.stroke();

      // Distance tag
      const distKm = Math.round(radarRadiusKm * rRatio);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px Inter, monospace';
      ctx.fillText(`${distKm} km`, centerX + 6, centerY - radius + 12);
    });

    // Crosshairs / Compass axes
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadarRadius, centerY);
    ctx.lineTo(centerX + maxRadarRadius, centerY);
    ctx.moveTo(centerX, centerY - maxRadarRadius);
    ctx.lineTo(centerX, centerY + maxRadarRadius);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
    ctx.stroke();

    // Cardinal Points
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(129, 140, 248, 0.8)';
    ctx.fillText('N', centerX - 4, centerY - maxRadarRadius - 8);
    ctx.fillText('S', centerX - 4, centerY + maxRadarRadius + 16);
    ctx.fillText('E', centerX + maxRadarRadius + 8, centerY + 4);
    ctx.fillText('W', centerX - maxRadarRadius - 18, centerY + 4);

    // Dynamic Rotating Radar Sweep Line & Sector gradient
    const sweepRad = (radarSweepAngle * Math.PI) / 180;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadarRadius);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, maxRadarRadius, sweepRad - 0.4, sweepRad);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sweep line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + maxRadarRadius * Math.cos(sweepRad),
      centerY + maxRadarRadius * Math.sin(sweepRad)
    );
    ctx.strokeStyle = 'rgba(165, 180, 252, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // User center beacon dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.stroke();
  }, [radarRadiusKm, zoomLevel, radarSweepAngle]);

  // Coordinate projection helper: converts plane lat/lon relative to user center
  const getCanvasCoords = (lat: number | null, lon: number | null) => {
    if (lat === null || lon === null || !containerRef.current) {
      return { x: -100, y: -100 };
    }
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadarRadius = Math.min(centerX, centerY) * 0.88 * zoomLevel;

    // Approx degrees to km
    const dLatKm = (lat - userLocation.latitude) * 111.0;
    const dLonKm = (lon - userLocation.longitude) * (111.0 * Math.cos((userLocation.latitude * Math.PI) / 180));

    const x = centerX + (dLonKm / radarRadiusKm) * maxRadarRadius;
    const y = centerY - (dLatKm / radarRadiusKm) * maxRadarRadius; // Invert latitude for screen Y

    return { x, y };
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-2xl shadow-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveOpenSky ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-semibold text-white">
              {isLiveOpenSky ? 'OpenSky Live Feed' : 'Radar Traffic Simulated'}
            </span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono">
            {flights.length} টি বিমান আকাশে ট্র্যাকড
          </span>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* High Altitude Notification Alert Toggle & Settings Button */}
          <button
            id="btn-radar-notifications"
            onClick={() => setIsSettingsOpen(true)}
            className={`relative p-2 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${
              alertSettings.enabled
                ? 'bg-slate-900/90 border-indigo-500/60 text-indigo-400 hover:text-white hover:border-indigo-400 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="উচ্চ উচ্চতার বিমান নোটিফিকেশন সেটিংস (Browser Notification API)"
            aria-label="নোটিফিকেশন সেটিংস"
          >
            {activeAlerts.length > 0 ? (
              <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            {alertSettings.enabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Radius selector */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-1 flex items-center text-xs">
            {[40, 80, 150].map((km) => (
              <button
                key={km}
                onClick={() => onChangeRadius(km)}
                className={`px-2.5 py-1 rounded-xl font-medium transition-colors ${
                  radarRadiusKm === km
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
            className="p-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.25))}
            className="p-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            title="Refresh Overhead Flights"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating High-Altitude Real-Time Alert Banner */}
      <HighAltitudeAlertBanner
        alerts={activeAlerts}
        onDismiss={(id) => setActiveAlerts((prev) => prev.filter((a) => a.id !== id))}
        onSelectFlight={(flight) => {
          onSelectFlight(flight);
          setActiveAlerts([]);
        }}
        radarRadiusKm={radarRadiusKm}
      />

      {/* Notification Settings & Browser Permission Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={alertSettings}
        onUpdateSettings={(newSettings) => {
          setAlertSettings(newSettings);
          saveNotificationSettings(newSettings);
        }}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* Radar Stage Container */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Floating Semi-transparent Map Legend in Bottom-Left Corner */}
        <MapLegend radarRadiusKm={radarRadiusKm} />

        {/* Center GPS User Label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
          <div className="mt-5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-[10px] text-indigo-300 font-mono shadow-lg flex items-center gap-1 whitespace-nowrap">
            <Navigation className="w-3 h-3 text-indigo-400" />
            <span>আপনার অবস্থান ({userLocation.city})</span>
          </div>
        </div>

        {/* Overhead Aircraft Pins */}
        {flights.map((flight) => {
          const { x, y } = getCanvasCoords(flight.latitude, flight.longitude);
          const isSelected = selectedFlight?.icao24 === flight.icao24;
          const headingDeg = flight.trueTrack || 0;
          const isGround = flight.onGround || (flight.baroAltitude || 0) <= 50;
          const isPrivate = flight.flightCategory === 'private';

          // Visa color-code dot lookup for flight destination
          const destCode = flight.estimatedDestination?.countryCode || 'TH';
          const visaInfo = BANGLADESH_PASSPORT_VISA_DB[destCode];
          const visaDotColor =
            visaInfo?.visaCategory === 'visa-free'
              ? 'bg-emerald-400'
              : visaInfo?.visaCategory === 'visa-on-arrival'
              ? 'bg-amber-400'
              : visaInfo?.visaCategory === 'eta-evisa'
              ? 'bg-sky-400'
              : 'bg-rose-400';

          // Hide if off canvas
          if (x < -20 || y < -20) return null;

          return (
            <div
              key={flight.icao24}
              id={`radar-flight-${flight.icao24}`}
              onClick={() => onSelectFlight(flight)}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 cursor-pointer group"
            >
              {/* Pulsing Selection ring */}
              {isSelected && (
                <div className="absolute -inset-3 rounded-full border border-amber-400 animate-ping opacity-75 pointer-events-none" />
              )}

              {/* Aircraft Icon with track rotation & style based on category */}
              <div
                className={`p-1.5 rounded-full transition-transform duration-300 flex items-center justify-center ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-125'
                    : isGround
                    ? 'bg-slate-700 text-slate-400 border border-slate-600'
                    : isPrivate
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/40 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-slate-950'
                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-slate-950'
                }`}
                title={`${flight.callsign} (${isPrivate ? 'Private Jet' : 'Commercial Flight'})`}
              >
                <div style={{ transform: `rotate(${headingDeg - 90}deg)` }}>
                  <Plane className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Callout Label Tag */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 pointer-events-none transition-opacity ${
                  isSelected ? 'opacity-100 z-30' : 'opacity-85 group-hover:opacity-100'
                }`}
              >
                <div
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono whitespace-nowrap shadow-xl flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isSelected ? 'bg-slate-950' : visaDotColor
                    }`}
                    title={visaInfo?.visaCategory || 'Visa Category'}
                  />
                  <span>{flight.callsign || flight.icao24}</span>
                  {isPrivate && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-teal-500/30 text-teal-200 border border-teal-500/40 font-sans">
                      PVT
                    </span>
                  )}
                  {flight.baroAltitude && (
                    <span className="text-[9px] opacity-75">
                      {Math.round(flight.baroAltitude * 3.28084)}ft
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Stats / Hint Bar */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden sm:flex items-center">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-3 py-2 rounded-2xl text-[11px] text-slate-300 flex items-center gap-2 pointer-events-auto shadow-xl">
          <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>একটি বিমানে ট্যাপ করুন ✈️ গন্তব্যের ভিসা দেখতে</span>
        </div>
      </div>
    </div>
  );
};
