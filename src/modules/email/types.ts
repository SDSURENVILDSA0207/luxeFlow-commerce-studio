export type EmailTemplateId = "promotional-sale" | "featured-collection" | "new-arrivals";

export type EmailTemplate = {
  id: EmailTemplateId;
  name: string;
  subject: string;
  preheader: string;
  description: string;
  html: string;
};

export type EmailCampaignStatus = "draft" | "scheduled" | "sent";

export type EmailCampaignRecord = {
  id: string;
  name: string;
  templateId: EmailTemplateId;
  subject: string;
  sendDateTime: string;
  audienceSegment: string;
  status: EmailCampaignStatus;
  updatedAt: string;
};
