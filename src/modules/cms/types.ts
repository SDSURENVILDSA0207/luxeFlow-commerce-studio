export type ContentBlockType =
  | "homepage-hero"
  | "promotional-banner"
  | "featured-collection"
  | "cta-section"
  | "landing-section";

export type ContentStatus = "draft" | "published";

export type ContentBlock = {
  id: string;
  name: string;
  type: ContentBlockType;
  status: ContentStatus;
  page: string;
  headline: string;
  body: string;
  badgeText: string;
  ctaLabel: string;
  ctaUrl: string;
  updatedAt: string;
};
