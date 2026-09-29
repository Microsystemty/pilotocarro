import { Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Fuel, Gauge, Heart, Scale, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatMileage, type Vehicle } from "@/data/vehicles";
import { useVehiclePreferences } from "@/hooks/use-vehicle-preferences";

const tagLabels = { offer: "Oferta", new: "Novidade", "low-mileage": "Baixa km", none: "" };
const statusLabels = {
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
  hidden: "Oculto",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { favorites, compare, toggleFavorite, toggleCompare } = useVehiclePreferences();
  const favorite = favorites.includes(vehicle.slug);
  const comparing = compare.includes(vehicle.slug);
  return (
    <Card className="vehicle-card-premium group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-premium">
      <Link
        to="/estoque/$slug"
        params={{ slug: vehicle.slug }}
        aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}
      >
        <div className="vehicle-card-premium__image relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            width={1200}
            height={800}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
           <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
             <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur">
               <CheckCircle2 className="h-3.5 w-3.5 text-whatsapp" />
               {statusLabels[vehicle.status ?? "available"]}
             </Badge>
            {vehicle.tag && vehicle.tag !== "none" && <Badge>{tagLabels[vehicle.tag]}</Badge>}
          </div>
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.preventDefault();
                toggleFavorite(vehicle.slug);
              }}
              className="h-11 w-11 rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur hover:text-primary"
              aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.preventDefault();
                toggleCompare(vehicle.slug);
              }}
              className={`h-11 w-11 rounded-full bg-background/90 shadow-lg backdrop-blur ${comparing ? "text-primary" : "text-foreground hover:text-primary"}`}
              aria-label={comparing ? "Remover da comparação" : "Adicionar à comparação"}
            >
              <Scale className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
       <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              {vehicle.brand}
            </p>
            <h3 className="mt-1 truncate font-display text-xl font-extrabold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">{vehicle.version}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {vehicle.body}
          </Badge>
        </div>
         <p className="mt-5 font-sans text-2xl font-extrabold text-foreground">
          {formatCurrency(vehicle.price)}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" /> {vehicle.year}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Gauge className="h-4 w-4 shrink-0 text-primary" /> {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Settings className="h-4 w-4 shrink-0 text-primary" /> {vehicle.transmission}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Fuel className="h-4 w-4 shrink-0 text-primary" /> {vehicle.fuel}
            {vehicle.additionalFuel ? ` + ${vehicle.additionalFuel}` : ""}
          </span>
        </div>
         <Button asChild variant="premium" className="mt-auto w-full rounded-full font-bold">
          <Link to="/estoque/$slug" params={{ slug: vehicle.slug }}>
            Ver detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
