import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Edit3,
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, type Vehicle } from "@/data/vehicles";
import { createVehicleSlug, imageFileToDataUrl, useVehicles } from "@/hooks/use-vehicles";
import { defaultStoreSettings, useStoreSettings } from "@/hooks/use-store-settings";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminSession,
  listAdminUsers,
  loginAdmin,
  logoutAdmin,
} from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminSession(),
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
  details: Array<{ label: string; value: string }>;
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
  additionalFuel: "none",
  body: "SUV",
  featured: false,
  gallery: [],
  highlights: "",
  description: "",
  details: [],
  status: "available",
  tag: "none",
  featuredOrder: 99,
};

function vehicleToForm(vehicle: Vehicle): VehicleForm {
  return {
    ...vehicle,
    body: vehicle.body === "Sedan" ? "Sedã" : vehicle.body === "Pickup" ? "Picape" : vehicle.body,
    gallery: vehicle.gallery.length ? vehicle.gallery : [vehicle.image],
    highlights: vehicle.highlights.join(", "),
    details: vehicle.details ?? [],
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
  const { settings, saveSettings } = useStoreSettings();
  const [form, setForm] = useState<VehicleForm>(vehicle ? vehicleToForm(vehicle) : emptyForm);
  const [addingBrand, setAddingBrand] = useState(
    Boolean(vehicle?.brand && !settings.brands.includes(vehicle.brand)),
  );
  const [newBrand, setNewBrand] = useState(
    vehicle?.brand && !settings.brands.includes(vehicle.brand) ? vehicle.brand : "",
  );
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
    if (!form.brand.trim()) {
      setError("Selecione uma marca ou adicione uma nova.");
      return;
    }
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
      additionalFuel: form.additionalFuel === "none" ? undefined : form.additionalFuel?.trim(),
      body: form.body.trim(),
      featured: form.featured,
      image: form.gallery[0] ?? "",
      gallery: form.gallery,
      highlights: form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: form.description.trim(),
      details: form.details.filter((detail) => detail.label.trim() && detail.value.trim()),
      status: form.status ?? "available",
      tag: form.tag ?? "none",
      featuredOrder: Number(form.featuredOrder ?? 99),
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
              <Select
                value={addingBrand ? "__new" : form.brand}
                onValueChange={(value) => {
                  if (value === "__new") {
                    setAddingBrand(true);
                    setNewBrand("");
                    update("brand", "");
                  } else {
                    setAddingBrand(false);
                    update("brand", value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {settings.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new">+ Adicionar nova marca</SelectItem>
                </SelectContent>
              </Select>
              {addingBrand && (
                <div className="flex gap-2">
                  <Input
                    value={newBrand}
                    onChange={(event) => setNewBrand(event.target.value)}
                    placeholder="Nome da nova marca"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const brand = newBrand.trim();
                      if (!brand) return;
                      const brands = [...settings.brands, brand]
                        .filter(
                          (item, index, items) =>
                            items.findIndex(
                              (candidate) =>
                                candidate.toLocaleLowerCase("pt-BR") ===
                                item.toLocaleLowerCase("pt-BR"),
                            ) === index,
                        )
                        .sort((a, b) => a.localeCompare(b, "pt-BR"));
                      saveSettings({ ...settings, brands });
                      update("brand", brand);
                      setAddingBrand(false);
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              )}
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
              <Select
                value={form.transmission}
                onValueChange={(value) => update("transmission", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automático">Automático</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Semi-Automático">Semi-Automático</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Combustível" required>
              <Select value={form.fuel} onValueChange={(value) => update("fuel", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flex">Flex</SelectItem>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Álcool">Álcool</SelectItem>
                  <SelectItem value="Elétrico">Elétrico</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Combustível adicional">
              <Select
                value={form.additionalFuel ?? "none"}
                onValueChange={(value) => update("additionalFuel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="GNV">GNV</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Categoria" required>
              <Select value={form.body} onValueChange={(value) => update("body", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Sedã">Sedã</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Picape">Picape</SelectItem>
                  <SelectItem value="Perua">Perua</SelectItem>
                  <SelectItem value="Coupé">Coupé</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Label>Detalhes adicionais</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Adicione informações como cor, motor, portas, tração ou garantia.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update("details", [...form.details, { label: "", value: "" }])}
              >
                <Plus /> Adicionar detalhe
              </Button>
            </div>
            {form.details.map((detail, index) => (
              <div
                key={`detail-${index}`}
                className="grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <Input
                  value={detail.label}
                  placeholder="Nome: Cor"
                  aria-label={`Nome do detalhe ${index + 1}`}
                  onChange={(event) =>
                    update(
                      "details",
                      form.details.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, label: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  value={detail.value}
                  placeholder="Valor: Preto"
                  aria-label={`Valor do detalhe ${index + 1}`}
                  onChange={(event) =>
                    update(
                      "details",
                      form.details.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover detalhe ${index + 1}`}
                  onClick={() =>
                    update(
                      "details",
                      form.details.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>

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
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        className="grid h-8 w-8 place-items-center rounded-full bg-background/90 disabled:opacity-30"
                        aria-label="Mover foto para a esquerda"
                        onClick={() => {
                          const next = [...form.gallery];
                           const current = next[index];
                           const previous = next[index - 1];
                           if (!current || !previous) return;
                           next[index - 1] = current;
                           next[index] = previous;
                          update("gallery", next);
                        }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === form.gallery.length - 1}
                        className="grid h-8 w-8 place-items-center rounded-full bg-background/90 disabled:opacity-30"
                        aria-label="Mover foto para a direita"
                        onClick={() => {
                          const next = [...form.gallery];
                           const current = next[index];
                           const following = next[index + 1];
                           if (!current || !following) return;
                           next[index] = following;
                           next[index + 1] = current;
                          update("gallery", next);
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
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
          <div className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-3">
            <FormField label="Situação do anúncio">
              <Select
                value={form.status ?? "available"}
                onValueChange={(value) => update("status", value as Vehicle["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="hidden">Oculto</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Selo promocional">
              <Select
                value={form.tag ?? "none"}
                onValueChange={(value) => update("tag", value as Vehicle["tag"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="offer">Oferta</SelectItem>
                  <SelectItem value="new">Novidade</SelectItem>
                  <SelectItem value="low-mileage">Baixa km</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Ordem do destaque">
              <Input
                type="number"
                min="1"
                value={form.featuredOrder ?? 99}
                onChange={(event) => update("featuredOrder", Number(event.target.value))}
              />
            </FormField>
          </div>
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
  const initialSession = Route.useLoaderData();
  const [authenticated, setAuthenticated] = useState(initialSession.authenticated);

  if (!authenticated) {
    return <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin({ data: { username, password } });
      if (result.authenticated) onAuthenticated();
      else setError(result.error);
    } catch {
      setError("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[75vh] place-items-center bg-surface px-4 py-12">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
        <div className="border-b border-border bg-foreground px-6 py-8 text-background">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            Área protegida
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Painel administrativo</h1>
          <p className="mt-2 text-sm text-background/70">
            Informe suas credenciais para gerenciar o estoque.
          </p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-5 p-6">
          <FormField label="Usuário" required>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </FormField>
          <FormField label="Senha" required>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-0 top-0 grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button type="submit" variant="premium" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
            {loading ? "Entrando..." : "Entrar no painel"}
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" /> Sessão protegida e expira após 8 horas
          </p>
        </form>
      </section>
    </main>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { vehicles, saveVehicle, deleteVehicle, replaceVehicles } = useVehicles();
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

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const duplicateVehicle = (vehicle: Vehicle) => {
    const copy = {
      ...vehicle,
      slug: createVehicleSlug(vehicle.brand, `${vehicle.model}-copia-${Date.now()}`),
      model: `${vehicle.model} (cópia)`,
      featured: false,
      status: "hidden" as const,
    };
    saveVehicle(copy);
    setFeedback("Cópia criada como anúncio oculto.");
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(vehicles, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `estoque-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data) || data.some((item) => !item.slug || !item.brand || !item.gallery)) {
        throw new Error("invalid");
      }
      replaceVehicles(data as Vehicle[]);
      setFeedback("Backup importado com sucesso.");
    } catch {
      setFeedback("O arquivo selecionado não é um backup válido.");
    }
  };

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void handleLogout()}>
              <LogOut /> Sair
            </Button>
            <Button variant="premium" onClick={openNewVehicle}>
              <Plus /> Novo veículo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="mt-8">
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-card p-1.5 shadow-card sm:w-auto">
            <TabsTrigger value="dashboard" className="gap-2 px-4 py-2.5">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-2 px-4 py-2.5">
              <Edit3 className="h-4 w-4" /> Veículos
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 px-4 py-2.5">
              <Users className="h-4 w-4" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-4 py-2.5">
              <Settings className="h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <AdminDashboardOverview vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="vehicles" className="mt-6">
            {feedback && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm font-medium text-whatsapp"
              >
                {feedback}
              </div>
            )}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <Metric label="Veículos cadastrados" value={vehicles.length} />
              <Metric
                label="Em destaque"
                value={vehicles.filter((vehicle) => vehicle.featured).length}
              />
              <Metric
                label="Fotos armazenadas"
                value={vehicles.reduce((total, vehicle) => total + vehicle.gallery.length, 0)}
              />
              <Metric
                label="Valor do estoque"
                value={formatCurrency(
                  vehicles.reduce((total, vehicle) => total + vehicle.price, 0),
                )}
              />
              <Metric
                label="Preço médio"
                value={formatCurrency(
                  vehicles.length
                    ? vehicles.reduce((total, vehicle) => total + vehicle.price, 0) /
                        vehicles.length
                    : 0,
                )}
              />
            </section>

            <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
              <div className="grid gap-4 border-b border-border p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center sm:p-5">
                <div className="relative min-w-0">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar por marca, modelo ou versão"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportBackup}>
                    <Download /> Exportar
                  </Button>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
                    <Upload className="h-4 w-4" /> Importar
                    <input
                      type="file"
                      accept="application/json"
                      className="sr-only"
                      onChange={(event) => void importBackup(event.target.files?.[0])}
                    />
                  </label>
                  <Badge variant="outline">{filteredVehicles.length} resultado(s)</Badge>
                </div>
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
                          <Badge
                            variant={
                              vehicle.status === "available" || !vehicle.status
                                ? "default"
                                : "secondary"
                            }
                          >
                            {vehicle.status === "reserved"
                              ? "Reservado"
                              : vehicle.status === "sold"
                                ? "Vendido"
                                : vehicle.status === "hidden"
                                  ? "Oculto"
                                  : "Disponível"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="outline" size="icon">
                              <a
                                href={`/estoque/${vehicle.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Visualizar ${vehicle.brand} ${vehicle.model}`}
                              >
                                <Eye />
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Duplicar ${vehicle.brand} ${vehicle.model}`}
                              onClick={() => duplicateVehicle(vehicle)}
                            >
                              <Copy />
                            </Button>
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
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <StoreSettingsPanel />
          </TabsContent>
        </Tabs>
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

type AdminUserSummary = {
  username: string;
  createdAt: string;
  removable: boolean;
};

const dashboardChartConfig = {
  total: { label: "Veículos", color: "var(--chart-1)" },
  value: { label: "Valor", color: "var(--chart-2)" },
} satisfies ChartConfig;

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function AdminDashboardOverview({ vehicles }: { vehicles: Vehicle[] }) {
  const byBrand = useMemo(() => {
    const groups = new Map<string, { name: string; total: number; value: number }>();
    vehicles.forEach((vehicle) => {
      const current = groups.get(vehicle.brand) ?? { name: vehicle.brand, total: 0, value: 0 };
      current.total += 1;
      current.value += vehicle.price;
      groups.set(vehicle.brand, current);
    });
    return [...groups.values()].sort((a, b) => b.total - a.total);
  }, [vehicles]);

  const statusData = useMemo(() => {
    const labels: Record<NonNullable<Vehicle["status"]>, string> = {
      available: "Disponíveis",
      reserved: "Reservados",
      sold: "Vendidos",
      hidden: "Ocultos",
    };
    return Object.entries(labels).map(([status, name]) => ({
      name,
      total: vehicles.filter((vehicle) => (vehicle.status ?? "available") === status).length,
    }));
  }, [vehicles]);

  const byBody = useMemo(() => {
    const groups = new Map<string, number>();
    vehicles.forEach((vehicle) => groups.set(vehicle.body, (groups.get(vehicle.body) ?? 0) + 1));
    return [...groups].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [vehicles]);

  const available = vehicles.filter(
    (vehicle) => (vehicle.status ?? "available") === "available",
  ).length;
  const sold = vehicles.filter((vehicle) => vehicle.status === "sold").length;
  const conversion = vehicles.length ? Math.round((sold / vehicles.length) * 100) : 0;
  const inventoryValue = vehicles
    .filter((vehicle) => vehicle.status !== "sold")
    .reduce((total, vehicle) => total + vehicle.price, 0);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Veículos disponíveis" value={available} />
        <Metric label="Veículos vendidos" value={sold} />
        <Metric label="Taxa de vendas" value={`${conversion}%`} />
        <Metric label="Valor disponível" value={formatCurrency(inventoryValue)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          title="Veículos por fabricante"
          description="Quantidade atual de anúncios por marca."
        >
          <ChartContainer config={dashboardChartConfig} className="h-80 w-full aspect-auto">
            <BarChart data={byBrand} margin={{ left: 0, right: 10, top: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

        <DashboardCard
          title="Situação do estoque"
          description="Distribuição entre disponíveis, reservados, vendidos e ocultos."
        >
          <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <ChartContainer config={dashboardChartConfig} className="h-72 w-full aspect-auto">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusData}
                  dataKey="total"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={96}
                  paddingAngle={3}
                >
                  {statusData.map((item, index) => (
                    <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid gap-3">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="min-w-24 text-muted-foreground">{item.name}</span>
                  <strong>{item.total}</strong>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Categorias do estoque"
          description="Quais tipos de carro formam o catálogo."
        >
          <ChartContainer config={dashboardChartConfig} className="h-72 w-full aspect-auto">
            <BarChart data={byBody} layout="vertical" margin={{ left: 8, right: 18 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={74} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

        <DashboardCard
          title="Valor por fabricante"
          description="Soma do preço anunciado por marca."
        >
          <ChartContainer config={dashboardChartConfig} className="h-72 w-full aspect-auto">
            <BarChart data={byBrand} margin={{ left: 8, right: 8, top: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={54}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-semibold">{formatCurrency(Number(value))}</span>
                    )}
                  />
                }
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </DashboardCard>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <h2 className="font-display text-xl font-extrabold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const refreshUsers = async () => {
    setLoading(true);
    try {
      setUsers(await listAdminUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUsers();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await createAdminUser({ data: { username, password } });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setUsername("");
      setPassword("");
      setDialogOpen(false);
      setFeedback("Usuário adicionado com sucesso.");
      await refreshUsers();
    } catch {
      setError("Não foi possível adicionar o usuário.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUserSummary) => {
    await deleteAdminUser({ data: { username: user.username } });
    setFeedback(`Usuário ${user.username} removido.`);
    await refreshUsers();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Usuários do painel
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie acessos individuais para quem também administra o estoque.
          </p>
        </div>
        <Button variant="premium" onClick={() => setDialogOpen(true)}>
          <UserPlus /> Adicionar usuário
        </Button>
      </div>

      {feedback && (
        <p
          role="status"
          className="m-5 rounded-xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm font-medium text-whatsapp"
        >
          {feedback}
        </p>
      )}

      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="animate-spin" /> Carregando usuários...
          </div>
        ) : (
          users.map((user) => (
            <div key={user.username} className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-bold uppercase text-primary">
                  {user.username.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.removable
                      ? `Criado em ${new Date(user.createdAt).toLocaleDateString("pt-BR")}`
                      : user.createdAt}
                  </p>
                </div>
              </div>
              {user.removable ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Remover usuário ${user.username}`}
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
                      <AlertDialogDescription>
                        O usuário {user.username} não poderá mais entrar no painel.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => void handleDelete(user)}
                      >
                        Remover usuário
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Badge variant="secondary">Principal</Badge>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar usuário</DialogTitle>
            <DialogDescription>
              Crie um nome de acesso e uma senha exclusiva para este usuário.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-5">
            <FormField label="Nome de usuário" required>
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ex.: vendedor01"
                autoComplete="off"
                required
              />
            </FormField>
            <FormField label="Senha" required>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  className="pr-11"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-0 top-0 grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Use pelo menos 8 caracteres.</p>
            </FormField>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <UserPlus />}
                {saving ? "Adicionando..." : "Adicionar usuário"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StoreSettingsPanel() {
  const { settings, saveSettings } = useStoreSettings();
  const [form, setForm] = useState(settings);
  const [brandsText, setBrandsText] = useState(settings.brands.join(", "));
  const [feedback, setFeedback] = useState("");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const handleLogo = async (file: File | undefined) => {
    if (!file) return;
    try {
      set("logo", await imageFileToDataUrl(file));
    } catch {
      setFeedback("Não foi possível processar o logotipo.");
    }
  };

  return (
    <form
      className="grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-premium sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        saveSettings({
          ...form,
          brands: brandsText
            .split(",")
            .map((brand) => brand.trim())
            .filter(Boolean)
            .filter((brand, index, brands) => brands.indexOf(brand) === index),
        });
        setFeedback("Configurações salvas e aplicadas no site.");
      }}
    >
      <div>
        <h2 className="font-display text-2xl font-extrabold">Identidade da loja</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize os dados exibidos no cabeçalho e no rodapé.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nome da loja" required>
          <Input value={form.name} onChange={(event) => set("name", event.target.value)} required />
        </FormField>
        <FormField label="Frase da marca" required>
          <Input
            value={form.tagline}
            onChange={(event) => set("tagline", event.target.value)}
            required
          />
        </FormField>
        <FormField label="Telefone" required>
          <Input
            value={form.phone}
            onChange={(event) => set("phone", event.target.value)}
            required
          />
        </FormField>
        <FormField label="WhatsApp com DDD" required>
          <Input
            value={form.whatsapp}
            onChange={(event) => set("whatsapp", event.target.value)}
            required
          />
        </FormField>
        <FormField label="Endereço" required>
          <Input
            value={form.address}
            onChange={(event) => set("address", event.target.value)}
            required
          />
        </FormField>
        <FormField label="Horário" required>
          <Input
            value={form.hours}
            onChange={(event) => set("hours", event.target.value)}
            required
          />
        </FormField>
      </div>
      <FormField label="Marcas pré-definidas">
        <Textarea
          value={brandsText}
          onChange={(event) => setBrandsText(event.target.value)}
          placeholder="Toyota, Honda, Chevrolet, Volkswagen"
          className="min-h-24"
        />
        <p className="text-xs text-muted-foreground">
          Separe as marcas por vírgulas. Elas aparecerão como opções rápidas no cadastro de
          veículos.
        </p>
      </FormField>
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div>
          <h3 className="font-display text-lg font-extrabold text-foreground">Página “A loja”</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Apresente o ambiente da loja e fotos reais de clientes para reforçar a confiança.
          </p>
        </div>
        <div className="mt-5 grid gap-5">
          <FormField label="Link do vídeo de apresentação">
            <Input
              type="url"
              value={form.aboutVideoUrl}
              onChange={(event) => set("aboutVideoUrl", event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Use um link público do YouTube ou Vimeo. O vídeo será exibido na página “A loja”.
            </p>
          </FormField>
          <div className="grid gap-3">
            <Label>Galeria de clientes recentes</Label>
            <div className="flex flex-wrap gap-3">
              {form.customerGallery.map((image, index) => (
                <div key={`${image.slice(0, 36)}-${index}`} className="group relative h-24 w-32">
                  <img
                    src={image}
                    alt={`Cliente ${index + 1}`}
                    className="h-full w-full rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "customerGallery",
                        form.customerGallery.filter((_, imageIndex) => imageIndex !== index),
                      )
                    }
                    className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-foreground text-background opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label={`Remover foto ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {form.customerGallery.length < 8 && (
                <label className="grid h-24 w-32 cursor-pointer place-items-center rounded-lg border border-dashed border-primary/50 bg-primary/5 text-center text-xs font-bold text-primary transition hover:bg-primary/10">
                  <span className="grid justify-items-center gap-1">
                    <ImagePlus className="h-5 w-5" /> Adicionar fotos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      const files = [...(event.target.files ?? [])].slice(
                        0,
                        8 - form.customerGallery.length,
                      );
                      void Promise.all(files.map(imageFileToDataUrl))
                        .then((images) =>
                          set("customerGallery", [...form.customerGallery, ...images]),
                        )
                        .catch(() => setFeedback("Não foi possível processar uma das fotos."));
                      event.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Até 8 fotos. Escolha imagens autorizadas pelos clientes; elas ficam visíveis na página
              pública.
            </p>
          </div>
        </div>
      </section>
      <div className="grid gap-3">
        <Label>Logotipo</Label>
        <div className="flex flex-wrap items-center gap-4">
          {form.logo ? (
            <img
              src={form.logo}
              alt="Prévia do logotipo"
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground">
              <Settings />
            </div>
          )}
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input px-4 text-sm font-medium">
            <Upload className="h-4 w-4" /> Selecionar imagem
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => void handleLogo(event.target.files?.[0])}
            />
          </label>
          {form.logo && (
            <Button type="button" variant="ghost" onClick={() => set("logo", "")}>
              Remover
            </Button>
          )}
        </div>
      </div>
      {feedback && (
        <p className="rounded-lg bg-whatsapp/10 p-3 text-sm font-medium text-whatsapp">
          {feedback}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setForm(defaultStoreSettings);
            setBrandsText(defaultStoreSettings.brands.join(", "));
          }}
        >
          Restaurar padrão
        </Button>
        <Button type="submit" variant="premium">
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}
