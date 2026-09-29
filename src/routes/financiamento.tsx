import { createFileRoute } from "@tanstack/react-router";
import { BadgePercent, FileCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export const Route = createFileRoute("/financiamento")({
  head: () => ({
    meta: [
      { title: "Financiamento — Prime Motors" },
      { name: "description", content: "Página inicial para simulação de financiamento de veículos premium com atendimento consultivo." },
      { property: "og:title", content: "Financiamento — Prime Motors" },
      { property: "og:description", content: "Estrutura visual para captar simulações de financiamento com dados básicos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinancingPage,
});

function FinancingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Financiamento"
        title="Simulação objetiva para acelerar a compra."
        description="Uma estrutura inicial para receber intenção de financiamento e direcionar o cliente ao atendimento comercial."
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="grid gap-5">
            {[
              { icon: WalletCards, title: "Entrada flexível", text: "Organize propostas por entrada, parcelas e perfil do cliente." },
              { icon: BadgePercent, title: "Taxas competitivas", text: "Espaço pronto para integrar parceiros financeiros no futuro." },
              { icon: FileCheck, title: "Pré-análise", text: "Coleta simples para iniciar contato sem criar fluxo pesado." },
            ].map((item) => (
              <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border border-border bg-card p-5 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0"><h2 className="font-display text-xl font-semibold text-foreground">{item.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p></div>
              </div>
            ))}
          </div>
          <form className="rounded-xl border border-border bg-card p-5 shadow-premium sm:p-8" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="nome-fin">Nome</Label><Input id="nome-fin" placeholder="Seu nome" /></div>
              <div className="grid gap-2"><Label htmlFor="tel-fin">Telefone</Label><Input id="tel-fin" placeholder="(00) 00000-0000" /></div>
              <div className="grid gap-2"><Label htmlFor="veiculo-fin">Veículo de interesse</Label><Input id="veiculo-fin" placeholder="Modelo desejado" /></div>
              <div className="grid gap-2"><Label htmlFor="valor-fin">Valor de entrada</Label><Input id="valor-fin" placeholder="R$" /></div>
              <div className="grid gap-2"><Label htmlFor="parcelas-fin">Parcelas</Label><Input id="parcelas-fin" placeholder="Ex.: 48x" /></div>
              <div className="grid gap-2"><Label htmlFor="renda-fin">Renda mensal</Label><Input id="renda-fin" placeholder="R$" /></div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="premium" size="lg">Solicitar simulação</Button>
              <WhatsAppButton message="Olá, quero simular um financiamento." />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
