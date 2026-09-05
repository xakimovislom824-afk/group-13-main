// services/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",   // ← faqat shu qator muhim
    prepareHeaders: (headers) => {
      // localStorage faqat brauzerda ishlaydi
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  tagTypes: [
    "Wishlist",
    "Comparisons",
    "Profile",
    "Payments",
    "Product",
    "User",
    "Favorite",
    "Cart",
    "Feedback",
    "Contact",
    "ProductDetail",
    "OrderAddress",
  ],

  endpoints: () => ({}),
});