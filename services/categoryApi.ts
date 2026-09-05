// services/categoryApi.ts
import { ICategory } from "../Types/index.types";
import { baseApi } from "./baseApi";

const dummyCategories = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting",
];

const formatCategoryName = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidate = record.name ?? record.title ?? record.slug ?? "";
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return "";
};

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<ICategory[], void>({
            query: () => "/products/categories",
            transformResponse: (response: any) => {
                const categories = Array.isArray(response) ? response : response?.categories ?? [];
                return categories
                    .map((item: any, index: number) => {
                        const name = formatCategoryName(item);
                        return {
                            id: index + 1,
                            name: name || dummyCategories[index] || `Category ${index + 1}`,
                        };
                    })
                    .filter((item) => item.name && item.name !== "[object Object]");
            },
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;

export { dummyCategories };