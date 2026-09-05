import { IProduct } from "../Types/index.types";
import { baseApi } from "./baseApi";
import { dummyCategories } from "./categoryApi";

const normalizeProduct = (item: any): IProduct => {
  const categoryName = String(item.category ?? "").toLowerCase();
  const categoryId =
    dummyCategories.findIndex((name) => name.toLowerCase() === categoryName) + 1 || 1;

  return {
    id: Number(item.id ?? 0),
    name: item.title ?? item.name ?? "",
    description: item.description ?? "",
    price: String(item.price ?? "0"),
    old_price: item.oldPrice ? String(item.oldPrice) : String(item.price ?? "0"),
    image: Array.isArray(item.images) ? item.images[0] ?? "" : item.thumbnail ?? item.image ?? "",
    brand: item.brand ?? "",
    is_hit: false,
    is_new: false,
    is_sale: Number(item.discountPercentage ?? 0) > 0,
    stock: Number(item.stock ?? 0),
    created_at: item.createdAt ?? new Date().toISOString(),
    updated_at: item.updatedAt ?? new Date().toISOString(),
    category: categoryId,
  };
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], void>({
      query: () => "/products",
      transformResponse: (response: any) => {
        const products = Array.isArray(response) ? response : response?.products ?? [];
        return products.map(normalizeProduct);
      },
    }),

    getProductById: builder.query<IProduct, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any) => normalizeProduct(response),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productApi;