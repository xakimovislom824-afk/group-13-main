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

const normalizeDummyProductDetail = (item: any): IProductDetail => {
  const categoryName = String(item.category ?? "").toLowerCase();
  const categoryId =
    dummyCategories.findIndex((name) => name.toLowerCase() === categoryName) + 1 || 1;

  return {
    id: Number(item.id ?? 0),
    has_discount: Number(item.discountPercentage ?? 0) > 0,
    discounted_price: String(item.price ?? "0"),
    name: item.title ?? item.name ?? "",
    description: item.description ?? "",
    price: String(item.price ?? "0"),
    old_price: item.oldPrice ? String(item.oldPrice) : String(item.price ?? "0"),
    discount_percent: Number(item.discountPercentage ?? 0),
    image: Array.isArray(item.images) ? item.images[0] ?? "" : item.thumbnail ?? item.image ?? "",
    specifications: "",
    advantages: "",
    is_hit: false,
    is_new: false,
    is_sale: Number(item.discountPercentage ?? 0) > 0,
    stock: Number(item.stock ?? 0),
    created_at: item.createdAt ?? new Date().toISOString(),
    updated_at: item.updatedAt ?? new Date().toISOString(),
    category: categoryId,
  };
};

const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query<IProductDetail, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any) => normalizeDummyProductDetail(response),
      providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProductByIdQuery } = productDetailApi;