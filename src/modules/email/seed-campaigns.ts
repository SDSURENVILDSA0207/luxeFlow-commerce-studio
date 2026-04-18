import type { EmailCampaignRecord } from "@/modules/email/types";

export const seedEmailCampaigns: EmailCampaignRecord[] = [
  {
    id: "email-campaign-bridal-private",
    name: "Bridal Private Offer Blast",
    templateId: "promotional-sale",
    subject: "Private Bridal Event: Up to 20% Off Signature Pieces",
    sendDateTime: "2026-04-18T10:00",
    audienceSegment: "VIP Bridal Leads",
    status: "scheduled",
    updatedAt: "2026-04-16T14:00:00.000Z"
  },
  {
    id: "email-campaign-celestial-feature",
    name: "Celestial Collection Spotlight",
    templateId: "featured-collection",
    subject: "Now Featuring: Celestial Gold Collection",
    sendDateTime: "2026-04-15T09:30",
    audienceSegment: "High Intent Repeat Customers",
    status: "sent",
    updatedAt: "2026-04-15T09:45:00.000Z"
  },
  {
    id: "email-campaign-arrivals-launch",
    name: "New Arrivals Early Access",
    templateId: "new-arrivals",
    subject: "New Arrivals: Contemporary Icons Just Landed",
    sendDateTime: "2026-04-20T11:00",
    audienceSegment: "Newsletter Early Access",
    status: "draft",
    updatedAt: "2026-04-16T11:15:00.000Z"
  }
];
