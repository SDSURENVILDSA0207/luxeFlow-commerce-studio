import type { EmailTemplate } from "@/modules/email/types";

type BaseEmailTemplateInput = {
  preheader: string;
  title: string;
  subtitle: string;
  contentBlock: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote?: string;
};

function renderBaseTemplate({
  preheader,
  title,
  subtitle,
  contentBlock,
  ctaLabel,
  ctaUrl,
  footerNote
}: BaseEmailTemplateInput): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>LuxeFlow Campaign</title>
  <style>
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background: #f3ede4; font-family: Inter, Arial, sans-serif; }
    .email-wrap { width: 100%; background: #f3ede4; padding: 28px 12px; }
    .email-container { width: 100%; max-width: 640px; margin: 0 auto; background: #15121a; border-radius: 16px; overflow: hidden; }
    .header { padding: 26px 28px 14px; background: linear-gradient(135deg, #1d1825, #16121c); }
    .brand { font-family: Georgia, "Times New Roman", serif; font-size: 24px; line-height: 1.2; color: #f4efe6; letter-spacing: 0.04em; }
    .preheader { display: none !important; max-height: 0; overflow: hidden; opacity: 0; color: transparent; }
    .hero { padding: 18px 28px 8px; }
    .eyebrow { font-size: 11px; line-height: 1.2; letter-spacing: 0.14em; text-transform: uppercase; color: #dfc7a2; font-weight: 700; }
    .title { margin: 10px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: 34px; line-height: 1.2; color: #f4efe6; }
    .subtitle { margin: 14px 0 0; font-size: 16px; line-height: 1.65; color: #c3b8a8; }
    .content { padding: 18px 28px 8px; }
    .content-card { background: #211b2a; border: 1px solid #3c3448; border-radius: 12px; padding: 18px; }
    .content-title { margin: 0 0 10px; color: #f4efe6; font-size: 20px; line-height: 1.3; font-family: Georgia, "Times New Roman", serif; }
    .content-text { margin: 0; color: #bfb3a3; font-size: 14px; line-height: 1.7; }
    .cta-wrap { padding: 22px 28px 8px; }
    .cta-button { display: inline-block; background: #caa774; color: #23170d !important; font-weight: 700; font-size: 14px; line-height: 1; text-decoration: none; padding: 14px 22px; border-radius: 10px; }
    .trust { padding: 20px 28px 8px; }
    .trust-card { background: #181420; border: 1px solid #302938; border-radius: 12px; padding: 14px; }
    .trust-item { margin: 0; color: #b7ab9b; font-size: 12px; line-height: 1.6; }
    .divider { margin: 20px 0 0; border-top: 1px solid #342d40; }
    .footer { padding: 16px 28px 24px; }
    .footer-text { margin: 8px 0 0; color: #9f9485; font-size: 11px; line-height: 1.6; }
    @media screen and (max-width: 620px) {
      .header, .hero, .content, .cta-wrap, .trust, .footer { padding-left: 18px !important; padding-right: 18px !important; }
      .title { font-size: 28px !important; }
      .subtitle { font-size: 15px !important; }
      .cta-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="email-wrap">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" class="email-container" cellpadding="0" cellspacing="0">
            <tr>
              <td class="header">
                <div class="brand">LuxeFlow Atelier</div>
              </td>
            </tr>
            <tr>
              <td class="hero">
                <p class="eyebrow">Luxury Jewelry Campaign</p>
                <h1 class="title">${title}</h1>
                <p class="subtitle">${subtitle}</p>
              </td>
            </tr>
            <tr>
              <td class="content">
                ${contentBlock}
              </td>
            </tr>
            <tr>
              <td class="cta-wrap">
                <a href="${ctaUrl}" class="cta-button">${ctaLabel}</a>
              </td>
            </tr>
            <tr>
              <td class="trust">
                <div class="trust-card">
                  <p class="trust-item">Certified responsibly sourced stones · Complimentary luxury gift packaging · Secure insured shipping</p>
                </div>
                <div class="divider"></div>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p class="footer-text">LuxeFlow Commerce Studio, 88 Atelier Row, New York, NY</p>
                <p class="footer-text">${footerNote ?? "You are receiving this message because you subscribed to LuxeFlow campaign updates."}</p>
                <p class="footer-text">
                  <a href="mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("Unsubscribe request")}" style="color:#caa774;text-decoration:underline;">Unsubscribe</a>
                  ·
                  <a href="mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("Privacy policy")}" style="color:#caa774;text-decoration:underline;">Privacy</a>
                  ·
                  <a href="mailto:concierge@luxeFlow.studio?subject=${encodeURIComponent("Client services")}" style="color:#caa774;text-decoration:underline;">Client Services</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function renderPromotionalSaleEmail() {
  return renderBaseTemplate({
    preheader: "Private sale invitation: up to 20% off signature jewelry.",
    title: "Private Promotion: Up to 20% Off Signature Pieces",
    subtitle:
      "For 72 hours, enjoy exclusive pricing on selected rings, necklaces, and bridal favorites designed for modern collectors.",
    contentBlock: `
      <div class="content-card">
        <h2 class="content-title">Event Highlights</h2>
        <p class="content-text">- Save up to 20% on selected icons<br/>- Early access to limited sapphire capsule<br/>- Complimentary styling consultation on qualifying orders</p>
      </div>
    `,
    ctaLabel: "Shop Private Sale",
    ctaUrl: "/c/spring-bridal-event"
  });
}

function renderFeaturedCollectionEmail() {
  return renderBaseTemplate({
    preheader: "Explore the Celestial Gold collection edit.",
    title: "Featured Collection: Celestial Gold",
    subtitle:
      "A luminous edit of sculpted gold silhouettes, designed to layer effortlessly from daywear to evening styling.",
    contentBlock: `
      <div class="content-card">
        <h2 class="content-title">Why This Collection</h2>
        <p class="content-text">Inspired by celestial light and contemporary tailoring, this release includes minimalist pendants, refined cuffs, and timeless signet forms.</p>
      </div>
    `,
    ctaLabel: "Explore Collection",
    ctaUrl: "/collections"
  });
}

function renderNewArrivalsEmail() {
  return renderBaseTemplate({
    preheader: "See the newest arrivals in fine jewelry.",
    title: "New Arrivals: Contemporary Icons Have Landed",
    subtitle:
      "Discover fresh arrivals in 18K gold, pearl atelier drops, and gemstone essentials curated for premium gifting and personal milestones.",
    contentBlock: `
      <div class="content-card">
        <h2 class="content-title">Now Available</h2>
        <p class="content-text">Luna Halo Ring · Pearl Sculpt Drops · Solstice Charm Necklace · Noir Sapphire Pendant</p>
      </div>
    `,
    ctaLabel: "Shop New Arrivals",
    ctaUrl: "/c/new-arrivals-collection"
  });
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "promotional-sale",
    name: "Promotional Sale",
    subject: "Private Jewelry Promotion: Up to 20% Off",
    preheader: "Limited-time pricing on signature pieces.",
    description: "Urgency-focused campaign email for conversion and seasonal sale pushes.",
    html: renderPromotionalSaleEmail()
  },
  {
    id: "featured-collection",
    name: "Featured Collection",
    subject: "Now Featuring: Celestial Gold Collection",
    preheader: "Discover our most refined collection edit.",
    description: "Collection spotlight template optimized for storytelling and merchandising.",
    html: renderFeaturedCollectionEmail()
  },
  {
    id: "new-arrivals",
    name: "New Arrivals",
    subject: "New Arrivals: Contemporary Jewelry Icons",
    preheader: "Fresh luxury pieces just landed.",
    description: "Launch template for announcing newly released products and drops.",
    html: renderNewArrivalsEmail()
  }
];
