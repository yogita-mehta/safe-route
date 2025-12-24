// Nominatim (OpenStreetMap) Geocoding Service - Free, no API key required

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  placeId: string;
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) return [];
  
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
    {
      headers: {
        "User-Agent": "SafeRoute-App/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Geocoding request failed");
  }

  const data = await response.json();
  
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name,
    placeId: item.place_id.toString(),
  }));
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    {
      headers: {
        "User-Agent": "SafeRoute-App/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding request failed");
  }

  const data = await response.json();
  return data.display_name || "Unknown location";
}
