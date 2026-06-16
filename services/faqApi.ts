// services/faqApi.ts
import { IFAQ } from "../Types/index.types";
import { baseApi } from "./baseApi";


export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query<IFAQ[], void>({
            query: () => "faq/",
        }),
    }),
});

export const { useGetFaqsQuery } = faqApi;