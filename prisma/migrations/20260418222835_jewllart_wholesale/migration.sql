-- CreateEnum
CREATE TYPE "WholesaleCatalogStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOW_STOCK', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "WholesalePricingTier" AS ENUM ('RETAIL_REF', 'TIER_A', 'TIER_B', 'TIER_C', 'VIP');

-- CreateEnum
CREATE TYPE "WholesaleOrderStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WholesaleStockMovementType" AS ENUM ('ADJUSTMENT', 'INBOUND', 'OUTBOUND', 'RESERVED', 'RELEASED');

-- CreateTable
CREATE TABLE "WholesaleSupplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleCustomer" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "billingLine1" TEXT,
    "billingLine2" TEXT,
    "billingCity" TEXT,
    "billingRegion" TEXT,
    "billingPostal" TEXT,
    "billingCountry" TEXT,
    "shippingLine1" TEXT,
    "shippingLine2" TEXT,
    "shippingCity" TEXT,
    "shippingRegion" TEXT,
    "shippingPostal" TEXT,
    "shippingCountry" TEXT,
    "taxId" TEXT,
    "pricingTier" "WholesalePricingTier" NOT NULL DEFAULT 'TIER_A',
    "creditLimitCents" INTEGER NOT NULL DEFAULT 0,
    "paymentTerms" TEXT NOT NULL DEFAULT 'Net 30',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleProduct" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "materialType" TEXT NOT NULL,
    "weightGrams" DECIMAL(12,4),
    "purity" TEXT,
    "sizeDimensions" TEXT,
    "stockOnHand" INTEGER NOT NULL DEFAULT 0,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "unitPriceCents" INTEGER NOT NULL,
    "wholesaleTiers" JSONB,
    "supplierId" TEXT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "catalogStatus" "WholesaleCatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "popularityScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WholesaleProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleStockMovement" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "WholesaleStockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "supplierId" TEXT,
    "actorUserId" TEXT,
    "actorLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WholesaleStockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "WholesaleOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "taxCents" INTEGER NOT NULL DEFAULT 0,
    "shippingCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "customerNotes" TEXT,
    "internalNotes" TEXT,
    "pricingTierApplied" "WholesalePricingTier",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleOrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "lineDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "taxCents" INTEGER NOT NULL DEFAULT 0,
    "lineTotalCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WholesaleOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleActivityLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT,
    "metadata" JSONB,
    "actorUserId" TEXT,
    "actorLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WholesaleActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WholesaleSupplier_code_key" ON "WholesaleSupplier"("code");

-- CreateIndex
CREATE INDEX "WholesaleSupplier_name_idx" ON "WholesaleSupplier"("name");

-- CreateIndex
CREATE INDEX "WholesaleCustomer_businessName_idx" ON "WholesaleCustomer"("businessName");

-- CreateIndex
CREATE INDEX "WholesaleCustomer_email_idx" ON "WholesaleCustomer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WholesaleProduct_sku_key" ON "WholesaleProduct"("sku");

-- CreateIndex
CREATE INDEX "WholesaleProduct_category_idx" ON "WholesaleProduct"("category");

-- CreateIndex
CREATE INDEX "WholesaleProduct_supplierId_idx" ON "WholesaleProduct"("supplierId");

-- CreateIndex
CREATE INDEX "WholesaleProduct_catalogStatus_idx" ON "WholesaleProduct"("catalogStatus");

-- CreateIndex
CREATE INDEX "WholesaleProduct_name_idx" ON "WholesaleProduct"("name");

-- CreateIndex
CREATE INDEX "WholesaleProductImage_productId_sortOrder_idx" ON "WholesaleProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "WholesaleProductVariant_productId_idx" ON "WholesaleProductVariant"("productId");

-- CreateIndex
CREATE INDEX "WholesaleStockMovement_productId_createdAt_idx" ON "WholesaleStockMovement"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "WholesaleStockMovement_type_createdAt_idx" ON "WholesaleStockMovement"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WholesaleOrder_orderNumber_key" ON "WholesaleOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "WholesaleOrder_customerId_createdAt_idx" ON "WholesaleOrder"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "WholesaleOrder_status_createdAt_idx" ON "WholesaleOrder"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WholesaleOrderLine_orderId_idx" ON "WholesaleOrderLine"("orderId");

-- CreateIndex
CREATE INDEX "WholesaleOrderLine_productId_idx" ON "WholesaleOrderLine"("productId");

-- CreateIndex
CREATE INDEX "WholesaleActivityLog_entityType_entityId_idx" ON "WholesaleActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "WholesaleActivityLog_createdAt_idx" ON "WholesaleActivityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "WholesaleProduct" ADD CONSTRAINT "WholesaleProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "WholesaleSupplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleProductImage" ADD CONSTRAINT "WholesaleProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "WholesaleProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleProductVariant" ADD CONSTRAINT "WholesaleProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "WholesaleProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleStockMovement" ADD CONSTRAINT "WholesaleStockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "WholesaleProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleStockMovement" ADD CONSTRAINT "WholesaleStockMovement_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrder" ADD CONSTRAINT "WholesaleOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "WholesaleCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrderLine" ADD CONSTRAINT "WholesaleOrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "WholesaleOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrderLine" ADD CONSTRAINT "WholesaleOrderLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "WholesaleProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrderLine" ADD CONSTRAINT "WholesaleOrderLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "WholesaleProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleActivityLog" ADD CONSTRAINT "WholesaleActivityLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
