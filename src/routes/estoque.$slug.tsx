import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Fuel, Gauge, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { formatCurrency, formatMileage, getVehicleBySlug } from "@/data/vehicles";

export const Route = createFileRoute("/estoque/$slug")({
  loader: ({ params }) => {
    const vehicle = getVehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    const vehicle = loaderData?.vehicle;
    const title = vehicle ? `${vehicle.brand} ${vehicle.model} — Prime Motors` : "Veículo não encontrado — Prime Motors";
    const description = vehicle
      ? `${vehicle.year}, ${formatMileage(vehicle.mileage)}, ${vehicle.transmission}, ${vehicle.fuel}. Veja detalhes e fale pelo WhatsApp.`
      : "O veículo solicitado não foi encontrado no estoque.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { vehicle } = Route.useLoaderData();
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
          <Link to="/estoque"><ArrowLeft aria-hidden="true" /> Voltar ao estoque</Link>
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="overflow-hidden border border-border bg-muted shadow-card">
              <img
                src={vehicle.gallery[0] ?? vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={1200}
                height={800}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {vehicle.gallery.map((image, index) => (
                <div key={`${vehicle.slug}-${index}`} className="overflow-hidden border border-border bg-muted">
                  <img
                    src={image}
                    alt={`${vehicle.model} foto ${index + 1}`}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-6 shadow-premium sm:p-8">
              <Badge variant="secondary">{vehicle.body}</Badge>
              <p className="mt-5 text-sm font-semibold uppercase text-primary">{vehicle.brand}</p>
              <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
                {vehicle.model}
              </h1>
              <p className="mt-2 text-muted-foreground">{vehicle.version}</p>
              <p className="mt-6 font-display text-4xl font-semibold text-primary">
                {formatCurrency(vehicle.price)}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="border border-border bg-surface p-4">
                    <spec.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">{spec.label}</p>
                    <p className="mt-1 font-medium text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <WhatsAppButton
                  message={`Olá, tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`}
                  >Tenho interesse</WhatsAppButton>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Descrição</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">Resumo do veículo</h2>
          </div>
          <div>
            <p className="text-base leading-8 text-muted-foreground">{vehicle.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {vehicle.highlights.map((highlight) => (
                <Badge key={highlight} variant="outline">{highlight}</Badge>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
