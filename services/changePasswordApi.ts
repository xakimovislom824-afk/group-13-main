import { IChangePassword } from "../Types/index.types";
import { baseApi } from "./baseApi";

const getStoredPassword = () => {
    if (typeof window === "undefined") return "admin7";
    return localStorage.getItem("demo_password") || "admin7";
};

export const changePassword = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        changeParol: builder.mutation<IChangePassword, { old_password: string; new_password: string }>({
            queryFn: async (body) => {
                try {
                    const currentPassword = getStoredPassword();

                    if (!body?.old_password) {
                        return { error: { status: 400, data: "Eski parol kiritilishi shart" } };
                    }

                    if (body.old_password !== currentPassword) {
                        return { error: { status: 400, data: "Eski parol noto'g'ri" } };
                    }

                    if (!body.new_password || body.new_password.length < 4) {
                        return { error: { status: 400, data: "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak" } };
                    }

                    if (typeof window !== "undefined") {
                        localStorage.setItem("demo_password", body.new_password);
                    }

                    return {
                        data: {
                            old_password: body.old_password,
                            new_password: body.new_password,
                            password: body.new_password,
                        },
                    };
                } catch (error: any) {
                    return { error: { status: 500, data: error?.message || "Password change failed" } };
                }
            },
        })
    })
})
export const { useChangeParolMutation } = changePassword