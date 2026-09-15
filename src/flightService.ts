import { FlightState } from './types';
import { COMMON_FLIGHT_ROUTES, AIRLINE_DATABASE } from './visaData';

/**
 * Calculates a bounding box around latitude and longitude in degrees.
 * ~1 degree latitude is approx 111 km.
 */
export function getBoundingBox(lat: number, lon: number, radiusKm: number = 80) {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));

  return {
    lamin: Number((lat - latDelta).toFixed(4)),
    lamax: Number((lat + latDelta).toFixed(4)),
    lomin: Number((lon - lonDelta).toFixed(4)),
    lomax: Number((lon + lonDelta).toFixed(4)),
  };
}

/**
 * Enriches raw OpenSky flight data with airline info and destination
 */
export function enrichFlightData(flight: FlightState): FlightState {
  const cleanCallsign = (flight.callsign || '').trim().toUpperCase();
  
  // Try matching known routes
  const matchedRoute = COMMON_FLIGHT_ROUTES.find(r => 
    cleanCallsign.startsWith(r.callsignPrefix) || 
    cleanCallsign === r.flight.replace('-', '') ||
    cleanCallsign === r.flight
  );

  let airlineName = 'Commercial Airline';
  let flightCategory: 'commercial' | 'private' | 'cargo' = 'commercial';
  let estimatedOrigin = { code: 'DAC', city: 'Dhaka', country: 'Bangladesh' };
  let estimatedDestination = { code: 'BKK', city: 'Bangkok', country: 'Thailand', countryCode: 'TH' };

  // Detect private / charter flights
  if (
    cleanCallsign.startsWith('S2-A') ||
    cleanCallsign.startsWith('S2-P') ||
    cleanCallsign.startsWith('N1') ||
    cleanCallsign.startsWith('VT-P') ||
    cleanCallsign.includes('JET') ||
    cleanCallsign.includes('PVT')
  ) {
    flightCategory = 'private';
    airlineName = 'Private Executive Jet / Charter';
  } else if (
    cleanCallsign.startsWith('FDX') ||
    cleanCallsign.startsWith('SQC') ||
    cleanCallsign.startsWith('BML') ||
    cleanCallsign.startsWith('CLX')
  ) {
    flightCategory = 'cargo';
    airlineName = 'Freight Cargo Transport';
  }

  if (matchedRoute) {
    airlineName = matchedRoute.airline;
    estimatedOrigin = { code: matchedRoute.from, city: matchedRoute.fromCity, country: 'Bangladesh' };
    estimatedDestination = { 
      code: matchedRoute.to, 
      city: matchedRoute.toCity, 
      country: matchedRoute.toCountry, 
      countryCode: matchedRoute.toCode 
    };
    if (matchedRoute.airline.toLowerCase().includes('cargo')) {
      flightCategory = 'cargo';
    }
  } else if (flightCategory === 'commercial') {
    // Check 2 or 3 letter prefix for airline
    const prefix2 = cleanCallsign.slice(0, 2);
    const prefix3 = cleanCallsign.slice(0, 3);
    const airline = AIRLINE_DATABASE[prefix3] || AIRLINE_DATABASE[prefix2];

    if (airline) {
      airlineName = airline.name;
    } else if (flight.originCountry) {
      airlineName = `${flight.originCountry} Commercial Flight`;
    }

    // Heuristic: if heading East/Southeast from Bangladesh, popular destinations are Thailand, Malaysia, Singapore
    const track = flight.trueTrack || 0;
    if (track > 80 && track < 160) {
      estimatedDestination = { code: 'BKK', city: 'Bangkok', country: 'Thailand', countryCode: 'TH' };
    } else if (track >= 160 && track < 210) {
      estimatedDestination = { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY' };
    } else if (track >= 210 && track < 260) {
      estimatedDestination = { code: 'MLE', city: 'Malé', country: 'Maldives', countryCode: 'MV' };
    } else if (track >= 260 && track < 320) {
      estimatedDestination = { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE' };
    } else if (track >= 320 || track <= 40) {
      estimatedDestination = { code: 'KTM', city: 'Kathmandu', country: 'Nepal', countryCode: 'NP' };
    } else {
      estimatedDestination = { code: 'SIN', city: 'Singapore', country: 'Singapore', countryCode: 'SG' };
    }
  }

  return {
    ...flight,
    airlineName,
    flightCategory,
    estimatedOrigin,
    estimatedDestination,
  };
}

/**
 * Simulated flight radar generator for when OpenSky rate limit is reached or when offline
 */
export function generateSimulatedFlightsAround(userLat: number, userLon: number): FlightState[] {
  const now = Math.floor(Date.now() / 1000);
  // Smooth position drift based on time
  const timeOffset = (now % 600); // 10 minute cycle

  const samplePresets = [
    { callsign: 'BBC047', routeIndex: 0, alt: 10500, speed: 235, track: 125, dLat: 0.12, dLon: 0.15, onGround: false },
    { callsign: 'UBG337', routeIndex: 8, alt: 9800, speed: 220, track: 205, dLat: -0.18, dLon: -0.09, onGround: false },
    { callsign: 'UAE583', routeIndex: 9, alt: 11200, speed: 245, track: 280, dLat: 0.22, dLon: -0.21, onGround: false },
    { callsign: 'THA322', routeIndex: 13, alt: 10100, speed: 230, track: 130, dLat: 0.05, dLon: 0.28, onGround: false },
    { callsign: 'S2-APJ', routeIndex: 2, alt: 7200, speed: 185, track: 95, dLat: -0.09, dLon: 0.18, onGround: false }, // Private Executive Jet
    { callsign: 'BBC071', routeIndex: 5, alt: 8400, speed: 205, track: 350, dLat: 0.32, dLon: 0.04, onGround: false },
    { callsign: 'SQC7182', routeIndex: 12, alt: 9500, speed: 240, track: 145, dLat: -0.22, dLon: 0.24, onGround: false }, // Cargo Flight
    { callsign: 'QTR639', routeIndex: 10, alt: 11800, speed: 250, track: 275, dLat: -0.15, dLon: -0.28, onGround: false },
    { callsign: 'S2-AEU', routeIndex: 2, alt: 0, speed: 0, track: 140, dLat: -0.02, dLon: 0.03, onGround: true }, // Parked/ground
  ];

  // Inbound high-altitude long-haul flight that moves inward into the radar scope
  const inboundProgress = (timeOffset % 120) / 120; // 2-minute entry cycle
  const inboundDistDeg = 1.1 - (inboundProgress * 0.9); // Transitions from 1.1 deg (~122km) to 0.2 deg (~22km)
  const inboundTrack = 230; // Flying southwest toward airport
  const inboundRad = (inboundTrack * Math.PI) / 180;

  const inboundFlight = {
    callsign: 'SIA433',
    routeIndex: 11,
    alt: 11400, // 37,400 ft high-altitude Boeing 787
    speed: 255,
    track: inboundTrack,
    dLat: inboundDistDeg * Math.cos(inboundRad),
    dLon: inboundDistDeg * Math.sin(inboundRad),
    onGround: false,
    icao24: '76cda1',
  };

  const flightsList = samplePresets.map((item, idx) => {
    const raw: FlightState = {
      icao24: `4b18${(idx + 10).toString(16)}`,
      callsign: item.callsign,
      originCountry: item.callsign.startsWith('BBC') || item.callsign.startsWith('UBG') || item.callsign.startsWith('S2') ? 'Bangladesh' : 'International',
      timePosition: now,
      lastContact: now,
      latitude: userLat + item.dLat,
      longitude: userLon + item.dLon,
      baroAltitude: item.alt,
      onGround: item.onGround,
      velocity: item.speed,
      trueTrack: item.track,
      verticalRate: item.onGround ? 0 : 2.5,
      geoAltitude: item.alt,
      squawk: item.onGround ? '1000' : '7700',
    };

    return enrichFlightData(raw);
  });

  // Append the dynamic inbound aircraft
  const rawInbound: FlightState = {
    icao24: inboundFlight.icao24,
    callsign: inboundFlight.callsign,
    originCountry: 'Singapore',
    timePosition: now,
    lastContact: now,
    latitude: userLat + inboundFlight.dLat,
    longitude: userLon + inboundFlight.dLon,
    baroAltitude: inboundFlight.alt,
    onGround: false,
    velocity: inboundFlight.speed,
    trueTrack: inboundFlight.track,
    verticalRate: -1.8,
    geoAltitude: inboundFlight.alt,
    squawk: '4331',
  };
  flightsList.push(enrichFlightData(rawInbound));

  return flightsList;
}

/**
 * Fetch live flights from OpenSky Network, falls back to simulated radar smoothly
 */
export async function fetchLiveOverheadFlights(
  lat: number,
  lon: number,
  radiusKm: number = 80
): Promise<{ flights: FlightState[]; isLiveOpenSky: boolean; message?: string }> {
  const bbox = getBoundingBox(lat, lon, radiusKm);
  const url = `https://opensky-network.org/api/states/all?lamin=${bbox.lamin}&lamax=${bbox.lamax}&lomin=${bbox.lomin}&lomax=${bbox.lomax}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.states) && data.states.length > 0) {
        const flights: FlightState[] = data.states.map((s: any) => {
          const raw: FlightState = {
            icao24: s[0] || 'Unknown',
            callsign: (s[1] || '').trim() || 'NO CALLSIGN',
            originCountry: s[2] || 'International',
            timePosition: s[3],
            lastContact: s[4],
            longitude: s[5],
            latitude: s[6],
            baroAltitude: s[7],
            onGround: Boolean(s[8]),
            velocity: s[9],
            trueTrack: s[10],
            verticalRate: s[11],
            geoAltitude: s[13],
            squawk: s[14],
          };
          return enrichFlightData(raw);
        });

        return { flights, isLiveOpenSky: true };
      }
    }
  } catch (err) {
    console.warn('OpenSky Network direct query throttled or blocked by CORS/timeout, switching to radar feed:', err);
  }

  // Graceful fallback with realistic overhead traffic around user GPS
  const simulated = generateSimulatedFlightsAround(lat, lon);
  return {
    flights: simulated,
    isLiveOpenSky: false,
    message: 'OpenSky Network API রেট-লিমিট বা নেটওয়ার্ক সীমাবদ্ধতার কারণে লাইভ রাডার সিমুলেশন ফিড সচল করা হয়েছে।'
  };
}

/**
 * Result model for wind-adjusted arrival time analytics
 */
export interface WindAdjustedETAResult {
  nominalRemainingMinutes: number;
  windAdjustedRemainingMinutes: number;
  nominalETA: Date;
  windAdjustedETA: Date;
  deltaMinutes: number; // e.g. -3 (tailwind saves 3m) or +4 (headwind delays 4m)
  headwindKnots: number;
  tailwindKnots: number;
  crosswindKnots: number;
  relativeAngleDeg: number;
  effectType: 'tailwind' | 'headwind' | 'crosswind' | 'calm';
  windSpeedKnots: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  badgeLabel: string;
  badgeClass: string;
  summarySentenceBn: string;
  detailedPhysicsBn: string;
  effectiveGroundSpeedKmh: number;
  stillAirSpeedKmh: number;
}

/**
 * Calculates aerodynamic wind impact (Headwind vs Tailwind) on flight arrival time (Wind-Adjusted ETA).
 * Applies vector decomposition (V_hw = V_w * cos(theta), V_xw = V_w * sin(theta))
 * to adjust true airspeed and calculate real time saved or lost.
 */
export function calculateWindAdjustedETA(
  flight: FlightState,
  weather?: {
    windSpeedKnots: number;
    windDirectionDeg: number;
    windDirectionCardinal?: string;
  } | null,
  nominalRemainingMinutes?: number,
  remainingDistanceKm?: number
): WindAdjustedETAResult {
  const now = new Date();
  const altMeters = flight.baroAltitude ?? 0;
  const isParked = flight.onGround || altMeters <= 60;

  const windSpeedKnots = weather?.windSpeedKnots ?? 15;
  const windDirectionDeg = weather?.windDirectionDeg ?? 190;
  const windDirectionCardinal = weather?.windDirectionCardinal ?? 'S';

  const defaultNominalMins = nominalRemainingMinutes ?? (isParked ? 150 : 35);
  const distKm = remainingDistanceKm ?? Math.max(Math.round((altMeters / 1000) * 22), 45);

  if (isParked) {
    const nominalETA = new Date(now.getTime() + defaultNominalMins * 60000);
    return {
      nominalRemainingMinutes: defaultNominalMins,
      windAdjustedRemainingMinutes: defaultNominalMins,
      nominalETA,
      windAdjustedETA: nominalETA,
      deltaMinutes: 0,
      headwindKnots: 0,
      tailwindKnots: 0,
      crosswindKnots: 0,
      relativeAngleDeg: 0,
      effectType: 'calm',
      windSpeedKnots,
      windDirectionDeg,
      windDirectionCardinal,
      badgeLabel: 'মাটিতে অবস্থানরত (Parked)',
      badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
      summarySentenceBn: 'বিমানটি বর্তমানে রানওয়ে বা টার্মিনালে অবস্থান করছে, ক্রুজ বায়ুপ্রবাহ কার্যকর নয়।',
      detailedPhysicsBn: 'গ্রাউন্ড অপারেশনে টার্মিনাল উইন্ড ভেক্টর কার্যকর থাকে না।',
      effectiveGroundSpeedKmh: 0,
      stillAirSpeedKmh: 0,
    };
  }

  // 1. Heading and Wind Vector Trigonometry
  const track = flight.trueTrack ?? 0;
  let relAngle = Math.abs(windDirectionDeg - track) % 360;
  if (relAngle > 180) relAngle = 360 - relAngle;

  const rad = ((windDirectionDeg - track) * Math.PI) / 180;
  // Headwind = wind blowing towards face of aircraft (positive = headwind, negative = tailwind)
  const headwindKnots = Math.round(windSpeedKnots * Math.cos(rad));
  const tailwindKnots = -headwindKnots;
  const crosswindKnots = Math.round(Math.abs(windSpeedKnots * Math.sin(rad)));

  // 2. Airspeeds in km/h (1 knot = 1.852 km/h)
  const measuredGroundSpeedKmh = Math.round((flight.velocity ?? 220) * 3.6);
  const headwindKmh = headwindKnots * 1.852;
  
  // Nominal True Airspeed (TAS) = GroundSpeed + Headwind
  const stillAirSpeedKmh = Math.max(Math.round(measuredGroundSpeedKmh + headwindKmh), 220);

  // 3. Time differential computation (deltaMinutes)
  // Distance / Speed calculations:
  // t_nominal = (D / TAS) * 60
  // t_wind = (D / (TAS - Headwind)) * 60
  const adjustedGroundSpeedKmh = Math.max(stillAirSpeedKmh - headwindKmh, 160);
  const nominalFlightHours = distKm / stillAirSpeedKmh;
  const windFlightHours = distKm / adjustedGroundSpeedKmh;
  
  let computedDeltaMins = Math.round((windFlightHours - nominalFlightHours) * 60);

  // Add crosswind crab drift drag penalty if crosswind is stiff (> 14 kt)
  if (crosswindKnots >= 14 && stillAirSpeedKmh > 300) {
    const crabDragFactor = 0.5; // ~0.5 - 1 min steering correction
    computedDeltaMins += Math.round(crabDragFactor);
  }

  // Determine effect classification
  let effectType: 'tailwind' | 'headwind' | 'crosswind' | 'calm' = 'calm';
  let badgeLabel = 'বাতাস শান্ত (Calm)';
  let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let summarySentenceBn = 'গতিপথে বাতাসের প্রভাব নগণ্য, স্বাভাবিক অবতরণ সময় অপরিবর্তিত রয়েছে।';

  if (tailwindKnots >= 6) {
    effectType = 'tailwind';
    // Ensure deltaMinutes is negative (time saved)
    computedDeltaMins = computedDeltaMins <= 0 ? computedDeltaMins : -Math.max(Math.abs(computedDeltaMins), 1);
    // Cap reasonable delta for radar zone
    computedDeltaMins = Math.max(computedDeltaMins, -15);
    badgeLabel = `💨 +${tailwindKnots}kt টেলউইন্ড (${Math.abs(computedDeltaMins)}মি. আগে)`;
    badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    summarySentenceBn = `অনুকূল টেলউইন্ডের কারণে বিমানের গতি বেড়েছে এবং অবতরণ সময় প্রায় ${Math.abs(computedDeltaMins)} মিনিট এগিয়েছে।`;
  } else if (headwindKnots >= 6) {
    effectType = 'headwind';
    // Ensure deltaMinutes is positive (delay)
    computedDeltaMins = computedDeltaMins >= 0 ? computedDeltaMins : Math.max(Math.abs(computedDeltaMins), 1);
    computedDeltaMins = Math.min(computedDeltaMins, 20);
    badgeLabel = `⚠️ -${headwindKnots}kt হেডউইন্ড (+${computedDeltaMins}মি. বিলম্ব)`;
    badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    summarySentenceBn = `বিপরীতমুখী হেডউইন্ডের কারণে বিমানের গ্রাউন্ড স্পিড কিছুটা হ্রাস পেয়েছে, ফলে অবতরণ প্রায় ${computedDeltaMins} মিনিট পিছিয়ে গেছে।`;
  } else if (crosswindKnots >= 8) {
    effectType = 'crosswind';
    computedDeltaMins = Math.max(computedDeltaMins, 0);
    badgeLabel = `↔️ ${crosswindKnots}kt ক্রসউইন্ড`;
    badgeClass = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    summarySentenceBn = `পার্শ্বীয় ক্রসউইন্ডের কারণে অটোপাইলট ড্রাফ্ট কারেকশন কার্যকর রয়েছে (অবতরণে প্রভাব নগণ্য: +${computedDeltaMins} মি.)।`;
  } else {
    computedDeltaMins = 0;
  }

  const windAdjustedMins = Math.max(defaultNominalMins + computedDeltaMins, 3);
  const nominalETA = new Date(now.getTime() + defaultNominalMins * 60000);
  const windAdjustedETA = new Date(now.getTime() + windAdjustedMins * 60000);

  const detailedPhysicsBn = `ভেক্টর হিসাব: বাতাসের দিক ${windDirectionDeg}° (${windDirectionCardinal}) ও গতি ${windSpeedKnots} নট। বিমানের হেডিং ${Math.round(track)}° সাপেক্ষে কোণ ${Math.round(relAngle)}°। হেডউইন্ড: ${headwindKnots >= 0 ? `+${headwindKnots}` : headwindKnots} kt ($V_w \\cos\\theta$), ক্রসউইন্ড: ${crosswindKnots} kt ($V_w \\sin\\theta$)।`;

  return {
    nominalRemainingMinutes: defaultNominalMins,
    windAdjustedRemainingMinutes: windAdjustedMins,
    nominalETA,
    windAdjustedETA,
    deltaMinutes: computedDeltaMins,
    headwindKnots,
    tailwindKnots,
    crosswindKnots,
    relativeAngleDeg: Math.round(relAngle),
    effectType,
    windSpeedKnots,
    windDirectionDeg,
    windDirectionCardinal,
    badgeLabel,
    badgeClass,
    summarySentenceBn,
    detailedPhysicsBn,
    effectiveGroundSpeedKmh: adjustedGroundSpeedKmh,
    stillAirSpeedKmh,
  };
}
