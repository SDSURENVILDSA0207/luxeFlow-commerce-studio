-- CreateEnum
CREATE TYPE "InventoryLowStockStatus" AS ENUM ('OK', 'LOW', 'OUT');

-- CreateEnum
CREATE TYPE "B2BAccountStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TradeQuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TradeOrderStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TradeFulfillmentStatus" AS ENUM ('UNFULFILLED', 'PARTIAL', 'FULFILLED');

-- CreateEnum
CREATE TYPE "JewelrySupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "JewelrySupplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leadTimeDays" INTEGER,
    "status" "JewelrySupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JewelrySupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JewelryInventoryItem" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "gemstone" TEXT,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "reorderThreshold" INTEGER NOT NULL DEFAULT 5,
    "lowStockStatus" "InventoryLowStockStatus" NOT NULL DEFAULT 'OK',
    "supplierId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JewelryInventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "B2BCustomer" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "accountStatus" "B2BAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "B2BCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeQuote" (
    "id" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "TradeQuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeQuoteLine" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,

    CONSTRAINT "TradeQuoteLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "quoteId" TEXT,
    "status" "TradeOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "fulfillmentStatus" "TradeFulfillmentStatus" NOT NULL DEFAULT 'UNFULFILLED',
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeOrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,
    "quantityFulfilled" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TradeOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JewelrySupplier_name_idx" ON "JewelrySupplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JewelryInventoryItem_sku_key" ON "JewelryInventoryItem"("sku");

-- CreateIndex
CREATE INDEX "JewelryInventoryItem_supplierId_idx" ON "JewelryInventoryItem"("supplierId");

-- CreateIndex
CREATE INDEX "JewelryInventoryItem_category_idx" ON "JewelryInventoryItem"("category");

-- CreateIndex
CREATE INDEX "JewelryInventoryItem_lowStockStatus_idx" ON "JewelryInventoryItem"("lowStockStatus");

-- CreateIndex
CREATE UNIQUE INDEX "B2BCustomer_email_key" ON "B2BCustomer"("email");

-- CreateIndex
CREATE INDEX "B2BCustomer_businessName_idx" ON "B2BCustomer"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "TradeQuote_quoteNumber_key" ON "TradeQuote"("quoteNumber");

-- CreateIndex
CREATE INDEX "TradeQuote_customerId_createdAt_idx" ON "TradeQuote"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "TradeQuote_status_idx" ON "TradeQuote"("status");

-- CreateIndex
CREATE INDEX "TradeQuoteLine_quoteId_idx" ON "TradeQuoteLine"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "TradeOrder_orderNumber_key" ON "TradeOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "TradeOrder_customerId_createdAt_idx" ON "TradeOrder"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "TradeOrder_status_idx" ON "TradeOrder"("status");

-- CreateIndex
CREATE INDEX "TradeOrder_quoteId_idx" ON "TradeOrder"("quoteId");

-- CreateIndex
CREATE INDEX "TradeOrderLine_orderId_idx" ON "TradeOrderLine"("orderId");

-- AddForeignKey
ALTER TABLE "JewelryInventoryItem" ADD CONSTRAINT "JewelryInventoryItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "JewelrySupplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeQuote" ADD CONSTRAINT "TradeQuote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "B2BCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeQuoteLine" ADD CONSTRAINT "TradeQuoteLine_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "TradeQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeQuoteLine" ADD CONSTRAINT "TradeQuoteLine_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "JewelryInventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeOrder" ADD CONSTRAINT "TradeOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "B2BCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeOrder" ADD CONSTRAINT "TradeOrder_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "TradeQuote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeOrderLine" ADD CONSTRAINT "TradeOrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TradeOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeOrderLine" ADD CONSTRAINT "TradeOrderLine_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "JewelryInventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
