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

const readFeedbacks = (): IFeedbackResponse[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("feedbacks") || "[]");
  } catch {
    return [];
  }
};

const writeFeedbacks = (items: IFeedbackResponse[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("feedbacks", JSON.stringify(items));
  }
};

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation<IFeedbackResponse, IFeedbackPayload>({
      queryFn: async (body) => {
        try {
          const list = readFeedbacks();
          const item: IFeedbackResponse = {
            id: Date.now(),
            category: body.category || "suggestion",
            rating: body.rating || 5,
            title: body.title || `${body.name} fikri`,
            message: body.message,
            email: body.email || "",
            name: body.name,
            phone: body.phone || "",
            user: 0,
            user_name: body.name,
            is_read: false,
            is_resolved: false,
            admin_response: "",
            attachments: body.attachments || "",
            created_at: new Date().toISOString(),
          };

          const next = [item, ...list];
          writeFeedbacks(next);
          return { data: item };
        } catch (error: any) {
          return { error: { status: 500, data: error?.message || "Feedback sending failed" } };
        }
      },
      invalidatesTags: ["Feedback"],
    }),
    getFeedbacks: builder.query<IFeedbackResponse[], void>({
      queryFn: async () => ({ data: readFeedbacks() }),
      providesTags: ["Feedback"],
    }),
  }),
});

export const { useSendFeedbackMutation, useGetFeedbacksQuery } = feedbackApi;