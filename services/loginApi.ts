// services/loginApi.ts
import { baseApi } from "./baseApi";

export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  user: Record<string, string>;
  refresh: string;
  access: string;
}

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILoginResponse, ILogin>({
      query: (body) => ({
        url: "/users/login/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
