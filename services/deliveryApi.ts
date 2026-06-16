import { IDelivery } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDelivery: builder.query<IDelivery[], void>({
      query: () => "/delivery/shipping-methods/",
    }),
    getDeliveryById: builder.query<IDelivery, string>({
      query: (id) => `/delivery/shipping-methods/${id}/`,
    }),
  }),
});
export const { useGetDeliveryQuery, useGetDeliveryByIdQuery } = deliveryApi;
