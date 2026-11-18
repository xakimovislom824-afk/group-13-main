import { baseApi } from "./baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

const normalizeCatalog = (response: unknown): CatalogResponse => {
  const responseRecord = isRecord(response) ? response : {};
  const candidate = responseRecord.categories ?? responseRecord.results;
  const raw: unknown[] = Array.isArray(response) ? response : Array.isArray(candidate) ? candidate : [];

  const categories = raw.map((item, index) => {
    const itemRecord = isRecord(item) ? item : {};
    const name = typeof item === "string" ? item : itemRecord.name ?? itemRecord.title ?? `Category ${index + 1}`;
    const slug = typeof item === "string" ? item : itemRecord.slug ?? String(name).toLowerCase().replace(/\s+/g, "-");

    return {
      id: Number(itemRecord.id ?? index + 1),
      name: String(name).trim(),
      slug: String(slug).trim(),
      image: String(itemRecord.image ?? itemRecord.thumbnail ?? ""),
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
