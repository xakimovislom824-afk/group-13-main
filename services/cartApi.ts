// services/cartApi.ts
import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCarts: builder.query<any, void>({
            query: () => "carts/",
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation<any, { product: number; quantity: number }>({
            query: (body) => ({
                url: "carts/items/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),
        // ✅ PATCH o'rniga PUT — backend PATCH ga ruxsat bermaydi
        updateCart: builder.mutation<any, { id: number; product: number; quantity: number }>({
            query: ({ id, product, quantity }) => ({
                url: `carts/items/${id}/`,
                method: "PUT",
                body: { product, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),
        deleteCart: builder.mutation<any, number>({
            query: (id) => ({
                url: `carts/items/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetCartsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useDeleteCartMutation,
} = cartApi;