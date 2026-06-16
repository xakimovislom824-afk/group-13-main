import { baseApi } from "./baseApi";

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => "/favorites",
      providesTags: ["Favorite"],
    }),

    addFavorite: builder.mutation({
      query: (productId) => ({
        url: "/favorites",
        method: "POST",
        body: { product: productId },
      }),
      invalidatesTags: ["Favorite"],
    }),

    removeFavorite: builder.mutation({
      query: (id) => ({
        url: `/favorites/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorite"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;