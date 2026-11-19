import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parolniTiklashApi = createApi({
  reducerPath: "parolniTiklashApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      queryFn: async () => ({
        error: {
          status: "CUSTOM_ERROR",
          error: "DummyJSON does not provide a password-reset endpoint.",
        },
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = parolniTiklashApi;
