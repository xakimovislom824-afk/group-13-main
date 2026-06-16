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
      query: (body) => ({
        url: "/users/verify/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useVerifyUserMutation } = verifyApi;