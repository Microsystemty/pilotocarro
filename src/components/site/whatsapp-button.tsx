import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/data/vehicles";

export function WhatsAppButton({
  message,
  children,
  className,
}: {
  message: string;
  children?: string;
  className?: string;
}) {
  return (
    <Button asChild variant="whatsapp" size="lg" className={className}>
      <a href={getWhatsAppLink(message)} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" />
        {children ?? "Chamar no WhatsApp"}
      </a>
    </Button>
  );
}
