import { baseApi } from "./baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

          const responseData: unknown = await response.json();
          const data = isRecord(responseData) ? responseData : {};

          if (!response.ok) {
            return { error: { status: response.status, data: data.message || data.error || "Registration failed" } };
          }

          return {
            data: {
              id: Number(data.id) || Date.now(),
              username: typeof data.username === "string" ? data.username : body.username,
              email: typeof data.email === "string" ? data.email : body.email,
            },
          };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Registration failed";
          return { error: { status: 500, data: message } };
        }
      },
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
