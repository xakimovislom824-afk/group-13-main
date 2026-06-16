// services/categoryApi.ts
import { ICategory } from "../Types/index.types";
import { baseApi } from "./baseApi";



export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<ICategory[], void>({
            query: () => "/categories/",
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;