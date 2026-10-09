export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-surface py-12 sm:py-18 lg:py-24">
      <div className="absolute -right-32 -top-44 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="section-shell">
        <p className="section-kicker">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-extrabold leading-[1.06] text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
