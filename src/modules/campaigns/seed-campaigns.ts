import type { CampaignRecord } from "@/modules/campaigns/types";

export const seedCampaigns: CampaignRecord[] = [
  {
    id: "campaign-spring-bridal",
    name: "Spring Bridal Event",
    status: "active",
    startDate: "2026-04-10",
    endDate: "2026-04-28",
    targetPage: "/collections",
    landingPage: "/c/spring-bridal-event",
    bannerBlockId: "block-promo-bridal",
    contentBlockId: "block-landing-story",
    emailTemplateId: "promotional-sale",
    summary: "Drive bridal conversion with limited-time offer and concierge bookings.",
    updatedAt: "2026-04-16T14:00:00.000Z"
  },
  {
    id: "campaign-new-arrivals",
    name: "New Arrivals Collection",
    status: "scheduled",
    startDate: "2026-04-20",
    endDate: "2026-05-06",
    targetPage: "/products",
    landingPage: "/c/new-arrivals-collection",
    bannerBlockId: "block-featured-collection",
    contentBlockId: "block-landing-story",
    emailTemplateId: "new-arrivals",
    summary: "Launch spring drop with collection storytelling and email-first traffic push.",
    updatedAt: "2026-04-16T12:45:00.000Z"
  },
  {
    id: "campaign-holiday-gift-guide",
    name: "Holiday Gift Guide",
    status: "draft",
    startDate: "2026-11-15",
    endDate: "2026-12-24",
    targetPage: "/collections",
    landingPage: "/c/holiday-gift-guide",
    bannerBlockId: "block-cta-newsletter",
    contentBlockId: "block-featured-collection",
    emailTemplateId: "featured-collection",
    summary: "Seasonal gifting campaign centered on curated sets and guaranteed delivery.",
    updatedAt: "2026-04-16T09:30:00.000Z"
  }
];
