import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Clock,
  Gauge,
  HandCoins,
  Search,
  ShieldCheck,
} from "lucide-react";
import heroImage from "@/assets/auto-hero.jpg";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/vehicle-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { featuredVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prime Motors — Veículos premium selecionados" },
      {
        name: "description",
        content:
          "Loja de veículos premium com estoque selecionado, atendimento consultivo e contato rápido pelo WhatsApp.",
      },
      { property: "og:title", content: "Prime Motors — Veículos premium selecionados" },
      {
        property: "og:description",
        content:
          "Conheça veículos premium selecionados, veja destaques do estoque e fale com a equipe pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <section className="relative min-h-[34rem] overflow-hidden bg-hero-gradient">
        <img
          src={heroImage}
          alt="Sedan premium em uma concessionária moderna"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl py-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-hero-foreground shadow-soft">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Compra segura e sem
              complicação
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] text-hero-foreground sm:text-6xl lg:text-7xl">
              Encontre o carro certo para a sua próxima história.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-hero-muted">
              Seminovos selecionados, atendimento próximo e todas as informações para você escolher
              com confiança.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="premium" size="lg" className="rounded-full px-8 font-bold">
                <Link to="/estoque">
                  Ver estoque
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <WhatsAppButton
                className="rounded-full"
                message="Olá, quero conhecer os veículos disponíveis na Prime Motors."
              />
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 text-hero-muted">
              <div className="border-l border-hero-line pl-4">
                <p className="font-display text-2xl font-semibold text-hero-foreground">+40</p>
                <p className="text-sm">veículos no padrão</p>
              </div>
              <div className="border-l border-hero-line pl-4">
                <p className="font-display text-2xl font-semibold text-hero-foreground">100%</p>
                <p className="text-sm">procedência analisada</p>
              </div>
              <div className="border-l border-hero-line pl-4">
                <p className="font-display text-2xl font-semibold text-hero-foreground">24h</p>
                <p className="text-sm">retorno comercial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-2xl">
              <label htmlFor="home-search" className="text-lg font-extrabold text-foreground">
                Qual veículo você está buscando?
              </label>
              <div className="mt-3 flex overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary">
                <Search
                  className="ml-4 mt-3.5 h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="home-search"
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Digite marca ou modelo"
                />
                <Button asChild variant="premium" className="h-12 rounded-none px-6">
                  <Link to="/estoque">Pesquisar</Link>
                </Button>
              </div>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/estoque">
                Ver todo o estoque <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {["BMW", "Chevrolet", "Fiat", "Ford", "Hyundai", "Toyota", "Volkswagen"].map(
              (brand) => (
                <Link
                  key={brand}
                  to="/estoque"
                  className="rounded-xl border border-border bg-background px-3 py-4 text-center text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
                >
                  {brand}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-background pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Últimas novidades
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Destaques do nosso estoque
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Veículos escolhidos com cuidado, informações transparentes e atendimento pronto para
              ajudar.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="premium" size="lg" className="rounded-full px-8 font-bold">
              <Link to="/estoque">
                Veja todos os veículos <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10">
            <CarFront className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">Venda seu carro</h2>
            <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
              Faça uma avaliação rápida, segura e receba uma proposta transparente pelo seu veículo.
            </p>
            <Button asChild variant="premium" className="mt-7 rounded-full">
              <Link to="/venda-seu-carro">
                Avalie agora <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10">
            <HandCoins className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">Financie seu sonho</h2>
            <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
              Compare possibilidades de financiamento e encontre parcelas que combinam com você.
            </p>
            <Button asChild variant="premium" className="mt-7 rounded-full">
              <Link to="/financiamento">
                Faça uma simulação <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: ShieldCheck,
              title: "Procedência",
              text: "Veículos selecionados, documentação conferida e compra transparente.",
            },
            {
              icon: Gauge,
              title: "Detalhes completos",
              text: "Informações claras para você comparar e decidir com tranquilidade.",
            },
            {
              icon: Clock,
              title: "Atendimento rápido",
              text: "Nossa equipe está pronta para responder e agendar sua visita.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <item.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-extrabold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
