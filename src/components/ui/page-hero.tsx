type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="rounded-2xl border border-border/90 bg-surface p-6 shadow-premium md:p-8">
      {eyebrow ? <p className="text-label-sm uppercase tracking-[0.18em] text-accent-soft">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-display-lg text-foreground md:text-display-xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-body-sm leading-7 text-muted">{description}</p>
    </section>
  );
}
