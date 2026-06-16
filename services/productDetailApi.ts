import { baseApi } from "./baseApi";

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

const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query<IProductDetail, number>({
      query: (id) => `/products/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }], // ✅ "ProductDetail" ishlatildi
    }),
  }),
  overrideExisting: true,
});

export const { useGetProductByIdQuery } = productDetailApi;