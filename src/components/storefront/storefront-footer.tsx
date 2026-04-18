import type { Route } from "next";
import Link from "next/link";

const legalMail = (subject: string) =>
  `mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent(subject)}`;

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Rings", href: "/collections#rings" },
      { label: "Necklaces", href: "/collections#necklaces" },
      { label: "Bracelets", href: "/collections#bracelets" },
      { label: "Earrings", href: "/collections#earrings" }
    ]
  },
  {
    title: "Maison",
    links: [
      { label: "Craftsmanship", href: "/c/spring-bridal-event" },
      { label: "Our Story", href: "/c/new-arrivals-collection" },
      { label: "Materials & Care", href: "/collections" },
      { label: "Client Services", href: "/c/holiday-gift-guide" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/products" },
      { label: "Size Guide", href: "/product/luna-halo-ring" },
      { label: "Book a Stylist", href: "/c/spring-bridal-event" },
      { label: "Contact", href: legalMail("LuxeFlow client inquiry") }
    ]
  }
] as const;

export function StorefrontFooter() {
  return (
    <footer className="mt-space-3xl border-t border-border/70 pb-space-xl pt-space-2xl">
      <div className="grid min-w-0 gap-10 md:grid-cols-[1.5fr_2fr]">
        <div className="min-w-0 space-y-4">
          <p className="text-label-sm font-semibold uppercase text-accent-soft">LuxeFlow Atelier</p>
          <h3 className="max-w-sm text-balance text-heading-xl">Fine jewelry experiences, designed with modern elegance.</h3>
          <p className="max-w-md text-body-sm text-muted">
            Crafted for collectors who value timeless silhouettes, ethical sourcing, and elevated service.
          </p>
        </div>

        <div className="grid min-w-0 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title} className="min-w-0">
              <p className="text-body-sm font-semibold text-foreground">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => {
                  const isMail = link.href.startsWith("mailto:");
                  return (
                    <li key={link.label}>
                      {isMail ? (
                        <a
                          className="break-words text-body-sm text-muted transition-colors duration-300 hover:text-foreground"
                          href={link.href}
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          className="break-words text-body-sm text-muted transition-colors duration-300 hover:text-foreground"
                          href={link.href as Route}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-space-xl flex min-w-0 flex-col gap-3 border-t border-border/70 pt-space-md text-body-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0">© {new Date().getFullYear()} LuxeFlow Commerce Studio. All rights reserved.</p>
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
          <a className="hover:text-foreground" href={legalMail("Privacy policy request")}>
            Privacy
          </a>
          <a className="hover:text-foreground" href={legalMail("Terms of service request")}>
            Terms
          </a>
          <a className="hover:text-foreground" href={legalMail("Accessibility support")}>
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}
