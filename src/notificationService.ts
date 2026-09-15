/**
 * Browser Notification API & Audio Synthesizer Service
 * Handles high-altitude flight alerts, permissions, audio chimes, and browser notifications.
 */

import { FlightState, UserLocation } from './types';

export type NotificationAlertMode = 'all_flights' | 'watchlist_only';

export interface NotificationSettings {
  enabled: boolean;
  minAltitudeFt: number; // e.g. 30000 ft (9,144 meters)
  soundEnabled: boolean;
  alertMode: NotificationAlertMode; // 'all_flights' | 'watchlist_only'
  watchlistIcaos: string[]; // specifically monitored individual flights
  mutedIcaos: string[]; // specifically muted individual flights
}

const STORAGE_KEY = 'skybound_high_altitude_alert_settings';

export const DEFAULT_ALERT_SETTINGS: NotificationSettings = {
  enabled: true,
  minAltitudeFt: 30000, // 30,000 feet (~9,144 meters) standard cruising FL300
  soundEnabled: true,
  alertMode: 'all_flights',
  watchlistIcaos: [],
  mutedIcaos: [],
};

/**
 * Load user notification preferences from localStorage
 */
export function loadNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_ALERT_SETTINGS,
        ...parsed,
        alertMode: parsed.alertMode === 'watchlist_only' ? 'watchlist_only' : 'all_flights',
        watchlistIcaos: Array.isArray(parsed.watchlistIcaos) ? parsed.watchlistIcaos : [],
        mutedIcaos: Array.isArray(parsed.mutedIcaos) ? parsed.mutedIcaos : [],
      };
    }
  } catch (err) {
    console.warn('Could not read notification settings from storage:', err);
  }
  return DEFAULT_ALERT_SETTINGS;
}

/**
 * Save user notification preferences
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save notification settings to storage:', err);
  }
}

/**
 * Determines whether a specific aircraft should trigger a notification
 * taking into account master toggle, individual flight watchlist, muted list,
 * altitude thresholds, and alert mode.
 */
export function shouldNotifyFlight(
  flight: FlightState,
  settings: NotificationSettings
): boolean {
  if (!settings.enabled) return false;

  const icao = (flight.icao24 || '').toLowerCase();

  // 1. Check if specifically muted by user
  const isMuted = (settings.mutedIcaos || []).some((m) => m.toLowerCase() === icao);
  if (isMuted) return false;

  // 2. Check if explicitly in the watchlist
  const isWatchlisted = (settings.watchlistIcaos || []).some((w) => w.toLowerCase() === icao);

  // If in watchlist_only mode, only notify if the flight is in watchlist
  if (settings.alertMode === 'watchlist_only') {
    return isWatchlisted;
  }

  // In all_flights mode:
  // If explicitly watchlisted, notify regardless of altitude
  if (isWatchlisted) return true;

  // Otherwise, check altitude threshold
  const altitudeMeters = flight.baroAltitude || flight.geoAltitude || 0;
  const altitudeFt = Math.round(altitudeMeters * 3.28084);
  return altitudeFt >= settings.minAltitudeFt;
}

/**
 * Toggle watchlist status for an individual flight
 */
export function toggleWatchlistFlight(
  settings: NotificationSettings,
  icao24: string
): NotificationSettings {
  const normIcao = icao24.toLowerCase();
  const currentList = settings.watchlistIcaos || [];
  const exists = currentList.some((id) => id.toLowerCase() === normIcao);

  const newWatchlist = exists
    ? currentList.filter((id) => id.toLowerCase() !== normIcao)
    : [...currentList, icao24];

  // If adding to watchlist, remove from muted list if present
  const newMuted = (settings.mutedIcaos || []).filter((id) => id.toLowerCase() !== normIcao);

  const updated: NotificationSettings = {
    ...settings,
    watchlistIcaos: newWatchlist,
    mutedIcaos: newMuted,
  };
  saveNotificationSettings(updated);
  return updated;
}

/**
 * Toggle mute status for an individual flight
 */
export function toggleMuteFlight(
  settings: NotificationSettings,
  icao24: string
): NotificationSettings {
  const normIcao = icao24.toLowerCase();
  const currentMuted = settings.mutedIcaos || [];
  const exists = currentMuted.some((id) => id.toLowerCase() === normIcao);

  const newMuted = exists
    ? currentMuted.filter((id) => id.toLowerCase() !== normIcao)
    : [...currentMuted, icao24];

  // If muting, remove from watchlist if present
  const newWatchlist = (settings.watchlistIcaos || []).filter((id) => id.toLowerCase() !== normIcao);

  const updated: NotificationSettings = {
    ...settings,
    mutedIcaos: newMuted,
    watchlistIcaos: newWatchlist,
  };
  saveNotificationSettings(updated);
  return updated;
}

/**
 * Check if the browser supports the HTML5 Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return Notification.permission;
  }
}

/**
 * Synthesizes a soft, crisp dual-tone radar audio ping using Web Audio API
 */
export function playRadarAlertChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: High crisp ping (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: Harmonious resonance ping (1760 Hz - A6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.22);

    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.55);

    // Close audio context after playback finishes
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 800);
  } catch (err) {
    // Audio context may be restricted before user gesture
    console.debug('Radar chime not played:', err);
  }
}

/**
 * Calculates geographical distance between two points in kilometers (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Triggers the browser's Notification API for a high-altitude flight entering radar radius
 */
export function triggerBrowserFlightNotification(
  flight: FlightState,
  radarRadiusKm: number,
  onClick?: (flight: FlightState) => void
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const altitudeMeters = flight.baroAltitude || flight.geoAltitude || 0;
  const altitudeFt = Math.round(altitudeMeters * 3.28084);
  const callsign = (flight.callsign || 'Unknown Flight').trim();
  const airline = flight.airlineName || 'Commercial Airliner';
  const destCity = flight.estimatedDestination?.city || 'International';
  const destCountry = flight.estimatedDestination?.country || '';

  const title = `✈️ High-Altitude Aircraft in Radar: ${callsign}`;
  const body = `${airline} • Altitude: ${altitudeFt.toLocaleString()} ft (${Math.round(altitudeMeters)}m)\nHeading to ${destCity}, ${destCountry} • Within ${radarRadiusKm} km range`;

  try {
    const notification = new Notification(title, {
      body,
      tag: `high-alt-${flight.icao24}`,
      icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%236366f1" stroke="%23ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
      requireInteraction: false,
    });

    if (onClick) {
      notification.onclick = () => {
        window.focus();
        onClick(flight);
        notification.close();
      };
    }

    return notification;
  } catch (err) {
    console.warn('Failed to construct browser Notification instance:', err);
    return null;
  }
}
