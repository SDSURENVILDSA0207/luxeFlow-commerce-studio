import type { Route } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/storefront/newsletter-signup";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { ProductCollectionCard } from "@/components/storefront/product-collection-card";
import { Badge, buttonVisualClasses, Card, CardContent } from "@/components/ui";
import {
  homeFeaturedCategories,
  homeFeaturedCollections,
  homeTrustPoints
} from "@/lib/storefront/storefront-routes";

const trendingProducts = [
  {
    name: "Luna Halo Ring",
    collection: "Celestial Gold",
    material: "18K Gold, VS Diamond",
    price: "$2,300",
    tag: "Best Seller",
    slug: "luna-halo-ring"
  },
  {
    name: "Noir Sapphire Pendant",
    collection: "Midnight Sapphire",
    material: "18K Gold, Blue Sapphire",
    price: "$1,780",
    tag: "Trending",
    slug: "noir-sapphire-pendant"
  },
  {
    name: "Aurelia Link Bracelet",
    collection: "Celestial Gold",
    material: "18K Gold, Hand-finished Links",
    price: "$1,460",
    tag: "Editor's pick",
    slug: "aurelia-link-bracelet"
  },
  {
    name: "Etoile Diamond Studs",
    collection: "Bridal Icons",
    material: "18K White Gold, Diamond",
    price: "$1,190",
    tag: "Gift edit",
    slug: "etoile-diamond-studs"
  }
];

