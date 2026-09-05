import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parolniTiklashApi = createApi({
  reducerPath: "parolniTiklashApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.ISLOM_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      queryFn: async (body) => {
        try {
          return {
            data: {
              message: `Parolni tiklash so'rovi qabul qilindi: ${body.email}`,
            },
          };
        } catch (error: any) {
          return { error: { status: 500, data: error?.message || "Request failed" } };
        }
      },
    }),
  }),
});

export const { useForgotPasswordMutation } = parolniTiklashApi;