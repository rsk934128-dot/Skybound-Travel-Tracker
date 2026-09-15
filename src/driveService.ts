import { DestinationVisaInfo, FlightState } from './types';

/**
 * Creates a formatted travel itinerary & visa checklist document directly into user's Google Drive.
 */
export async function saveVisaChecklistToDrive(
  accessToken: string,
  visaInfo: DestinationVisaInfo,
  flight?: FlightState | null
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const fileName = `Travel-Visa-Guide-${visaInfo.countryName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
  
  const content = `========================================================================
✈️ SKYBOUND & TRAVEL TRACKER: VISA & FLIGHT TRAVEL BRIEF
========================================================================
Generated on: ${new Date().toLocaleString()}

1. DESTINATION INFORMATION:
------------------------------------------------------------------------
Country: ${visaInfo.countryName} (${visaInfo.countryNameBn}) ${visaInfo.flagEmoji}
Capital City: ${visaInfo.capital}
Region: ${visaInfo.region}

2. VISA STATUS FOR BANGLADESHI CITIZENS:
------------------------------------------------------------------------
Category: ${visaInfo.visaCategory.toUpperCase()}
Permitted Stay Duration: ${visaInfo.stayDuration} (${visaInfo.stayDurationBn})
Estimated Visa/Processing Fee: ${visaInfo.feeEstimate}
Guideline Summary: ${visaInfo.notes} (${visaInfo.notesBn})

3. KEY ENTRY REQUIREMENTS:
------------------------------------------------------------------------
${visaInfo.keyRequirements.map((req, i) => `[ ] ${i + 1}. ${req}`).join('\n')}

4. MANDATORY TRAVEL DOCUMENTS CHECKLIST:
------------------------------------------------------------------------
${visaInfo.documentsNeeded.map((doc, i) => `[ ] ${i + 1}. ${doc}`).join('\n')}

${flight ? `5. ASSOCIATED OVERHEAD FLIGHT DETAILS:
------------------------------------------------------------------------
Flight Callsign: ${flight.callsign || 'N/A'}
Airline: ${flight.airlineName || 'N/A'}
Route: ${flight.estimatedOrigin?.city || 'Origin'} ➔ ${flight.estimatedDestination?.city || 'Destination'}
Current Altitude: ${flight.baroAltitude ? `${Math.round(flight.baroAltitude * 3.28084)} ft (${flight.baroAltitude} m)` : 'Ground / N/A'}
Speed: ${flight.velocity ? `${Math.round(flight.velocity * 3.6)} km/h` : 'N/A'}
Flight Status: ${flight.onGround ? 'On Ground / Taxiway' : 'In Flight / Overhead'}
` : ''}

========================================================================
Safe travels from Skybound & Travel Tracker! Keep this document saved on your Google Drive.
========================================================================
`;

  // Use multipart upload to create file with metadata & text body
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: `Travel visa guideline for ${visaInfo.countryName} generated via Skybound & Travel Tracker.`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload document to Google Drive: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Saves arbitrary text/markdown documents directly to Google Drive.
 */
export async function saveCustomDocumentToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  description?: string
): Promise<{ success: boolean; fileId?: string; fileUrl?: string; error?: string }> {
  try {
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'text/plain',
      description: description || `Document saved via SkyBound Bangladesh & Travel Tracker.`,
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
      content +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Drive error: ${response.status} ${errorText}` };
    }

    const data = await response.json();
    return { success: true, fileId: data.id, fileUrl: data.webViewLink };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * List files created with the app in Google Drive
 */
export async function listAppFilesFromDrive(accessToken: string): Promise<any[]> {
  try {
    const query = encodeURIComponent("mimeType = 'text/plain' and trashed = false");
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,webViewLink)&orderBy=createdTime desc&pageSize=15`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.files || [];
    }
    return [];
  } catch (err) {
    console.error('Failed to list files from Google Drive:', err);
    return [];
  }
}
