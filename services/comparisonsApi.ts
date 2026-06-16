import { baseApi } from "./baseApi";

// ─── Tiplar ───────────────────────────────────────────────────────────────────

export interface IComparisonProduct {
  id: number;
  name: string;
  image?: string;
  price?: number | string;
  old_price?: number | string;
  category?: number | string;
  description?: string;
  [key: string]: unknown;
}

export interface IComparison {
  id: number;
  name: string;
  products: number[];
  products_detail: IComparisonProduct[] | string;
  created_at: string;
  updated_at: string;
}

export interface ICreateComparisonPayload {
  name: string;
  products: number[];
}

export interface IUpdateComparisonPayload {
  id: number;
  products: number[];
}

// ─── Helper: products_detail parse ───────────────────────────────────────────
export function parseProductsDetail(
  detail: IComparisonProduct[] | string | undefined
): IComparisonProduct[] {
  if (!detail) return [];
  if (Array.isArray(detail)) return detail;
  try {
    const parsed = JSON.parse(detail as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── baseApi ga inject ────────────────────────────────────────────────────────
const comparisonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComparisons: builder.query<IComparison[], void>({
      query: () => "/commerce-extras/product-comparisons/",
      providesTags: ["Comparisons"],
    }),

    // comparisonsApi.ts ga qo'shing
    createComparison: builder.mutation<IComparison, ICreateComparisonPayload>({
      query: (body) => ({
        url: "/commerce-extras/product-comparisons/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          console.log("❌ comparison error:", err?.error?.data);
        }
      },
      invalidatesTags: ["Comparisons"],
    }), 
    // Mavjud comparisonga mahsulot qo'shish / olib tashlash uchun PATCH
    updateComparison: builder.mutation<IComparison, IUpdateComparisonPayload>({
      query: ({ id, products }) => ({
        url: `/commerce-extras/product-comparisons/${id}/`,
        method: "PATCH",
        body: { products },
      }),
      invalidatesTags: ["Comparisons"],
    }),

    deleteComparison: builder.mutation<void, number>({
      query: (id) => ({
        url: `/commerce-extras/product-comparisons/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comparisons"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComparisonsQuery,
  useCreateComparisonMutation,
  useUpdateComparisonMutation,
  useDeleteComparisonMutation,
} = comparisonsApi;