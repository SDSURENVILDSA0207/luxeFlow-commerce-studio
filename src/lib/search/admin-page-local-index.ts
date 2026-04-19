import { getStudioRouteMeta } from "@/components/layouts/studio-navigation";
import { seedCampaigns } from "@/modules/campaigns/seed-campaigns";
import { seedContentBlocks } from "@/modules/cms/seed-content-blocks";
import { seedEmailCampaigns } from "@/modules/email/seed-campaigns";
import { emailTemplates } from "@/modules/email/templates";
import { seedAbTests } from "@/modules/experiments/seed-tests";
import type { AbTestRecord } from "@/modules/experiments/types";
import type { SearchIndexEntry } from "@/lib/search/types";

/** Live A/B tests from the studio UI — merged into page search when mounted. */
let experimentsSearchOverride: AbTestRecord[] | null = null;

export function syncStudioExperimentsSearchIndex(tests: AbTestRecord[] | null) {
  experimentsSearchOverride = tests;
}

function abTypeLabel(type: AbTestRecord["type"]): string {
  const map: Record<AbTestRecord["type"], string> = {
    "homepage-hero": "Homepage Hero",
    "campaign-banner": "Campaign Banner",
    "cta-copy": "CTA Copy",
    "promotional-headline": "Promotional Headline"
  };
  return map[type] ?? type;
}

