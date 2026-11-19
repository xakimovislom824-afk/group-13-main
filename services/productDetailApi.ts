import { baseApi } from "./baseApi";
import { normalizeProduct } from "./productApi";
import type { IProduct } from "../Types/index.types";

export interface IProductDetail extends IProduct {
  has_discount: boolean;
  discounted_price: string;
  discount_percent: number;
  specifications: string;
  advantages: string;
}

const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query<IProductDetail, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: unknown): IProductDetail => {
        const product = normalizeProduct(response);
        return {
          ...product,
          has_discount: product.is_sale,
          discounted_price: product.price,
          discount_percent: product.discountPercentage ?? 0,
          specifications: "",
          advantages: "",
        };
      },
      providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProductByIdQuery } = productDetailApi;
