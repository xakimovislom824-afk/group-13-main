import { baseApi } from "./baseApi";
import type { IProduct } from "../Types/index.types";

export interface ProductPage {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductQuery {
  limit?: number;
  skip?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const normalizeProduct = (value: unknown): IProduct => {
  const item = isRecord(value) ? value : {};
  const price = Number(item.price ?? 0);
  const discountPercentage = Number(item.discountPercentage ?? 0);
  const originalPrice = discountPercentage > 0
    ? price / (1 - discountPercentage / 100)
    : price;
  const images = Array.isArray(item.images)
    ? item.images.filter((image): image is string => typeof image === "string")
    : [];

  return {
    id: Number(item.id ?? 0),
    name: String(item.title ?? ""),
    description: String(item.description ?? ""),
    price: String(price),
    old_price: String(originalPrice),
    image: String(item.thumbnail ?? images[0] ?? ""),
    images,
    brand: typeof item.brand === "string" ? item.brand : "",
    is_hit: Number(item.rating ?? 0) >= 4.5,
    is_new: false,
    is_sale: discountPercentage > 0,
    discountPercentage,
    rating: Number(item.rating ?? 0),
    stock: Number(item.stock ?? 0),
    created_at: "",
    updated_at: "",
    category: typeof item.category === "string" ? item.category : "",
  };
};

const normalizePage = (response: unknown): ProductPage => {
  const record = isRecord(response) ? response : {};
  const products = Array.isArray(record.products) ? record.products : [];
  return {
    products: products.map(normalizeProduct),
    total: Number(record.total ?? 0),
    skip: Number(record.skip ?? 0),
    limit: Number(record.limit ?? 20),
  };
};

const pageQuery = ({ limit = 20, skip = 0 }: ProductQuery = {}) =>
  `/products?limit=${Math.max(1, Math.min(100, limit))}&skip=${Math.max(0, skip)}`;

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], void>({
      query: () => pageQuery({ limit: 20, skip: 0 }),
      transformResponse: (response: unknown) => normalizePage(response).products,
    }),
    getProductsPage: builder.query<ProductPage, ProductQuery>({
      query: (query) => pageQuery(query),
      transformResponse: normalizePage,
    }),
    getProductsByCategory: builder.query<ProductPage, ProductQuery & { slug: string }>({
      query: ({ slug, limit = 20, skip = 0 }) =>
        `/products/category/${encodeURIComponent(slug)}?limit=${Math.max(1, Math.min(100, limit))}&skip=${Math.max(0, skip)}`,
      transformResponse: normalizePage,
    }),
    searchProducts: builder.query<ProductPage, ProductQuery & { q: string }>({
      query: ({ q, limit = 20, skip = 0 }) =>
        `/products/search?q=${encodeURIComponent(q)}&limit=${Math.max(1, Math.min(100, limit))}&skip=${Math.max(0, skip)}`,
      transformResponse: normalizePage,
    }),
    getProductById: builder.query<IProduct, number>({
      query: (id) => `/products/${id}`,
      transformResponse: normalizeProduct,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsPageQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
} = productApi;
