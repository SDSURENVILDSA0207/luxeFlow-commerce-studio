import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@luxeflow.studio" },
    update: { name: "LuxeFlow Admin", role: "ADMIN" },
    create: { email: "admin@luxeflow.studio", name: "LuxeFlow Admin", role: "ADMIN" }
  });

  const contentBlocksData = [
    {
      key: "homepage-hero-main",
      name: "Homepage Hero Main",
      type: "HOMEPAGE_HERO",
      status: "PUBLISHED",
      pagePath: "/",
      headline: "Jewelry crafted to be worn now and treasured for generations.",
      body: "Discover modern fine jewelry shaped by atelier craftsmanship, ethical sourcing, and elegant everyday wearability.",
      ctaLabel: "Shop Signature Pieces",
      ctaUrl: "/products",
      metadata: { placement: "hero", theme: "signature" }
    },
    {
      key: "homepage-promo-bridal-banner",
      name: "Homepage Promotional Banner",
      type: "PROMOTIONAL_BANNER",
      status: "PUBLISHED",
      pagePath: "/",
      headline: "Spring Bridal Event: Complimentary luxury ring case on qualifying orders.",
      body: "Limited seasonal offer for bridal clients through April 28.",
      ctaLabel: "Explore Bridal Edit",
      ctaUrl: "/c/spring-bridal-event",
      metadata: { priority: "high", channel: "storefront" }
    },
    {
      key: "homepage-featured-collections",
      name: "Homepage Featured Collections",
      type: "FEATURED_COLLECTION",
      status: "PUBLISHED",
      pagePath: "/",
      headline: "Curated collections for modern collectors.",
      body: "Discover signature edits with luminous gold, rare sapphires, and elevated pearl forms.",
      ctaLabel: "View Collections",
      ctaUrl: "/collections",
      metadata: { slot: "featured-collections" }
    },
    {
      key: "homepage-newsletter-cta",
      name: "Homepage Newsletter CTA",
      type: "CTA_SECTION",
      status: "PUBLISHED",
      pagePath: "/",
      headline: "Join the LuxeFlow private list for early campaign access.",
      body: "Receive launch previews, private sale windows, and stylist recommendations.",
      ctaLabel: "Join Inner Circle",
      ctaUrl: "/",
      metadata: { destination: "newsletter" }
    },
    {
      key: "campaign-new-arrivals-story",
      name: "New Arrivals Story Section",
      type: "LANDING_SECTION",
      status: "PUBLISHED",
      pagePath: "/c/new-arrivals-collection",
      headline: "Designed for today, crafted to become heirlooms.",
      body: "Our latest arrivals blend editorial silhouette with meticulous bench-made finishing.",
      ctaLabel: "Shop New Arrivals",
      ctaUrl: "/c/new-arrivals-collection",
      metadata: { campaign: "new-arrivals-collection" }
    }
  ];

  const contentBlocks = {};
  for (const block of contentBlocksData) {
    contentBlocks[block.key] = await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {
        ...block,
        publishedAt: block.status === "PUBLISHED" ? new Date() : null
      },
      create: {
        ...block,
        createdById: adminUser.id,
        publishedAt: block.status === "PUBLISHED" ? new Date() : null
      }
    });
  }

  const bannersData = [
    {
      key: "banner-spring-bridal-event",
      name: "Spring Bridal Event Banner",
      status: "PUBLISHED",
      contentBlockId: contentBlocks["homepage-promo-bridal-banner"].id,
      startsAt: new Date("2026-04-10T00:00:00.000Z"),
      endsAt: new Date("2026-04-28T23:59:59.000Z")
    },
    {
      key: "banner-new-arrivals-launch",
      name: "New Arrivals Launch Banner",
      status: "PUBLISHED",
      contentBlockId: contentBlocks["campaign-new-arrivals-story"].id,
      startsAt: new Date("2026-04-20T00:00:00.000Z"),
      endsAt: new Date("2026-05-07T23:59:59.000Z")
    },
    {
      key: "banner-holiday-gift-guide",
      name: "Holiday Gift Guide Banner",
      status: "DRAFT",
      contentBlockId: contentBlocks["homepage-newsletter-cta"].id,
      startsAt: new Date("2026-11-15T00:00:00.000Z"),
      endsAt: new Date("2026-12-24T23:59:59.000Z")
    }
  ];

  const banners = {};
  for (const banner of bannersData) {
    banners[banner.key] = await prisma.banner.upsert({
      where: { key: banner.key },
      update: banner,
      create: banner
    });
  }

  const collectionsData = [
    {
      slug: "celestial-gold",
      name: "Celestial Gold",
      description: "Luminous 18K silhouettes inspired by modern evening light.",
      heroImageUrl: "https://images.luxeflow.studio/collections/celestial-gold.jpg"
    },
    {
      slug: "midnight-sapphire",
      name: "Midnight Sapphire",
      description: "Deep blue sapphire icons for occasion styling and legacy gifting.",
      heroImageUrl: "https://images.luxeflow.studio/collections/midnight-sapphire.jpg"
    },
    {
      slug: "pearl-atelier",
      name: "Pearl Atelier",
      description: "Contemporary pearl forms with sculptural settings and clean proportions.",
      heroImageUrl: "https://images.luxeflow.studio/collections/pearl-atelier.jpg"
    },
    {
      slug: "bridal-icons",
      name: "Bridal Icons",
      description: "Engagement and wedding essentials with timeless craftsmanship.",
      heroImageUrl: "https://images.luxeflow.studio/collections/bridal-icons.jpg"
    }
  ];

  const collections = {};
  for (const collection of collectionsData) {
    collections[collection.slug] = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {
        ...collection,
        status: "PUBLISHED",
        publishedAt: new Date()
      },
      create: {
        ...collection,
        status: "PUBLISHED",
        publishedAt: new Date()
      }
    });
  }

  const productsData = [
    {
      slug: "luna-halo-ring",
      name: "Luna Halo Ring",
      description: "Round-cut diamond halo ring with refined cathedral profile.",
      story: "Designed to capture soft evening brilliance with a timeless silhouette.",
      priceInCents: 230000,
      compareAtCents: 255000,
      collectionSlug: "bridal-icons"
    },
    {
      slug: "etoile-diamond-studs",
      name: "Etoile Diamond Studs",
      description: "Classic diamond studs with elevated light performance.",
      story: "Our most versatile pair, crafted for daily wear and ceremonial styling.",
      priceInCents: 119000,
      compareAtCents: 132000,
      collectionSlug: "bridal-icons"
    },
    {
      slug: "noir-sapphire-pendant",
      name: "Noir Sapphire Pendant",
      description: "Oval sapphire pendant suspended on a delicate 18K chain.",
      story: "A signature sapphire piece balancing richness and restraint.",
      priceInCents: 178000,
      compareAtCents: 196000,
      collectionSlug: "midnight-sapphire"
    },
    {
      slug: "vesper-tennis-bracelet",
      name: "Vesper Tennis Bracelet",
      description: "Slim tennis bracelet with precision-set diamonds.",
      story: "An evening staple designed to layer elegantly with cuffs and bangles.",
      priceInCents: 335000,
      compareAtCents: 358000,
      collectionSlug: "midnight-sapphire"
    },
    {
      slug: "solstice-charm-necklace",
      name: "Solstice Charm Necklace",
      description: "Minimalist charm necklace in polished 18K gold.",
      story: "A lightweight statement for modern layering wardrobes.",
      priceInCents: 112000,
      compareAtCents: 125000,
      collectionSlug: "celestial-gold"
    },
    {
      slug: "aurelia-link-bracelet",
      name: "Aurelia Link Bracelet",
      description: "Hand-finished oval link bracelet with hidden clasp.",
      story: "Built with balanced proportions for confident day-to-night styling.",
      priceInCents: 146000,
      compareAtCents: 162000,
      collectionSlug: "celestial-gold"
    },
    {
      slug: "pearl-sculpt-drop-earrings",
      name: "Pearl Sculpt Drop Earrings",
      description: "Sculptural freshwater pearl drops in vermeil setting.",
      story: "An editorial reinterpretation of pearls for modern formalwear.",
      priceInCents: 98000,
      compareAtCents: 109000,
      collectionSlug: "pearl-atelier"
    },
    {
      slug: "atelier-pearl-collar",
      name: "Atelier Pearl Collar",
      description: "Layered pearl collar necklace with sculpted clasp details.",
      story: "A hero evening piece inspired by couture drape and fluid movement.",
      priceInCents: 264000,
      compareAtCents: 285000,
      collectionSlug: "pearl-atelier"
    }
  ];

  const products = {};
  for (const product of productsData) {
    const collectionId = collections[product.collectionSlug].id;
    const productFields = { ...product };
    delete productFields.collectionSlug;
    products[product.slug] = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productFields,
        status: "PUBLISHED",
        currency: "USD",
        collectionId,
        publishedAt: new Date()
      },
      create: {
        ...productFields,
        status: "PUBLISHED",
        currency: "USD",
        collectionId,
        publishedAt: new Date()
      }
    });
  }

  const emailTemplatesData = [
    {
      key: "promotional-sale-template",
      name: "Private Promotion Template",
      subject: "Private Jewelry Promotion: Up to 20% Off",
      preheader: "Limited-time pricing on signature bridal and gifting pieces.",
      html: "<html><body><h1>Private Promotion</h1><p>Save up to 20% on signature pieces.</p></body></html>"
    },
    {
      key: "featured-collection-template",
      name: "Featured Collection Template",
      subject: "Now Featuring: Celestial Gold Collection",
      preheader: "Discover luminous 18K essentials curated for modern collectors.",
      html: "<html><body><h1>Celestial Gold</h1><p>Explore our featured collection edit.</p></body></html>"
    },
    {
      key: "new-arrivals-template",
      name: "New Arrivals Template",
      subject: "New Arrivals: Contemporary Icons Have Landed",
      preheader: "Shop fresh arrivals in sapphires, pearls, and elevated gold forms.",
      html: "<html><body><h1>New Arrivals</h1><p>Meet this season's most-wanted pieces.</p></body></html>"
    }
  ];

  const emailTemplates = {};
  for (const template of emailTemplatesData) {
    emailTemplates[template.key] = await prisma.emailTemplate.upsert({
      where: { key: template.key },
      update: {
        ...template,
        status: "PUBLISHED",
        createdById: adminUser.id,
        publishedAt: new Date()
      },
      create: {
        ...template,
        status: "PUBLISHED",
        createdById: adminUser.id,
        publishedAt: new Date()
      }
    });
  }

  const campaignsData = [
    {
      slug: "spring-bridal-event",
      name: "Spring Bridal Event",
      objective: "Increase bridal collection conversion and consultation bookings.",
      status: "ACTIVE",
      startsAt: new Date("2026-04-10T00:00:00.000Z"),
      endsAt: new Date("2026-04-28T23:59:59.000Z"),
      targetPage: "/collections",
      landingPagePath: "/c/spring-bridal-event"
    },
    {
      slug: "new-arrivals-collection",
      name: "New Arrivals Collection Launch",
      objective: "Drive discovery and first-order purchases for new collection drops.",
      status: "SCHEDULED",
      startsAt: new Date("2026-04-20T00:00:00.000Z"),
      endsAt: new Date("2026-05-07T23:59:59.000Z"),
      targetPage: "/products",
      landingPagePath: "/c/new-arrivals-collection"
    },
    {
      slug: "holiday-gift-guide",
      name: "Holiday Gift Guide",
      objective: "Capture seasonal gifting demand with curated product bundles.",
      status: "DRAFT",
      startsAt: new Date("2026-11-15T00:00:00.000Z"),
      endsAt: new Date("2026-12-24T23:59:59.000Z"),
      targetPage: "/collections",
      landingPagePath: "/c/holiday-gift-guide"
    }
  ];

  const campaigns = {};
  for (const campaign of campaignsData) {
    campaigns[campaign.slug] = await prisma.campaign.upsert({
      where: { slug: campaign.slug },
      update: { ...campaign, ownerId: adminUser.id },
      create: { ...campaign, ownerId: adminUser.id }
    });
  }

  const campaignAssetsData = [
    {
      key: "asset-bridal-banner",
      campaignSlug: "spring-bridal-event",
      type: "BANNER",
      bannerId: banners["banner-spring-bridal-event"].id
    },
    {
      key: "asset-bridal-hero-content",
      campaignSlug: "spring-bridal-event",
      type: "CONTENT_BLOCK",
      contentBlockId: contentBlocks["homepage-hero-main"].id
    },
    {
      key: "asset-bridal-collection-icons",
      campaignSlug: "spring-bridal-event",
      type: "COLLECTION",
      collectionId: collections["bridal-icons"].id
    },
    {
      key: "asset-bridal-featured-product",
      campaignSlug: "spring-bridal-event",
      type: "PRODUCT",
      productId: products["luna-halo-ring"].id
    },
    {
      key: "asset-bridal-email-template",
      campaignSlug: "spring-bridal-event",
      type: "EMAIL_TEMPLATE",
      emailTemplateId: emailTemplates["promotional-sale-template"].id
    },
    {
      key: "asset-arrivals-banner",
      campaignSlug: "new-arrivals-collection",
      type: "BANNER",
      bannerId: banners["banner-new-arrivals-launch"].id
    },
    {
      key: "asset-arrivals-story-block",
      campaignSlug: "new-arrivals-collection",
      type: "CONTENT_BLOCK",
      contentBlockId: contentBlocks["campaign-new-arrivals-story"].id
    },
    {
      key: "asset-arrivals-email-template",
      campaignSlug: "new-arrivals-collection",
      type: "EMAIL_TEMPLATE",
      emailTemplateId: emailTemplates["new-arrivals-template"].id
    }
  ];

  for (const asset of campaignAssetsData) {
    const { campaignSlug, ...rest } = asset;
    await prisma.campaignAsset.upsert({
      where: { key: rest.key },
      update: { ...rest, campaignId: campaigns[campaignSlug].id },
      create: { ...rest, campaignId: campaigns[campaignSlug].id }
    });
  }

  const emailCampaignsData = [
    {
      key: "bridal-private-offer-blast",
      name: "Bridal Private Offer Blast",
      status: "SCHEDULED",
      subjectOverride: "Private Bridal Event: Up to 20% Off Signature Pieces",
      sendAt: new Date("2026-04-18T10:00:00.000Z"),
      audienceSegment: "VIP Bridal Leads",
      campaignSlug: "spring-bridal-event",
      templateKey: "promotional-sale-template"
    },
    {
      key: "arrivals-early-access-drop",
      name: "New Arrivals Early Access",
      status: "DRAFT",
      subjectOverride: "Early Access: New Icons in Celestial Gold",
      sendAt: new Date("2026-04-20T09:00:00.000Z"),
      audienceSegment: "Newsletter Early Access",
      campaignSlug: "new-arrivals-collection",
      templateKey: "new-arrivals-template"
    },
    {
      key: "collection-spotlight-weekly",
      name: "Weekly Collection Spotlight",
      status: "SENT",
      subjectOverride: "Now Featuring: Midnight Sapphire Capsule",
      sendAt: new Date("2026-04-12T09:00:00.000Z"),
      audienceSegment: "High Intent Repeat Customers",
      campaignSlug: "spring-bridal-event",
      templateKey: "featured-collection-template"
    }
  ];

  const emailCampaigns = {};
  for (const emailCampaign of emailCampaignsData) {
    const { campaignSlug, templateKey, ...rest } = emailCampaign;
    emailCampaigns[rest.key] = await prisma.emailCampaign.upsert({
      where: { key: rest.key },
      update: {
        ...rest,
        campaignId: campaigns[campaignSlug].id,
        templateId: emailTemplates[templateKey].id
      },
      create: {
        ...rest,
        campaignId: campaigns[campaignSlug].id,
        templateId: emailTemplates[templateKey].id
      }
    });
  }

  const abTestsData = [
    {
      key: "home-hero-narrative-01",
      name: "Homepage Hero Narrative",
      type: "HOMEPAGE_HERO",
      status: "RUNNING",
      targetPage: "/",
      campaignSlug: "spring-bridal-event",
      variants: [
        {
          key: "a",
          label: "Variant A",
          content: "Jewelry crafted to be worn now and cherished for generations.",
          allocation: 50,
          impressions: 26420,
          clicks: 1455,
          conversions: 844,
          conversionRate: 3.19,
          clickThroughRate: 5.51,
          isWinner: false
        },
        {
          key: "b",
          label: "Variant B",
          content: "Fine jewelry designed for modern icons and milestone moments.",
          allocation: 50,
          impressions: 25980,
          clicks: 1648,
          conversions: 972,
          conversionRate: 3.74,
          clickThroughRate: 6.34,
          isWinner: true
        }
      ]
    },
    {
      key: "campaign-banner-offer-01",
      name: "Campaign Banner Offer",
      type: "CAMPAIGN_BANNER",
      status: "COMPLETED",
      targetPage: "/c/spring-bridal-event",
      campaignSlug: "spring-bridal-event",
      variants: [
        {
          key: "a",
          label: "Variant A",
          content: "Complimentary luxury ring case above $1,500.",
          allocation: 50,
          impressions: 18120,
          clicks: 905,
          conversions: 446,
          conversionRate: 2.46,
          clickThroughRate: 4.99,
          isWinner: false
        },
        {
          key: "b",
          label: "Variant B",
          content: "Private bridal offer: gift wrap and consultation included.",
          allocation: 50,
          impressions: 17990,
          clicks: 1032,
          conversions: 518,
          conversionRate: 2.88,
          clickThroughRate: 5.74,
          isWinner: true
        }
      ]
    },
    {
      key: "cta-copy-home-01",
      name: "Homepage CTA Copy",
      type: "CTA_COPY",
      status: "DRAFT",
      targetPage: "/",
      campaignSlug: "new-arrivals-collection",
      variants: [
        {
          key: "a",
          label: "Variant A",
          content: "Shop Bestsellers",
          allocation: 50,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          conversionRate: 0,
          clickThroughRate: 0,
          isWinner: false
        },
        {
          key: "b",
          label: "Variant B",
          content: "Discover Signature Pieces",
          allocation: 50,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          conversionRate: 0,
          clickThroughRate: 0,
          isWinner: false
        }
      ]
    }
  ];

  const abTests = {};
  for (const test of abTestsData) {
    const { campaignSlug, variants, ...testFields } = test;
    const abTest = await prisma.aBTest.upsert({
      where: { key: testFields.key },
      update: {
        ...testFields,
        campaignId: campaigns[campaignSlug].id,
        completedAt: testFields.status === "COMPLETED" ? new Date("2026-04-15T17:00:00.000Z") : null
      },
      create: {
        ...testFields,
        campaignId: campaigns[campaignSlug].id,
        completedAt: testFields.status === "COMPLETED" ? new Date("2026-04-15T17:00:00.000Z") : null
      }
    });

    abTests[testFields.key] = abTest;

    for (const variant of variants) {
      await prisma.aBVariant.upsert({
        where: { testId_key: { testId: abTest.id, key: variant.key } },
        update: variant,
        create: { ...variant, testId: abTest.id }
      });
    }
  }

  await prisma.analyticsEvent.deleteMany({
    where: { sessionId: { startsWith: "seed-" } }
  });

  await prisma.analyticsEvent.createMany({
    data: [
      {
        eventName: "campaign_view",
        source: "CAMPAIGN",
        sessionId: "seed-campaign-001",
        campaignId: campaigns["spring-bridal-event"].id,
        payload: { page: "/c/spring-bridal-event", source: "meta_ads" }
      },
      {
        eventName: "campaign_view",
        source: "CAMPAIGN",
        sessionId: "seed-campaign-002",
        campaignId: campaigns["new-arrivals-collection"].id,
        payload: { page: "/c/new-arrivals-collection", source: "email" }
      },
      {
        eventName: "email_open",
        source: "EMAIL",
        sessionId: "seed-email-001",
        campaignId: campaigns["spring-bridal-event"].id,
        emailCampaignId: emailCampaigns["bridal-private-offer-blast"].id,
        payload: { template: "promotional-sale-template", device: "mobile" }
      },
      {
        eventName: "email_click",
        source: "EMAIL",
        sessionId: "seed-email-001",
        campaignId: campaigns["spring-bridal-event"].id,
        emailCampaignId: emailCampaigns["bridal-private-offer-blast"].id,
        payload: { cta: "Shop Private Sale", device: "mobile" }
      },
      {
        eventName: "email_open",
        source: "EMAIL",
        sessionId: "seed-email-002",
        campaignId: campaigns["new-arrivals-collection"].id,
        emailCampaignId: emailCampaigns["arrivals-early-access-drop"].id,
        payload: { template: "new-arrivals-template", device: "desktop" }
      },
      {
        eventName: "product_view",
        source: "STOREFRONT",
        sessionId: "seed-storefront-001",
        campaignId: campaigns["spring-bridal-event"].id,
        payload: { product: "luna-halo-ring", collection: "bridal-icons" }
      },
      {
        eventName: "add_to_cart",
        source: "STOREFRONT",
        sessionId: "seed-storefront-001",
        campaignId: campaigns["spring-bridal-event"].id,
        payload: { product: "luna-halo-ring", value: 230000 }
      },
      {
        eventName: "checkout_complete",
        source: "STOREFRONT",
        sessionId: "seed-storefront-001",
        campaignId: campaigns["spring-bridal-event"].id,
        payload: { orderValue: 230000, currency: "USD" }
      },
      {
        eventName: "ab_variant_impression",
        source: "STOREFRONT",
        sessionId: "seed-ab-001",
        campaignId: campaigns["spring-bridal-event"].id,
        abTestId: abTests["home-hero-narrative-01"].id,
        payload: { variant: "b", page: "/" }
      },
      {
        eventName: "ab_variant_click",
        source: "STOREFRONT",
        sessionId: "seed-ab-001",
        campaignId: campaigns["spring-bridal-event"].id,
        abTestId: abTests["home-hero-narrative-01"].id,
        payload: { variant: "b", cta: "Shop Signature Pieces" }
      },
      {
        eventName: "ab_variant_impression",
        source: "STOREFRONT",
        sessionId: "seed-ab-002",
        campaignId: campaigns["spring-bridal-event"].id,
        abTestId: abTests["campaign-banner-offer-01"].id,
        payload: { variant: "a", page: "/c/spring-bridal-event" }
      },
      {
        eventName: "collection_view",
        source: "STOREFRONT",
        sessionId: "seed-storefront-002",
        campaignId: campaigns["new-arrivals-collection"].id,
        payload: { collection: "celestial-gold" }
      }
    ]
  });

  // —— Jewelry B2B inventory (Jewelry Admin) ——
  await prisma.tradeOrderLine.deleteMany({});
  await prisma.tradeOrder.deleteMany({});
  await prisma.tradeQuoteLine.deleteMany({});
  await prisma.tradeQuote.deleteMany({});
  await prisma.jewelryInventoryItem.deleteMany({});
  await prisma.b2BCustomer.deleteMany({});
  await prisma.jewelrySupplier.deleteMany({});

  const supValenza = await prisma.jewelrySupplier.create({
    data: {
      name: "Valenza Atelier Metals",
      email: "trade@valenza-atelier.example",
      phone: "+39 0131 555 0100",
      categories: ["Rings", "Bridal"],
      materials: ["18k gold", "platinum"],
      leadTimeDays: 21,
      status: "ACTIVE",
      notes: "Primary bench partner for EU bridal mounts."
    }
  });

  const supAntwerp = await prisma.jewelrySupplier.create({
    data: {
      name: "Antwerp Gem House",
      email: "b2b@antwerp-gem.example",
      phone: "+32 3 555 0200",
      categories: ["Loose stones", "Bridal"],
      materials: ["diamond", "sapphire"],
      leadTimeDays: 14,
      status: "ACTIVE",
      notes: "Certified melee; weekly air shipments."
    }
  });

  const supTokyo = await prisma.jewelrySupplier.create({
    data: {
      name: "Tokyo Pearl Collective",
      email: "export@tokyo-pearl.example",
      phone: "+81 3 5550 1122",
      categories: ["Necklaces", "Earrings"],
      materials: ["akoya pearl", "18k gold"],
      leadTimeDays: 28,
      status: "ACTIVE",
      notes: "Akoya and South Sea strands; MOQ 6 units."
    }
  });

  await prisma.jewelrySupplier.create({
    data: {
      name: "Rhine Findings (archived)",
      email: null,
      phone: "+49 221 555 8899",
      categories: ["Findings"],
      materials: ["sterling silver"],
      leadTimeDays: 10,
      status: "INACTIVE",
      notes: "Legacy vendor — do not route new POs."
    }
  });

  const invRing = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-RG-001",
      name: "Luna Halo Ring — trade blank",
      category: "Rings",
      material: "18k yellow gold",
      gemstone: "Diamond",
      stockQuantity: 42,
      reservedQuantity: 7,
      reorderThreshold: 8,
      lowStockStatus: "OK",
      supplierId: supValenza.id,
      notes: "Halo basket fits 6.5mm center."
    }
  });

  const invBand = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-BD-014",
      name: "Aurelia band — 4mm",
      category: "Rings",
      material: "Platinum",
      gemstone: null,
      stockQuantity: 6,
      reservedQuantity: 2,
      reorderThreshold: 5,
      lowStockStatus: "OK",
      supplierId: supValenza.id
    }
  });

  const invPendant = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-PD-022",
      name: "Solstice pendant — sapphire",
      category: "Necklaces",
      material: "18k white gold",
      gemstone: "Sapphire",
      stockQuantity: 0,
      reservedQuantity: 0,
      reorderThreshold: 4,
      lowStockStatus: "OUT",
      supplierId: supAntwerp.id,
      notes: "Reorder expected week of May 5."
    }
  });

  const invBracelet = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-BR-031",
      name: "Celestial tennis — 3ctw",
      category: "Bracelets",
      material: "18k white gold",
      gemstone: "Diamond",
      stockQuantity: 11,
      reservedQuantity: 0,
      reorderThreshold: 3,
      lowStockStatus: "OK",
      supplierId: supAntwerp.id
    }
  });

  const invEarring = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-ER-008",
      name: "Nocturne drop — pearl",
      category: "Earrings",
      material: "18k rose gold",
      gemstone: "Pearl",
      stockQuantity: 4,
      reservedQuantity: 0,
      reorderThreshold: 6,
      lowStockStatus: "LOW",
      supplierId: supTokyo.id
    }
  });

  const invChain = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-NK-017",
      name: "Serpent chain — 20in",
      category: "Necklaces",
      material: "18k yellow gold",
      gemstone: null,
      stockQuantity: 88,
      reservedQuantity: 12,
      reorderThreshold: 20,
      lowStockStatus: "OK",
      supplierId: supValenza.id
    }
  });

  const invSignet = await prisma.jewelryInventoryItem.create({
    data: {
      sku: "LF-TRD-RG-019",
      name: "Vesper signet — blank",
      category: "Rings",
      material: "Sterling silver",
      gemstone: null,
      stockQuantity: 2,
      reservedQuantity: 0,
      reorderThreshold: 8,
      lowStockStatus: "LOW",
      supplierId: null
    }
  });

  const b2bHarper = await prisma.b2BCustomer.create({
    data: {
      businessName: "Harper Fine Jewelers",
      contactName: "Jordan Lee",
      email: "trade@harperfine.example",
      phone: "+1 212 555 0140",
      accountStatus: "ACTIVE",
      notes: "Flagship on Madison; prefers consolidated weekly shipments."
    }
  });

  const b2bNorth = await prisma.b2BCustomer.create({
    data: {
      businessName: "North Coast Gallery",
      contactName: "Sam Rivera",
      email: "orders@northcoastgallery.example",
      phone: "+1 415 555 0199",
      accountStatus: "ON_HOLD",
      notes: "Credit review until Q3."
    }
  });

  const b2bVolt = await prisma.b2BCustomer.create({
    data: {
      businessName: "Volt & Stone Collective",
      contactName: "Alex Kim",
      email: "b2b@voltstone.example",
      phone: "+1 646 555 2200",
      accountStatus: "ACTIVE"
    }
  });

  const b2bMaison = await prisma.b2BCustomer.create({
    data: {
      businessName: "Maison Lioré Montréal",
      contactName: "Camille Dubois",
      email: "appro@maisonliore.example",
      phone: "+1 514 555 3301",
      accountStatus: "ACTIVE"
    }
  });

  const b2bArchive = await prisma.b2BCustomer.create({
    data: {
      businessName: "Silverline Estate Buyers",
      contactName: "Pat O’Neill",
      email: "trade@silverline-estate.example",
      phone: "+1 617 555 4412",
      accountStatus: "INACTIVE"
    }
  });

  const validSpring = new Date("2026-06-30T23:59:59.000Z");

  const quote1 = await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0001",
      customerId: b2bHarper.id,
      status: "ACCEPTED",
      validUntil: validSpring,
      subtotalCents: 450000,
      totalCents: 450000,
      notes: "Net 30; includes branded pouches.",
      lines: {
        create: [
          {
            inventoryItemId: invRing.id,
            quantity: 3,
            unitPriceCents: 150000,
            lineTotalCents: 450000
          }
        ]
      }
    }
  });

  await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0002",
      customerId: b2bNorth.id,
      status: "DRAFT",
      subtotalCents: 310000,
      totalCents: 310000,
      lines: {
        create: [
          {
            inventoryItemId: invBand.id,
            quantity: 2,
            unitPriceCents: 140000,
            lineTotalCents: 280000
          },
          {
            inventoryItemId: invPendant.id,
            quantity: 1,
            unitPriceCents: 30000,
            lineTotalCents: 30000
          }
        ]
      }
    }
  });

  await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0003",
      customerId: b2bVolt.id,
      status: "SENT",
      validUntil: validSpring,
      subtotalCents: 920000,
      totalCents: 920000,
      lines: {
        create: [
          {
            inventoryItemId: invBracelet.id,
            quantity: 2,
            unitPriceCents: 380000,
            lineTotalCents: 760000
          },
          {
            inventoryItemId: invChain.id,
            quantity: 4,
            unitPriceCents: 40000,
            lineTotalCents: 160000
          }
        ]
      }
    }
  });

  await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0004",
      customerId: b2bMaison.id,
      status: "DECLINED",
      subtotalCents: 198000,
      totalCents: 198000,
      notes: "Customer chose local fabricator.",
      lines: {
        create: [
          {
            inventoryItemId: invEarring.id,
            quantity: 6,
            unitPriceCents: 33000,
            lineTotalCents: 198000
          }
        ]
      }
    }
  });

  await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0005",
      customerId: b2bHarper.id,
      status: "EXPIRED",
      validUntil: new Date("2026-01-15T12:00:00.000Z"),
      subtotalCents: 560000,
      totalCents: 560000,
      lines: {
        create: [
          {
            inventoryItemId: invSignet.id,
            quantity: 8,
            unitPriceCents: 70000,
            lineTotalCents: 560000
          }
        ]
      }
    }
  });

  await prisma.tradeQuote.create({
    data: {
      quoteNumber: "Q-2026-0006",
      customerId: b2bVolt.id,
      status: "SENT",
      subtotalCents: 275000,
      totalCents: 275000,
      lines: {
        create: [
          {
            inventoryItemId: invRing.id,
            quantity: 1,
            unitPriceCents: 155000,
            lineTotalCents: 155000
          },
          {
            inventoryItemId: invBand.id,
            quantity: 1,
            unitPriceCents: 120000,
            lineTotalCents: 120000
          }
        ]
      }
    }
  });

  await prisma.tradeOrder.create({
    data: {
      orderNumber: "O-2026-0001",
      customerId: b2bHarper.id,
      quoteId: quote1.id,
      status: "CONFIRMED",
      fulfillmentStatus: "UNFULFILLED",
      subtotalCents: 450000,
      totalCents: 450000,
      notes: "Ship when QA batch LF-QA-118 clears.",
      lines: {
        create: [
          {
            inventoryItemId: invRing.id,
            quantity: 3,
            unitPriceCents: 150000,
            lineTotalCents: 450000,
            quantityFulfilled: 0
          }
        ]
      }
    }
  });

  await prisma.tradeOrder.create({
    data: {
      orderNumber: "O-2026-0002",
      customerId: b2bVolt.id,
      quoteId: null,
      status: "IN_PRODUCTION",
      fulfillmentStatus: "PARTIAL",
      subtotalCents: 760000,
      totalCents: 760000,
      lines: {
        create: [
          {
            inventoryItemId: invBracelet.id,
            quantity: 2,
            unitPriceCents: 380000,
            lineTotalCents: 760000,
            quantityFulfilled: 1
          }
        ]
      }
    }
  });

  await prisma.tradeOrder.create({
    data: {
      orderNumber: "O-2026-0003",
      customerId: b2bMaison.id,
      quoteId: null,
      status: "SHIPPED",
      fulfillmentStatus: "FULFILLED",
      subtotalCents: 160000,
      totalCents: 160000,
      lines: {
        create: [
          {
            inventoryItemId: invChain.id,
            quantity: 4,
            unitPriceCents: 40000,
            lineTotalCents: 160000,
            quantityFulfilled: 4
          }
        ]
      }
    }
  });

  await prisma.tradeOrder.create({
    data: {
      orderNumber: "O-2026-0004",
      customerId: b2bNorth.id,
      quoteId: null,
      status: "DRAFT",
      fulfillmentStatus: "UNFULFILLED",
      subtotalCents: 120000,
      totalCents: 120000,
      lines: {
        create: [
          {
            inventoryItemId: invBand.id,
            quantity: 1,
            unitPriceCents: 120000,
            lineTotalCents: 120000,
            quantityFulfilled: 0
          }
        ]
      }
    }
  });

  await prisma.tradeOrder.create({
    data: {
      orderNumber: "O-2026-0005",
      customerId: b2bHarper.id,
      quoteId: null,
      status: "CANCELLED",
      fulfillmentStatus: "UNFULFILLED",
      subtotalCents: 330000,
      totalCents: 330000,
      notes: "Client paused opening budget.",
      lines: {
        create: [
          {
            inventoryItemId: invEarring.id,
            quantity: 10,
            unitPriceCents: 33000,
            lineTotalCents: 330000,
            quantityFulfilled: 0
          }
        ]
      }
    }
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
