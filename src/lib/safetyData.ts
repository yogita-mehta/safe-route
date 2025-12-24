// Safety scoring for real routes

export interface SafetyZone {
  id: string;
  lat: number;
  lng: number;
  safetyScore: number;
  factors: {
    crimeRate: number;
    streetLighting: number;
    pedestrianTraffic: number;
    sidewalkQuality: number;
  };
  radius: number;
}

export interface RouteSegment {
  id: string;
  startPoint: [number, number];
  endPoint: [number, number];
  safetyScore: number;
  distance: number;
}

export interface CalculatedRoute {
  id: string;
  name: string;
  segments: RouteSegment[];
  totalDistance: number;
  estimatedTime: number;
  overallSafetyScore: number;
  coordinates: [number, number][];
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

// Calculate safety score for a route based on various factors
// In a real app, this would query actual crime/lighting data
export function calculateRouteSafetyScore(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 50;

  // Simulate safety scoring based on route characteristics
  // In production, this would use real data APIs
  let baseScore = 70;
  
  // Longer routes through more areas = more variability
  const routeLength = coordinates.length;
  const variability = Math.sin(routeLength * 0.5) * 15;
  
  // Calculate route "straightness" - more direct routes often follow main roads
  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];
  const directDistance = haversineDistance(start[1], start[0], end[1], end[0]);
  
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(
      coordinates[i][1], coordinates[i][0],
      coordinates[i + 1][1], coordinates[i + 1][0]
    );
  }
  
  const directnessRatio = directDistance / Math.max(totalDistance, 1);
  
  // More direct routes often mean main roads = better lighting, more traffic
  const directnessBonus = directnessRatio * 20;
  
  // Add some deterministic variation based on coordinates
  const coordHash = coordinates.reduce((acc, coord) => acc + coord[0] * 1000 + coord[1], 0);
  const hashVariation = (Math.sin(coordHash) * 10);
  
  const finalScore = Math.round(
    Math.max(30, Math.min(95, baseScore + variability + directnessBonus + hashVariation))
  );
  
  return finalScore;
}

// Haversine formula for distance calculation
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getSafetyLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Very Safe", color: "safe" };
  if (score >= 60) return { label: "Moderately Safe", color: "caution" };
  if (score >= 40) return { label: "Use Caution", color: "warning" };
  return { label: "High Risk", color: "danger" };
}

// Convert OSRM routes to CalculatedRoutes with safety scores
export function processRoutes(
  routes: { coordinates: [number, number][]; distance: number; duration: number }[],
  origin: Location,
  destination: Location
): CalculatedRoute[] {
  const routeNames = ["Primary Route", "Alternative Route", "Scenic Route"];
  
  return routes.map((route, index) => {
    const safetyScore = calculateRouteSafetyScore(route.coordinates);
    
    return {
      id: `route-${index}`,
      name: routeNames[index] || `Route ${index + 1}`,
      segments: [],
      totalDistance: route.distance,
      estimatedTime: Math.round(route.duration / 60),
      overallSafetyScore: safetyScore,
      coordinates: route.coordinates,
    };
  }).sort((a, b) => b.overallSafetyScore - a.overallSafetyScore);
}

// Generate dynamic safety zones around the current map view
export function generateSafetyZonesForArea(
  centerLat: number,
  centerLng: number,
  count: number = 8
): SafetyZone[] {
  const zones: SafetyZone[] = [];
  const radius = 0.015; // Roughly 1.5km spread
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = radius * (0.5 + Math.random() * 0.5);
    const lat = centerLat + Math.sin(angle) * distance;
    const lng = centerLng + Math.cos(angle) * distance;
    
    // Generate deterministic but varied safety scores
    const seed = lat * 1000 + lng;
    const safetyScore = Math.round(40 + Math.abs(Math.sin(seed) * 55));
    
    zones.push({
      id: `zone-${i}`,
      lat,
      lng,
      safetyScore,
      factors: {
        crimeRate: Math.round(100 - safetyScore + Math.random() * 10),
        streetLighting: Math.round(safetyScore - 10 + Math.random() * 20),
        pedestrianTraffic: Math.round(safetyScore - 5 + Math.random() * 15),
        sidewalkQuality: Math.round(safetyScore + Math.random() * 10),
      },
      radius: 200 + Math.random() * 300,
    });
  }
  
  return zones;
}
