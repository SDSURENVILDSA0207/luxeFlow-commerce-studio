import type { Route } from "next";
import Link from "next/link";
import { ProductCollectionCard } from "@/components/storefront/product-collection-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { Card, CardContent } from "@/components/ui";

type CampaignLandingPageProps = {
  params: Promise<{ campaignSlug: string }>;
};

type CampaignTheme = {
  eyebrow: string;
  title: string;
  subtitle: string;
  heroNote: string;
  promoTitle: string;
  promoCopy: string;
  ctaPrimary: string;
  ctaSecondary: string;
  storyTitle: string;
  storyBody: string;
};

const campaignFallback: CampaignTheme = {
  eyebrow: "Campaign",
  title: "Explore this LuxeFlow seasonal experience.",
  subtitle:
    "Editorial storytelling, curated product highlights, and clear calls to action—built for premium e-commerce launches.",
  heroNote: "Campaign preview: connect with the studio for merchandising and fulfillment details.",
  promoTitle: "Work with the LuxeFlow team",
  promoCopy: "Our studio helps brands ship polished campaign pages, offers, and client journeys end to end.",
  ctaPrimary: "Shop featured pieces",
  ctaSecondary: "Contact studio",
  storyTitle: "Designed for clarity and conversion.",
  storyBody:
    "Each campaign layout balances luxury tone with scannable structure so shoppers can discover, compare, and check out with confidence."
};

const themes: Record<string, CampaignTheme> = {
  "spring-bridal-event": {
    eyebrow: "Spring Bridal Event",
    title: "Celebrate your forever moment with refined bridal jewelry.",
    subtitle:
      "Exclusive seasonal pricing on signature engagement rings, bridal sets, and wedding-day styling essentials.",
    heroNote: "Limited Event: complimentary bridal consultation + gift packaging",
    promoTitle: "Book your private bridal appointment",
    promoCopy: "Meet virtually with a LuxeFlow stylist to curate ceremony-to-reception looks.",
    ctaPrimary: "Shop Bridal Edit",
    ctaSecondary: "Book Appointment",
    storyTitle: "Crafted for modern love stories.",
    storyBody:
      "From halo solitaires to delicate diamond bands, every piece is hand-finished to balance brilliance, comfort, and timeless silhouette."
  },
  "new-arrivals-collection": {
    eyebrow: "New Arrivals Collection",
    title: "Discover the newest icons in contemporary fine jewelry.",
    subtitle:
      "Fresh silhouettes in recycled 18K gold, sculptural pearl designs, and luminous gemstone accents for everyday statement wear.",
    heroNote: "New Drop: early access for newsletter members",
    promoTitle: "Unlock first-access launch pricing",
    promoCopy: "Join our campaign list and receive private access to limited release quantities.",
    ctaPrimary: "Explore New Arrivals",
    ctaSecondary: "Join Early Access",
    storyTitle: "Designed for now, meant for a lifetime.",
    storyBody:
      "Each arrival blends editorial-inspired form with heirloom-grade craftsmanship, so clients can collect with confidence."
  },
  "holiday-gift-guide": {
    eyebrow: "Holiday Gift Guide",
    title: "Gift-worthy jewelry curated for every celebration.",
    subtitle:
      "From timeless diamond studs to elevated layering essentials, discover guaranteed-delivery holiday selections.",
    heroNote: "Holiday Promise: express insured shipping + luxury wrapping",
    promoTitle: "Find gifts by style and budget",
    promoCopy: "Our gifting concierge helps you select premium pieces for every recipient and occasion.",
    ctaPrimary: "Shop Gift Guide",
    ctaSecondary: "Talk to Concierge",
    storyTitle: "A season of intentional gifting.",
    storyBody:
      "Our holiday curation focuses on versatile, high-impact pieces that feel personal, luxurious, and unforgettable."
  }
};

const featuredProducts = [
  {
    name: "Luna Halo Ring",
    collection: "Celestial Gold",
    material: "18K Gold, VS Diamond",
    price: "$2,300",
    slug: "luna-halo-ring",
    tag: "Featured"
  },
  {
    name: "Noir Sapphire Pendant",
    collection: "Midnight Sapphire",
    material: "18K Gold, Blue Sapphire",
    price: "$1,780",
    slug: "noir-sapphire-pendant",
    tag: "Capsule"
  },
  {
    name: "Etoile Diamond Studs",
    collection: "Bridal Icons",
    material: "18K White Gold, Diamond",
    price: "$1,190",
    slug: "etoile-diamond-studs"
  },
  {
    name: "Aurelia Link Bracelet",
    collection: "Celestial Gold",
    material: "18K Gold, Hand-finished Links",
    price: "$1,460",
    slug: "aurelia-link-bracelet"
  }
];

