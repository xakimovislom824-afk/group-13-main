import { ICompanyInfo, ITeamMember } from "../Types/index.types";
import { baseApi } from "./baseApi";

export const companyApi = baseApi.injectEndpoints({
    endpoints: (bulider) => ({
        getCompanyInfo: bulider.query<ICompanyInfo, void>({
            query: () => "/company/info/"
        }),
        getCompanyMain: bulider.query<ICompanyInfo, void>({
            query: () => "/company/info/main/"
        }),
        getTeam: bulider.query<ITeamMember[], void>({
            query: () => "/company/team/"
        })
    })
})
export const { useGetCompanyInfoQuery, useGetCompanyMainQuery, useGetTeamQuery } = companyApi