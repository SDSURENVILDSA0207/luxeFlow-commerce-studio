import type { AbTestRecord } from "@/modules/experiments/types";

export const seedAbTests: AbTestRecord[] = [
  {
    id: "ab-home-hero-01",
    name: "Homepage Hero Narrative",
    type: "homepage-hero",
    status: "running",
    targetPage: "/",
    variantALabel: "Variant A",
    variantACopy: "Jewelry crafted to be worn now and cherished for decades.",
    variantBLabel: "Variant B",
    variantBCopy: "Fine jewelry designed for modern icons and milestone moments.",
    metricsA: { impressions: 18240, clicks: 994, ctr: "5.45%", conversionRate: "3.12%" },
    metricsB: { impressions: 17960, clicks: 1118, ctr: "6.22%", conversionRate: "3.58%" },
    updatedAt: "2026-04-16T14:15:00.000Z"
  },
  {
    id: "ab-campaign-banner-01",
    name: "Bridal Campaign Banner Offer",
    type: "campaign-banner",
    status: "completed",
    targetPage: "/c/spring-bridal-event",
    variantALabel: "Variant A",
    variantACopy: "Complimentary silk jewelry case on orders above $1,500.",
    variantBLabel: "Variant B",
    variantBCopy: "Private bridal offer: luxury gift wrap + free consultation.",
    metricsA: { impressions: 12340, clicks: 612, ctr: "4.96%", conversionRate: "2.44%" },
    metricsB: { impressions: 12110, clicks: 705, ctr: "5.82%", conversionRate: "2.87%" },
    updatedAt: "2026-04-15T17:10:00.000Z"
  },
  {
    id: "ab-cta-copy-01",
    name: "Homepage CTA Copy",
    type: "cta-copy",
    status: "draft",
    targetPage: "/",
    variantALabel: "Variant A",
    variantACopy: "Shop Bestsellers",
    variantBLabel: "Variant B",
    variantBCopy: "Discover Signature Pieces",
    metricsA: { impressions: 0, clicks: 0, ctr: "0.00%", conversionRate: "0.00%" },
    metricsB: { impressions: 0, clicks: 0, ctr: "0.00%", conversionRate: "0.00%" },
    updatedAt: "2026-04-16T09:45:00.000Z"
  },
  {
    id: "ab-headline-01",
    name: "Promotional Headline Test",
    type: "promotional-headline",
    status: "running",
    targetPage: "/c/new-arrivals-collection",
    variantALabel: "Variant A",
    variantACopy: "Contemporary Icons Have Landed",
    variantBLabel: "Variant B",
    variantBCopy: "New Arrivals Curated for Everyday Luxury",
    metricsA: { impressions: 9640, clicks: 488, ctr: "5.06%", conversionRate: "2.35%" },
    metricsB: { impressions: 9510, clicks: 546, ctr: "5.74%", conversionRate: "2.68%" },
    updatedAt: "2026-04-16T13:00:00.000Z"
  }
];
