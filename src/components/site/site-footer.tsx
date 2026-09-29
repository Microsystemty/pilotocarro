import { Link } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { useStoreSettings } from "@/hooks/use-store-settings";

export function SiteFooter() {
  const { settings } = useStoreSettings();
  return (
    <footer className="border-t-4 border-primary bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="font-display text-xl font-extrabold uppercase tracking-[0.16em]">
            {settings.name}
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Veículos selecionados e informações organizadas para uma escolha tranquila.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-foreground">Páginas</p>
          <nav
            className="mt-4 grid gap-2 text-sm text-muted-foreground"
            aria-label="Links do rodapé"
          >
            <Link to="/a-loja" className="hover:text-foreground">
              A loja
            </Link>
            <Link to="/estoque" className="hover:text-foreground">
              Estoque
            </Link>
            <Link to="/venda-seu-carro" className="hover:text-foreground">
              Venda seu carro
            </Link>
            <Link to="/financiamento" className="hover:text-foreground">
              Financiamento
            </Link>
            <Link to="/contato" className="hover:text-foreground">
              Contato
            </Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-foreground">Atendimento</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.address}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> {settings.hours}
            </span>
            <a
              className="flex items-center gap-2 hover:text-foreground"
              href={`tel:+${settings.phone.replace(/\D/g, "")}`}
            >
              <Phone className="h-4 w-4 text-primary" /> {settings.phone}
            </a>
            <a
              className="flex items-center gap-2 font-semibold text-whatsapp hover:text-whatsapp/80"
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, quero falar com a ${settings.name}.`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings.name}. Todos os direitos reservados.
          </p>
          <a
            href="https://vextty.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conheça a Vextty — Sistemas e Tecnologia"
            className="group inline-flex w-fit items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Desenvolvido por
            </span>
            <span className="vextty-mark vextty-mark-small" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="leading-none">
              <strong className="block text-sm font-bold tracking-[0.12em] text-foreground transition-colors group-hover:text-[#27bfff]">
                VEXTTY
              </strong>
              <small className="block text-[7px] tracking-[0.22em] text-muted-foreground">
                SISTEMAS &amp; TECNOLOGIA
              </small>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
