import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parolniTiklashApi = createApi({
  reducerPath: "parolniTiklashApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/users/forgot-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = parolniTiklashApi;