import { useEffect, useState } from "react";
import { useSearchProductsQuery } from "../../services/productApi";

export interface SearchProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string | number;
}

export function useProductSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { data } = useSearchProductsQuery(
    { q: debouncedQuery, limit: 8, skip: 0 },
    { skip: debouncedQuery.length < 2 },
  );

  return (data?.products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image,
    category: product.category,
  }));
}
