import { baseApi } from "./baseApi";

export interface CatalogItem {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface CatalogResponse {
  categories: CatalogItem[];
  count: number;
}

const normalizeCatalog = (response: any): CatalogResponse => {
  const raw = Array.isArray(response) ? response : response?.categories ?? response?.results ?? [];

  const categories = raw.map((item: any, index: number) => {
    const name = typeof item === "string" ? item : item?.name ?? item?.title ?? `Category ${index + 1}`;
    const slug = typeof item === "string" ? item : item?.slug ?? String(name).toLowerCase().replace(/\s+/g, "-");

    return {
      id: Number(item?.id ?? index + 1),
      name: String(name).trim(),
      slug: String(slug).trim(),
      image: item?.image ?? item?.thumbnail ?? "",
    };
  });

  return {
    categories,
    count: categories.length,
  };
};

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalog: builder.query<CatalogResponse, void>({
      query: () => "/products/categories",
      transformResponse: normalizeCatalog,
    }),
  }),
});

export const { useGetCatalogQuery } = catalogApi;