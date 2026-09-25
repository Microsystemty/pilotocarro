import { Link } from "@tanstack/react-router";
import { CarFront, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Estoque", to: "/estoque" },
  { label: "Venda seu carro", to: "/venda-seu-carro" },
  { label: "Financiamento", to: "/financiamento" },
  { label: "Contato", to: "/contato" },
] as const;

function BrandMark() {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="Ir para a página inicial">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-premium transition-transform group-hover:scale-95">
        <CarFront className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-base font-semibold uppercase text-foreground sm:text-lg">
          Prime Motors
        </span>
        <span className="block truncate text-xs font-medium uppercase text-muted-foreground">
          Veículos premium
        </span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeProps={{ className: "bg-muted text-foreground" }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(24rem,calc(100vw-2rem))] border-border bg-background">
        <SheetHeader>
          <SheetTitle className="text-left font-display">Prime Motors</SheetTitle>
        </SheetHeader>
        <div className="mt-8 grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-3 text-sm font-semibold text-foreground"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Painel administrativo
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex lg:justify-between lg:px-8">
        <BrandMark />
        <DesktopNav />
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline">
            <Link to="/admin">
              <ShieldCheck aria-hidden="true" />
              Admin
            </Link>
          </Button>
          <Button asChild variant="premium">
            <Link to="/estoque">Ver estoque</Link>
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
