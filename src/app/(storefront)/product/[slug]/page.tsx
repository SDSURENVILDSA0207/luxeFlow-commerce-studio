import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/storefront/product-detail-view";
import { getCatalogProductBySlug } from "@/lib/storefront/catalog-lookup";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailView key={product.slug} product={product} />;
}
