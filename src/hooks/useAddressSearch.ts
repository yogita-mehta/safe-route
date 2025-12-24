import { useState, useEffect, useCallback } from "react";
import { searchAddress, GeocodingResult } from "@/lib/geocoding";

export function useAddressSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchAddress(query);
        setResults(data);
      } catch (e) {
        setError("Failed to search addresses");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clear,
  };
}
