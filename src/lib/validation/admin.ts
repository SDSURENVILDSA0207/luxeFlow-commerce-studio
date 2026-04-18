import {
  ABTestStatus,
  ABTestType,
  CampaignStatus,
  ContentBlockType,
  EmailCampaignStatus,
  PublishStatus
} from "@prisma/client";
import { z } from "zod";

const optionalDate = z.string().datetime().optional().nullable();

export const contentBlockCreateSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  type: z.nativeEnum(ContentBlockType),
  status: z.nativeEnum(PublishStatus).optional(),
  pagePath: z.string().min(1),
  headline: z.string().min(2),
  body: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdById: z.string().min(1),
  publishedAt: optionalDate
});

export const contentBlockUpdateSchema = contentBlockCreateSchema.partial().omit({ createdById: true });

export const bannerCreateSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  status: z.nativeEnum(PublishStatus).optional(),
  startsAt: optionalDate,
  endsAt: optionalDate,
  contentBlockId: z.string().optional().nullable()
});

export const bannerUpdateSchema = bannerCreateSchema.partial();

export const collectionCreateSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(PublishStatus).optional(),
  heroImageUrl: z.string().url().optional().nullable(),
  publishedAt: optionalDate
});

export const collectionUpdateSchema = collectionCreateSchema.partial();

export const campaignCreateSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  objective: z.string().optional().nullable(),
  status: z.nativeEnum(CampaignStatus).optional(),
  startsAt: optionalDate,
  endsAt: optionalDate,
  targetPage: z.string().optional().nullable(),
  landingPagePath: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable()
});

export const campaignUpdateSchema = campaignCreateSchema.partial();

export const emailTemplateCreateSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  subject: z.string().min(2),
  preheader: z.string().optional().nullable(),
  status: z.nativeEnum(PublishStatus).optional(),
  html: z.string().min(10),
  createdById: z.string().min(1),
  publishedAt: optionalDate
});

export const emailTemplateUpdateSchema = emailTemplateCreateSchema.partial().omit({ createdById: true });

const abVariantSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  content: z.string().min(1),
  allocation: z.number().int().min(0).max(100).optional(),
  impressions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  conversions: z.number().int().min(0).optional(),
  conversionRate: z.number().min(0).optional(),
  clickThroughRate: z.number().min(0).optional(),
  isWinner: z.boolean().optional()
});

export const abTestCreateSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  type: z.nativeEnum(ABTestType),
  status: z.nativeEnum(ABTestStatus).optional(),
  targetPage: z.string().min(1),
  campaignId: z.string().optional().nullable(),
  completedAt: optionalDate,
  variants: z.array(abVariantSchema).min(2).max(2)
});

export const abTestUpdateSchema = z.object({
  key: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  type: z.nativeEnum(ABTestType).optional(),
  status: z.nativeEnum(ABTestStatus).optional(),
  targetPage: z.string().min(1).optional(),
  campaignId: z.string().optional().nullable(),
  completedAt: optionalDate,
  variants: z.array(abVariantSchema).min(2).max(2).optional()
});

export const emailCampaignStatusSchema = z.nativeEnum(EmailCampaignStatus);

export const aiCopyRequestSchema = z.object({
  campaignTheme: z.string().min(2),
  audience: z.string().min(2),
  promotionType: z.string().min(2),
  tone: z.string().min(2).optional().default("luxury-modern")
});
