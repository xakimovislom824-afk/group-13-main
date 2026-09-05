// services/verifyApi.ts
import { baseApi } from "./baseApi";

export interface IVerify {
  email: string;
  code: string;
}

export interface IVerifyResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const verifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyUser: builder.mutation<IVerifyResponse, IVerify>({
      queryFn: async (body) => {
        try {
          return {
            data: {
              id: Date.now(),
              username: body.email.split("@")[0] || "user",
              email: body.email,
              first_name: "",
              last_name: "",
            },
          };
        } catch (error: any) {
          return { error: { status: 500, data: error?.message || "Verification failed" } };
        }
      },
    }),
  }),
});

export const { useVerifyUserMutation } = verifyApi;