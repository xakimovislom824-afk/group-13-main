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
      queryFn: async (body) => {
        try {
          const username = (body.username || "").trim();
          const password = String(body.password || "");

          if (!username) {
            return { error: { status: 400, data: "Ism kiritilishi shart" } };
          }

          if (password !== "admin7") {
            return { error: { status: 401, data: "Parol noto'g'ri! Parol: admin7" } };
          }

          const demoToken = `demo-token-${Date.now()}`;
          if (typeof window !== "undefined") {
            localStorage.setItem("demo_password", "admin7");
          }

          return {
            data: {
              user: {
                username,
                email: `${username}@demo.local`,
                firstName: username,
                lastName: "",
              },
              refresh: demoToken,
              access: demoToken,
            },
          };
        } catch (error: any) {
          return { error: { status: 500, data: error?.message || "Login failed" } };
        }
      },
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
