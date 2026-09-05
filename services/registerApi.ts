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
      queryFn: async (body) => {
        try {
          const response = await fetch("https://dummyjson.com/users/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: body.username,
              email: body.email,
              firstName: body.first_name,
              lastName: body.last_name,
              password: body.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            return { error: { status: response.status, data: data?.message || data?.error || "Registration failed" } };
          }

          return {
            data: {
              id: data.id || Date.now(),
              username: data.username || body.username,
              email: data.email || body.email,
            },
          };
        } catch (error: any) {
          return { error: { status: 500, data: error?.message || "Registration failed" } };
        }
      },
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
