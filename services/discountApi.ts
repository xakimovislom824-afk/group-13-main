import { IDiscount } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<IDiscount[], void>({
      query: () => "/commerce-extras/discounts/",
    }),
    getDiscountBySlug: builder.query<IDiscount, string>({
      query: (slug) => `/commerce-extras/discounts/${slug}/`,
    }),
  }),
});

export const { useGetDiscountsQuery, useGetDiscountBySlugQuery } = discountApi;
