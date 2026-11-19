import type { ICategory } from "../Types/index.types";
import { baseApi } from "./baseApi";

export interface StoreCategory extends ICategory {
  slug: string;
  url: string;
}

const categoryLabels: Record<string, string> = {
  beauty: "Go'zallik", fragrances: "Atirlar", furniture: "Mebel",
  groceries: "Oziq-ovqat", "home-decoration": "Uy bezaklari",
  "kitchen-accessories": "Oshxona anjomlari", laptops: "Noutbuklar",
  smartphones: "Smartfonlar", "mobile-accessories": "Mobil aksessuarlar",
  "skin-care": "Teri parvarishi", "sports-accessories": "Sport aksessuarlari",
  tops: "Ustki kiyimlar",
  "mens-shirts": "Erkaklar ko'ylaklari", "mens-shoes": "Erkaklar oyoq kiyimlari",
  "mens-watches": "Erkaklar soatlari", "womens-dresses": "Ayollar liboslari",
  "womens-shoes": "Ayollar oyoq kiyimlari", "womens-watches": "Ayollar soatlari",
  "womens-bags": "Ayollar sumkalari", "womens-jewellery": "Ayollar taqinchoqlari",
  sunglasses: "Quyosh ko'zoynaklari", tablets: "Planshetlar", vehicle: "Transport",
  motorcycle: "Mototsikllar", lighting: "Yoritish",
};

export const getCategoryDisplayName = (category: StoreCategory) =>
  categoryLabels[category.slug] ?? category.name;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<StoreCategory[], void>({
      query: () => "/products/categories",
      transformResponse: (response: unknown) => {
        if (!Array.isArray(response)) return [];
        return response.flatMap((value, index) => {
          if (!isRecord(value) || typeof value.slug !== "string") return [];
          return [{
            id: index + 1,
            name: typeof value.name === "string" ? value.name : value.slug,
            slug: value.slug,
            url: typeof value.url === "string" ? value.url : `/products/category/${value.slug}`,
          }];
        });
      },
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
