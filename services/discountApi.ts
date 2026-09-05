import { IDiscount } from "../Types/index.types";
import { baseApi } from "./baseApi";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeDiscount = (product: any): IDiscount => {
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
    starts_at: new Date().toISOString(),
    ends_at: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<IDiscount[], void>({
      query: () => "/products",
      transformResponse: (response: any) => {
        const products = Array.isArray(response) ? response : response?.products ?? [];
        return products
          .filter((product: any) => Number(product.discountPercentage ?? 0) > 0)
          .map(normalizeDiscount);
      },
    }),
    getDiscountBySlug: builder.query<IDiscount, string>({
      async queryFn(slug, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("/products");
        if (result.error) return { error: result.error };

        const products = Array.isArray(result.data) ? result.data : (result.data as any)?.products ?? [];
        const product = products.find((item: any) => `${toSlug(String(item.title ?? item.name ?? ""))}-${item.id}` === slug);

        return product
          ? { data: normalizeDiscount(product) }
          : { error: { status: 404, data: "Discount not found" } };
      },
    }),
  }),
});

export const { useGetDiscountsQuery, useGetDiscountBySlugQuery } = discountApi;
