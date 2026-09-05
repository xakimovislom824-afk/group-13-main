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
  products_detail?: IComparisonProduct[];
}

export interface IUpdateComparisonPayload {
  id: number;
  products: number[];
  products_detail?: IComparisonProduct[];
}

const readComparisons = () => {
  if (typeof window === "undefined") return [] as IComparison[];
  try {
    return JSON.parse(localStorage.getItem("comparisons") || "[]") as IComparison[];
  } catch {
    return [] as IComparison[];
  }
};

const writeComparisons = (items: IComparison[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("comparisons", JSON.stringify(items));
  }
};

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
      queryFn: async () => ({ data: readComparisons() }),
      providesTags: ["Comparisons"],
    }),

    createComparison: builder.mutation<IComparison, ICreateComparisonPayload>({
      queryFn: async (body) => {
        const list = readComparisons();
        const detail = Array.isArray(body.products_detail) && body.products_detail.length > 0
          ? body.products_detail
          : body.products.map((id) => ({
              id,
              name: `Mahsulot ${id}`,
              image: "",
              price: 0,
              old_price: 0,
              category: 0,
              description: "",
            }));

        const nextItem: IComparison = {
          id: Date.now(),
          name: body.name,
          products: body.products,
          products_detail: detail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const next = [...list, nextItem];
        writeComparisons(next);
        return { data: nextItem };
      },
      invalidatesTags: ["Comparisons"],
    }),

    updateComparison: builder.mutation<IComparison, IUpdateComparisonPayload>({
      queryFn: async ({ id, products, products_detail }) => {
        const list = readComparisons();
        const next = list.map((item) =>
          item.id === id
            ? {
                ...item,
                products,
                products_detail: Array.isArray(products_detail) && products_detail.length > 0
                  ? products_detail
                  : item.products_detail,
                updated_at: new Date().toISOString(),
              }
            : item
        );
        writeComparisons(next);
        const updated = next.find((item) => item.id === id) || null;
        return { data: updated as IComparison };
      },
      invalidatesTags: ["Comparisons"],
    }),

    deleteComparison: builder.mutation<IComparison[], number>({
      queryFn: async (id) => {
        const list = readComparisons().filter((item) => item.id !== id);
        writeComparisons(list);
        return { data: list };
      },
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