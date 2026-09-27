import { useState } from "react";
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
  Star,
} from "lucide-react";
import heroImage from "@/assets/auto-hero.jpg";
import { AnimatedCarShowcase } from "@/components/site/animated-car-showcase";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/vehicle-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { useVehicles } from "@/hooks/use-vehicles";

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
  const [homeSearch, setHomeSearch] = useState("");
  const { vehicles } = useVehicles();
  const visibleVehicles = vehicles.filter((vehicle) => vehicle.status !== "hidden");
  const featuredVehicles = visibleVehicles
    .filter((vehicle) => vehicle.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
    .slice(0, 3);
  const vehicleOfWeek = featuredVehicles[0] ?? visibleVehicles[0];
  return (
    <main>
      <section className="relative min-h-[40rem] overflow-hidden bg-hero-gradient">
        <img
          src={heroImage}
          alt="Sedan premium em uma concessionária moderna"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="hero-light-sweep" />
        <div className="relative mx-auto grid min-h-[40rem] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="hero-copy max-w-3xl py-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-hero-foreground shadow-soft">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Compra segura e sem
              complicação
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,9vw,3.9rem)] font-extrabold leading-[1.02] text-hero-foreground">
              Seu próximo carro
              <span className="block">
                merece ser <span className="hero-accent-text">inesquecível.</span>
              </span>
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
            <div className="hero-metrics mt-12 grid max-w-2xl grid-cols-3 gap-2 text-hero-muted sm:gap-3">
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
          <div>
            <AnimatedCarShowcase />
          </div>
        </div>
        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker__track">
            {[0, 1].map((group) => (
              <div className="hero-ticker__group" key={group}>
                <span>COMPRA SEGURA</span>
                <i />
                <span>VEÍCULOS SELECIONADOS</span>
                <i />
                <span>FINANCIAMENTO</span>
                <i />
                <span>AVALIAÇÃO JUSTA</span>
                <i />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-border bg-card p-5 shadow-premium sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="w-full max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                    Busca rápida
                  </p>
                  <label
                    htmlFor="home-search"
                    className="mt-0.5 block text-lg font-extrabold text-foreground sm:text-xl"
                  >
                    Qual veículo você está buscando?
                  </label>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex h-12 items-center rounded-xl border border-border bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                  <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="home-search"
                    value={homeSearch}
                    onChange={(event) => setHomeSearch(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="Digite uma marca ou modelo"
                  />
                </div>
                <Button asChild variant="premium" className="h-12 rounded-xl px-7">
                  <Link to="/estoque" search={{ query: homeSearch.trim() || undefined }}>
                    Pesquisar
                  </Link>
                </Button>
              </div>
            </div>
            <Button asChild variant="outline" size="lg" className="w-full rounded-full lg:w-auto">
              <Link to="/estoque">
                Ver todo o estoque <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-7 border-t border-border pt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Busque pelas marcas mais procuradas
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {["BMW", "Chevrolet", "Fiat", "Ford", "Hyundai", "Toyota", "Volkswagen"].map(
                (brand) => (
                  <Link
                    key={brand}
                    to="/estoque"
                    search={{ brand }}
                    className="rounded-xl border border-border bg-background px-3 py-3.5 text-center text-sm font-bold text-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    {brand}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Últimas novidades
              </p>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Destaques do nosso estoque
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
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

      {vehicleOfWeek && (
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-premium lg:grid-cols-2">
            <img
              src={vehicleOfWeek.image}
              alt={`${vehicleOfWeek.brand} ${vehicleOfWeek.model}`}
              className="h-full min-h-80 w-full object-cover"
            />
            <div className="flex flex-col justify-center p-7 sm:p-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Veículo da semana
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold">
                {vehicleOfWeek.brand} {vehicleOfWeek.model}
              </h2>
              <p className="mt-3 text-muted-foreground">{vehicleOfWeek.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {vehicleOfWeek.highlights.map((item) => (
                  <span key={item} className="rounded-full border border-border px-3 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </div>
              <Button asChild variant="premium" size="lg" className="mt-8 w-fit rounded-full">
                <Link to="/estoque/$slug" params={{ slug: vehicleOfWeek.slug }}>
                  Conhecer este veículo <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
              Quem compra recomenda
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Confiança em cada entrega
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Mariana Costa",
                text: "Atendimento transparente e o carro estava exatamente como anunciado.",
              },
              {
                name: "Rafael Almeida",
                text: "Processo rápido, equipe atenciosa e ótima experiência na negociação.",
              },
              {
                name: "Lucas Ferreira",
                text: "Consegui comparar as opções e fechar o financiamento com tranquilidade.",
              },
            ].map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 leading-7 text-muted-foreground">“{testimonial.text}”</p>
                <p className="mt-5 font-bold text-foreground">{testimonial.name}</p>
              </article>
            ))}
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
