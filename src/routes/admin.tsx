import { createFileRoute } from "@tanstack/react-router";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, vehicles } from "@/data/vehicles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Prime Motors" },
      { name: "description", content: "Estrutura inicial de painel administrativo para futura gestão de veículos." },
      { property: "og:title", content: "Painel administrativo — Prime Motors" },
      { property: "og:description", content: "Base visual para cadastrar, editar e excluir veículos no futuro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <main className="bg-surface py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-primary">Admin</p>
            <h1 className="truncate font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Gestão de veículos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Estrutura inicial para futuras ações de cadastro, edição e exclusão.
            </p>
          </div>
          <Button variant="premium" className="shrink-0"><Plus aria-hidden="true" /> Novo veículo</Button>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-border bg-card p-5 shadow-card"><p className="text-sm text-muted-foreground">Veículos</p><p className="mt-2 font-display text-3xl font-semibold text-foreground">{vehicles.length}</p></div>
          <div className="border border-border bg-card p-5 shadow-card"><p className="text-sm text-muted-foreground">Destaques</p><p className="mt-2 font-display text-3xl font-semibold text-foreground">{vehicles.filter((vehicle) => vehicle.featured).length}</p></div>
          <div className="border border-border bg-card p-5 shadow-card"><p className="text-sm text-muted-foreground">Status</p><p className="mt-2 font-display text-3xl font-semibold text-foreground">Visual</p></div>
        </section>

        <section className="mt-8 border border-border bg-card shadow-premium">
          <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input className="pl-9" placeholder="Buscar veículo" />
            </div>
            <Badge variant="outline" className="w-fit">CRUD futuro</Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.slug}>
                    <TableCell className="min-w-64">
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={vehicle.image} alt="" loading="lazy" width={80} height={56} className="h-14 w-20 shrink-0 object-cover" />
                        <div className="min-w-0"><p className="truncate font-medium text-foreground">{vehicle.brand} {vehicle.model}</p><p className="truncate text-sm text-muted-foreground">{vehicle.version}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                    <TableCell><Badge variant={vehicle.featured ? "default" : "secondary"}>{vehicle.featured ? "Destaque" : "Estoque"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" aria-label="Editar veículo"><Edit3 aria-hidden="true" /></Button>
                        <Button variant="outline" size="icon" aria-label="Excluir veículo"><Trash2 aria-hidden="true" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
