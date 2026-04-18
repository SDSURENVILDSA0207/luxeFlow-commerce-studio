export type AICopyContext = {
  campaignTheme: string;
  audience: string;
  promotionType: string;
  tone: string;
};

export type AICopySuggestions = {
  heroHeadlines: string[];
  ctaSuggestions: string[];
  promoBannerText: string[];
  emailSubjectLines: string[];
  campaignSummaries: string[];
};
