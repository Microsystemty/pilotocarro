import { useEffect, useState } from "react";

export type StoreSettings = {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  logo: string;
  brands: string[];
  motorcycleBrands: string[];
  aboutVideoUrl: string;
  customerGallery: string[];
};

export const defaultStoreSettings: StoreSettings = {
  name: "Prime Motors",
  tagline: "Seu próximo carro",
  phone: "(11) 99999-9999",
  whatsapp: "5511999999999",
  address: "Av. Europa, 1000",
  hours: "Segunda a sábado, 9h às 18h",
  logo: "",
  aboutVideoUrl: "",
  customerGallery: [],
  brands: [
    "Audi",
    "BMW",
    "BYD",
    "CAOA Chery",
    "Chevrolet",
    "Chrysler",
    "Citroën",
    "Dodge",
    "Fiat",
    "Ford",
    "GAC",
    "Geely",
    "GWM",
    "Honda",
    "Hyundai",
    "JAC Motors",
    "Jaecoo",
    "Jeep",
    "Jaguar",
    "Kia",
    "Land Rover",
    "Lexus",
    "Mercedes-Benz",
    "MINI",
    "Mitsubishi",
    "Nissan",
    "Omoda",
    "Peugeot",
    "Porsche",
    "RAM",
    "Renault",
    "Subaru",
    "Suzuki",
    "Troller",
    "Toyota",
    "Volkswagen",
    "Volvo",
    "Zeekr",
  ],
  motorcycleBrands: [
    "Honda",
    "Yamaha",
    "Shineray",
    "Haojue",
    "Bajaj",
    "Royal Enfield",
    "BMW Motorrad",
    "Triumph",
    "Kawasaki",
    "Dafra",
    "Zontes",
    "Suzuki",
    "Ducati",
    "Harley-Davidson",
    "KTM",
    "Husqvarna",
    "TVS Motor Company",
    "Benelli",
    "Piaggio / Vespa",
  ],
};

const storageKey = "prime-motors-store-settings";
const eventName = "prime-motors-settings-change";
const carBrandCatalogMigrationKey = "prime-motors-car-brands-v2";

function readSettings() {
  if (typeof window === "undefined") return defaultStoreSettings;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<StoreSettings>;
    const settings = { ...defaultStoreSettings, ...stored };

    if (!localStorage.getItem(carBrandCatalogMigrationKey)) {
      settings.brands = [...new Set([...defaultStoreSettings.brands, ...(stored.brands ?? [])])].sort(
        (left, right) => left.localeCompare(right, "pt-BR"),
      );
      localStorage.setItem(storageKey, JSON.stringify(settings));
      localStorage.setItem(carBrandCatalogMigrationKey, "true");
    }

    return settings;
  } catch {
    return defaultStoreSettings;
  }
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);

  useEffect(() => {
    const sync = () => setSettings(readSettings());
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const saveSettings = (next: StoreSettings) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setSettings(next);
    window.dispatchEvent(new Event(eventName));
  };

  return { settings, saveSettings };
}
