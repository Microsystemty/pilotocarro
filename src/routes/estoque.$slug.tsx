import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Fuel,
  Gauge,
  Images,
  Settings,
  Share2,
  ZoomIn,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { formatCurrency, formatMileage } from "@/data/vehicles";
import { useVehicles } from "@/hooks/use-vehicles";

export const Route = createFileRoute("/estoque/$slug")({
  head: () => ({
    meta: [
      { title: "Detalhes do veículo — Prime Motors" },
      { name: "description", content: "Veja fotos, preço e informações completas do veículo." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { slug } = Route.useParams();
  const { vehicles, ready } = useVehicles();
  const vehicle = vehicles.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [entry, setEntry] = useState(20);
  const [months, setMonths] = useState(48);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (vehicle) setSelectedImage(vehicle.gallery[0] ?? vehicle.image);
  }, [vehicle]);

  if (!vehicle) {
    if (!ready) {
      return (
        <main className="min-h-[50vh] bg-background p-10 text-center text-muted-foreground">
          Carregando veículo...
        </main>
      );
    }
    return (
      <main className="grid min-h-[55vh] place-items-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">Veículo não encontrado</h1>
          <p className="mt-3 text-muted-foreground">
            Este anúncio pode ter sido removido do estoque.
          </p>
          <Button asChild variant="premium" className="mt-6">
            <Link to="/estoque">Voltar ao estoque</Link>
          </Button>
        </div>
      </main>
    );
  }

  const gallery = vehicle.gallery.length ? vehicle.gallery : [vehicle.image];
  const specs = [
    { label: "Ano", value: vehicle.year, icon: CalendarDays },
    { label: "Quilometragem", value: formatMileage(vehicle.mileage), icon: Gauge },
    { label: "Câmbio", value: vehicle.transmission, icon: Settings },
    { label: "Combustível", value: vehicle.fuel, icon: Fuel },
  ];
  const currentImageIndex = Math.max(0, gallery.indexOf(selectedImage));
  const financedAmount = vehicle.price * (1 - entry / 100);
  const monthlyRate = 0.0149;
  const installment =
    (financedAmount * (monthlyRate * (1 + monthlyRate) ** months)) /
    ((1 + monthlyRate) ** months - 1);
  const shareVehicle = async () => {
    const url = window.location.href;
    if (navigator.share)
      await navigator.share({
        title: `${vehicle.brand} ${vehicle.model}`,
        text: `Confira este veículo por ${formatCurrency(vehicle.price)}`,
        url,
      });
    else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/estoque">
            <ArrowLeft /> Voltar ao estoque
          </Link>
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-muted text-left shadow-card"
            >
              <img
                src={selectedImage || gallery[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-bold text-foreground opacity-100 backdrop-blur sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" /> Ampliar
              </span>
            </button>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Images className="h-5 w-5 text-primary" /> Todas as fotos
              </p>
              <p className="text-sm text-muted-foreground">
                {gallery.length} {gallery.length === 1 ? "imagem" : "imagens"}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${vehicle.slug}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-lg border-2 bg-muted transition ${selectedImage === image ? "border-primary" : "border-border hover:border-primary/60"}`}
                  aria-label={`Exibir foto ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${vehicle.model} foto ${index + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
              <Badge variant="secondary">{vehicle.body}</Badge>
              <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                {vehicle.brand}
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold text-foreground">
                {vehicle.model}
              </h1>
              <p className="mt-2 text-muted-foreground">{vehicle.version}</p>
              <p className="mt-6 font-display text-4xl font-extrabold text-primary">
                {formatCurrency(vehicle.price)}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-border bg-surface p-4">
                    <spec.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">
                      {spec.label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <WhatsAppButton
                  message={`Olá, tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`}
                >
                  Tenho interesse
                </WhatsAppButton>
              </div>
              <Button variant="outline" className="mt-3 w-full" onClick={() => void shareVehicle()}>
                {shared ? <Copy /> : <Share2 />}
                {shared ? "Link copiado" : "Compartilhar veículo"}
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
              Descrição
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground">
              Resumo do veículo
            </h2>
          </div>
          <div>
            <p className="text-base leading-8 text-muted-foreground">{vehicle.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {vehicle.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </section>

        {!!vehicle.details?.length && (
          <section className="mt-12 border-t border-border pt-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
              Informações adicionais
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground">
              Mais detalhes deste veículo
            </h2>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vehicle.details.map((detail, index) => (
                <div
                  key={`${detail.label}-${index}`}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="mt-2 font-semibold text-foreground">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Calculator className="h-9 w-9 text-primary" />
              <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                Simulação rápida
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">
                Veja uma parcela estimada
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Estimativa ilustrativa. A condição final depende da análise da instituição
                financeira.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="entry">Entrada ({entry}%)</Label>
                <Input
                  id="entry"
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={entry}
                  onChange={(event) => setEntry(Number(event.target.value))}
                />
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency((vehicle.price * entry) / 100)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="months">Quantidade de parcelas</Label>
                <select
                  id="months"
                  value={months}
                  onChange={(event) => setMonths(Number(event.target.value))}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {[12, 24, 36, 48, 60].map((value) => (
                    <option key={value} value={value}>
                      {value} parcelas
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl bg-primary p-5 text-primary-foreground sm:col-span-2">
                <p className="text-sm opacity-80">Parcela estimada</p>
                <p className="mt-1 font-display text-3xl font-extrabold">
                  {months}x de {formatCurrency(installment)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-3">
          <DialogTitle className="sr-only">
            Galeria de {vehicle.brand} {vehicle.model}
          </DialogTitle>
          <div className="relative">
            <img
              src={selectedImage || gallery[0]}
              alt={`${vehicle.model} ampliado`}
              className="max-h-[82vh] w-full rounded-lg object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() =>
                setSelectedImage(gallery[(currentImageIndex - 1 + gallery.length) % gallery.length])
              }
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => setSelectedImage(gallery[(currentImageIndex + 1) % gallery.length])}
            >
              <ChevronRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
