// OSRM (Open Source Routing Machine) - Free routing service, no API key required

export interface RouteResult {
  coordinates: [number, number][]; // [lng, lat] format for Leaflet
  distance: number; // meters
  duration: number; // seconds
}

export interface OSRMRoute {
  geometry: {
    coordinates: [number, number][];
  };
  legs: {
    distance: number;
    duration: number;
  }[];
}

export async function getRoutes(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult[]> {
  // OSRM expects coordinates in lng,lat format
  const url = `https://router.project-osrm.org/route/v1/foot/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Routing request failed");
  }

  const data = await response.json();

  if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
    throw new Error("No routes found");
  }

  return data.routes.map((route: OSRMRoute) => ({
    coordinates: route.geometry.coordinates,
    distance: route.legs.reduce((sum, leg) => sum + leg.distance, 0),
    duration: route.legs.reduce((sum, leg) => sum + leg.duration, 0),
  }));
}

// Get alternative routes by using different profiles or waypoints
export async function getAlternativeRoutes(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult[]> {
  const routes: RouteResult[] = [];

  // Get walking routes (primary for safety app)
  try {
    const walkingRoutes = await getRoutes(originLat, originLng, destLat, destLng);
    routes.push(...walkingRoutes);
  } catch (e) {
    console.error("Failed to get walking routes:", e);
  }

  // If we only got one route, try to create synthetic alternatives
  // by requesting bike routes which may take different paths
  if (routes.length < 2) {
    try {
      const bikeUrl = `https://router.project-osrm.org/route/v1/bike/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const bikeResponse = await fetch(bikeUrl);
      if (bikeResponse.ok) {
        const bikeData = await bikeResponse.json();
        if (bikeData.code === "Ok" && bikeData.routes?.length > 0) {
          const bikeRoute = bikeData.routes[0];
          routes.push({
            coordinates: bikeRoute.geometry.coordinates,
            distance: bikeRoute.legs.reduce((sum: number, leg: any) => sum + leg.distance, 0),
            // Adjust duration for walking speed
            duration: bikeRoute.legs.reduce((sum: number, leg: any) => sum + leg.duration, 0) * 3,
          });
        }
      }
    } catch (e) {
      console.error("Failed to get alternative routes:", e);
    }
  }

  // Try driving route as another alternative (may take main roads)
  if (routes.length < 3) {
    try {
      const carUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const carResponse = await fetch(carUrl);
      if (carResponse.ok) {
        const carData = await carResponse.json();
        if (carData.code === "Ok" && carData.routes?.length > 0) {
          const carRoute = carData.routes[0];
          routes.push({
            coordinates: carRoute.geometry.coordinates,
            distance: carRoute.legs.reduce((sum: number, leg: any) => sum + leg.distance, 0),
            // Adjust duration for walking speed (roughly 5x slower than driving)
            duration: carRoute.legs.reduce((sum: number, leg: any) => sum + leg.duration, 0) * 5,
          });
        }
      }
    } catch (e) {
      console.error("Failed to get car routes:", e);
    }
  }

  return routes;
}
