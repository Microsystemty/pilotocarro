import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Settings, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatMileage, type Vehicle } from "@/data/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-premium">
      <Link
        to="/estoque/$slug"
        params={{ slug: vehicle.slug }}
        aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            width={1200}
            height={800}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-5 sm:p-6">
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
        <p className="mt-5 inline-flex rounded-lg bg-primary px-3 py-2 font-display text-2xl font-extrabold text-primary-foreground">
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
          </span>
        </div>
        <Button asChild variant="premium" className="mt-5 w-full rounded-full font-bold">
          <Link to="/estoque/$slug" params={{ slug: vehicle.slug }}>
            Ver detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
