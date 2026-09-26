import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/data/vehicles";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 500);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 sm:right-6">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-premium"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href={getWhatsAppLink("Olá, quero saber mais sobre os veículos disponíveis.")}
        target="_blank"
        rel="noreferrer"
        className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-premium transition hover:scale-105"
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
