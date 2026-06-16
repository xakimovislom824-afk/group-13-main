import { IProduct } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], void>({
      query: () => "/products",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response.results ?? [];
      },
    }),

    getProductById: builder.query<IProduct[], number>({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productApi;