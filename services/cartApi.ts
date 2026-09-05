// services/cartApi.ts
import { baseApi } from "./baseApi";

const normalizeCartItems = (source: any[]) => {
  if (!Array.isArray(source)) return [];

  return source.flatMap((item) => {
    if (Array.isArray(item?.items)) return item.items;
    if (item && (item.product !== undefined || item.product_data || item.product_detail)) return [item];
    return [];
  });
};

const readCart = () => {
  if (typeof window === "undefined") return [] as any[];
  try {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(raw) ? normalizeCartItems(raw) : [];
  } catch {
    return [] as any[];
  }
};

const writeCart = (items: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCarts: builder.query<any[], void>({
            queryFn: async () => ({ data: readCart() }),
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation<any, { product: number; quantity: number }>({
            queryFn: async (body) => {
                const carts = readCart();
                const existing = carts.find(
                  (item) =>
                    Number(item.product) === Number(body.product) ||
                    Number(item.product_data?.id) === Number(body.product) ||
                    Number(item.product_detail?.id) === Number(body.product)
                );

                const next = existing
                  ? carts.map((item) =>
                      Number(item.id) === Number(existing.id)
                        ? { ...item, quantity: Number(item.quantity || 0) + Number(body.quantity || 1) }
                        : item
                    )
                  : [...carts, { id: Date.now(), product: body.product, quantity: body.quantity, created_at: new Date().toISOString() }];

                writeCart(next);
                return { data: next };
            },
            invalidatesTags: ["Cart"],
        }),
        updateCart: builder.mutation<any, { id: number; product: number; quantity: number }>({
            queryFn: async ({ id, product, quantity }) => {
                const carts = readCart().map((item) => item.id === id ? { ...item, product, quantity } : item);
                writeCart(carts);
                return { data: carts.find((item) => item.id === id) || null };
            },
            invalidatesTags: ["Cart"],
        }),
        deleteCart: builder.mutation<any, number>({
            queryFn: async (id) => {
                const carts = readCart().filter((item) => item.id !== id);
                writeCart(carts);
                return { data: carts };
            },
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