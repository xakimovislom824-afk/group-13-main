import { IEditProfile } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const editProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<IEditProfile, void>({
            query: () => "/commerce-extras/me/profile/",
            providesTags: ["Profile"],
        }),
        editProfil: builder.mutation<IEditProfile, Partial<IEditProfile>>({
            query: (body) => ({
                url: "/commerce-extras/me/profile/",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const { useGetProfileQuery, useEditProfilMutation } = editProfileApi;