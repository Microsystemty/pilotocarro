import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Edit3, ImagePlus, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, type Vehicle } from "@/data/vehicles";
import { createVehicleSlug, imageFileToDataUrl, useVehicles } from "@/hooks/use-vehicles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Gestão de veículos — Prime Motors" },
      { name: "description", content: "Área reservada para gestão do estoque." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type VehicleForm = Omit<Vehicle, "slug" | "image" | "gallery" | "highlights"> & {
  slug?: string;
  gallery: string[];
  highlights: string;
};

const emptyForm: VehicleForm = {
  brand: "",
  model: "",
  version: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  transmission: "Automático",
  fuel: "Flex",
  body: "SUV",
  featured: false,
  gallery: [],
  highlights: "",
  description: "",
};

function vehicleToForm(vehicle: Vehicle): VehicleForm {
  return {
    ...vehicle,
    gallery: vehicle.gallery.length ? vehicle.gallery : [vehicle.image],
    highlights: vehicle.highlights.join(", "),
  };
}

function VehicleFormDialog({
  open,
  vehicle,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  vehicle: Vehicle | null;
  onOpenChange: (open: boolean) => void;
  onSave: (vehicle: Vehicle) => void;
}) {
  const [form, setForm] = useState<VehicleForm>(vehicle ? vehicleToForm(vehicle) : emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const remaining = Math.max(0, 8 - form.gallery.length);
      const selected = Array.from(files).slice(0, remaining);
      const images = await Promise.all(selected.map(imageFileToDataUrl));
      setForm((current) => ({ ...current, gallery: [...current.gallery, ...images] }));
    } catch {
      setError("Não foi possível processar uma das imagens.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!form.gallery.length) {
      setError("Adicione pelo menos uma foto do veículo.");
      return;
    }

    const savedVehicle: Vehicle = {
      slug: form.slug ?? createVehicleSlug(form.brand, form.model),
      brand: form.brand.trim(),
      model: form.model.trim(),
      version: form.version.trim(),
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      transmission: form.transmission.trim(),
      fuel: form.fuel.trim(),
      body: form.body.trim(),
      featured: form.featured,
      image: form.gallery[0],
      gallery: form.gallery,
      highlights: form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: form.description.trim(),
    };

    try {
      onSave(savedVehicle);
      onOpenChange(false);
    } catch {
      setError(
        "O navegador ficou sem espaço para salvar. Reduza a quantidade ou o tamanho das fotos.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Editar veículo" : "Cadastrar veículo"}</DialogTitle>
          <DialogDescription>
            Preencha os dados e adicione até oito fotos. A primeira será a imagem principal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Marca" required>
              <Input
                value={form.brand}
                onChange={(event) => update("brand", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Modelo" required>
              <Input
                value={form.model}
                onChange={(event) => update("model", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Versão" required>
              <Input
                value={form.version}
                onChange={(event) => update("version", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Ano" required>
              <Input
                type="number"
                min="1900"
                max="2100"
                value={form.year}
                onChange={(event) => update("year", Number(event.target.value))}
                required
              />
            </FormField>
            <FormField label="Preço" required>
              <Input
                type="number"
                min="0"
                step="100"
                value={form.price}
                onChange={(event) => update("price", Number(event.target.value))}
                required
              />
            </FormField>
            <FormField label="Quilometragem" required>
              <Input
                type="number"
                min="0"
                value={form.mileage}
                onChange={(event) => update("mileage", Number(event.target.value))}
                required
              />
            </FormField>
            <FormField label="Câmbio" required>
              <Input
                value={form.transmission}
                onChange={(event) => update("transmission", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Combustível" required>
              <Input
                value={form.fuel}
                onChange={(event) => update("fuel", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Categoria" required>
              <Input
                value={form.body}
                onChange={(event) => update("body", event.target.value)}
                placeholder="SUV, Sedan, Pickup..."
                required
              />
            </FormField>
          </div>

          <FormField label="Destaques">
            <Input
              value={form.highlights}
              onChange={(event) => update("highlights", event.target.value)}
              placeholder="Único dono, revisado, garantia"
            />
            <p className="text-xs text-muted-foreground">Separe os itens por vírgulas.</p>
          </FormField>
          <FormField label="Descrição" required>
            <Textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="min-h-28"
              required
            />
          </FormField>

          <div className="grid gap-3">
            <Label>Fotos do veículo</Label>
            <label className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/60 bg-primary/5 px-4 text-sm font-semibold text-primary hover:bg-primary/10">
              {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              {uploading ? "Processando imagens..." : "Selecionar imagens"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                disabled={uploading || form.gallery.length >= 8}
                onChange={(event) => void handleImages(event.target.files)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              {form.gallery.length}/8 fotos adicionadas
            </p>
            {form.gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.gallery.map((image, index) => (
                  <div
                    key={`${image.slice(-24)}-${index}`}
                    className="group relative overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    {index === 0 && <Badge className="absolute bottom-2 left-2">Principal</Badge>}
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "gallery",
                          form.gallery.filter((_, imageIndex) => imageIndex !== index),
                        )
                      }
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground opacity-100 shadow lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label={`Remover foto ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm font-medium">
            <Checkbox
              checked={form.featured}
              onCheckedChange={(checked) => update("featured", checked === true)}
            />
            Exibir este veículo nos destaques da página inicial
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" disabled={uploading}>
              {vehicle ? "Salvar alterações" : "Cadastrar veículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function AdminPage() {
  const { vehicles, saveVehicle, deleteVehicle } = useVehicles();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return vehicles;
    return vehicles.filter((vehicle) =>
      `${vehicle.brand} ${vehicle.model} ${vehicle.version}`.toLowerCase().includes(term),
    );
  }, [search, vehicles]);

  const openNewVehicle = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };

  const handleSave = (vehicle: Vehicle) => {
    saveVehicle(vehicle);
    setFeedback(
      editingVehicle ? "Veículo atualizado com sucesso." : "Veículo cadastrado com sucesso.",
    );
  };

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
              Área reservada
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Gestão de veículos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Cadastre, edite e remova veículos do estoque. As alterações aparecem imediatamente no
              site.
            </p>
          </div>
          <Button variant="premium" onClick={openNewVehicle}>
            <Plus /> Novo veículo
          </Button>
        </div>

        {feedback && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm font-medium text-whatsapp"
          >
            {feedback}
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Veículos cadastrados" value={vehicles.length} />
          <Metric
            label="Em destaque"
            value={vehicles.filter((vehicle) => vehicle.featured).length}
          />
          <Metric
            label="Fotos armazenadas"
            value={vehicles.reduce((total, vehicle) => total + vehicle.gallery.length, 0)}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
          <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por marca, modelo ou versão"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Badge variant="outline">{filteredVehicles.length} resultado(s)</Badge>
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
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.slug}>
                    <TableCell className="min-w-64">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt=""
                          className="h-14 w-20 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {vehicle.version} · {vehicle.gallery.length} foto(s)
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.featured ? "default" : "secondary"}>
                        {vehicle.featured ? "Destaque" : "Estoque"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Editar ${vehicle.brand} ${vehicle.model}`}
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit3 />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Excluir ${vehicle.brand} ${vehicle.model}`}
                            >
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir este veículo?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O anúncio de {vehicle.brand} {vehicle.model} será removido do
                                estoque. Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                  deleteVehicle(vehicle.slug);
                                  setFeedback("Veículo excluído do estoque.");
                                }}
                              >
                                Excluir veículo
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!filteredVehicles.length && (
              <p className="p-10 text-center text-sm text-muted-foreground">
                Nenhum veículo encontrado.
              </p>
            )}
          </div>
        </section>
      </div>
      {dialogOpen && (
        <VehicleFormDialog
          key={editingVehicle?.slug ?? "new"}
          open={dialogOpen}
          vehicle={editingVehicle}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}
