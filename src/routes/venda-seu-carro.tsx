import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export const Route = createFileRoute("/venda-seu-carro")({
  head: () => ({
    meta: [
      { title: "Venda seu carro — Prime Motors" },
      { name: "description", content: "Estrutura inicial para captação de veículos com formulário visual e contato pelo WhatsApp." },
      { property: "og:title", content: "Venda seu carro — Prime Motors" },
      { property: "og:description", content: "Envie os dados do seu veículo para uma avaliação consultiva e segura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  return (
    <main>
      <PageHero
        eyebrow="Venda seu carro"
        title="Uma entrada simples para captar bons veículos."
        description="Página preparada para receber dados do cliente e do veículo, com chamada direta para negociação pelo WhatsApp."
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: ClipboardCheck, title: "Avaliação", text: "Dados básicos para iniciar a análise comercial." },
              { icon: ShieldCheck, title: "Procedência", text: "Espaço pronto para laudo, fotos e documentação." },
              { icon: Handshake, title: "Negociação", text: "Contato rápido para combinar os próximos passos." },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-card p-6 shadow-card">
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-4 font-display text-xl font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          <form className="rounded-xl border border-border bg-card p-5 shadow-premium sm:p-8" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="nome">Nome</Label><Input id="nome" placeholder="Seu nome" /></div>
              <div className="grid gap-2"><Label htmlFor="telefone">Telefone</Label><Input id="telefone" placeholder="(00) 00000-0000" /></div>
              <div className="grid gap-2"><Label htmlFor="marca">Marca</Label><Input id="marca" placeholder="Marca do veículo" /></div>
              <div className="grid gap-2"><Label htmlFor="modelo-venda">Modelo</Label><Input id="modelo-venda" placeholder="Modelo e versão" /></div>
              <div className="grid gap-2"><Label htmlFor="ano-venda">Ano</Label><Input id="ano-venda" placeholder="Ex.: 2021/2022" /></div>
              <div className="grid gap-2"><Label htmlFor="km-venda">Quilometragem</Label><Input id="km-venda" placeholder="Ex.: 32.000 km" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="obs-venda">Observações</Label><Textarea id="obs-venda" placeholder="Conte estado geral, opcionais e histórico." /></div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="premium" size="lg">Enviar avaliação</Button>
              <WhatsAppButton message="Olá, quero vender meu carro e gostaria de uma avaliação." />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
