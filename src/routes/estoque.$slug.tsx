import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Fuel, Gauge, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { formatCurrency, formatMileage } from "@/data/vehicles";
import { useVehicles } from "@/hooks/use-vehicles";

export const Route = createFileRoute("/estoque/$slug")({
  head: () => ({
    meta: [
      { title: "Detalhes do veículo — Prime Motors" },
      { name: "description", content: "Veja fotos, preço e informações completas do veículo." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { slug } = Route.useParams();
  const { vehicles, ready } = useVehicles();
  const vehicle = vehicles.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (vehicle) setSelectedImage(vehicle.gallery[0] ?? vehicle.image);
  }, [vehicle]);

  if (!vehicle) {
    if (!ready) {
      return (
        <main className="min-h-[50vh] bg-background p-10 text-center text-muted-foreground">
          Carregando veículo...
        </main>
      );
    }
    return (
      <main className="grid min-h-[55vh] place-items-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">Veículo não encontrado</h1>
          <p className="mt-3 text-muted-foreground">
            Este anúncio pode ter sido removido do estoque.
          </p>
          <Button asChild variant="premium" className="mt-6">
            <Link to="/estoque">Voltar ao estoque</Link>
          </Button>
        </div>
      </main>
    );
  }

  const gallery = vehicle.gallery.length ? vehicle.gallery : [vehicle.image];
  const specs = [
    { label: "Ano", value: vehicle.year, icon: CalendarDays },
    { label: "Quilometragem", value: formatMileage(vehicle.mileage), icon: Gauge },
    { label: "Câmbio", value: vehicle.transmission, icon: Settings },
    { label: "Combustível", value: vehicle.fuel, icon: Fuel },
  ];

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/estoque">
            <ArrowLeft /> Voltar ao estoque
          </Link>
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
              <img
                src={selectedImage || gallery[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${vehicle.slug}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-lg border-2 bg-muted transition ${selectedImage === image ? "border-primary" : "border-border hover:border-primary/60"}`}
                  aria-label={`Exibir foto ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${vehicle.model} foto ${index + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
              <Badge variant="secondary">{vehicle.body}</Badge>
              <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                {vehicle.brand}
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold text-foreground">
                {vehicle.model}
              </h1>
              <p className="mt-2 text-muted-foreground">{vehicle.version}</p>
              <p className="mt-6 font-display text-4xl font-extrabold text-primary">
                {formatCurrency(vehicle.price)}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-border bg-surface p-4">
                    <spec.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">
                      {spec.label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <WhatsAppButton
                  message={`Olá, tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`}
                >
                  Tenho interesse
                </WhatsAppButton>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
              Descrição
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground">
              Resumo do veículo
            </h2>
          </div>
          <div>
            <p className="text-base leading-8 text-muted-foreground">{vehicle.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {vehicle.highlights.map((highlight) => (
                <Badge key={highlight} variant="outline">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
