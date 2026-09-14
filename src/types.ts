export interface FlightState {
  icao24: string;
  callsign: string;
  originCountry: string;
  timePosition: number | null;
  lastContact: number;
  longitude: number | null;
  latitude: number | null;
  baroAltitude: number | null; // meters
  onGround: boolean;
  velocity: number | null; // m/s
  trueTrack: number | null; // degrees (0-360)
  verticalRate: number | null;
  geoAltitude: number | null;
  squawk: string | null;
  
  // Derived enriched fields
  airlineName?: string;
  aircraftType?: string;
  flightCategory?: 'commercial' | 'private' | 'cargo';
  estimatedOrigin?: {
    code: string;
    city: string;
    country: string;
  };
  estimatedDestination?: {
    code: string;
    city: string;
    country: string;
    countryCode: string;
  };
}

export type VisaCategory = 'visa-free' | 'visa-on-arrival' | 'eta-evisa' | 'visa-required';

export interface DestinationVisaInfo {
  countryCode: string;
  countryName: string;
  countryNameBn: string;
  flagEmoji: string;
  capital: string;
  region: string;
  visaCategory: VisaCategory;
  stayDuration: string;
  stayDurationBn: string;
  feeEstimate: string;
  keyRequirements: string[];
  keyRequirementsBn: string[];
  notes: string;
  notesBn: string;
  officialPortalUrl?: string;
  documentsNeeded: string[];
  destinationImage?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface DriveSavedDocument {
  id: string;
  name: string;
  createdTime: string;
  webViewLink?: string;
  countryName: string;
  flightCallsign?: string;
}
