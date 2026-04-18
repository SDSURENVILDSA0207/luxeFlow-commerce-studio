export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", description: "Performance overview and studio health." },
  { href: "/admin/content", label: "Content", description: "Manage storefront and campaign content blocks." },
  { href: "/admin/campaigns", label: "Campaigns", description: "Launch and monitor marketing promotions." },
  { href: "/admin/email-templates", label: "Email Templates", description: "Design and preview campaign emails." },
  { href: "/admin/ai-assistant", label: "AI Copy Assistant", description: "Generate premium marketing copy suggestions." },
  { href: "/admin/experiments", label: "A/B Testing", description: "Run experiments and compare variants." },
  { href: "/admin/analytics", label: "Analytics", description: "Track revenue, attribution, and conversion." },
  { href: "/admin/settings", label: "Settings", description: "Configure team roles and platform preferences." }
];

type RouteMeta = {
  title: string;
  description: string;
};

const routeMetaMap: Record<string, RouteMeta> = {
  "/admin": {
    title: "Dashboard",
    description: "A premium control center for daily performance and studio priorities."
  },
  "/admin/content": {
    title: "Content",
    description: "Shape luxury storytelling across storefront, campaigns, and editorial pages."
  },
  "/admin/campaigns": {
    title: "Campaigns",
    description: "Coordinate launches, activation windows, and conversion-focused promotions."
  },
  "/admin/email-templates": {
    title: "Email Templates",
    description: "Preview and refine responsive campaign emails before launch."
  },
  "/admin/ai-assistant": {
    title: "AI Copy Assistant",
    description: "Generate premium campaign copy and subject-line ideas with context-aware prompts."
  },
  "/admin/experiments": {
    title: "A/B Testing",
    description: "Compare creative and offer variants with structured experimentation."
  },
  "/admin/analytics": {
    title: "Analytics",
    description: "Understand performance trends and attribution across channels."
  },
  "/admin/settings": {
    title: "Settings",
    description: "Manage teams, integrations, and studio defaults."
  },
  "/admin/design-system": {
    title: "Design System",
    description: "Maintain visual consistency for premium commerce experiences."
  }
};

export function getAdminRouteMeta(pathname: string): RouteMeta {
  if (routeMetaMap[pathname]) return routeMetaMap[pathname];
  return {
    title: "LuxeFlow Studio",
    description: "Manage commerce, campaigns, and premium client experiences."
  };
}
