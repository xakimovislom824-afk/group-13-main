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
        const record = typeof response === "object" && response !== null && !Array.isArray(response)
          ? response as Record<string, unknown>
          : {};
        const specifications = [
          ["Brend", record.brand],
          ["Kategoriya", record.category],
          ["Reyting", typeof record.rating === "number" ? `${record.rating.toFixed(1)} / 5` : undefined],
          ["Omborda", typeof record.stock === "number" ? `${record.stock} dona` : undefined],
          ["Kafolat", record.warrantyInformation],
          ["Yetkazib berish", record.shippingInformation],
          ["Qaytarish", record.returnPolicy],
          ["Minimal buyurtma", typeof record.minimumOrderQuantity === "number" ? `${record.minimumOrderQuantity} dona` : undefined],
        ].filter((item): item is [string, string] => typeof item[1] === "string" && item[1].length > 0);
        const advantages = [record.warrantyInformation, record.shippingInformation, record.returnPolicy]
          .filter((item): item is string => typeof item === "string" && item.length > 0);

        return {
          ...product,
          has_discount: product.is_sale,
          discounted_price: product.price,
          discount_percent: product.discountPercentage ?? 0,
          specifications: JSON.stringify(specifications.map(([label, value]) => ({ label, value }))),
          advantages: JSON.stringify(advantages),
        };
      },
      providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }],
    }),
  }),
});

export const { useGetProductByIdQuery } = productDetailApi;
