import { Link } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppLink } from "@/data/vehicles";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold uppercase">Prime Motors</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Base visual para uma revenda premium, preparada para evoluir com cadastro de veículos,
            gestão de estoque e integrações futuras.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-foreground">Páginas</p>
          <nav className="mt-4 grid gap-2 text-sm text-muted-foreground" aria-label="Links do rodapé">
            <Link to="/estoque" className="hover:text-foreground">Estoque</Link>
            <Link to="/venda-seu-carro" className="hover:text-foreground">Venda seu carro</Link>
            <Link to="/financiamento" className="hover:text-foreground">Financiamento</Link>
            <Link to="/contato" className="hover:text-foreground">Contato</Link>
            <Link to="/admin" className="hover:text-foreground">Admin</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-foreground">Atendimento</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Av. Europa, 1000</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Seg. a sábado, 9h às 18h</span>
            <a className="flex items-center gap-2 hover:text-foreground" href="tel:+5511999999999">
              <Phone className="h-4 w-4 text-primary" /> (11) 99999-9999
            </a>
            <a
              className="flex items-center gap-2 font-semibold text-whatsapp hover:text-whatsapp/80"
              href={getWhatsAppLink("Olá, quero falar com a Prime Motors.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
