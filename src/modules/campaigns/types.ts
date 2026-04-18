export type CampaignStatus = "draft" | "scheduled" | "active" | "completed";

export type CampaignRecord = {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  targetPage: string;
  landingPage: string;
  bannerBlockId: string;
  contentBlockId: string;
  emailTemplateId: string;
  summary: string;
  updatedAt: string;
};
