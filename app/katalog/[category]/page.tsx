import type { Metadata } from "next";
import CategoryCatalog from "../../../components/CategoryCatalog";
import { categories } from "../../../lib/site-config";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const categoryTitle = (slug: string) => categories.find((category) => category.href.endsWith(`/${slug}`))?.label ?? "Katalog";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const title = categoryTitle(category);
  return {
    title: `${title} | Islomx7`,
    description: `${title} bo'limidagi mahsulotlarni ko'ring, saralang va Islomx7 orqali buyurtma bering.`,
    alternates: { canonical: `/katalog/${category}` },
    openGraph: { title: `${title} | Islomx7`, description: `${title} bo'limidagi mahsulotlar katalogi.` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return <CategoryCatalog slug={category} />;
}
