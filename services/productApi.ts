import { IProduct } from "../Types/index.types";
import { baseApi } from "./baseApi";
import { dummyCategories } from "./categoryApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeProduct = (value: unknown): IProduct => {
  const item = isRecord(value) ? value : {};
  const categoryName = String(item.category ?? "").toLowerCase();
  const categoryId =
    dummyCategories.findIndex((name) => name.toLowerCase() === categoryName) + 1 || 1;

  return {
    id: Number(item.id ?? 0),
    name: String(item.title ?? item.name ?? ""),
    description: String(item.description ?? ""),
    price: String(item.price ?? "0"),
    old_price: item.oldPrice ? String(item.oldPrice) : String(item.price ?? "0"),
    image: String(Array.isArray(item.images) ? item.images[0] ?? "" : item.thumbnail ?? item.image ?? ""),
    brand: String(item.brand ?? ""),
    is_hit: false,
    is_new: false,
    is_sale: Number(item.discountPercentage ?? 0) > 0,
    stock: Number(item.stock ?? 0),
    created_at: String(item.createdAt ?? new Date().toISOString()),
    updated_at: String(item.updatedAt ?? new Date().toISOString()),
    category: categoryId,
  };
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], void>({
      query: () => "/products",
      transformResponse: (response: unknown) => {
        const responseRecord = isRecord(response) ? response : {};
        const products: unknown[] = Array.isArray(response)
          ? response
          : Array.isArray(responseRecord.products) ? responseRecord.products : [];
        return products.map(normalizeProduct);
      },
    }),

    getProductById: builder.query<IProduct, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: unknown) => normalizeProduct(response),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productApi;
