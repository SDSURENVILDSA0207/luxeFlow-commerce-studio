import { ProductDetailView } from "@/components/storefront/product-detail-view";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return <ProductDetailView slug={slug} />;
}