const benefits = [
  "Complimentary luxury gift packaging on every campaign order",
  "Certified responsibly sourced stones and precious materials",
  "Flexible returns with white-glove client support"
];

function secondaryActionHref(slug: string): string {
  if (slug === "spring-bridal-event") {
    return `mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("Bridal appointment request")}`;
  }
  if (slug === "new-arrivals-collection") {
    return `mailto:newsletter@luxeFlow.studio?subject=${encodeURIComponent("Early access — new arrivals")}`;
  }
  if (slug === "holiday-gift-guide") {
    return `mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("Holiday gifting concierge")}`;
  }
  return `mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("LuxeFlow campaign inquiry")}`;
}

export default async function CampaignLandingPage({ params }: CampaignLandingPageProps) {
  const { campaignSlug } = await params;
  const theme = themes[campaignSlug] ?? campaignFallback;
  const secondaryHref = secondaryActionHref(campaignSlug);

  return (
    <div className="min-w-0 space-y-space-2xl">
      <section className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface to-surface-2 px-5 py-space-2xl shadow-premium-lg sm:px-8 md:px-10">
        <div className="absolute -right-28 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/2 top-full h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8a6f99]/25 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">{theme.eyebrow}</p>
            <h1 className="max-w-3xl">{theme.title}</h1>
            <p className="max-w-2xl text-body">{theme.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={"/products" as Route}
                className="premium-ring inline-flex h-11 items-center rounded-lg border border-transparent bg-accent px-5 text-body-sm font-medium text-accent-foreground transition-all duration-300 ease-premium hover:bg-accent-soft"
              >
                {theme.ctaPrimary}
              </Link>
              <a
                href={secondaryHref}
                className="premium-ring inline-flex h-11 items-center rounded-lg border border-border-strong bg-surface-2 px-5 text-body-sm font-medium text-foreground transition-all duration-300 ease-premium hover:bg-surface-3"
              >
                {theme.ctaSecondary}
              </a>
            </div>
          </div>
          <Card className="border-border bg-surface/90">
            <CardContent className="space-y-3 p-5">
              <p className="text-label-sm font-semibold uppercase text-accent-soft">Campaign Highlight</p>
              <h2 className="text-heading-lg">{theme.heroNote}</h2>
              <p className="text-body-sm text-muted">
                Campaign optimized for digital marketing and e-commerce conversion with premium client experience at every step.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="bg-surface">
          <CardContent className="space-y-4 p-7">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Campaign Story</p>
            <h2 className="max-w-xl text-heading-xl">{theme.storyTitle}</h2>
            <p className="max-w-2xl text-body-sm text-muted">{theme.storyBody}</p>
          </CardContent>
        </Card>
        <Card id="campaign-offer" className="scroll-mt-28 border-accent/35 bg-accent/10">
          <CardContent className="space-y-4 p-7">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Promotional Block</p>
            <h2 className="text-heading-lg">{theme.promoTitle}</h2>
            <p className="text-body-sm text-muted">{theme.promoCopy}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={"/products" as Route}
                className="premium-ring inline-flex h-10 items-center rounded-lg border border-border-strong bg-surface-2 px-4 text-body-sm text-foreground transition-all duration-300 hover:bg-surface-3"
              >
                Shop offer
              </Link>
              <a
                href={secondaryHref}
                className="premium-ring inline-flex h-10 items-center rounded-lg border border-transparent bg-accent px-4 text-body-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent-soft"
              >
                Contact studio
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="campaign-featured" className="scroll-mt-28 space-y-5">
        <div>
          <p className="text-label-sm font-semibold uppercase text-accent-soft">Featured Products</p>
          <h2 className="mt-2">Campaign Curated Selection</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCollectionCard
              key={product.slug}
              name={product.name}
              collection={product.collection}
              material={product.material}
              price={product.price}
              slug={product.slug}
              tag={product.tag}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border-strong bg-surface px-6 py-8 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-xl border border-border bg-surface-2/70 p-5">
              <p className="text-body-sm text-muted">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-accent/35 bg-accent/10 px-7 py-9">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Final Campaign CTA</p>
            <h2 className="mt-2">Ready to launch your signature selection?</h2>
            <p className="mt-2 text-body-sm text-muted">
              Drive conversions with elevated storytelling, clear value messaging, and premium fulfillment incentives.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={"/products" as Route}
              className="premium-ring inline-flex h-11 items-center rounded-lg border border-transparent bg-accent px-5 text-body-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent-soft"
            >
              Shop Campaign
            </Link>
            <Link
              href={"/collections" as Route}
              className="premium-ring inline-flex h-11 items-center rounded-lg border border-border-strong bg-surface-2 px-5 text-body-sm font-medium text-foreground transition-all duration-300 hover:bg-surface-3"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </div>
  );
}
