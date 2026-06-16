import { baseApi } from "./baseApi";

export interface IFeedbackPayload {
  category?: "suggestion" | "complaint" | "praise" | "question";
  rating?: number;
  title: string;
  message: string;
  email?: string;
  name: string;
  phone?: string;
  attachments?: string;
}

export interface IFeedbackResponse {
  id: number;
  category: "suggestion" | "complaint" | "praise" | "question";
  rating: number;
  title: string;
  message: string;
  email: string;
  name: string;
  phone: string;
  user: number;
  user_name: string;
  is_read: boolean;
  is_resolved: boolean;
  admin_response: string;
  attachments: string;
  created_at: string;
}

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation<IFeedbackResponse, IFeedbackPayload>({
      query: (body) => ({
        url: "/feedback/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"], // ← POST bo'lgach GET qayta ishlaydi
    }),
    getFeedbacks: builder.query<IFeedbackResponse[], void>({
      query: () => ({
        url: "/feedback/",
        method: "GET",
      }),
      providesTags: ["Feedback"], // ← bu listni kuzatadi
    }),
  }),
});

export const { useSendFeedbackMutation, useGetFeedbacksQuery } = feedbackApi;