export type StudioNavItem = {
  href: string;
  label: string;
  description: string;
};

/** LuxeFlow marketing & commerce studio (unauthenticated internal tools). */
export const studioNavItems: StudioNavItem[] = [
  { href: "/studio", label: "Dashboard", description: "Performance overview and studio health." },
  { href: "/studio/content", label: "Content", description: "Manage storefront and campaign content blocks." },
  { href: "/studio/campaigns", label: "Campaigns", description: "Launch and monitor marketing promotions." },
  { href: "/studio/email-templates", label: "Email Templates", description: "Design and preview campaign emails." },
  { href: "/studio/ai-assistant", label: "AI Copy Assistant", description: "Generate premium marketing copy suggestions." },
  { href: "/studio/experiments", label: "A/B Testing", description: "Run experiments and compare variants." },
  { href: "/studio/analytics", label: "Analytics", description: "Track revenue, attribution, and conversion." },
  { href: "/studio/settings", label: "Settings", description: "Configure team roles and platform preferences." }
];

type RouteMeta = {
  title: string;
  description: string;
};

const routeMetaMap: Record<string, RouteMeta> = {
  "/studio": {
    title: "Dashboard",
    description: "A premium control center for daily performance and studio priorities."
  },
  "/studio/content": {
    title: "Content",
    description: "Shape luxury storytelling across storefront, campaigns, and editorial pages."
  },
  "/studio/campaigns": {
    title: "Campaigns",
    description: "Coordinate launches, activation windows, and conversion-focused promotions."
  },
  "/studio/email-templates": {
    title: "Email Templates",
    description: "Preview and refine responsive campaign emails before launch."
  },
  "/studio/ai-assistant": {
    title: "AI Copy Assistant",
    description: "Generate premium campaign copy and subject-line ideas with context-aware prompts."
  },
  "/studio/experiments": {
    title: "A/B Testing",
    description: "Compare creative and offer variants with structured experimentation."
  },
  "/studio/analytics": {
    title: "Analytics",
    description: "Understand performance trends and attribution across channels."
  },
  "/studio/settings": {
    title: "Settings",
    description: "Manage teams, integrations, and studio defaults."
  },
  "/studio/design-system": {
    title: "Design System",
    description: "Maintain visual consistency for premium commerce experiences."
  }
};

export function getStudioRouteMeta(pathname: string): RouteMeta {
  if (routeMetaMap[pathname]) return routeMetaMap[pathname];
  return {
    title: "LuxeFlow Studio",
    description: "Manage commerce, campaigns, and premium client experiences."
  };
}
