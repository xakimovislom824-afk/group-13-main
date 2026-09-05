import { IProduct, IWishlist } from "../Types/index.types";
import { baseApi } from "./baseApi";

const readWishlist = () => {
  if (typeof window === "undefined") return [] as IWishlist[];
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]") as IWishlist[];
  } catch {
    return [] as IWishlist[];
  }
};

const writeWishlist = (items: IWishlist[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }
};

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getWishlist: builder.query<IWishlist[], void>({
      queryFn: async () => ({ data: readWishlist() }),
      providesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation<IWishlist, { product_id: number; product_detail?: Partial<IProduct> }>({
      queryFn: async (body) => {
        const list = readWishlist();
        const existing = list.find((item) => item.product === body.product_id);

        const productDetail = body.product_detail && typeof body.product_detail === "object" && "id" in body.product_detail
          ? { ...body.product_detail } as IProduct
          : { id: body.product_id } as IProduct;

        const next = existing
          ? list.filter((item) => item.product !== body.product_id)
          : [
              ...list,
              {
                id: Date.now(),
                product: body.product_id,
                product_detail: productDetail,
                created_at: new Date().toISOString(),
              },
            ];

        writeWishlist(next);
        const saved = next.find((item) => item.product === body.product_id);
        return {
          data: (saved ?? {
            id: Date.now(),
            product: body.product_id,
            product_detail: productDetail,
            created_at: new Date().toISOString(),
          }) as IWishlist,
        };
      },
      invalidatesTags: ["Wishlist"],
    }),

    removeWishlist: builder.mutation<IWishlist[], number>({
      queryFn: async (id) => {
        const list = readWishlist().filter((item) => item.product !== id);
        writeWishlist(list);
        return { data: list };
      },
      invalidatesTags: ["Wishlist"],
    }),

  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;