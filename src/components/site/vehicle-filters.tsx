import { SlidersHorizontal } from "lucide-react";
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

export function VehicleFilters() {
  return (
    <section className="border border-border bg-card p-4 shadow-card sm:p-5" aria-label="Filtros de veículos">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="grid gap-2">
          <Label>Marca</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Todas as marcas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as marcas</SelectItem>
              <SelectItem value="aurum">Aurum</SelectItem>
              <SelectItem value="nobre">Nobre</SelectItem>
              <SelectItem value="vertex">Vertex</SelectItem>
              <SelectItem value="terra">Terra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" placeholder="Ex.: SUV, sedan" />
        </div>
        <div className="grid gap-2">
          <Label>Ano</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Qualquer ano" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Qualquer ano</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Preço</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Faixa de preço" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as faixas</SelectItem>
              <SelectItem value="ate-250">Até R$ 250 mil</SelectItem>
              <SelectItem value="250-350">R$ 250 mil a R$ 350 mil</SelectItem>
              <SelectItem value="350-plus">Acima de R$ 350 mil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="premium" className="w-full lg:w-auto">
          <SlidersHorizontal aria-hidden="true" />
          Filtrar
        </Button>
      </div>
    </section>
  );
}
