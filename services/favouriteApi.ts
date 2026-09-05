import { baseApi } from "./baseApi";

const readFavorites = () => {
  if (typeof window === "undefined") return [] as number[];
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]") as number[];
  } catch {
    return [] as number[];
  }
};

const writeFavorites = (items: number[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(items));
  }
};

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<number[], void>({
      queryFn: async () => ({ data: readFavorites() }),
      providesTags: ["Favorite"],
    }),

    addFavorite: builder.mutation<number[], number>({
      queryFn: async (productId) => {
        const list = readFavorites();
        const next = list.includes(productId) ? list : [...list, productId];
        writeFavorites(next);
        return { data: next };
      },
      invalidatesTags: ["Favorite"],
    }),

    removeFavorite: builder.mutation<number[], number>({
      queryFn: async (id) => {
        const list = readFavorites().filter((productId) => productId !== id);
        writeFavorites(list);
        return { data: list };
      },
      invalidatesTags: ["Favorite"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;