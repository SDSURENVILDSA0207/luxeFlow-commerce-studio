-- Remove Jewllart / B2B wholesale schema (tables + enums)

DROP TABLE IF EXISTS "WholesaleOrderLine" CASCADE;
DROP TABLE IF EXISTS "WholesaleStockMovement" CASCADE;
DROP TABLE IF EXISTS "WholesaleActivityLog" CASCADE;
DROP TABLE IF EXISTS "WholesaleOrder" CASCADE;
DROP TABLE IF EXISTS "WholesaleProductImage" CASCADE;
DROP TABLE IF EXISTS "WholesaleProductVariant" CASCADE;
DROP TABLE IF EXISTS "WholesaleProduct" CASCADE;
DROP TABLE IF EXISTS "WholesaleCustomer" CASCADE;
DROP TABLE IF EXISTS "WholesaleSupplier" CASCADE;

DROP TYPE IF EXISTS "WholesaleStockMovementType";
DROP TYPE IF EXISTS "WholesaleOrderStatus";
DROP TYPE IF EXISTS "WholesalePricingTier";
DROP TYPE IF EXISTS "WholesaleCatalogStatus";