function blob(parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function push(entries: SearchIndexEntry[], e: SearchIndexEntry) {
  entries.push(e);
}

/** Normalize pathname for admin route keys (no query/hash, no trailing slash). */
export function normalizeAdminPathname(pathname: string): string {
  const raw = pathname.split("?")[0]?.split("#")[0] ?? "";
  if (!raw.startsWith("/studio")) return "/studio";
  const trimmed = raw.replace(/\/$/, "") || "/studio";
  return trimmed;
}

/**
 * Searchable sections and cards for the current admin screen only (studio command palette default scope).
 */
export function getAdminPageLocalEntries(pathname: string): SearchIndexEntry[] {
  const path = normalizeAdminPathname(pathname);
  const meta = getStudioRouteMeta(path);
  const out: SearchIndexEntry[] = [];

  push(out, {
    id: `page-${path}-hero`,
    group: "page",
    title: meta.title,
    subtitle: "Page · overview",
    href: path,
    searchBlob: blob([meta.title, meta.description, path, "page", "section"]),
    boost: 14
  });

  switch (path) {
    case "/studio": {
      push(out, {
        id: "dash-kpi-metrics",
        group: "page",
        title: "Key metrics",
        subtitle: "Revenue, CVR, AOV, return rate",
        href: "/studio#kpi-metrics",
        searchBlob: blob(["kpi", "metrics", "revenue", "cvr", "aov", "return", "performance", "cards"]),
        boost: 12
      });
      for (const row of [
        { label: "Revenue (7d)", terms: "revenue money sales 7d week" },
        { label: "Campaign CVR", terms: "conversion rate cvr campaign" },
        { label: "Average Order Value", terms: "aov order value basket" },
        { label: "Return Rate", terms: "returns refunds size guide" }
      ]) {
        push(out, {
          id: `dash-kpi-${row.label}`,
          group: "page",
          title: row.label,
          subtitle: "Metric card · Dashboard",
          href: "/studio/analytics#overview",
          searchBlob: blob([row.label, row.terms, "metric", "dashboard"]),
          boost: 8
        });
      }
      push(out, {
        id: "dash-campaign-momentum",
        group: "page",
        title: "Campaign Momentum",
        subtitle: "Active launches and scaling campaigns",
        href: "/studio#campaign-momentum",
        searchBlob: blob(["campaign", "momentum", "launch", "live", "scaling", "planned"]),
        boost: 11
      });
      for (const c of seedCampaigns) {
        push(out, {
          id: `dash-camp-${c.id}`,
          group: "page",
          title: c.name,
          subtitle: `${c.status} · ${c.summary}`,
          href: c.landingPage,
          searchBlob: blob([c.name, c.summary, c.status, "campaign", "row"]),
          boost: c.status === "active" ? 7 : 5
        });
      }
      push(out, {
        id: "dash-studio-priorities",
        group: "page",
        title: "Studio Priorities",
        subtitle: "Today · tasks and follow-ups",
        href: "/studio#studio-priorities",
        searchBlob: blob(["priorities", "today", "tasks", "todo", "follow up"]),
        boost: 10
      });
      for (const line of [
        {
          text: "Finalize hero assets for Bridal campaign landing page.",
          terms: "hero bridal content landing",
          href: "/studio/content"
        },
        {
          text: "Approve featured collection email before 3:00 PM send window.",
          terms: "email approve send featured",
          href: "/studio/email-templates"
        },
        {
          text: "Review A/B result snapshot and select winner variant.",
          terms: "ab test experiment winner",
          href: "/studio/experiments"
        }
      ]) {
        push(out, {
          id: `dash-priority-${line.text.slice(0, 24)}`,
          group: "page",
          title: line.text,
          subtitle: "Priority · Dashboard",
          href: line.href,
          searchBlob: blob([line.text, line.terms, "priority"]),
          boost: 6
        });
      }
      push(out, {
        id: "dash-link-campaigns",
        group: "page",
        title: "Manage in Campaigns",
        subtitle: "Open full campaign workspace",
        href: "/studio/campaigns",
        searchBlob: blob(["manage", "campaigns", "link"]),
        boost: 4
      });
      break;
    }
    case "/studio/content": {
      push(out, {
        id: "content-hero",
        group: "page",
        title: "Content Management",
        subtitle: "CMS workspace overview",
        href: "/studio/content",
        searchBlob: blob(["content", "cms", "blocks", "publish", "preview"]),
        boost: 10
      });
      push(out, {
        id: "content-library",
        group: "page",
        title: "Block library",
        subtitle: "Select and edit content blocks",
        href: "/studio/content#content-blocks",
        searchBlob: blob(["library", "blocks", "list", "select"]),
        boost: 9
      });
      for (const b of seedContentBlocks) {
        push(out, {
          id: `content-block-${b.id}`,
          group: "page",
          title: b.name,
          subtitle: `${b.type.replace(/-/g, " ")} · ${b.status}`,
          href: "/studio/content#content-blocks",
          searchBlob: blob([b.name, b.type, b.status, b.headline, b.body, b.page]),
          boost: b.status === "published" ? 5 : 3
        });
      }
      break;
    }
    case "/studio/campaigns": {
      push(out, {
        id: "camp-hero",
        group: "page",
        title: "Campaign Manager",
        subtitle: "Create and schedule promotions",
        href: "/studio/campaigns",
        searchBlob: blob(["campaign", "manager", "schedule", "promotion"]),
        boost: 10
      });
      for (const c of seedCampaigns) {
        push(out, {
          id: `camp-row-${c.id}`,
          group: "page",
          title: c.name,
          subtitle: `${c.status} · ${c.summary}`,
          href: "/studio/campaigns",
          searchBlob: blob([c.name, c.summary, c.status, "campaign"]),
          boost: c.status === "active" ? 7 : 4
        });
      }
      break;
    }
    case "/studio/email-templates": {
      push(out, {
        id: "email-hero",
        group: "page",
        title: "Email Templates",
        subtitle: "Responsive campaign emails",
        href: "/studio/email-templates",
        searchBlob: blob(["email", "template", "responsive", "campaign"]),
        boost: 10
      });
      for (const t of emailTemplates) {
        push(out, {
          id: `email-tpl-page-${t.id}`,
          group: "page",
          title: t.name,
          subtitle: t.description,
          href: "/studio/email-templates",
          searchBlob: blob([t.name, t.subject, t.description, t.id]),
          boost: 6
        });
      }
      for (const e of seedEmailCampaigns) {
        push(out, {
          id: `email-camp-page-${e.id}`,
          group: "page",
          title: e.name,
          subtitle: `${e.status} · ${e.subject}`,
          href: "/studio/email-templates",
          searchBlob: blob([e.name, e.subject, e.audienceSegment, e.status]),
          boost: 5
        });
      }
      break;
    }
    case "/studio/ai-assistant": {
      push(out, {
        id: "ai-hero",
        group: "page",
        title: "AI Copy Assistant",
        subtitle: "Prompts and generated copy",
        href: "/studio/ai-assistant",
        searchBlob: blob(["ai", "copy", "assistant", "subject", "cta", "prompt"]),
        boost: 10
      });
      push(out, {
        id: "ai-editor",
        group: "page",
        title: "Copy editor",
        subtitle: "Edit and copy to clipboard",
        href: "/studio/ai-assistant",
        searchBlob: blob(["editor", "clipboard", "tone", "variants"]),
        boost: 7
      });
      break;
    }
    case "/studio/experiments": {
      const abTests = experimentsSearchOverride ?? seedAbTests;

      push(out, {
        id: "exp-hero",
        group: "page",
        title: "A/B Testing",
        subtitle: "Experiments and variants",
        href: "/studio/experiments",
        searchBlob: blob(["ab", "test", "testing", "experiment", "experiments", "variant", "variants", "conversion", "split"]),
        boost: 10
      });

      push(out, {
        id: "exp-section-list",
        group: "page",
        title: "Experiment List",
        subtitle: "Browse and select tests",
        href: "/studio/experiments#experiment-list",
        searchBlob: blob(["experiment", "list", "tests", "cards", "select", "running", "draft", "completed"]),
        boost: 9
      });
      push(out, {
        id: "exp-section-setup",
        group: "page",
        title: "A/B Test Setup",
        subtitle: "Name, type, target page, variants",
        href: "/studio/experiments#ab-test-setup",
        searchBlob: blob([
          "setup",
          "create",
          "edit",
          "test name",
          "test type",
          "target page",
          "variant",
          "label",
          "copy",
          "homepage hero",
          "campaign banner",
          "cta",
          "promotional headline"
        ]),
        boost: 9
      });
      push(out, {
        id: "exp-section-metrics",
        group: "page",
        title: "Mock Performance Metrics",
        subtitle: "Impressions, clicks, CTR, conversion",
        href: "/studio/experiments#ab-performance-metrics",
        searchBlob: blob([
          "mock",
          "performance",
          "metrics",
          "results",
          "results view",
          "impressions",
          "clicks",
          "ctr",
          "click through",
          "conversion",
          "conversion rate",
          "rate",
          "winner",
          "current winner"
        ]),
        boost: 9
      });

      for (const t of abTests) {
        const typeLabel = abTypeLabel(t.type);
        push(out, {
          id: `exp-row-${t.id}`,
          group: "page",
          title: t.name,
          subtitle: `${typeLabel} · ${t.status}`,
          href: "/studio/experiments",
          searchBlob: blob([
            t.name,
            t.type,
            typeLabel,
            t.status,
            t.status.toUpperCase(),
            t.targetPage,
            t.variantALabel,
            t.variantBLabel,
            t.variantACopy,
            t.variantBCopy,
            "experiment",
            "variant",
            "impressions",
            "clicks",
            "ctr",
            "conversion",
            "conversion rate",
            "metrics",
            "performance"
          ]),
          boost: 6
        });
      }
      break;
    }
    case "/studio/analytics": {
      push(out, {
        id: "analytics-hero",
        group: "page",
        title: "Analytics Dashboard",
        subtitle: "Performance and attribution",
        href: "/studio/analytics",
        searchBlob: blob(["analytics", "attribution", "revenue", "channels"]),
        boost: 10
      });
      push(out, {
        id: "analytics-overview",
        group: "page",
        title: "Overview",
        subtitle: "Key charts and KPI strip",
        href: "/studio/analytics#overview",
        searchBlob: blob(["overview", "charts", "kpi", "trends"]),
        boost: 9
      });
      break;
    }
    case "/studio/settings": {
      push(out, {
        id: "settings-team",
        group: "page",
        title: "Team & Permissions",
        subtitle: "Role access",
        href: "/studio/settings",
        searchBlob: blob(["team", "permissions", "roles", "access", "designer", "marketer"]),
        boost: 9
      });
      push(out, {
        id: "settings-integrations",
        group: "page",
        title: "Integrations",
        subtitle: "Email, analytics, delivery",
        href: "/studio/settings",
        searchBlob: blob(["integrations", "email provider", "analytics", "delivery"]),
        boost: 9
      });
      break;
    }
    case "/studio/design-system": {
      push(out, {
        id: "ds-tokens",
        group: "page",
        title: "Design tokens",
        subtitle: "Color, type, spacing",
        href: "/studio/design-system",
        searchBlob: blob(["tokens", "color", "typography", "spacing", "radius"]),
        boost: 9
      });
      push(out, {
        id: "ds-components",
        group: "page",
        title: "Components",
        subtitle: "Buttons, cards, forms",
        href: "/studio/design-system",
        searchBlob: blob(["components", "button", "card", "form", "ui"]),
        boost: 8
      });
      break;
    }
    default:
      break;
  }

  return out;
}
