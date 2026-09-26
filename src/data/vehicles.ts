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
  additionalFuel?: string;
  body: string;
  featured: boolean;
  featuredOrder?: number;
  status?: "available" | "reserved" | "sold" | "hidden";
  tag?: "offer" | "new" | "low-mileage" | "none";
  image: string;
  gallery: string[];
  imageCredit?: {
    author: string;
    license: string;
    sourceUrl: string;
  };
  highlights: string[];
  description: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
};

const demoVehiclePhotos = {
  gol: "https://commons.wikimedia.org/wiki/Special:FilePath/VW_Gol_2009_front.jpg?width=1280",
  corsa: "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian_Chevy_Corsa.jpg?width=1280",
  tucson: "https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_Tucson_.jpg?width=1280",
  corolla:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Corolla_(50316620921).jpg?width=1280",
  hilux:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Hilux_(50722639491).jpg?width=1280",
  onix: "https://commons.wikimedia.org/wiki/Special:FilePath/Chevrolet_Onix.JPG?width=1280",
  tracker:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Chevrolet_Tracker_1.8_LT_Highway_2017_(52780903018).jpg?width=1280",
  yaris: "https://commons.wikimedia.org/wiki/Special:FilePath/Yaris.jpg?width=1280",
} as const;

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
    body: "Sedã",
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
    body: "Picape",
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
  {
    slug: "volkswagen-gol-2022",
    brand: "Volkswagen",
    model: "Gol",
    version: "1.0 MPI",
    year: 2022,
    price: 58900,
    mileage: 42800,
    transmission: "Manual",
    fuel: "Flex",
    body: "Hatchback",
    featured: false,
    status: "available",
    tag: "none",
    image: demoVehiclePhotos.gol,
    gallery: [demoVehiclePhotos.gol],
    imageCredit: {
      author: "Wikimedia Commons",
      license: "Domínio público",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VW_Gol_2009_front.jpg",
    },
    highlights: ["Econômico", "Revisado", "Documentação em dia"],
    description:
      "Hatch compacto conhecido pela mecânica confiável e baixo custo de manutenção. Ótima opção para o dia a dia, primeiro carro ou trabalho.",
  },
  {
    slug: "chevrolet-corsa-2011",
    brand: "Chevrolet",
    model: "Corsa",
    version: "1.4 Maxx",
    year: 2011,
    price: 32900,
    mileage: 98400,
    transmission: "Manual",
    fuel: "Flex",
    body: "Hatchback",
    featured: false,
    status: "available",
    tag: "offer",
    image: demoVehiclePhotos.corsa,
    gallery: [demoVehiclePhotos.corsa],
    imageCredit: {
      author: "Renzo Maia",
      license: "CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Brazilian_Chevy_Corsa.jpg",
    },
    highlights: ["Motor 1.4", "Ar-condicionado", "Ótimo custo-benefício"],
    description:
      "Compacto prático e confortável, com manutenção simples e amplo histórico de procura no mercado de seminovos.",
  },
  {
    slug: "hyundai-tucson-2018",
    brand: "Hyundai",
    model: "Tucson",
    version: "GL 1.6 Turbo",
    year: 2018,
    price: 109900,
    mileage: 63700,
    transmission: "Automático",
    fuel: "Gasolina",
    body: "SUV",
    featured: true,
    featuredOrder: 5,
    status: "available",
    tag: "low-mileage",
    image: demoVehiclePhotos.tucson,
    gallery: [demoVehiclePhotos.tucson],
    imageCredit: {
      author: "IFCAR",
      license: "Domínio público",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hyundai_Tucson_.jpg",
    },
    highlights: ["Teto panorâmico", "Câmera de ré", "Interior espaçoso"],
    description:
      "SUV com design marcante, excelente posição de dirigir e pacote completo para quem busca conforto e segurança em família.",
  },
  {
    slug: "toyota-corolla-2021",
    brand: "Toyota",
    model: "Corolla",
    version: "XEi 2.0",
    year: 2021,
    price: 134900,
    mileage: 45200,
    transmission: "Automático",
    fuel: "Flex",
    body: "Sedã",
    featured: true,
    featuredOrder: 4,
    status: "available",
    tag: "new",
    image: demoVehiclePhotos.corolla,
    gallery: [demoVehiclePhotos.corolla],
    imageCredit: {
      author: "crash71100",
      license: "CC0 1.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Toyota_Corolla_(50316620921).jpg",
    },
    highlights: ["Único dono", "Revisões em dia", "Multimídia"],
    description:
      "Sedã reconhecido pela confiabilidade, conforto e ótima liquidez. Veículo selecionado para uma compra tranquila.",
  },
  {
    slug: "toyota-hilux-2020",
    brand: "Toyota",
    model: "Hilux",
    version: "SRX 2.8 Diesel 4x4",
    year: 2020,
    price: 229900,
    mileage: 78200,
    transmission: "Automático",
    fuel: "Diesel",
    body: "Picape",
    featured: false,
    status: "available",
    tag: "none",
    image: demoVehiclePhotos.hilux,
    gallery: [demoVehiclePhotos.hilux],
    imageCredit: {
      author: "crash71100",
      license: "CC0 1.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Toyota_Hilux_(50722639491).jpg",
    },
    highlights: ["Tração 4x4", "Cabine dupla", "Capota marítima"],
    description:
      "Picape robusta com capacidade para trabalho e conforto para viagens, preparada para diferentes tipos de terreno.",
  },
  {
    slug: "chevrolet-onix-2023",
    brand: "Chevrolet",
    model: "Onix",
    version: "LT 1.0 Turbo",
    year: 2023,
    price: 82900,
    mileage: 21700,
    transmission: "Automático",
    fuel: "Flex",
    body: "Hatchback",
    featured: false,
    status: "available",
    tag: "low-mileage",
    image: demoVehiclePhotos.onix,
    gallery: [demoVehiclePhotos.onix],
    imageCredit: {
      author: "Matti Blume",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chevrolet_Onix.JPG",
    },
    highlights: ["Turbo", "Baixa quilometragem", "Controle de estabilidade"],
    description:
      "Hatch moderno, econômico e equipado, ideal para quem quer conectividade e praticidade sem abrir mão do desempenho.",
  },
  {
    slug: "chevrolet-tracker-2022",
    brand: "Chevrolet",
    model: "Tracker",
    version: "Premier 1.2 Turbo",
    year: 2022,
    price: 119900,
    mileage: 35400,
    transmission: "Automático",
    fuel: "Flex",
    body: "SUV",
    featured: false,
    status: "available",
    tag: "none",
    image: demoVehiclePhotos.tracker,
    gallery: [demoVehiclePhotos.tracker],
    imageCredit: {
      author: "Wikimedia Commons",
      license: "Ver licença na fonte",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Chevrolet_Tracker_1.8_LT_Highway_2017_(52780903018).jpg",
    },
    highlights: ["Wi-Fi nativo", "Chave presencial", "Seis airbags"],
    description:
      "SUV compacto com tecnologia, boa altura do solo e excelente conjunto para a rotina urbana e viagens curtas.",
  },
  {
    slug: "toyota-yaris-2022",
    brand: "Toyota",
    model: "Yaris",
    version: "XS 1.5",
    year: 2022,
    price: 89900,
    mileage: 38800,
    transmission: "Automático",
    fuel: "Flex",
    body: "Hatchback",
    featured: false,
    status: "available",
    tag: "none",
    image: demoVehiclePhotos.yaris,
    gallery: [demoVehiclePhotos.yaris],
    imageCredit: {
      author: "Roman Tworkowski",
      license: "CC BY 2.5 / GFDL",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Yaris.jpg",
    },
    highlights: ["Câmbio CVT", "Econômico", "Revisado"],
    description:
      "Hatch compacto com condução suave, boa eficiência e padrão de confiabilidade para uso diário.",
  },
];

export const demoCatalogVehicleSlugs = [
  "volkswagen-gol-2022",
  "chevrolet-corsa-2011",
  "hyundai-tucson-2018",
  "toyota-corolla-2021",
  "toyota-hilux-2020",
  "chevrolet-onix-2023",
  "chevrolet-tracker-2022",
  "toyota-yaris-2022",
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
