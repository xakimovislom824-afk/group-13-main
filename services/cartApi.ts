// services/cartApi.ts
import { baseApi } from "./baseApi";
import type { IProduct } from "../Types/index.types";

type CartItem = Record<string, unknown>;

const isRecord = (value: unknown): value is CartItem =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeCartItems = (source: unknown[]): CartItem[] => {
  return source.flatMap((value) => {
    if (!isRecord(value)) return [];
    if (Array.isArray(value.items)) return value.items.filter(isRecord);
    if (value.product !== undefined || value.product_data || value.product_detail) return [value];
    return [];
  });
};

const readCart = () => {
  if (typeof window === "undefined") return [] as CartItem[];
  try {
    const raw: unknown = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(raw) ? normalizeCartItems(raw) : [];
  } catch {
    return [] as CartItem[];
  }
};

const writeCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCarts: builder.query<CartItem[], void>({
            queryFn: async () => ({ data: readCart() }),
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation<CartItem[], { product: number; quantity: number; product_data?: Partial<IProduct> }>({
            queryFn: async (body) => {
                const carts = readCart();
                const existing = carts.find(
                  (item) =>
                    Number(item.product) === Number(body.product) ||
                    Number(isRecord(item.product_data) ? item.product_data.id : undefined) === Number(body.product) ||
                    Number(isRecord(item.product_detail) ? item.product_detail.id : undefined) === Number(body.product)
                );

                const next = existing
                  ? carts.map((item) =>
                      Number(item.id) === Number(existing.id)
                        ? { ...item, quantity: Number(item.quantity || 0) + Number(body.quantity || 1) }
                        : item
                    )
                  : [...carts, { id: Date.now(), product: body.product, quantity: body.quantity, product_data: body.product_data, created_at: new Date().toISOString() }];

                writeCart(next);
                return { data: next };
            },
            invalidatesTags: ["Cart"],
        }),
        updateCart: builder.mutation<CartItem | null, { id: number; product: number; quantity: number }>({
            queryFn: async ({ id, product, quantity }) => {
                const carts = readCart().map((item) => item.id === id ? { ...item, product, quantity } : item);
                writeCart(carts);
                return { data: carts.find((item) => item.id === id) || null };
            },
            invalidatesTags: ["Cart"],
        }),
        deleteCart: builder.mutation<CartItem[], number>({
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
