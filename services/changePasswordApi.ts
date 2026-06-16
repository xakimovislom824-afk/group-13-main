import { IChangePassword } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const changePassword = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        changeParol: builder.mutation<IChangePassword, void>({
            query: (body) => ({
                url: "/users/change-password/",
                method: "POST",
                body,
            })
        })
    })
})
export const { useChangeParolMutation } = changePassword