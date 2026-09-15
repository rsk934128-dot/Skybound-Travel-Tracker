import { FlightState } from './types';
import { calculateWindAdjustedETA, WindAdjustedETAResult } from './flightService';
import { WeatherConditions } from './weatherService';

export interface AirportCoordinates {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezoneOffsetHours: number; // UTC offset, e.g. +6 for BD, +7 for TH
}

export interface RouteHistoricalData {
  routeKey: string;
  scheduledMinutes: number;
  averageCruiseSpeedKmh: number;
  historicalOnTimePercent: number;
  averageHistoricalDelayMinutes: number;
  typicalCruisingAltFt: number;
}

export type FlightPhase = 'parked' | 'climb' | 'cruise' | 'descent' | 'approach';
export type DelayStatus = 'early' | 'on-time' | 'minor-delay' | 'moderate-delay' | 'major-delay';

export interface FlightAnalyticsResult {
  originAirport: AirportCoordinates;
  destinationAirport: AirportCoordinates;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  progressPercent: number;
  currentPhase: FlightPhase;
  phaseLabelBn: string;
  phaseLabelEn: string;
  estimatedRemainingMinutes: number;
  estimatedLandingTime: Date;
  windAdjustedRemainingMinutes: number;
  windAdjustedLandingTime: Date;
  windTimeDeltaMinutes: number;
  windAdjustedETA: WindAdjustedETAResult;
  scheduledLandingTime: Date;
  predictedDelayMinutes: number;
  delayStatus: DelayStatus;
  delayStatusLabelBn: string;
  delayStatusBadgeClass: string;
  delayStatusTextClass: string;
  topOfDescentKmRemaining: number;
  isDescentInitiated: boolean;
  confidencePercent: number;
  predictiveFactorsBn: string[];
  historicalOnTimePercent: number;
  speedEfficiencyRatio: number; // e.g. 1.05 = 5% faster than baseline
}

