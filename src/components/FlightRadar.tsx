import React, { useEffect, useRef, useState } from 'react';
import { FlightState, UserLocation } from '../types';
import { 
  Plane, Compass, Navigation, Eye, AlertCircle, RefreshCw, ZoomIn, ZoomOut, 
  Layers, Bell, BellRing, BellOff, Bookmark, SlidersHorizontal,
  CloudRain, Wind, Thermometer
} from 'lucide-react';
import { MapLegend } from './MapLegend';
import { BANGLADESH_PASSPORT_VISA_DB } from '../visaData';
import { HighAltitudeAlertBanner, AlertBannerItem } from './HighAltitudeAlertBanner';
import { NotificationSettingsModal } from './NotificationSettingsModal';
import { AviationWeatherModal } from './AviationWeatherModal';
import {
  fetchLiveRadarWeather,
  calculateAircraftWindImpact,
  generatePrecipitationRadarCells,
  WeatherConditions,
  PrecipitationCell,
} from '../weatherService';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  NotificationSettings,
  calculateDistanceKm,
  playRadarAlertChime,
  triggerBrowserFlightNotification,
  shouldNotifyFlight,
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
  alertSettings?: NotificationSettings;
  onUpdateAlertSettings?: (settings: NotificationSettings) => void;
  browserNotifPermission?: NotificationPermission | 'unsupported';
  onCheckAndPromptPermission?: () => void;
  onShowDeniedExplanation?: () => void;
  onWeatherLoaded?: (weather: WeatherConditions) => void;
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
  alertSettings: propAlertSettings,
  onUpdateAlertSettings,
  browserNotifPermission,
  onCheckAndPromptPermission,
  onShowDeniedExplanation,
  onWeatherLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFlightPaths, setShowFlightPaths] = useState(true);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Notification API & High-Altitude Alert state
  const [localAlertSettings, setLocalAlertSettings] = useState<NotificationSettings>(loadNotificationSettings);
  const alertSettings = propAlertSettings || localAlertSettings;

  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    const wasDisabled = !alertSettings.enabled;
    saveNotificationSettings(newSettings);
    if (onUpdateAlertSettings) {
      onUpdateAlertSettings(newSettings);
    } else {
      setLocalAlertSettings(newSettings);
    }

    // Prompt for browser notification permission if user enables alert features
    if (newSettings.enabled && wasDisabled && onCheckAndPromptPermission) {
      onCheckAndPromptPermission();
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertBannerItem[]>([]);
  const prevFlightIdsRef = useRef<Set<string>>(new Set());
  const isFirstCheckRef = useRef<boolean>(true);

  // Real-time Aviation Weather & Wind Layer state
  const [weatherLayer, setWeatherLayer] = useState<'off' | 'wind' | 'rain' | 'all'>('all');
  const [weatherData, setWeatherData] = useState<WeatherConditions | null>(null);
  const [precipCells, setPrecipCells] = useState<PrecipitationCell[]>([]);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [windOffset, setWindOffset] = useState(0);

  // Radar sweep and wind streamline animation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRadarSweepAngle((prev) => (prev + 1.2) % 360);
      setWindOffset((prev) => (prev + 0.5) % 100);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Periodic weather fetching
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      try {
        const data = await fetchLiveRadarWeather(userLocation.latitude, userLocation.longitude);
        if (!isMounted) return;
        setWeatherData(data);
        onWeatherLoaded?.(data);
        const cells = generatePrecipitationRadarCells(
          userLocation.latitude,
          userLocation.longitude,
          data.precipitationMm,
          data.weatherCode
        );
        setPrecipCells(cells);
      } catch (err) {
        console.warn('Radar weather load failed:', err);
      }
    };

    loadWeather();
    const timer = setInterval(loadWeather, 4 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [userLocation.latitude, userLocation.longitude]);

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

        // Check if aircraft qualifies for notification based on user's individual flight toggles & settings
        if (shouldNotifyFlight(flight, alertSettings)) {
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

    // 1. Precipitation Doppler Radar Layer (Draw behind sweep line & planes)
    if ((weatherLayer === 'rain' || weatherLayer === 'all') && precipCells.length > 0) {
      ctx.save();
      // Clip to circular radar boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadarRadius, 0, 2 * Math.PI);
      ctx.clip();

      precipCells.forEach((cell) => {
        const dLatKm = (cell.centerLat - userLocation.latitude) * 111.0;
        const dLonKm = (cell.centerLon - userLocation.longitude) * (111.0 * Math.cos((userLocation.latitude * Math.PI) / 180));
        const cx = centerX + (dLonKm / radarRadiusKm) * maxRadarRadius;
        const cy = centerY - (dLatKm / radarRadiusKm) * maxRadarRadius;
        const rPx = (cell.radiusKm / radarRadiusKm) * maxRadarRadius;

        if (rPx > 6) {
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rPx);
          if (cell.intensityDbz >= 45) {
            // Thunderstorm cell (Crimson core to yellow)
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.42)');
            grad.addColorStop(0.35, 'rgba(249, 115, 22, 0.30)');
            grad.addColorStop(0.7, 'rgba(234, 179, 8, 0.16)');
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else if (cell.intensityDbz >= 30) {
            // Moderate rain band (Amber to green)
            grad.addColorStop(0, 'rgba(234, 179, 8, 0.32)');
            grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.20)');
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else {
            // Light drizzle (Green to cyan)
            grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
            grad.addColorStop(0.6, 'rgba(6, 182, 212, 0.12)');
            grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          }

          ctx.beginPath();
          ctx.arc(cx, cy, rPx, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.fill();

          // Reflectivity contour
          ctx.beginPath();
          ctx.arc(cx, cy, rPx * 0.6, 0, 2 * Math.PI);
          ctx.strokeStyle = cell.intensityDbz >= 45 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(234, 179, 8, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Cell label
          ctx.font = '9px monospace';
          ctx.fillStyle = cell.intensityDbz >= 45 ? 'rgba(252, 165, 165, 0.85)' : 'rgba(253, 224, 71, 0.8)';
          ctx.fillText(`${cell.intensityDbz} dBZ`, cx - 14, cy - rPx * 0.6 - 2);
        }
      });
      ctx.restore();
    }

    // 2. Wind Flow Field & Streamlines Layer
    if ((weatherLayer === 'wind' || weatherLayer === 'all') && weatherData) {
      ctx.save();
      // Clip to radar boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadarRadius, 0, 2 * Math.PI);
      ctx.clip();

      const targetDeg = (weatherData.windDirectionDeg + 180) % 360;
      const targetRad = (targetDeg * Math.PI) / 180;
      const dx = Math.sin(targetRad);
      const dy = -Math.cos(targetRad);

      const step = 68;
      const minX = centerX - maxRadarRadius;
      const maxX = centerX + maxRadarRadius;
      const minY = centerY - maxRadarRadius;
      const maxY = centerY + maxRadarRadius;

      const spd = Math.max(weatherData.windSpeedKnots, 4);
      const strokeColor = spd >= 25 ? 'rgba(168, 85, 247, 0.38)' : 'rgba(56, 189, 248, 0.28)';

      for (let gx = minX + 24; gx < maxX; gx += step) {
        for (let gy = minY + 24; gy < maxY; gy += step) {
          const dist = Math.hypot(gx - centerX, gy - centerY);
          if (dist < maxRadarRadius * 0.94) {
            // Animated shift along flow
            const animPhase = ((windOffset * 0.4) % 1) * 12;
            const px = gx + dx * (animPhase - 6);
            const py = gy + dy * (animPhase - 6);

            const halfLen = 13;
            ctx.beginPath();
            ctx.moveTo(px - dx * halfLen, py - dy * halfLen);
            ctx.lineTo(px + dx * halfLen, py + dy * halfLen);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Directional arrow chevron
            const arrowHead = 4;
            const perpX = -dy * arrowHead * 0.6;
            const perpY = dx * arrowHead * 0.6;
            const tipX = px + dx * halfLen;
            const tipY = py + dy * halfLen;

            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(tipX - dx * arrowHead + perpX, tipY - dy * arrowHead + perpY);
            ctx.lineTo(tipX - dx * arrowHead - perpX, tipY - dy * arrowHead - perpY);
            ctx.closePath();
            ctx.fillStyle = strokeColor;
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }

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
  }, [
    radarRadiusKm,
    zoomLevel,
    radarSweepAngle,
    weatherLayer,
    weatherData,
    precipCells,
    windOffset,
    userLocation.latitude,
    userLocation.longitude,
  ]);

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
        <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap justify-end">
          {/* Radar Interface Settings Toggle: Master switch & Individual flight filter */}
          <div
            id="radar-notification-control-panel"
            className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1 shadow-lg"
          >
            {/* Quick Alert Toggle Button */}
            <button
              id="btn-radar-alert-toggle"
              onClick={() =>
                handleUpdateSettings({
                  ...alertSettings,
                  enabled: !alertSettings.enabled,
                })
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                !alertSettings.enabled
                  ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  : alertSettings.alertMode === 'watchlist_only'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm'
              }`}
              title={
                alertSettings.enabled
                  ? 'অ্যালার্ট বন্ধ করতে ক্লিক করুন'
                  : 'অ্যালার্ট সক্রিয় করতে ক্লিক করুন'
              }
            >
              {!alertSettings.enabled ? (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">অ্যালার্ট বন্ধ</span>
                </>
              ) : alertSettings.alertMode === 'watchlist_only' ? (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>নির্বাচিত ({alertSettings.watchlistIcaos?.length || 0})</span>
                </>
              ) : (
                <>
                  <BellRing className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>সকল বিমান</span>
                </>
              )}
            </button>

            {/* Inline Filter Switcher: All Passing vs Individual/Watchlist Only */}
            {alertSettings.enabled && (
              <div className="flex items-center bg-slate-950/80 rounded-xl p-0.5 border border-slate-800/80 text-[11px]">
                <button
                  id="btn-filter-all-flights"
                  onClick={() =>
                    handleUpdateSettings({
                      ...alertSettings,
                      alertMode: 'all_flights',
                    })
                  }
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    alertSettings.alertMode === 'all_flights'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="রাডারে আসা সকল উচ্চ-উচ্চতার বিমানে অ্যালার্ট"
                >
                  সকল
                </button>
                <button
                  id="btn-filter-watchlist-only"
                  onClick={() =>
                    handleUpdateSettings({
                      ...alertSettings,
                      alertMode: 'watchlist_only',
                    })
                  }
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    alertSettings.alertMode === 'watchlist_only'
                      ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="ঘনঘন নোটিফিকেশন বন্ধ করে শুধুমাত্র আপনার পছন্দের বিমানে অ্যালার্ট"
                >
                  <span>ওয়াচলিস্ট</span>
                </button>
              </div>
            )}

            {/* Modal Opener Button */}
            <button
              id="btn-radar-notifications"
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="নোটিফিকেশন বিস্তারিত সেটিংস"
              aria-label="নোটিফিকেশন সেটিংস"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Weather Layer Toggle */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-1 flex items-center text-xs shadow-md">
            <button
              id="btn-weather-layer-toggle"
              onClick={() => {
                setWeatherLayer((prev) =>
                  prev === 'all' ? 'wind' : prev === 'wind' ? 'rain' : prev === 'rain' ? 'off' : 'all'
                );
              }}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                weatherLayer === 'all'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm font-bold'
                  : weatherLayer === 'wind'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : weatherLayer === 'rain'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="আবহাওয়া লেয়ার পরিবর্তন: বাতাস (Wind), বৃষ্টি (Rain), উভয় (All) অথবা বন্ধ (Off)"
            >
              {weatherLayer === 'wind' ? (
                <Wind className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              ) : weatherLayer === 'rain' ? (
                <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
              ) : weatherLayer === 'all' ? (
                <Wind className="w-3.5 h-3.5 text-sky-300" />
              ) : (
                <Wind className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="hidden sm:inline">
                {weatherLayer === 'all'
                  ? 'বাতাস + বৃষ্টি'
                  : weatherLayer === 'wind'
                  ? 'বায়ুপ্রবাহ'
                  : weatherLayer === 'rain'
                  ? 'বৃষ্টি রাডার'
                  : 'আবহাওয়া বন্ধ'}
              </span>
              <span className="sm:hidden">
                {weatherLayer === 'all' ? 'WX' : weatherLayer === 'wind' ? 'WIND' : weatherLayer === 'rain' ? 'RAIN' : 'OFF'}
              </span>
            </button>

            {weatherData && (
              <button
                id="btn-weather-details-modal"
                onClick={() => setIsWeatherModalOpen(true)}
                className="ml-1 px-2 py-1 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                title="শাহজালাল বিমানবন্দর (DAC) রানওয়ে ও লাইভ আবহাওয়া বিশ্লেষণ দেখুন"
              >
                <span className="text-sky-400 font-bold">{weatherData.windDirectionCardinal}</span>
                <span>{weatherData.windSpeedKnots}kt</span>
                {weatherData.precipitationMm > 0 && (
                  <span className="text-indigo-400 hidden md:inline">🌧️{weatherData.precipitationMm}mm</span>
                )}
              </button>
            )}
          </div>

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

      {/* Permission Denied Friendly Warning Banner when alerts are active */}
      {browserNotifPermission === 'denied' && alertSettings.enabled && (
        <div 
          id="banner-notification-permission-denied"
          onClick={onShowDeniedExplanation}
          className="absolute top-18 left-1/2 -translate-x-1/2 z-25 max-w-lg w-[92%] px-3.5 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 backdrop-blur-md flex items-center justify-between gap-2 text-xs shadow-lg shadow-black/40 cursor-pointer hover:bg-amber-500/25 transition-all group pointer-events-auto"
        >
          <div className="flex items-center gap-2 min-w-0">
            <BellOff className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">
              <strong>ব্রাউজার নোটিফিকেশন বন্ধ:</strong> ব্যাকগ্রাউন্ড পুশ অ্যালার্ট পেতে ব্রাউজারে অনুমতি দিন
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-300 underline shrink-0">
            সমাধান দেখুন
          </span>
        </div>
      )}

      {/* Notification Settings & Browser Permission Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={alertSettings}
        onUpdateSettings={handleUpdateSettings}
        onSendTestNotification={handleSendTestNotification}
        onShowDeniedExplanation={onShowDeniedExplanation}
      />

      {/* Aviation Weather & Runway Crosswind Modal */}
      <AviationWeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        weather={weatherData}
        radarRadiusKm={radarRadiusKm}
      />

      {/* Radar Stage Container */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Floating Semi-transparent Map Legend in Bottom-Left Corner */}
        <MapLegend radarRadiusKm={radarRadiusKm} />

        {/* Floating Wind & Atmospheric HUD Indicator in Top-Right Corner */}
        {weatherData && weatherLayer !== 'off' && (
          <div className="absolute top-20 right-4 z-20 pointer-events-auto">
            <button
              onClick={() => setIsWeatherModalOpen(true)}
              className="bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md border border-slate-750 hover:border-sky-500/50 p-2 sm:px-3 sm:py-2 rounded-2xl shadow-xl flex items-center gap-2.5 transition-all cursor-pointer group"
              title="বিস্তারিত এভিয়েশন আবহাওয়া ও রানওয়ে অ্যানালিটিক্স দেখতে ক্লিক করুন"
            >
              <div 
                className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ transform: `rotate(${(weatherData.windDirectionDeg + 180) % 360}deg)` }}
                title={`বাতাসের দিক: ${weatherData.windDirectionDeg}°`}
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-sky-300 font-mono">
                    {weatherData.windDirectionCardinal} {weatherData.windSpeedKnots} kt
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({weatherData.windDirectionDeg}°)</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{weatherData.temperatureC}°C</span>
                  <span>•</span>
                  <span className="text-indigo-300">
                    {weatherData.precipitationMm > 0 ? `${weatherData.precipitationMm}mm/h বৃষ্টি` : 'বৃষ্টিমুক্ত'}
                  </span>
                </div>
              </div>
            </button>
          </div>
        )}

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
          const isWatchlisted = (alertSettings.watchlistIcaos || []).some(
            (id) => id.toLowerCase() === flight.icao24.toLowerCase()
          );
          const isMuted = (alertSettings.mutedIcaos || []).some(
            (id) => id.toLowerCase() === flight.icao24.toLowerCase()
          );

          // Calculate atmospheric wind effect (Headwind vs Tailwind)
          const windImpact = weatherData
            ? calculateAircraftWindImpact(flight.trueTrack, weatherData.windDirectionDeg, weatherData.windSpeedKnots)
            : null;

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

              {/* Active Watchlist Ring */}
              {isWatchlisted && !isSelected && (
                <div className="absolute -inset-2.5 rounded-full border border-amber-400/80 animate-pulse pointer-events-none" />
              )}

              {/* Aircraft Icon with track rotation & style based on category */}
              <div
                className={`p-1.5 rounded-full transition-transform duration-300 flex items-center justify-center relative ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-125'
                    : isGround
                    ? 'bg-slate-700 text-slate-400 border border-slate-600'
                    : isWatchlisted
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300/80 shadow-lg shadow-amber-500/40 group-hover:scale-110'
                    : isPrivate
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/40 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-slate-950'
                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-slate-950'
                }`}
                title={`${flight.callsign} (${isPrivate ? 'Private Jet' : 'Commercial Flight'})`}
              >
                <div style={{ transform: `rotate(${headingDeg - 90}deg)` }}>
                  <Plane className="w-4 h-4 fill-current" />
                </div>

                {/* Micro notification badge on aircraft pin */}
                {isWatchlisted && (
                  <div
                    className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md ring-2 ring-slate-950 z-20"
                    title="এই বিমানে নোটিফিকেশন অ্যালার্ট সক্রিয়"
                  >
                    <Bell className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}
                {isMuted && (
                  <div
                    className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-slate-900 text-rose-400 shadow-md ring-1 ring-slate-700 z-20"
                    title="এই বিমানটি মিউট করা রয়েছে"
                  >
                    <BellOff className="w-2.5 h-2.5" />
                  </div>
                )}
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
                      : isWatchlisted
                      ? 'bg-amber-950/90 text-amber-200 border-amber-600 font-semibold'
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
                  {isWatchlisted && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">
                      TRACKED
                    </span>
                  )}
                  {isMuted && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40">
                      MUTED
                    </span>
                  )}
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

                  {/* Real-time Wind Vector Impact Badge (Headwind vs Tailwind) */}
                  {weatherLayer !== 'off' && windImpact && windImpact.effectType !== 'calm' && (
                    <span 
                      className={`text-[8px] px-1 py-0.2 rounded border font-mono font-bold ${windImpact.badgeClass}`}
                      title={windImpact.explanationBn}
                    >
                      {windImpact.badgeLabel}
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
