import heroImage from "@/assets/auto-hero.jpg";
import coupeImage from "@/assets/vehicle-coupe.jpg";
import pickupImage from "@/assets/vehicle-pickup.jpg";
import sedanImage from "@/assets/vehicle-sedan.jpg";
import suvImage from "@/assets/vehicle-suv.jpg";

export type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  body: string;
  featured: boolean;
  featuredOrder?: number;
  status?: "available" | "reserved" | "sold" | "hidden";
  tag?: "offer" | "new" | "low-mileage" | "none";
  image: string;
  gallery: string[];
  highlights: string[];
  description: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
};

export const whatsappNumber = "5511999999999";

export const vehicles: Vehicle[] = [
  {
    slug: "aurum-sport-coupe-2023",
    brand: "Aurum",
    model: "Sport Coupé",
    version: "3.0 Performance",
    year: 2023,
    price: 389900,
    mileage: 11800,
    transmission: "Automático",
    fuel: "Gasolina",
    body: "Coupé",
    featured: true,
    featuredOrder: 1,
    status: "available",
    tag: "new",
    image: coupeImage,
    gallery: [coupeImage, heroImage, sedanImage],
    highlights: ["Pacote esportivo", "Interior premium", "Baixa quilometragem"],
    description:
      "Coupé de perfil esportivo com acabamento refinado, conjunto mecânico forte e histórico de manutenção criterioso. Uma opção para quem busca presença, desempenho e conforto no uso diário.",
  },
  {
    slug: "nobre-executive-sedan-2024",
    brand: "Nobre",
    model: "Executive Sedan",
    version: "2.0 Turbo Prestige",
    year: 2024,
    price: 324900,
    mileage: 6200,
    transmission: "Automático",
    fuel: "Flex",
    body: "Sedan",
    featured: true,
    featuredOrder: 2,
    status: "available",
    tag: "low-mileage",
    image: sedanImage,
    gallery: [sedanImage, heroImage, suvImage],
    highlights: ["Único dono", "Garantia de fábrica", "Revisões em dia"],
    description:
      "Sedan executivo com excelente nível de conforto, tecnologia embarcada e ótima eficiência para viagens. Veículo selecionado com procedência verificada e documentação pronta para transferência.",
  },
  {
    slug: "vertex-premium-suv-2022",
    brand: "Vertex",
    model: "Premium SUV",
    version: "AWD Signature",
    year: 2022,
    price: 279900,
    mileage: 26500,
    transmission: "Automático",
    fuel: "Gasolina",
    body: "SUV",
    featured: true,
    featuredOrder: 3,
    status: "available",
    tag: "offer",
    image: suvImage,
    gallery: [suvImage, heroImage, pickupImage],
    highlights: ["Tração integral", "Teto panorâmico", "Sete airbags"],
    description:
      "SUV premium com cabine espaçosa, condução elevada e pacote completo de segurança. Ideal para família, estrada e rotina urbana com alto padrão de acabamento.",
  },
  {
    slug: "terra-lux-pickup-2023",
    brand: "Terra",
    model: "Lux Pickup",
    version: "Diesel Highline 4x4",
    year: 2023,
    price: 299900,
    mileage: 18400,
    transmission: "Automático",
    fuel: "Diesel",
    body: "Pickup",
    featured: false,
    featuredOrder: 4,
    status: "available",
    tag: "none",
    image: pickupImage,
    gallery: [pickupImage, suvImage, heroImage],
    highlights: ["4x4", "Capota marítima", "Central multimídia"],
    description:
      "Pickup robusta com proposta premium, excelente capacidade de carga e conforto para longas viagens. Pronta para trabalho, lazer e uso familiar.",
  },
];

export const featuredVehicles = vehicles.filter((vehicle) => vehicle.featured);

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function getVehicleBySlug(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
