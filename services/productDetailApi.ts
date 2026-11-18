import { baseApi } from "./baseApi";
import { dummyCategories } from "./categoryApi";

export interface IProductDetail {
  id: number;
  has_discount: boolean;
  discounted_price: string;
  name: string;
  description: string;
  price: string;
  old_price: string;
  discount_percent: number;
  image: string;
  specifications: string;
  advantages: string;
  is_hit: boolean;
  is_new: boolean;
  is_sale: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  category: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeDummyProductDetail = (value: unknown): IProductDetail => {
  const item = isRecord(value) ? value : {};
  const categoryName = String(item.category ?? "").toLowerCase();
  const categoryId =
    dummyCategories.findIndex((name) => name.toLowerCase() === categoryName) + 1 || 1;

  return {
    id: Number(item.id ?? 0),
    has_discount: Number(item.discountPercentage ?? 0) > 0,
    discounted_price: String(item.price ?? "0"),
    name: String(item.title ?? item.name ?? ""),
    description: String(item.description ?? ""),
    price: String(item.price ?? "0"),
    old_price: item.oldPrice ? String(item.oldPrice) : String(item.price ?? "0"),
    discount_percent: Number(item.discountPercentage ?? 0),
    image: String(Array.isArray(item.images) ? item.images[0] ?? "" : item.thumbnail ?? item.image ?? ""),
    specifications: "",
    advantages: "",
    is_hit: false,
    is_new: false,
    is_sale: Number(item.discountPercentage ?? 0) > 0,
    stock: Number(item.stock ?? 0),
    created_at: String(item.createdAt ?? new Date().toISOString()),
    updated_at: String(item.updatedAt ?? new Date().toISOString()),
    category: categoryId,
  };
};

const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query<IProductDetail, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: unknown) => normalizeDummyProductDetail(response),
      providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProductByIdQuery } = productDetailApi;
