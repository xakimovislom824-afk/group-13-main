import { IBlog } from "../Types/index.types";
import { baseApi } from "./baseApi";

const demoNews: IBlog[] = [
  {
    id: 1,
    title: "Yangi bino materiallari omborda",
    slug: "yangi-bino-materiallari-omborda",
    summary: "Yangi yil uchun eng talabgor qurilish materiallari va chegirmalar faollashtirildi.",
    content: "Bugungi kunda qurilish bozori tez sur'atlarda o'sib bormoqda. Bizning olimlarimiz va yetkazib beruvchilarimiz bilan birgalikda yangi yilga tayyorgarlik ko'rishda ko'plab innovatsion materiallar omborga keltirildi. Bu mahsulotlar sifat, narx va tezkor yetkazib berish jihatidan foydalanuvchilar ehtiyojlariga mos.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    published_at: "2026-09-01T10:00:00.000Z",
    created_at: "2026-09-01T10:00:00.000Z",
    updated_at: "2026-09-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Santexnika bo'limida yangi chegirmalar",
    slug: "santexnika-bo-limida-yangi-chegirmalar",
    summary: "Mijozlar uchun santexnika va sanitariya mahsulotlarida katta yillik chegirma boshlandi.",
    content: "Santexnika bo'limida mavsumiy chegirmalar davom etmoqda. Vanna, dolaba, quvur va armatura mahsulotlari uchun prefakturali narxlar taklif qilinmoqda. Har bir buyurtma uchun tezkor yetkazib berish va professional maslahat imkoni mavjud.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    published_at: "2026-08-22T09:00:00.000Z",
    created_at: "2026-08-22T09:00:00.000Z",
    updated_at: "2026-08-22T09:00:00.000Z",
  },
  {
    id: 3,
    title: "Elektr jihozlari bo'limiga yangi tovarlar keldi",
    slug: "elektr-jihozlari-bo-limiga-yangi-tovarlar-keldi",
    summary: "Energiya tejamkor va xavfsiz elektr asboblari omborda paydo bo'ldi.",
    content: "Elektr jihozlari bo'limida zamonaviy, qulay va energiya tejovchi mahsulotlar kiritildi. Bular orasida LED chiroqlar, uzatgichlar, elektr rozetkalar va himoya asboblari mavjud. Mahsulotlar sifat nazorati orqali tanlab olingan.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    published_at: "2026-08-10T12:30:00.000Z",
    created_at: "2026-08-10T12:30:00.000Z",
    updated_at: "2026-08-10T12:30:00.000Z",
  },
];

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<IBlog[], void>({
      queryFn: async () => ({ data: demoNews }),
    }),
    getNewsById: builder.query<IBlog, number>({
      queryFn: async (id) => {
        const news = demoNews.find((item) => item.id === id);
        if (!news) {
          return { error: { status: 404, data: "News not found" } };
        }
        return { data: news };
      },
    }),
  }),
});

export const { useGetNewsQuery, useGetNewsByIdQuery } = newsApi;  