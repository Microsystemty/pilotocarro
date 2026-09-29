import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, Images, PlayCircle, ShieldCheck, UsersRound } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { useStoreSettings } from "@/hooks/use-store-settings";

export const Route = createFileRoute("/a-loja")({
  head: () => ({
    meta: [
      { title: "A loja — Prime Motors" },
      {
        name: "description",
        content: "Conheça o ambiente, o atendimento e a experiência da Prime Motors.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "A loja — Prime Motors" },
      { property: "og:description", content: "Conheça o ambiente, o atendimento e a experiência da Prime Motors." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutStorePage,
});

function getVideoEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
    }
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
    }
    if (url.hostname.includes("vimeo.com")) {
      const videoId = url.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

function AboutStorePage() {
  const { settings } = useStoreSettings();
  const videoEmbedUrl = getVideoEmbedUrl(settings.aboutVideoUrl);

  return (
    <main>
      <PageHero
        eyebrow="A nossa história"
        title="Uma experiência de compra pensada para você dirigir tranquilo."
        description="Conheça o ambiente da loja, a nossa seleção de veículos e quem já realizou o sonho do próximo carro com a gente."
      />

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
            {videoEmbedUrl ? (
              <div className="aspect-video bg-foreground">
                <iframe
                  className="h-full w-full"
                  src={videoEmbedUrl}
                  title={`Conheça a ${settings.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="grid aspect-video place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(239,40,40,.24),transparent_32%),linear-gradient(130deg,#161111,#080707)] p-6 text-center text-background">
                <div className="max-w-sm">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-background/25 bg-background/10 text-primary">
                    <PlayCircle className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-extrabold">
                    Veja a nossa loja por dentro
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-background/70">
                    Em breve, um vídeo apresentando o ambiente e o atendimento da {settings.name}.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
              Atendimento que aproxima
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Transparência desde a primeira conversa.
            </h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              Cada veículo é apresentado com informações claras, fotos e um atendimento próximo para
              que a sua decisão seja segura e agradável.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <TrustItem icon={ShieldCheck} text="Procedência verificada" />
              <TrustItem icon={BadgeCheck} text="Atendimento personalizado" />
              <TrustItem icon={Building2} text="Ambiente preparado para receber você" />
              <TrustItem icon={UsersRound} text="Clientes acompanhados até a entrega" />
            </div>
            <div className="mt-8">
              <WhatsAppButton message={`Olá, quero conhecer a ${settings.name}.`}>
                Agendar uma visita
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                <Images className="h-4 w-4" /> Entregas recentes
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Histórias que nos deixam orgulhosos.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Fotos publicadas com autorização dos clientes que escolheram a {settings.name}.
            </p>
          </div>

          {settings.customerGallery.length ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {settings.customerGallery.map((image, index) => (
                <img
                  key={`${image.slice(0, 36)}-${index}`}
                  src={image}
                  alt={`Entrega recente ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl border border-border object-cover shadow-card transition duration-300 hover:-translate-y-1"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm leading-6 text-muted-foreground sm:p-12">
              As fotos das próximas entregas aparecerão aqui. Você pode adicioná-las no painel
              administrativo, em Configurações.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function TrustItem({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-foreground shadow-card">
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      {text}
    </div>
  );
}
