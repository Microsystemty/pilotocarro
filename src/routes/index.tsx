import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CarFront, Clock, Gauge, ShieldCheck } from "lucide-react";
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
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-hero-gradient">
        <img
          src={heroImage}
          alt="Sedan premium em uma concessionária moderna"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl py-8">
            <p className="inline-flex items-center gap-2 rounded-md bg-hero-chip px-3 py-2 text-sm font-semibold uppercase text-hero-foreground shadow-soft">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Curadoria premium
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold text-hero-foreground sm:text-6xl lg:text-7xl">
              Veículos selecionados para quem exige mais.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-hero-muted">
              Uma base moderna para revendas que valorizam apresentação, confiança e uma jornada simples entre estoque, detalhes e atendimento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="premium" size="lg">
                <Link to="/estoque">
                  Ver estoque
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <WhatsAppButton message="Olá, quero conhecer os veículos disponíveis na Prime Motors." />
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

      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">Destaques</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Prontos para entrar na vitrine.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Cards organizados para evoluir depois com cadastro, filtros reais, histórico, fotos e integração comercial.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: ShieldCheck, title: "Procedência", text: "Estrutura para destacar laudos, revisões e documentação." },
            { icon: Gauge, title: "Detalhes completos", text: "Informações essenciais para acelerar a decisão de compra." },
            { icon: Clock, title: "Atendimento rápido", text: "Chamadas diretas para WhatsApp em pontos estratégicos." },
          ].map((item) => (
            <div key={item.title} className="border border-border bg-card p-6 shadow-card">
              <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