export default function StorefrontHomePage() {
  return (
    <div className="space-y-space-3xl">
      <section className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface to-surface-2 px-5 py-space-3xl shadow-premium-lg sm:px-8 md:px-12 lg:px-14">
        <div className="absolute -right-28 -top-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#8a6f99]/30 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="space-y-7">
            <Badge variant="accent">Spring Signature 2026</Badge>
            <div className="space-y-5">
              <h1 className="max-w-2xl">
                Jewelry crafted to be <span className="text-accent-soft">worn now</span> and cherished for decades.
              </h1>
              <p className="max-w-xl text-body">
                Discover a modern high-jewelry experience blending artisanal craftsmanship, elevated styling, and exclusive seasonal drops.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={"/products" as Route} className={buttonVisualClasses()}>
                Shop Bestsellers
              </Link>
              <Link href={"/collections" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
                Explore Collections
              </Link>
            </div>
            <div className="grid max-w-2xl gap-6 border-t border-border/80 pt-5 sm:grid-cols-3">
              <div>
                <p className="font-display text-heading-xl text-foreground">4.9/5</p>
                <p className="text-body-sm text-muted">Client satisfaction across premium orders</p>
              </div>
              <div>
                <p className="font-display text-heading-xl text-foreground">24h</p>
                <p className="text-body-sm text-muted">Concierge response with personalized guidance</p>
              </div>
              <div>
                <p className="font-display text-heading-xl text-foreground">100%</p>
                <p className="text-body-sm text-muted">Certified precious metal authenticity</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-2/80 p-6 shadow-premium">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Featured Drop</p>
            <h2 className="mt-3 text-heading-xl">The Midnight Sapphire Set</h2>
            <p className="mt-3 text-body-sm text-muted">
              A limited-edition trio of pendant, ring, and earrings inspired by evening couture and deep sapphire tones.
            </p>
            <div className="mt-6 grid gap-3">
              {["18K recycled gold", "Natural sapphires", "Complimentary luxury gift wrap"].map((item) => (
                <div key={item} className="rounded-lg border border-border bg-surface px-4 py-3 text-body-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link
                href={"/product/noir-sapphire-pendant" as Route}
                className={buttonVisualClasses({ variant: "secondary", size: "sm" })}
              >
                View sapphire capsule
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Featured Categories</p>
            <h2 className="mt-2">Curated Jewelry Universes</h2>
          </div>
          <Link className="text-body-sm text-muted transition-colors hover:text-foreground" href={"/collections" as Route}>
            View all categories
          </Link>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homeFeaturedCategories.map((category) => (
            <Link key={category.title} href={category.href} className="block min-w-0">
              <Card className="group h-full border-border bg-surface transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-border-strong hover:shadow-premium motion-reduce:transform-none">
                <CardContent className="space-y-4 p-6">
                  <p className="text-label-sm font-semibold uppercase text-accent-soft">{category.highlight}</p>
                  <h3 className="text-heading-lg transition-colors duration-300 group-hover:text-accent-soft">{category.title}</h3>
                  <p className="text-body-sm text-muted">{category.description}</p>
                  <span className="inline-flex text-body-sm font-medium text-accent-soft transition-transform group-hover:translate-x-0.5">
                    Shop category →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface px-6 py-8 sm:px-8 sm:py-10">
          <div>
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Featured Collections</p>
            <h2 className="mt-3 max-w-md text-balance">Signature edits designed for modern collectors.</h2>
          </div>
          <Link
            href={"/collections" as Route}
            className="mt-6 inline-flex w-fit text-body-sm font-medium text-accent-soft transition-colors hover:text-foreground"
          >
            Explore all collections →
          </Link>
        </div>
        <div className="grid min-w-0 gap-4">
          {homeFeaturedCollections.map((collection) => (
            <Link key={collection.name} href={collection.href} className="block min-w-0">
              <Card className="group h-full transition-all duration-500 hover:border-border-strong hover:shadow-premium motion-reduce:transform-none">
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="text-label-sm font-semibold uppercase text-accent-soft">{collection.season}</p>
                    <h3 className="mt-1 text-heading-lg">{collection.name}</h3>
                    <p className="mt-2 text-body-sm text-muted">{collection.description}</p>
                  </div>
                  <span className="shrink-0 text-xl text-muted transition-transform duration-300 group-hover:translate-x-1">→</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-accent/35 bg-accent/10 px-8 py-10 shadow-premium-soft">
        <div className="absolute -right-12 top-4 h-32 w-32 rounded-full border border-accent/40" />
        <p className="text-label-sm font-semibold uppercase text-accent-soft">Private Client Offer</p>
        <h2 className="mt-3 max-w-2xl">Receive a complimentary silk jewelry case with orders above $1,500 this week.</h2>
        <p className="mt-3 max-w-2xl text-body-sm text-muted">
          Limited seasonal campaign. Designed to increase average order value while elevating gifting experiences.
        </p>
        <div className="mt-5">
          <Link href={"/c/spring-bridal-event" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
            Shop the offer
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Bestsellers</p>
            <h2 className="mt-2">Trending Pieces This Week</h2>
          </div>
          <Link className="text-body-sm text-muted transition-colors hover:text-foreground" href={"/products" as Route}>
            Browse all products
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCollectionCard
              key={product.slug}
              name={product.name}
              collection={product.collection}
              material={product.material}
              price={product.price}
              tag={product.tag}
              slug={product.slug}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {homeTrustPoints.map((point) => (
          <Link key={point.title} href={point.href} className="group block min-h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Card className="h-full border-border bg-surface-2/70 transition-[border-color,box-shadow] duration-300 group-hover:border-border-strong group-hover:shadow-premium">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-heading-md">{point.title}</h3>
                <p className="text-body-sm text-muted">{point.description}</p>
                <span className="inline-flex text-body-sm font-medium text-accent-soft transition-transform group-hover:translate-x-0.5">
                  {point.cta} →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section id="newsletter" className="scroll-mt-28 rounded-2xl border border-border-strong bg-surface px-5 py-8 sm:px-8 sm:py-10 md:px-10">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Campaign Newsletter</p>
            <h2 className="mt-3 max-w-xl text-balance">Join the LuxeFlow inner circle for early access and private campaign drops.</h2>
            <p className="mt-3 max-w-xl text-body-sm text-muted">
              Receive launch previews, editorial styling notes, and invitation-only offers created for high-intent shoppers.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      <StorefrontFooter />
    </div>
  );
}
