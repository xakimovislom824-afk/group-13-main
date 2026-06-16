// services/paymentsApi.ts
import { IPayment } from "../Types/index.types";
import { baseApi } from "./baseApi";


export const paymentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<IPayment[], void>({
            query: () => "/payments/",
            providesTags: ["Payments"],
        }),
    }),
});

export const { useGetPaymentsQuery } = paymentsApi;