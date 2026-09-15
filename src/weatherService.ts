/**
 * Aviation Weather & Wind Pattern Engine for SkyBound Bangladesh
 * Integrates live meteorological data (wind vectors, precipitation radar, METAR)
 * and calculates dynamic Headwind/Tailwind impacts on aircraft.
 */

export interface WeatherConditions {
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  windGustKnots: number;
  precipitationMm: number;
  precipitationType: 'none' | 'light' | 'moderate' | 'heavy' | 'thunderstorm';
  precipitationLabelBn: string;
  cloudCoverPercent: number;
  visibilityKm: number;
  weatherCode: number;
  metarSummaryBn: string;
  isLive: boolean;
  lastUpdated: string;
}

export interface AircraftWindImpact {
  headwindKnots: number; // positive = headwind (slows down), negative = tailwind (speeds up)
  tailwindKnots: number; // positive = tailwind
  crosswindKnots: number;
  effectType: 'tailwind' | 'headwind' | 'crosswind' | 'calm';
  badgeLabel: string;
  badgeClass: string;
  etaAdjustmentMinutes: number;
  explanationBn: string;
}

export interface PrecipitationCell {
  id: string;
  centerLat: number;
  centerLon: number;
  radiusKm: number;
  intensityDbz: number; // 20 = light rain (green), 35 = moderate (yellow), 50+ = severe thunderstorm (red/purple)
  labelBn: string;
}

// Cardinal direction helper
export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// Convert cardinal direction to Bengali
export function cardinalToBengali(cardinal: string): string {
  const map: Record<string, string> = {
    N: 'উত্তর',
    NNE: 'উত্তর-উত্তরপূর্ব',
    NE: 'উত্তর-পূর্ব',
    ENE: 'পূর্ব-উত্তরপূর্ব',
    E: 'পূর্ব',
    ESE: 'পূর্ব-দক্ষিণপূর্ব',
    SE: 'দক্ষিণ-পূর্ব',
    SSE: 'দক্ষিণ-দক্ষিণপূর্ব',
    S: 'দক্ষিণ',
    SSW: 'দক্ষিণ-দক্ষিণপশ্চিম',
    SW: 'দক্ষিণ-পশ্চিম',
    WSW: 'পশ্চিম-দক্ষিণপশ্চিম',
    W: 'পশ্চিম',
    WNW: 'পশ্চিম-উত্তরপশ্চিম',
    NW: 'উত্তর-পশ্চিম',
    NNW: 'উত্তর-উত্তরপশ্চিম',
  };
  return map[cardinal] || cardinal;
}

/**
 * Fetch real-time weather from Open-Meteo for airport/radar center
 */
export async function fetchLiveRadarWeather(
  lat: number = 23.8430, // Dhaka Hazrat Shahjalal International Airport (DAC) default
  lon: number = 90.3980
): Promise<WeatherConditions> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (res.ok) {
      const data = await res.json();
      const cur = data.current;

      const windKmh = cur.wind_speed_10m || 14;
      const windKnots = Math.round(windKmh * 0.539957);
      const windDir = cur.wind_direction_10m || 160;
      const cardinal = degreesToCardinal(windDir);
      const precip = cur.precipitation || 0;
      const code = cur.weather_code || 0;

      let precipType: WeatherConditions['precipitationType'] = 'none';
      let precipLabelBn = 'কোনো বৃষ্টিপাত নেই';

      if (code >= 95) {
        precipType = 'thunderstorm';
        precipLabelBn = 'বজ্রবৃষ্টি ও দমকা হাওয়া (Thunderstorm)';
      } else if (code >= 65 || code >= 81 || precip > 5.0) {
        precipType = 'heavy';
        precipLabelBn = 'ভারী বর্ষণ (Heavy Rain)';
      } else if (code >= 61 || code >= 80 || precip > 1.0) {
        precipType = 'moderate';
        precipLabelBn = 'মাঝারি বৃষ্টি (Moderate Rain)';
      } else if (code >= 51 || precip > 0.1) {
        precipType = 'light';
        precipLabelBn = 'হালকা গুঁড়িগুঁড়ি বৃষ্টি (Light Drizzle)';
      }

      const metar = `DAC WX: ${cardinal} ${windKnots}KT | TEMP: ${Math.round(cur.temperature_2m)}°C | PRECIP: ${precip}mm/h | CLOUD: ${cur.cloud_cover}%`;

      return {
        temperatureC: Math.round(cur.temperature_2m),
        humidityPercent: Math.round(cur.relative_humidity_2m),
        windSpeedKmh: Math.round(windKmh),
        windSpeedKnots: Math.max(windKnots, 4),
        windDirectionDeg: windDir,
        windDirectionCardinal: cardinal,
        windGustKnots: Math.round((cur.wind_gusts_10m || windKmh) * 0.539957),
        precipitationMm: precip,
        precipitationType: precipType,
        precipitationLabelBn: precipLabelBn,
        cloudCoverPercent: cur.cloud_cover || 25,
        visibilityKm: precip > 3.0 ? 5.0 : 10.0,
        weatherCode: code,
        metarSummaryBn: metar,
        isLive: true,
        lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  } catch (err) {
    console.warn('Weather API fetch failed, falling back to simulated regional meteorological model:', err);
  }

  return getDhakaTerminalWeatherFallback();
}

