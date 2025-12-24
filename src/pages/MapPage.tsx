import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { SafetyMap } from "@/components/SafetyMap";
import { RouteSearch } from "@/components/RouteSearch";
import { SOSButton } from "@/components/SOSButton";
import { SafetyScore } from "@/components/SafetyScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedRoute, Location, processRoutes } from "@/lib/safetyData";
import { getAlternativeRoutes } from "@/lib/routing";
import { toast } from "sonner";

const MapPage = () => {
  const [routes, setRoutes] = useState<CalculatedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<CalculatedRoute | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const handleSearch = useCallback(async (origin: Location, destination: Location) => {
    setIsSearching(true);
    setRoutes([]);
    setSelectedRoute(null);

    try {
      const osrmRoutes = await getAlternativeRoutes(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
      );

      if (osrmRoutes.length === 0) {
        toast.error("No routes found between these locations");
        return;
      }

      const calculatedRoutes = processRoutes(osrmRoutes, origin, destination);
      setRoutes(calculatedRoutes);
      
      // Auto-select the safest route
      if (calculatedRoutes.length > 0) {
        setSelectedRoute(calculatedRoutes[0]);
        
        // Center map on route
        const midpoint = osrmRoutes[0].coordinates[Math.floor(osrmRoutes[0].coordinates.length / 2)];
        setMapCenter({ lat: midpoint[1], lng: midpoint[0] });
      }

      toast.success(`Found ${calculatedRoutes.length} route${calculatedRoutes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Routing error:", error);
      toast.error("Failed to find routes. Please try different locations.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleRouteClick = (route: CalculatedRoute) => {
    setSelectedRoute(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 h-screen flex">
        <div className="w-full md:w-96 p-4 space-y-4 overflow-y-auto">
          <RouteSearch
            onSearch={handleSearch}
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            isSearching={isSearching}
          />

          {selectedRoute && (
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Selected Route</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{selectedRoute.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedRoute.totalDistance / 1000).toFixed(1)} km • {selectedRoute.estimatedTime} min
                  </p>
                </div>
                <SafetyScore score={selectedRoute.overallSafetyScore} size="sm" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex-1 relative">
          <SafetyMap
            selectedRoute={selectedRoute}
            routes={routes}
            onLocationUpdate={setUserLocation}
            onRouteClick={handleRouteClick}
            center={mapCenter}
          />
        </div>

        <SOSButton userLocation={userLocation} />
      </main>
    </div>
  );
};

export default MapPage;
