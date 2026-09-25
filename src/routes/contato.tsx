import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Prime Motors" },
      { name: "description", content: "Entre em contato com a Prime Motors por telefone, WhatsApp ou formulário visual." },
      { property: "og:title", content: "Contato — Prime Motors" },
      { property: "og:description", content: "Canais de atendimento e localização da loja de veículos premium." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contato"
        title="Atendimento direto para compra, venda e financiamento."
        description="Página preparada para centralizar telefone, WhatsApp, endereço e mensagens comerciais."
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">Prime Motors</h2>
            <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Av. Europa, 1000 — São Paulo, SP</span>
              <a href="tel:+5511999999999" className="flex items-center gap-3 hover:text-foreground"><Phone className="h-5 w-5 text-primary" /> (11) 99999-9999</a>
              <a href="mailto:contato@primemotors.com" className="flex items-center gap-3 hover:text-foreground"><Mail className="h-5 w-5 text-primary" /> contato@primemotors.com</a>
              <span className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /> Segunda a sábado, 9h às 18h</span>
            </div>
            <div className="mt-8"><WhatsAppButton message="Olá, quero atendimento da Prime Motors." /></div>
          </div>
          <form className="border border-border bg-card p-5 shadow-premium sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="nome-contato">Nome</Label><Input id="nome-contato" placeholder="Seu nome" /></div>
              <div className="grid gap-2"><Label htmlFor="telefone-contato">Telefone</Label><Input id="telefone-contato" placeholder="(00) 00000-0000" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="email-contato">E-mail</Label><Input id="email-contato" placeholder="seu@email.com" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="mensagem-contato">Mensagem</Label><Textarea id="mensagem-contato" placeholder="Como podemos ajudar?" /></div>
            </div>
            <Button type="button" variant="premium" size="lg" className="mt-6">Enviar mensagem</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
