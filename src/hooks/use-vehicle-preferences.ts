import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "prime-motors-favorites-v1";
const COMPARE_KEY = "prime-motors-compare-v1";

function readList(key: string) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function useVehiclePreferences() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readList(FAVORITES_KEY));
    setCompare(readList(COMPARE_KEY));
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 3
          ? [...current, slug]
          : current;
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    localStorage.removeItem(COMPARE_KEY);
    setCompare([]);
  }, []);

  return { favorites, compare, toggleFavorite, toggleCompare, clearCompare };
}
