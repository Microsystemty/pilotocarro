import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleFilters } from "@/components/site/vehicle-filters";
import { useVehicles } from "@/hooks/use-vehicles";

export const Route = createFileRoute("/estoque/")({
  head: () => ({
    meta: [
      { title: "Estoque — Prime Motors" },
      {
        name: "description",
        content: "Consulte o estoque da Prime Motors com veículos, fotos e informações completas.",
      },
      { property: "og:title", content: "Estoque — Prime Motors" },
      {
        property: "og:description",
        content: "Veja veículos disponíveis em uma vitrine organizada e responsiva.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StockPage,
});

function StockPage() {
  const { vehicles } = useVehicles();

  return (
    <main>
      <PageHero
        eyebrow="Estoque"
        title="Encontre o veículo ideal para você."
        description="Consulte fotos, características e informações completas de cada veículo disponível."
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VehicleFilters />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
