import { IDiscount } from "../Types/index.types";
import { baseApi } from "./baseApi";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type ProductRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ProductRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeDiscount = (value: unknown): IDiscount => {
  const product = isRecord(value) ? value : {};
  const title = String(product.title ?? product.name ?? "Mahsulot aksiyasi");
  const discount = Math.round(Number(product.discountPercentage ?? 0));

  return {
    id: Number(product.id ?? 0),
    title,
    slug: `${toSlug(title)}-${Number(product.id ?? 0)}`,
    summary: String(product.description ?? "Ushbu mahsulot uchun maxsus taklif."),
    content: String(product.description ?? "Ushbu mahsulot chegirmali narxda taqdim etilmoqda."),
    image: String(product.thumbnail ?? (Array.isArray(product.images) ? product.images[0] : product.image) ?? ""),
    discount_percent: discount,
    products: [Number(product.id ?? 0)],
    products_detail: JSON.stringify(product),
    is_published: true,
    starts_at: "",
    ends_at: "",
    created_at: "",
    updated_at: "",
  };
};

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<IDiscount[], void>({
      query: () => "/products?limit=0",
      transformResponse: (response: unknown) => {
        const responseRecord = isRecord(response) ? response : {};
        const products: unknown[] = Array.isArray(response)
          ? response
          : Array.isArray(responseRecord.products) ? responseRecord.products : [];
        return products
          .filter((value) => isRecord(value) && Number(value.discountPercentage ?? 0) > 0)
          .map(normalizeDiscount);
      },
    }),
    getDiscountBySlug: builder.query<IDiscount, string>({
      async queryFn(slug, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("/products?limit=0");
        if (result.error) return { error: result.error };

        const responseRecord = isRecord(result.data) ? result.data : {};
        const products: unknown[] = Array.isArray(result.data)
          ? result.data
          : Array.isArray(responseRecord.products) ? responseRecord.products : [];
        const product = products.find((value) => {
          if (!isRecord(value)) return false;
          return `${toSlug(String(value.title ?? value.name ?? ""))}-${value.id}` === slug;
        });

        return product
          ? { data: normalizeDiscount(product) }
          : { error: { status: 404, data: "Discount not found" } };
      },
    }),
  }),
});

export const { useGetDiscountsQuery, useGetDiscountBySlugQuery } = discountApi;
