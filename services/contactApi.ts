import { baseApi } from "./baseApi";

export interface IContactPayload {
  subject: string;
  message: string;
  sender_name: string;
  sender_email?: string;
  sender_phone: string;
  priority?: "low" | "medium" | "high";
}

export interface IContactReply {
  id: number;
  sender: number;
  sender_name: string;
  content: string;
  is_internal: boolean;
  attachments: string;
  created_at: string;
}

export interface IContactResponse {
  id: number;
  subject: string;
  message: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  user: number;
  user_name: string;
  status: "new" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  assigned_to: number;
  replies: IContactReply[];
  created_at: string;
  updated_at: string;
  resolved_at: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<IContactResponse, IContactPayload>({
      query: (body) => ({
        url: "/contact/",
        method: "POST",
        body,
      }),
    }),
    getContactMessages: builder.query<IContactResponse[], void>({
      query: () => ({
        url: "/contact/",
        method: "GET",
      }),
    }),
  }),
});

export const { useSendContactMessageMutation, useGetContactMessagesQuery } = contactApi;