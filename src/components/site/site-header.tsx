import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CarFront, Clock3, Menu, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStoreSettings } from "@/hooks/use-store-settings";

const navItems = [
  { label: "Início", to: "/" },
  { label: "A loja", to: "/a-loja" },
  { label: "Estoque", to: "/estoque" },
  { label: "Venda seu carro", to: "/venda-seu-carro" },
  { label: "Financiamento", to: "/financiamento" },
  { label: "Contato", to: "/contato" },
] as const;

function BrandMark({ name, tagline, logo }: { name: string; tagline: string; logo: string }) {
  return (
    <Link
      to="/"
      className="group flex min-w-0 items-center gap-3"
      aria-label="Ir para a página inicial"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/60 bg-primary text-primary-foreground shadow-premium transition-transform group-hover:scale-95">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <CarFront className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-extrabold uppercase tracking-[0.12em] text-foreground sm:text-lg">
          {name}
        </span>
        <span className="hidden truncate text-xs font-medium uppercase text-muted-foreground min-[360px]:block">
          {tagline}
        </span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1.5 shadow-card lg:flex" aria-label="Navegação principal">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          className="rounded-full px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.05em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeProps={{ className: "bg-primary text-primary-foreground shadow-premium" }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(25rem,calc(100vw-1rem))] border-border bg-background/98 px-5"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-display">Prime Motors</SheetTitle>
        </SheetHeader>
        <div className="mt-8 grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center rounded-xl border border-transparent px-4 py-3 text-base font-bold text-muted-foreground outline-none transition hover:border-border hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "border-primary/40 bg-primary/10 text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block rounded-2xl border border-primary/30 bg-primary/10 p-5 transition hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="text-sm font-bold text-foreground">Prefere atendimento direto?</p>
          <p className="mt-1 text-sm text-muted-foreground">Fale com nossa equipe pelo WhatsApp.</p>
        </a>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const { settings } = useStoreSettings();
  const whatsapp = settings.whatsapp.replace(/\D/g, "");
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/88 shadow-[0_10px_40px_-28px_rgba(0,0,0,.9)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/82">
      <div className="hidden border-b border-white/10 bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs font-semibold lg:px-8">
          <span className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5" /> {settings.hours}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> {settings.phone}
          </span>
        </div>
      </div>
       <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-20 sm:px-6 lg:flex lg:justify-between lg:px-8">
        <BrandMark name={settings.name} tagline={settings.tagline} logo={settings.logo} />
        <DesktopNav />
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="whatsapp">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
        </div>
        <MobileNav whatsapp={whatsapp} />
      </div>
    </header>
  );
}
