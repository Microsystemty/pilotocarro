import { useCallback, useEffect, useState } from "react";
import {
  demoCatalogVehicleSlugs,
  vehicles as initialVehicles,
  type Vehicle,
} from "@/data/vehicles";

const STORAGE_KEY = "prime-motors-vehicles-v1";
const UPDATE_EVENT = "prime-motors-vehicles-updated";
const DEMO_CATALOG_SEED_KEY = "prime-motors-demo-catalog-v1";

function readVehicles() {
  if (typeof window === "undefined") return initialVehicles;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Vehicle[]) : initialVehicles;
  } catch {
    return initialVehicles;
  }
}

function persistVehicles(nextVehicles: Vehicle[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVehicles));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: nextVehicles }));
}

function seedDemoCatalog(currentVehicles: Vehicle[]) {
  if (typeof window === "undefined" || window.localStorage.getItem(DEMO_CATALOG_SEED_KEY)) {
    return currentVehicles;
  }

  const additionalVehicles = initialVehicles.filter(
    (vehicle) =>
      demoCatalogVehicleSlugs.includes(vehicle.slug) &&
      !currentVehicles.some((current) => current.slug === vehicle.slug),
  );
  window.localStorage.setItem(DEMO_CATALOG_SEED_KEY, "true");
  return additionalVehicles.length ? [...additionalVehicles, ...currentVehicles] : currentVehicles;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedVehicles = readVehicles();
    const seededVehicles = seedDemoCatalog(storedVehicles);
    if (seededVehicles !== storedVehicles) persistVehicles(seededVehicles);
    setVehicles(seededVehicles);
    setReady(true);

    const handleUpdate = (event: Event) => {
      const updated = (event as CustomEvent<Vehicle[]>).detail;
      setVehicles(updated ?? readVehicles());
    };
    const handleStorage = () => setVehicles(readVehicles());

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const saveVehicle = useCallback((vehicle: Vehicle) => {
    const current = readVehicles();
    const index = current.findIndex((item) => item.slug === vehicle.slug);
    const next =
      index >= 0
        ? current.map((item) => (item.slug === vehicle.slug ? vehicle : item))
        : [vehicle, ...current];
    persistVehicles(next);
  }, []);

  const deleteVehicle = useCallback((slug: string) => {
    persistVehicles(readVehicles().filter((vehicle) => vehicle.slug !== slug));
  }, []);

  const replaceVehicles = useCallback((nextVehicles: Vehicle[]) => {
    persistVehicles(nextVehicles);
  }, []);

  return { vehicles, ready, saveVehicle, deleteVehicle, replaceVehicles };
}

export function createVehicleSlug(brand: string, model: string) {
  const base = `${brand}-${model}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export async function imageFileToDataUrl(file: File) {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = raw;
  });

  const maxWidth = 1600;
  const maxHeight = 1200;
  const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return raw;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}
