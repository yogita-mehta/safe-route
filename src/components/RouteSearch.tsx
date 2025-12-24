import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Navigation, Clock, Route, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyScore } from "./SafetyScore";
import { CalculatedRoute, Location } from "@/lib/safetyData";
import { useAddressSearch } from "@/hooks/useAddressSearch";
import { GeocodingResult } from "@/lib/geocoding";
import { cn } from "@/lib/utils";

interface RouteSearchProps {
  onSearch: (origin: Location, destination: Location) => void;
  routes: CalculatedRoute[];
  selectedRoute: CalculatedRoute | null;
  onSelectRoute: (route: CalculatedRoute) => void;
  isSearching: boolean;
}

function AddressInput({
  placeholder,
  icon: Icon,
  iconColor,
  onSelect,
  selectedAddress,
}: {
  placeholder: string;
  icon: typeof MapPin;
  iconColor: string;
  onSelect: (result: GeocodingResult) => void;
  selectedAddress: string;
}) {
  const { query, setQuery, results, isLoading } = useAddressSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedAddress && !isFocused) {
      setDisplayValue(selectedAddress);
    }
  }, [selectedAddress, isFocused]);

  const handleSelect = (result: GeocodingResult) => {
    const shortName = result.displayName.split(",").slice(0, 2).join(", ");
    setDisplayValue(shortName);
    setQuery("");
    setIsFocused(false);
    onSelect(result);
  };

  return (
    <div className="relative">
      <Icon className={cn("absolute left-3 top-1/2 -translate-y-1/2 z-10", iconColor)} size={18} />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={isFocused ? query : displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!isFocused) setDisplayValue(e.target.value);
        }}
        onFocus={() => {
          setIsFocused(true);
          setQuery(displayValue);
        }}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 200);
        }}
        className="pl-10 pr-8"
      />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" size={16} />
      )}
      
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {results.map((result) => (
              <button
                key={result.placeId}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(result)}
              >
                <p className="text-sm font-medium truncate">
                  {result.displayName.split(",")[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {result.displayName.split(",").slice(1, 3).join(",")}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RouteSearch({
  onSearch,
  routes,
  selectedRoute,
  onSelectRoute,
  isSearching,
}: RouteSearchProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [originDisplay, setOriginDisplay] = useState("");
  const [destDisplay, setDestDisplay] = useState("");

  const handleSearch = () => {
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  const handleOriginSelect = (result: GeocodingResult) => {
    setOrigin({ lat: result.lat, lng: result.lng, name: result.displayName });
    setOriginDisplay(result.displayName.split(",").slice(0, 2).join(", "));
  };

  const handleDestSelect = (result: GeocodingResult) => {
    setDestination({ lat: result.lat, lng: result.lng, name: result.displayName });
    setDestDisplay(result.displayName.split(",").slice(0, 2).join(", "));
  };

  const getRouteColor = (score: number) => {
    if (score >= 80) return "border-safe/50 bg-safe/5";
    if (score >= 60) return "border-primary/50 bg-primary/5";
    if (score >= 40) return "border-warning/50 bg-warning/5";
    return "border-danger/50 bg-danger/5";
  };

  return (
    <Card variant="glass" className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Route className="text-primary" size={20} />
          Find Safe Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <AddressInput
            placeholder="Starting point..."
            icon={MapPin}
            iconColor="text-safe"
            onSelect={handleOriginSelect}
            selectedAddress={originDisplay}
          />
          <AddressInput
            placeholder="Destination..."
            icon={Navigation}
            iconColor="text-primary"
            onSelect={handleDestSelect}
            selectedAddress={destDisplay}
          />
          <Button
            onClick={handleSearch}
            disabled={!origin || !destination || isSearching}
            className="w-full"
            variant="hero"
          >
            {isSearching ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Finding routes...
              </>
            ) : (
              <>
                <Search size={18} />
                Search Safe Routes
              </>
            )}
          </Button>
        </div>

        {routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-2"
          >
            <h4 className="text-sm font-semibold text-muted-foreground">
              Available Routes ({routes.length})
            </h4>
            {routes.map((route, index) => (
              <motion.button
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectRoute(route)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  getRouteColor(route.overallSafetyScore),
                  selectedRoute?.id === route.id
                    ? "ring-2 ring-primary"
                    : "hover:scale-[1.02]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground mb-1">
                      {route.name}
                    </h5>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Route size={14} />
                        {(route.totalDistance / 1000).toFixed(1)} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {route.estimatedTime} min
                      </span>
                    </div>
                  </div>
                  <SafetyScore
                    score={route.overallSafetyScore}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
