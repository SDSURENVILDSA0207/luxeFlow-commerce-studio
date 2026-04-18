export type AbTestType = "homepage-hero" | "campaign-banner" | "cta-copy" | "promotional-headline";
export type AbTestStatus = "draft" | "running" | "completed";

export type VariantMetrics = {
  impressions: number;
  clicks: number;
  ctr: string;
  conversionRate: string;
};

export type AbTestRecord = {
  id: string;
  name: string;
  type: AbTestType;
  status: AbTestStatus;
  targetPage: string;
  variantALabel: string;
  variantACopy: string;
  variantBLabel: string;
  variantBCopy: string;
  metricsA: VariantMetrics;
  metricsB: VariantMetrics;
  updatedAt: string;
};
