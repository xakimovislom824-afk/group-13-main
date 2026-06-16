import { IWishlist } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getWishlist: builder.query<IWishlist[], void>({
      query: () => "/wishlist/",
      providesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation({
      query: (body) => ({
        url: "/wishlist/toggle/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;