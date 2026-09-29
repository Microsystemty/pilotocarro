import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type VehicleFilterState = {
  brand: string;
  query: string;
  year: string;
  price: string;
  transmission: string;
  fuel: string;
  body: string;
  sort: string;
  favoritesOnly: boolean;
};
export const emptyVehicleFilters: VehicleFilterState = {
  brand: "all",
  query: "",
  year: "all",
  price: "all",
  transmission: "all",
  fuel: "all",
  body: "all",
  sort: "featured",
  favoritesOnly: false,
};

export function VehicleFilters({
  value,
  onChange,
  brands,
  years,
  transmissions,
  fuels,
  bodies,
}: {
  value: VehicleFilterState;
  onChange: (filters: VehicleFilterState) => void;
  brands: string[];
  years: number[];
  transmissions: string[];
  fuels: string[];
  bodies: string[];
}) {
  const update = (key: keyof VehicleFilterState, next: string | boolean) =>
    onChange({ ...value, [key]: next });
  return (
    <section
      className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-5"
      aria-label="Filtros de veículos"
    >
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="flex items-center gap-2 font-bold text-foreground">
          <SlidersHorizontal className="h-5 w-5 text-primary" /> Filtrar estoque
        </p>
        <Button variant="ghost" size="sm" onClick={() => onChange(emptyVehicleFilters)}>
          <RotateCcw /> Limpar
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="Marca"
          value={value.brand}
          onValueChange={(next) => update("brand", next)}
          items={brands}
          allLabel="Todas as marcas"
        />
        <div className="grid gap-2">
          <Label htmlFor="modelo">Busca</Label>
          <Input
            id="modelo"
            value={value.query}
            onChange={(event) => update("query", event.target.value)}
            placeholder="Marca, modelo ou versão"
          />
        </div>
        <FilterSelect
          label="Ano"
          value={value.year}
          onValueChange={(next) => update("year", next)}
          items={years.map(String)}
          allLabel="Qualquer ano"
        />
        <FilterSelect
          label="Preço"
          value={value.price}
          onValueChange={(next) => update("price", next)}
          items={[
            "Até R$ 150 mil|150",
            "R$ 150 a 250 mil|250",
            "R$ 250 a 350 mil|350",
            "Acima de R$ 350 mil|351+",
          ]}
          allLabel="Todas as faixas"
        />
        <FilterSelect
          label="Câmbio"
          value={value.transmission}
          onValueChange={(next) => update("transmission", next)}
          items={transmissions}
          allLabel="Todos os câmbios"
        />
        <FilterSelect
          label="Combustível"
          value={value.fuel}
          onValueChange={(next) => update("fuel", next)}
          items={fuels}
          allLabel="Todos os combustíveis"
        />
        <FilterSelect
          label="Categoria"
          value={value.body}
          onValueChange={(next) => update("body", next)}
          items={bodies}
          allLabel="Todas as categorias"
        />
        <FilterSelect
          label="Ordenar"
          value={value.sort}
          onValueChange={(next) => update("sort", next)}
          items={[
            "Destaques|featured",
            "Menor preço|price-asc",
            "Maior preço|price-desc",
            "Mais recentes|year-desc",
            "Menor quilometragem|mileage",
          ]}
          allLabel="Destaques"
          hideAll
        />
      </div>
      <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
        <input
          type="checkbox"
          checked={value.favoritesOnly}
          onChange={(event) => update("favoritesOnly", event.target.checked)}
          className="h-5 w-5 accent-primary"
        />{" "}
        Somente favoritos
      </label>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  items,
  allLabel,
  hideAll = false,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: string[];
  allLabel: string;
  hideAll?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          {!hideAll && <SelectItem value="all">{allLabel}</SelectItem>}
          {items.map((raw) => {
            const [text, itemValue] = raw.split("|");
            return (
              <SelectItem key={itemValue ?? raw} value={itemValue ?? raw}>
                {text}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
