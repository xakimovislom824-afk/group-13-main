"use client";
import { useGetProductsQuery } from "../services/productApi";
import ProductCard from "./ProductCard";
const Products = () => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const products = data || [];
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error...</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
