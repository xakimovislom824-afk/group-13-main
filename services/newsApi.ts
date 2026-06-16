import { IBlog } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<IBlog[], void>({
      query: () => "/commerce-extras/news/", 
    }),
    getNewsById: builder.query<IBlog, number>({
      query: (id) => `/commerce-extras/news/${id}/`,
    }),
  }),
});

export const { useGetNewsQuery, useGetNewsByIdQuery } = newsApi;  