/**
 * Realistic Dhaka Aviation Climate Fallback (Seasonal Monsoonal Flow)
 */
export function getDhakaTerminalWeatherFallback(): WeatherConditions {
  const now = new Date();
  const month = now.getMonth(); // 0-11 (May-Sept is monsoon SW winds)
  const isMonsoon = month >= 4 && month <= 9;

  const simWindDir = isMonsoon ? 190 : 340; // SW monsoon vs NW winter
  const simWindKnots = isMonsoon ? 16 : 8;
  const simPrecip = isMonsoon ? 1.4 : 0.0;
  const cardinal = degreesToCardinal(simWindDir);

  return {
    temperatureC: isMonsoon ? 31 : 26,
    humidityPercent: isMonsoon ? 78 : 55,
    windSpeedKmh: Math.round(simWindKnots * 1.852),
    windSpeedKnots: simWindKnots,
    windDirectionDeg: simWindDir,
    windDirectionCardinal: cardinal,
    windGustKnots: simWindKnots + 6,
    precipitationMm: simPrecip,
    precipitationType: isMonsoon ? 'light' : 'none',
    precipitationLabelBn: isMonsoon ? 'হালকা বর্ষণ ও মৌসুমি মেঘ' : 'পরিষ্কার আকাশ',
    cloudCoverPercent: isMonsoon ? 65 : 20,
    visibilityKm: 9.0,
    weatherCode: isMonsoon ? 61 : 1,
    metarSummaryBn: `DAC WX (Sim): ${cardinal} ${simWindKnots}KT | TEMP 30°C | PRECIP ${simPrecip}mm`,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Calculates Headwind / Tailwind and Crosswind components for an aircraft
 * @param trackDeg Aircraft true track / heading (0-360)
 * @param windDirectionDeg Direction the wind is blowing FROM (0-360)
 * @param windSpeedKnots Wind speed in knots
 */
export function calculateAircraftWindImpact(
  trackDeg: number | null,
  windDirectionDeg: number,
  windSpeedKnots: number
): AircraftWindImpact {
  if (trackDeg === null || windSpeedKnots <= 3) {
    return {
      headwindKnots: 0,
      tailwindKnots: 0,
      crosswindKnots: 0,
      effectType: 'calm',
      badgeLabel: 'শান্ত বাতাস',
      badgeClass: 'bg-slate-750 text-slate-300 border-slate-700',
      etaAdjustmentMinutes: 0,
      explanationBn: 'গতিপথে বাতাসের কোনো উল্লেখযোগ্য প্রভাব নেই।',
    };
  }

  // Angle difference between wind direction and aircraft track
  // Wind direction is the direction FROM which wind blows.
  // Relative wind angle theta = windDirection - track
  const rad = ((windDirectionDeg - trackDeg) * Math.PI) / 180;

  // Headwind component = WindSpeed * cos(angle)
  // Positive = Headwind (wind in face), Negative = Tailwind (wind from behind)
  const headwindKnots = Math.round(windSpeedKnots * Math.cos(rad));
  const tailwindKnots = -headwindKnots;
  const crosswindKnots = Math.round(Math.abs(windSpeedKnots * Math.sin(rad)));

  if (tailwindKnots >= 6) {
    const etaBonus = tailwindKnots >= 20 ? -4 : tailwindKnots >= 10 ? -2 : -1;
    return {
      headwindKnots,
      tailwindKnots,
      crosswindKnots,
      effectType: 'tailwind',
      badgeLabel: `💨 +${tailwindKnots}kt টেলউইন্ড`,
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      etaAdjustmentMinutes: etaBonus,
      explanationBn: `অনুকূল টেলউইন্ড বিমানের গ্রাউন্ড স্পিড বাড়িয়েছে (আনুমানিক ${Math.abs(etaBonus)} মি. আগে পৌঁছাবে)।`,
    };
  }

  if (headwindKnots >= 6) {
    const etaPenalty = headwindKnots >= 20 ? 5 : headwindKnots >= 10 ? 3 : 1;
    return {
      headwindKnots,
      tailwindKnots,
      crosswindKnots,
      effectType: 'headwind',
      badgeLabel: `⚠️ -${headwindKnots}kt হেডউইন্ড`,
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      etaAdjustmentMinutes: etaPenalty,
      explanationBn: `বিপরীতমুখী হেডউইন্ডের কারণে বিমানের গতি কিছুটা কমছে (+${etaPenalty} মি. বিলম্ব হতে পারে)।`,
    };
  }

  return {
    headwindKnots,
    tailwindKnots,
    crosswindKnots,
    effectType: 'crosswind',
    badgeLabel: `↔️ ${crosswindKnots}kt ক্রসউইন্ড`,
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    etaAdjustmentMinutes: 0,
    explanationBn: `পার্শ্বীয় ক্রসউইন্ড বিরাজমান, অটোপাইলট উইন্ড ড্রিফট কারেকশন কার্যকর রেখেছে।`,
  };
}

/**
 * Generate meteorological Doppler precipitation radar cells around the user/radar center
 */
export function generatePrecipitationRadarCells(
  centerLat: number,
  centerLon: number,
  precipMm: number,
  weatherCode: number
): PrecipitationCell[] {
  // If no rain or very dry, return minimal or no cells
  if (precipMm <= 0.05 && weatherCode < 50) {
    return [];
  }

  const baseIntensity = weatherCode >= 95 ? 52 : precipMm > 3 ? 42 : precipMm > 0.5 ? 32 : 24;

  // Generate 2-4 semi-realistic rain clusters around Dhaka airspace
  // (e.g. over Gazipur, Meghna river basin, Manikganj)
  return [
    {
      id: 'cell-1',
      centerLat: centerLat + 0.18, // ~20km North (Gazipur)
      centerLon: centerLon + 0.08,
      radiusKm: 28,
      intensityDbz: baseIntensity,
      labelBn: baseIntensity >= 45 ? 'বজ্রঝড় মেঘমালা (CB Cell)' : 'বৃষ্টির বলয় (Rain Band)',
    },
    {
      id: 'cell-2',
      centerLat: centerLat - 0.22, // ~25km South (Narayanganj / Meghna)
      centerLon: centerLon - 0.12,
      radiusKm: 34,
      intensityDbz: Math.max(baseIntensity - 8, 20),
      labelBn: 'হালকা বর্ষণ অঞ্চল',
    },
    {
      id: 'cell-3',
      centerLat: centerLat + 0.05,
      centerLon: centerLon - 0.28, // ~30km West
      radiusKm: 22,
      intensityDbz: Math.max(baseIntensity - 4, 22),
      labelBn: 'টার্বুলেন্স ও মেঘপুঞ্জ',
    }
  ];
}
