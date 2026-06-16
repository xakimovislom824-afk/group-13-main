import { baseApi } from "./baseApi";

export interface IRegister {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<{ id: number; username: string; email: string }, IRegister>({
      query: (body) => ({
        url: "/users/register/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
