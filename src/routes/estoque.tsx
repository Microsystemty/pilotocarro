import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleFilters } from "@/components/site/vehicle-filters";
import { useVehicles } from "@/hooks/use-vehicles";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque — Prime Motors" },
      {
        name: "description",
        content:
          "Consulte o estoque inicial da Prime Motors com cards de veículos e filtros por marca, modelo, ano e preço.",
      },
      { property: "og:title", content: "Estoque — Prime Motors" },
      {
        property: "og:description",
        content: "Veja veículos disponíveis em uma vitrine premium, organizada e responsiva.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        title="Uma vitrine clara para veículos selecionados."
        description="Filtros básicos e cards padronizados deixam a navegação pronta para receber estoque real futuramente."
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
