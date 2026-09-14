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