// Major airport coordinates across common routes from Bangladesh & globally
export const AIRPORT_COORDINATES: Record<string, AirportCoordinates> = {
  DAC: { code: 'DAC', name: 'Hazrat Shahjalal Int\'l', city: 'Dhaka', country: 'Bangladesh', lat: 23.8430, lon: 90.3980, timezoneOffsetHours: 6 },
  CGP: { code: 'CGP', name: 'Shah Amanat Int\'l', city: 'Chittagong', country: 'Bangladesh', lat: 22.2496, lon: 91.8133, timezoneOffsetHours: 6 },
  ZYL: { code: 'ZYL', name: 'Osmani Int\'l', city: 'Sylhet', country: 'Bangladesh', lat: 24.9632, lon: 91.8668, timezoneOffsetHours: 6 },
  BKK: { code: 'BKK', name: 'Suvarnabhumi Int\'l', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lon: 100.7501, timezoneOffsetHours: 7 },
  DMK: { code: 'DMK', name: 'Don Mueang Int\'l', city: 'Bangkok', country: 'Thailand', lat: 13.9126, lon: 100.6067, timezoneOffsetHours: 7 },
  KUL: { code: 'KUL', name: 'Kuala Lumpur Int\'l', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lon: 101.7099, timezoneOffsetHours: 8 },
  SIN: { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', lat: 1.3644, lon: 103.9915, timezoneOffsetHours: 8 },
  DXB: { code: 'DXB', name: 'Dubai Int\'l', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2532, lon: 55.3657, timezoneOffsetHours: 4 },
  DOH: { code: 'DOH', name: 'Hamad Int\'l', city: 'Doha', country: 'Qatar', lat: 25.2731, lon: 51.6081, timezoneOffsetHours: 3 },
  MLE: { code: 'MLE', name: 'Velana Int\'l', city: 'Malé', country: 'Maldives', lat: 4.1918, lon: 73.5290, timezoneOffsetHours: 5 },
  KTM: { code: 'KTM', name: 'Tribhuvan Int\'l', city: 'Kathmandu', country: 'Nepal', lat: 27.6966, lon: 85.3591, timezoneOffsetHours: 5.75 },
  CCU: { code: 'CCU', name: 'Netaji Subhash Chandra Bose', city: 'Kolkata', country: 'India', lat: 22.6547, lon: 88.4467, timezoneOffsetHours: 5.5 },
  DEL: { code: 'DEL', name: 'Indira Gandhi Int\'l', city: 'New Delhi', country: 'India', lat: 28.5562, lon: 77.1000, timezoneOffsetHours: 5.5 },
  JED: { code: 'JED', name: 'King Abdulaziz Int\'l', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lon: 39.1565, timezoneOffsetHours: 3 },
  RUH: { code: 'RUH', name: 'King Khalid Int\'l', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9576, lon: 46.6988, timezoneOffsetHours: 3 },
  MED: { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia', lat: 24.5534, lon: 39.7051, timezoneOffsetHours: 3 },
  IST: { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lon: 28.7519, timezoneOffsetHours: 3 },
  LHR: { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', lat: 51.4700, lon: -0.4543, timezoneOffsetHours: 0 },
  JFK: { code: 'JFK', name: 'John F. Kennedy Int\'l', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781, timezoneOffsetHours: -5 },
  PBH: { code: 'PBH', name: 'Paro Airport', city: 'Paro', country: 'Bhutan', lat: 27.4088, lon: 89.4246, timezoneOffsetHours: 6 },
  CMB: { code: 'CMB', name: 'Bandaranaike Int\'l', city: 'Colombo', country: 'Sri Lanka', lat: 7.1808, lon: 79.8841, timezoneOffsetHours: 5.5 },
  HAN: { code: 'HAN', name: 'Noi Bai Int\'l', city: 'Hanoi', country: 'Vietnam', lat: 21.2212, lon: 105.8072, timezoneOffsetHours: 7 },
  CGK: { code: 'CGK', name: 'Soekarno-Hatta Int\'l', city: 'Jakarta', country: 'Indonesia', lat: -6.1256, lon: 106.6559, timezoneOffsetHours: 7 },
};

// Historical baseline database for common routes
export const ROUTE_HISTORICAL_DB: Record<string, RouteHistoricalData> = {
  'DAC-BKK': { routeKey: 'DAC-BKK', scheduledMinutes: 150, averageCruiseSpeedKmh: 790, historicalOnTimePercent: 88, averageHistoricalDelayMinutes: 5, typicalCruisingAltFt: 34000 },
  'DAC-KUL': { routeKey: 'DAC-KUL', scheduledMinutes: 225, averageCruiseSpeedKmh: 810, historicalOnTimePercent: 84, averageHistoricalDelayMinutes: 9, typicalCruisingAltFt: 36000 },
  'DAC-SIN': { routeKey: 'DAC-SIN', scheduledMinutes: 250, averageCruiseSpeedKmh: 825, historicalOnTimePercent: 91, averageHistoricalDelayMinutes: 4, typicalCruisingAltFt: 38000 },
  'DAC-DXB': { routeKey: 'DAC-DXB', scheduledMinutes: 320, averageCruiseSpeedKmh: 830, historicalOnTimePercent: 86, averageHistoricalDelayMinutes: 8, typicalCruisingAltFt: 36000 },
  'DAC-DOH': { routeKey: 'DAC-DOH', scheduledMinutes: 345, averageCruiseSpeedKmh: 840, historicalOnTimePercent: 89, averageHistoricalDelayMinutes: 6, typicalCruisingAltFt: 37000 },
  'DAC-MLE': { routeKey: 'DAC-MLE', scheduledMinutes: 260, averageCruiseSpeedKmh: 800, historicalOnTimePercent: 82, averageHistoricalDelayMinutes: 11, typicalCruisingAltFt: 35000 },
  'DAC-KTM': { routeKey: 'DAC-KTM', scheduledMinutes: 75, averageCruiseSpeedKmh: 680, historicalOnTimePercent: 78, averageHistoricalDelayMinutes: 14, typicalCruisingAltFt: 28000 },
  'DAC-CCU': { routeKey: 'DAC-CCU', scheduledMinutes: 45, averageCruiseSpeedKmh: 580, historicalOnTimePercent: 85, averageHistoricalDelayMinutes: 7, typicalCruisingAltFt: 18000 },
  'DAC-DEL': { routeKey: 'DAC-DEL', scheduledMinutes: 155, averageCruiseSpeedKmh: 770, historicalOnTimePercent: 79, averageHistoricalDelayMinutes: 16, typicalCruisingAltFt: 33000 },
  'DAC-JED': { routeKey: 'DAC-JED', scheduledMinutes: 390, averageCruiseSpeedKmh: 840, historicalOnTimePercent: 80, averageHistoricalDelayMinutes: 12, typicalCruisingAltFt: 38000 },
  'DAC-IST': { routeKey: 'DAC-IST', scheduledMinutes: 480, averageCruiseSpeedKmh: 835, historicalOnTimePercent: 87, averageHistoricalDelayMinutes: 8, typicalCruisingAltFt: 37000 },
  'DAC-LHR': { routeKey: 'DAC-LHR', scheduledMinutes: 670, averageCruiseSpeedKmh: 850, historicalOnTimePercent: 83, averageHistoricalDelayMinutes: 15, typicalCruisingAltFt: 39000 },
};

/**
 * Great-circle distance using Haversine formula (km)
 */
export function calculateHaversineDistance(
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
  return Math.round(R * c);
}

/**
 * Calculates bearing from point 1 to point 2 in degrees (0-360)
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Predictive Engine: Computes real-time arrival analytics, estimated landing times,
 * and arrival delay prediction based on live ADS-B telemetry, weather wind vectors, and route historical models.
 */
export function calculateFlightAnalytics(
  flight: FlightState,
  weather?: WeatherConditions | null
): FlightAnalyticsResult {
  const originCode = flight.estimatedOrigin?.code?.toUpperCase() || 'DAC';
  const destCode = flight.estimatedDestination?.code?.toUpperCase() || 'BKK';

  // Fallback airport coordinate resolution
  const originAirport: AirportCoordinates = AIRPORT_COORDINATES[originCode] || {
    code: originCode,
    name: `${flight.estimatedOrigin?.city || 'Dhaka'} Airport`,
    city: flight.estimatedOrigin?.city || 'Dhaka',
    country: flight.estimatedOrigin?.country || 'Bangladesh',
    lat: 23.8430,
    lon: 90.3980,
    timezoneOffsetHours: 6,
  };

  const destinationAirport: AirportCoordinates = AIRPORT_COORDINATES[destCode] || {
    code: destCode,
    name: `${flight.estimatedDestination?.city || 'Destination'} Airport`,
    city: flight.estimatedDestination?.city || 'Bangkok',
    country: flight.estimatedDestination?.country || 'International',
    lat: 13.6900,
    lon: 100.7501,
    timezoneOffsetHours: 7,
  };

  // 1. Distance calculations
  const totalDistanceKm = Math.max(
    calculateHaversineDistance(
      originAirport.lat,
      originAirport.lon,
      destinationAirport.lat,
      destinationAirport.lon
    ),
    150
  );

  const curLat = flight.latitude ?? originAirport.lat;
  const curLon = flight.longitude ?? originAirport.lon;
  const currentSpeedKmh = Math.round((flight.velocity ?? 0) * 3.6);
  const altMeters = flight.baroAltitude ?? 0;
  const altFeet = Math.round(altMeters * 3.28084);
  const verticalRateMs = flight.verticalRate ?? 0;
  const isParked = flight.onGround || altMeters <= 60;

  let remainingDistanceKm = calculateHaversineDistance(
    curLat,
    curLon,
    destinationAirport.lat,
    destinationAirport.lon
  );

  // If distance calculation is wildly larger than total distance due to coordinate anomaly, cap it
  if (remainingDistanceKm > totalDistanceKm * 1.25) {
    remainingDistanceKm = totalDistanceKm;
  }

  // Calculate route progress percentage
  const rawProgress = ((totalDistanceKm - remainingDistanceKm) / totalDistanceKm) * 100;
  const progressPercent = Math.min(Math.max(Math.round(rawProgress), isParked ? 0 : 5), 98);

  // 2. Lookup historical route profile
  const routeKey = `${originCode}-${destCode}`;
  const historical = ROUTE_HISTORICAL_DB[routeKey] || {
    routeKey,
    scheduledMinutes: Math.round((totalDistanceKm / 750) * 60) + 30, // Heuristic: 750 km/h + 30 min takeoff/approach
    averageCruiseSpeedKmh: 800,
    historicalOnTimePercent: 85,
    averageHistoricalDelayMinutes: 8,
    typicalCruisingAltFt: 35000,
  };

  // 3. Determine Flight Phase
  let currentPhase: FlightPhase = 'cruise';
  let phaseLabelBn = 'ক্রুজিং পর্যায় (Cruise)';
  let phaseLabelEn = 'Enroute Cruising';

  // Rule of three for descent: 3 nautical miles per 1,000 ft altitude (~ 5.55 km per 1,000 ft)
  const topOfDescentKmRemaining = Math.round((altFeet / 1000) * 5.55);
  const isDescentInitiated = !isParked && remainingDistanceKm <= topOfDescentKmRemaining;

  if (isParked) {
    currentPhase = 'parked';
    phaseLabelBn = 'টার্মিনালে অবস্থানরত (On Ground)';
    phaseLabelEn = 'Parked / Taxiing';
  } else if (remainingDistanceKm <= 45 || altFeet < 4000) {
    currentPhase = 'approach';
    phaseLabelBn = 'ফাইনাল অ্যাপ্রোচ ও অবতরণ (Final Approach)';
    phaseLabelEn = 'Final Approach';
  } else if (verticalRateMs < -1.2 || isDescentInitiated) {
    currentPhase = 'descent';
    phaseLabelBn = 'অবতরণ প্রস্তুতি (Descent)';
    phaseLabelEn = 'Descending';
  } else if (altFeet < 18000 && verticalRateMs > 1.2) {
    currentPhase = 'climb';
    phaseLabelBn = 'উড্ডয়ন ও উচ্চতা অর্জন (Climb Phase)';
    phaseLabelEn = 'Climbing';
  }

  // 4. Predictive Flight Duration & Remaining Time (EET)
  let effectiveSpeedKmh = currentSpeedKmh > 150 ? currentSpeedKmh : historical.averageCruiseSpeedKmh;
  const speedEfficiencyRatio = Number((effectiveSpeedKmh / historical.averageCruiseSpeedKmh).toFixed(2));

  // Remaining cruising flight minutes
  let estRemainingMinutes = 0;
  if (isParked) {
    estRemainingMinutes = historical.scheduledMinutes;
  } else {
    // Distance / speed in hours * 60 + standard terminal arrival radar vectoring buffer (8-14 mins)
    const enrouteMinutes = (remainingDistanceKm / effectiveSpeedKmh) * 60;
    const approachBufferMinutes = currentPhase === 'approach' ? 5 : 10;
    estRemainingMinutes = Math.max(Math.round(enrouteMinutes + approachBufferMinutes), 3);
  }

  // 5. Landing Time (ETA) calculation
  const now = new Date();
  const estimatedLandingTime = new Date(now.getTime() + estRemainingMinutes * 60 * 1000);

  // Scheduled arrival time baseline (assuming departure was proportional to progress)
  const elapsedMinutes = Math.round(historical.scheduledMinutes * (progressPercent / 100));
  const estimatedDepartureTime = new Date(now.getTime() - elapsedMinutes * 60 * 1000);
  const scheduledLandingTime = new Date(
    estimatedDepartureTime.getTime() + historical.scheduledMinutes * 60 * 1000
  );

  // 6. Delay Prediction Algorithm
  // Factors analyzed:
  // A. Speed differential (flying slower or faster than cruise baseline)
  // B. Track deviation (is the aircraft flying directly towards the airport or doing turns/vectoring)
  // C. Historical delay bias for this airline and route
  // D. Atmospheric Headwind/Tailwind vector impact on ground speed
  const predictiveFactorsBn: string[] = [];

  // Wind-Adjusted ETA calculation using aerodynamic vector physics
  const windAdjusted = calculateWindAdjustedETA(
    flight,
    weather,
    estRemainingMinutes,
    remainingDistanceKm
  );

  if (!isParked) {
    if (windAdjusted.effectType === 'tailwind' && windAdjusted.deltaMinutes < 0) {
      predictiveFactorsBn.unshift(
        `💨 [Wind-Adjusted ETA] ${windAdjusted.badgeLabel}: অনুকূল টেলউইন্ডে অবতরণ সময় ${Math.abs(windAdjusted.deltaMinutes)} মিনিট এগিয়েছে`
      );
    } else if (windAdjusted.effectType === 'headwind' && windAdjusted.deltaMinutes > 0) {
      predictiveFactorsBn.unshift(
        `⚠️ [Wind-Adjusted ETA] ${windAdjusted.badgeLabel}: বিপরীতমুখী হেডউইন্ডে অবতরণ সময় ${windAdjusted.deltaMinutes} মিনিট পিছিয়ে গেছে`
      );
    } else if (windAdjusted.effectType === 'crosswind') {
      predictiveFactorsBn.push(
        `↔️ [Wind Impact] ${windAdjusted.badgeLabel}: পার্শ্বীয় বায়ুপ্রবাহ বিরাজমান, অটোপাইলট ড্রাফ্ট কারেকশন সক্রিয়`
      );
    }
  }

  let predictedDelayMinutes = Math.round(
    (estimatedLandingTime.getTime() - scheduledLandingTime.getTime()) / (60 * 1000)
  );

  // Fine-tune delay based on predictive factors
  if (speedEfficiencyRatio >= 1.06) {
    predictiveFactorsBn.push('💨 অনুকূল উচ্চ-উচ্চতার টেলউইন্ড (Favorable Tailwind) গতি বৃদ্ধি করেছে');
  } else if (speedEfficiencyRatio <= 0.92 && !isParked) {
    predictiveFactorsBn.push('⚠️ বিপরীতমুখী হেডউইন্ডের কারণে স্বাভাবিকের চেয়ে কম গতি পরিলক্ষিত');
    predictedDelayMinutes += 4;
  }

  // Check track bearing alignment towards destination
  if (!isParked && flight.trueTrack !== null) {
    const directBearing = calculateBearing(
      curLat,
      curLon,
      destinationAirport.lat,
      destinationAirport.lon
    );
    const bearingDiff = Math.abs(flight.trueTrack - directBearing);
    const normalizedDiff = bearingDiff > 180 ? 360 - bearingDiff : bearingDiff;

    if (normalizedDiff > 35 && remainingDistanceKm < 150) {
      predictiveFactorsBn.push('🔄 এয়ার ট্র্যাফিক কন্ট্রোল (ATC) টার্মিনাল রাডার ভেক্টরিং / হোল্ডিং প্যাটার্ন চলমান');
      predictedDelayMinutes += 8;
    } else {
      predictiveFactorsBn.push('🧭 গন্তব্য এয়ারপোর্টের দিকে অপটিমাইজড ফ্লাইট রুট ও ডিরেক্ট হেডিং');
    }
  }

  // Factor in historical delay statistics
  if (historical.averageHistoricalDelayMinutes > 10) {
    predictiveFactorsBn.push(`📊 এই রুটে ঐতিহাসিক গড় বিলম্ব প্রায় ${historical.averageHistoricalDelayMinutes} মিনিট`);
  }

  // Ensure reasonable bounds
  if (isParked) {
    predictedDelayMinutes = 0;
    predictiveFactorsBn.length = 0;
    predictiveFactorsBn.push('🕒 বিমানটি বর্তমানে বোর্ডিং বা ট্যাক্সি পর্যায়ে রয়েছে, শিডিউল অনুযায়ী প্রস্থান প্রত্যাশিত');
  }

  // 7. Categorize Delay Status
  let delayStatus: DelayStatus = 'on-time';
  let delayStatusLabelBn = 'অন-টাইম (On-Time)';
  let delayStatusBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let delayStatusTextClass = 'text-emerald-400';

  if (predictedDelayMinutes <= -6) {
    delayStatus = 'early';
    delayStatusLabelBn = `সময়ের আগে পৌঁছাবে (-${Math.abs(predictedDelayMinutes)} মিনিট)`;
    delayStatusBadgeClass = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    delayStatusTextClass = 'text-teal-400';
  } else if (predictedDelayMinutes > 5 && predictedDelayMinutes <= 18) {
    delayStatus = 'minor-delay';
    delayStatusLabelBn = `সামান্য বিলম্ব (+${predictedDelayMinutes} মিনিট)`;
    delayStatusBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    delayStatusTextClass = 'text-amber-400';
  } else if (predictedDelayMinutes > 18 && predictedDelayMinutes <= 45) {
    delayStatus = 'moderate-delay';
    delayStatusLabelBn = `বিলম্বিত (+${predictedDelayMinutes} মিনিট)`;
    delayStatusBadgeClass = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    delayStatusTextClass = 'text-orange-400';
  } else if (predictedDelayMinutes > 45) {
    delayStatus = 'major-delay';
    delayStatusLabelBn = `উল্লেখযোগ্য বিলম্ব (+${predictedDelayMinutes} মিনিট)`;
    delayStatusBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    delayStatusTextClass = 'text-rose-400';
  }

  // 8. Confidence estimation
  let confidencePercent = 94;
  if (!flight.velocity || flight.velocity < 50) confidencePercent -= 12;
  if (flight.trueTrack === null) confidencePercent -= 8;
  if (flight.lastContact && Date.now() / 1000 - flight.lastContact > 180) confidencePercent -= 15;
  confidencePercent = Math.max(Math.min(confidencePercent, 98), 65);

  return {
    originAirport,
    destinationAirport,
    totalDistanceKm,
    remainingDistanceKm,
    progressPercent,
    currentPhase,
    phaseLabelBn,
    phaseLabelEn,
    estimatedRemainingMinutes: estRemainingMinutes,
    estimatedLandingTime,
    windAdjustedRemainingMinutes: windAdjusted.windAdjustedRemainingMinutes,
    windAdjustedLandingTime: windAdjusted.windAdjustedETA,
    windTimeDeltaMinutes: windAdjusted.deltaMinutes,
    windAdjustedETA: windAdjusted,
    scheduledLandingTime,
    predictedDelayMinutes,
    delayStatus,
    delayStatusLabelBn,
    delayStatusBadgeClass,
    delayStatusTextClass,
    topOfDescentKmRemaining,
    isDescentInitiated,
    confidencePercent,
    predictiveFactorsBn,
    historicalOnTimePercent: historical.historicalOnTimePercent,
    speedEfficiencyRatio,
  };
}

/**
 * Format a Date to HH:mm (12-hour or 24-hour) with timezone label
 */
export function formatFlightTime(date: Date, tzOffsetHours: number = 6): string {
  // Convert UTC to target timezone
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetDate = new Date(utc + 3600000 * tzOffsetHours);

  let hours = targetDate.getHours();
  const minutes = targetDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Helper to format remaining duration in Bengali
 */
export function formatRemainingDurationBn(minutes: number): string {
  if (minutes <= 0) return 'অবতরণ সম্পন্ন';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs} ঘণ্টা ${mins > 0 ? `${mins} মি.` : ''}`;
  }
  return `${mins} মিনিট`;
}
