import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/site/vehicle-card";
import { emptyVehicleFilters, VehicleFilters } from "@/components/site/vehicle-filters";
import { formatCurrency } from "@/data/vehicles";
import { useVehiclePreferences } from "@/hooks/use-vehicle-preferences";
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
  const { favorites, compare, clearCompare, toggleCompare } = useVehiclePreferences();
  const [filters, setFilters] = useState(emptyVehicleFilters);
  const visibleVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status !== "hidden"),
    [vehicles],
  );
  const filteredVehicles = useMemo(() => {
    const result = visibleVehicles.filter((vehicle) => {
      const text = `${vehicle.brand} ${vehicle.model} ${vehicle.version}`.toLowerCase();
      const priceOk =
        filters.price === "all" ||
        (filters.price === "150" && vehicle.price <= 150000) ||
        (filters.price === "250" && vehicle.price > 150000 && vehicle.price <= 250000) ||
        (filters.price === "350" && vehicle.price > 250000 && vehicle.price <= 350000) ||
        (filters.price === "351+" && vehicle.price > 350000);
      return (
        (filters.brand === "all" || vehicle.brand === filters.brand) &&
        (!filters.query || text.includes(filters.query.toLowerCase())) &&
        (filters.year === "all" || vehicle.year === Number(filters.year)) &&
        priceOk &&
        (filters.transmission === "all" || vehicle.transmission === filters.transmission) &&
        (filters.fuel === "all" ||
          vehicle.fuel === filters.fuel ||
          vehicle.additionalFuel === filters.fuel) &&
        (filters.body === "all" || vehicle.body === filters.body) &&
        (!filters.favoritesOnly || favorites.includes(vehicle.slug))
      );
    });
    return [...result].sort((a, b) =>
      filters.sort === "price-asc"
        ? a.price - b.price
        : filters.sort === "price-desc"
          ? b.price - a.price
          : filters.sort === "year-desc"
            ? b.year - a.year
            : filters.sort === "mileage"
              ? a.mileage - b.mileage
              : (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99),
    );
  }, [visibleVehicles, filters, favorites]);
  const compared = compare
    .map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
    .filter(Boolean);

  return (
    <main>
      <PageHero
        eyebrow="Estoque"
        title="Encontre o veículo ideal para você."
        description="Consulte fotos, características e informações completas de cada veículo disponível."
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VehicleFilters
            value={filters}
            onChange={setFilters}
            brands={[...new Set(visibleVehicles.map((v) => v.brand))]}
            years={[...new Set(visibleVehicles.map((v) => v.year))].sort((a, b) => b - a)}
            transmissions={[...new Set(visibleVehicles.map((v) => v.transmission))]}
            fuels={[
              ...new Set(
                visibleVehicles.flatMap((vehicle) =>
                  vehicle.additionalFuel ? [vehicle.fuel, vehicle.additionalFuel] : [vehicle.fuel],
                ),
              ),
            ]}
            bodies={[...new Set(visibleVehicles.map((v) => v.body))]}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{filteredVehicles.length}</strong> veículo(s)
              encontrado(s)
            </p>
            {compare.length > 0 && (
              <Button variant="outline" onClick={clearCompare}>
                <Scale /> Comparar ({compare.length})
              </Button>
            )}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
          {!filteredVehicles.length && (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Nenhum veículo corresponde aos filtros selecionados.
            </div>
          )}
          {compared.length > 0 && (
            <section className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold">Comparação</h2>
                <Button variant="ghost" onClick={clearCompare}>
                  <X /> Limpar
                </Button>
              </div>
              <div
                className="grid min-w-[640px] gap-4"
                style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(0, 1fr))` }}
              >
                {compared.map(
                  (vehicle) =>
                    vehicle && (
                      <div key={vehicle.slug} className="rounded-xl border border-border p-4">
                        <img
                          src={vehicle.image}
                          alt=""
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                        />
                        <h3 className="mt-3 font-bold">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="mt-2 text-xl font-extrabold text-primary">
                          {formatCurrency(vehicle.price)}
                        </p>
                        <dl className="mt-4 grid gap-2 text-sm text-muted-foreground">
                          <div>
                            Ano: <strong className="text-foreground">{vehicle.year}</strong>
                          </div>
                          <div>
                            Km:{" "}
                            <strong className="text-foreground">
                              {vehicle.mileage.toLocaleString("pt-BR")}
                            </strong>
                          </div>
                          <div>
                            Câmbio:{" "}
                            <strong className="text-foreground">{vehicle.transmission}</strong>
                          </div>
                        </dl>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3"
                          onClick={() => toggleCompare(vehicle.slug)}
                        >
                          Remover
                        </Button>
                        <Button asChild variant="premium" size="sm" className="mt-3 ml-2">
                          <Link to="/estoque/$slug" params={{ slug: vehicle.slug }}>
                            Detalhes
                          </Link>
                        </Button>
                      </div>
                    ),
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
