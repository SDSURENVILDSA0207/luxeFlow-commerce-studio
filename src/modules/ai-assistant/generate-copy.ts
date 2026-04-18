import type { AICopyContext, AICopySuggestions } from "@/modules/ai-assistant/types";

function titleCase(value: string) {
  return value
    .split(" ")
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ""))
    .join(" ");
}

export function generateCopySuggestions(context: AICopyContext): AICopySuggestions {
  const theme = titleCase(context.campaignTheme.trim());
  const audience = context.audience.trim();
  const promo = context.promotionType.trim();

  return {
    heroHeadlines: [
      `${theme}: Jewelry crafted for ${audience} with elevated seasonal detail.`,
      `Discover ${theme} - a premium edit designed for ${audience}.`,
      `${theme} Collection: Refined pieces made to celebrate ${promo}.`
    ],
    ctaSuggestions: [
      `Explore ${theme}`,
      `Shop the ${promo} Edit`,
      `Unlock Private Access`
    ],
    promoBannerText: [
      `${theme} Offer: Complimentary luxury packaging for ${audience} this week.`,
      `Limited ${promo} Event - curated ${theme} pieces with concierge support.`,
      `${theme} Campaign Live: Premium savings and priority access for ${audience}.`
    ],
    emailSubjectLines: [
      `${theme} Is Here: Exclusive ${promo} Access`,
      `Private ${theme} Invitation for ${audience}`,
      `${theme} Launch: Premium Pieces for ${promo}`
    ],
    campaignSummaries: [
      `${theme} is a conversion-focused campaign built for ${audience}, combining premium storytelling, curated merchandising, and a clear ${promo} incentive.`,
      `This ${promo} activation positions ${theme} as a luxury-led collection moment, designed to increase click-through and high-intent checkout behavior.`,
      `${theme} delivers an editorial commerce experience tailored to ${audience}, with strategic CTA hierarchy and premium value messaging.`
    ]
  };
}
