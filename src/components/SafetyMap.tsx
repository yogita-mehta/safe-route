import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CalculatedRoute, generateSafetyZonesForArea } from "@/lib/safetyData";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface SafetyMapProps {
  selectedRoute: CalculatedRoute | null;
  routes: CalculatedRoute[];
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
  onRouteClick?: (route: CalculatedRoute) => void;
  center?: { lat: number; lng: number } | null;
}

function getRouteColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getZoneColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function MapController({ 
  selectedRoute, 
  center 
}: { 
  selectedRoute: CalculatedRoute | null;
  center?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedRoute && selectedRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds(
        selectedRoute.coordinates.map((coord) => [coord[1], coord[0]] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView([center.lat, center.lng], 14);
    }
  }, [selectedRoute, center, map]);

  return null;
}

function SafetyZones({ centerLat, centerLng }: { centerLat: number; centerLng: number }) {
  const zones = useMemo(() => generateSafetyZonesForArea(centerLat, centerLng), [centerLat, centerLng]);
  
  return (
    <>
      {zones.map((zone) => (
        <Circle
          key={zone.id}
          center={[zone.lat, zone.lng]}
          radius={zone.radius}
          pathOptions={{
            color: getZoneColor(zone.safetyScore),
            fillColor: getZoneColor(zone.safetyScore),
            fillOpacity: 0.15,
            weight: 2,
            opacity: 0.5,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Safety Zone</p>
              <p>Safety Score: {zone.safetyScore}</p>
              <p className="text-xs mt-1">
                Lighting: {zone.factors.streetLighting}% • Crime: {zone.factors.crimeRate}%
              </p>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
}

function RoutePolylines({ 
  routes, 
  selectedRoute, 
  onRouteClick 
}: { 
  routes: CalculatedRoute[]; 
  selectedRoute: CalculatedRoute | null;
  onRouteClick: (route: CalculatedRoute) => void;
}) {
  return (
    <>
      {routes.map((route) => {
        const isSelected = selectedRoute?.id === route.id;
        const color = getRouteColor(route.overallSafetyScore);
        const positions = route.coordinates.map((coord) => [coord[1], coord[0]] as [number, number]);

        return (
          <Polyline
            key={route.id}
            positions={positions}
            pathOptions={{
              color,
              weight: isSelected ? 6 : 4,
              opacity: isSelected ? 1 : 0.5,
            }}
            eventHandlers={{
              click: () => onRouteClick(route),
            }}
          >
            <Popup>
              <div className="text-sm space-y-1 min-w-[150px]">
                <p className="font-bold text-base">{route.name}</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span>Safety Score: {route.overallSafetyScore}</span>
                </div>
                <p>Distance: {(route.totalDistance / 1000).toFixed(1)} km</p>
                <p>Est. Time: {route.estimatedTime} min</p>
              </div>
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
}

function UserLocationMarker({ position }: { position: [number, number] }) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>Your location</Popup>
    </Marker>
  );
}

export function SafetyMap({ selectedRoute, routes, onLocationUpdate, onRouteClick, center }: SafetyMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [clickedRoute, setClickedRoute] = useState<CalculatedRoute | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.006 });

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setMapCenter(loc);
          onLocationUpdate?.(loc);
        },
        () => {
          // Use default location if geolocation fails
          console.log("Geolocation not available, using default location");
        },
        { enableHighAccuracy: true }
      );

      // Watch for updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          onLocationUpdate?.(loc);
        },
        undefined,
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [onLocationUpdate]);

  const handleRouteClick = (route: CalculatedRoute) => {
    setClickedRoute(route);
    onRouteClick?.(route);
  };

  // Update map center when route is selected
  const displayCenter = center || mapCenter;

  if (!mapReady) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-background/50">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[displayCenter.lat, displayCenter.lng]}
        zoom={13}
        className="w-full h-full rounded-lg"
        style={{ background: "#1a1a2e" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedRoute={selectedRoute} center={center} />
        <SafetyZones centerLat={displayCenter.lat} centerLng={displayCenter.lng} />
        <RoutePolylines 
          routes={routes} 
          selectedRoute={selectedRoute} 
          onRouteClick={handleRouteClick} 
        />
        {userLocation && <UserLocationMarker position={userLocation} />}
      </MapContainer>

      {clickedRoute && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{clickedRoute.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: getRouteColor(clickedRoute.overallSafetyScore) }}
                />
                <span className="text-sm">Safety Score: {clickedRoute.overallSafetyScore}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {(clickedRoute.totalDistance / 1000).toFixed(1)} km • {clickedRoute.estimatedTime} min
              </p>
            </div>
            <button
              onClick={() => setClickedRoute(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-inset ring-border/50" />
    </div>
  );
}
