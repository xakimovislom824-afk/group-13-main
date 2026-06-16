import { baseApi } from "./baseApi";

interface CatalogItem {
    title: string;
    image: string;
    url: string;
}

interface CatalogResponse {
    katalog: CatalogItem[];
    catalog: { title: string; url: string };
}

export const catalogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCatalog: builder.query<CatalogResponse, void>({
            query: () => "/catalog/",
        }),
    }),
});

export const { useGetCatalogQuery } = catalogApi;