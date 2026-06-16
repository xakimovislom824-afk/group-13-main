"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import vozrat1 from "../src/assets/imgs/vozrat1.png";
import vozrat2 from "../src/assets/imgs/vozrat2.png";

import { useSendFeedbackMutation, useGetFeedbacksQuery } from "../../services/feedbackApi";

const subscribeSchema = z.object({
  subscribeEmail: z.string().min(1, "Email kiritilishi shart").email("Noto'g'ri email format"),
  privacyConsent: z.boolean().refine((val) => val === true, { message: "Rozilik berish shart" }),
});

const commentSchema = z.object({
  name: z.string().min(2, "Ismingiz kamida 2 ta harf bo'lishi kerak"),
  email: z.string().min(1, "Email kiritilishi shart").email("Noto'g'ri email format"),
  comment: z.string().min(10, "Fikr matni kamida 10 ta belgidan iborat bo'lishi kerak"),
  agree: z.boolean().refine((val) => val === true, { message: "Maxfiylik siyosatiga rozilik berish shart" }),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;
type CommentFormData = z.infer<typeof commentSchema>;

interface SelectedFile {
  file: File;
  url: string;
}

function getPages(cur: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (cur > 4) pages.push("...");
  const start = Math.max(2, cur - 1);
  const end = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (cur < total - 3) pages.push("...");
  pages.push(total);
  return pages;
}

const ITEMS_PER_PAGE = 10;

export default function FikrlarSahifasi() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeSort, setActiveSort] = useState<"new" | "old">("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const { data: feedbacks = [], isLoading: feedbacksLoading } = useGetFeedbacksQuery();

  const sorted = [...feedbacks].sort((a, b) => {
    if (activeSort === "new") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const [sendFeedback, { isLoading, isSuccess, isError, error, reset: resetMutation }] =
    useSendFeedbackMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { subscribeEmail: "", privacyConsent: false },
  });

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { name: "", email: "", comment: "", agree: false },
  });

  const onSubscribe = async (data: SubscribeFormData) => {
    await new Promise((res) => setTimeout(res, 1000));
    setIsSubscribed(true);
    reset();
  };

  const onCommentSubmit = async (data: CommentFormData) => {
    resetMutation();
    try {
      await sendFeedback({
        name: data.name,
        email: data.email,
        message: data.comment,
        title: `${data.name} fikri`,
        category: "suggestion",
        rating: 5,
      }).unwrap();
      resetComment();
      // Object URL larni tozalash
      selectedFiles.forEach((item) => URL.revokeObjectURL(item.url));
      setSelectedFiles([]);
      setCurrentPage(1);
    } catch (_) {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const withUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...withUrls]);
    // Bir xil faylni qayta yuklash uchun inputni tozalash
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[index].url); // Memory leak oldini olish
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D]">
      <div className="w-full border-t-[3px] border-[#1A73E8]">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center gap-2 text-[11px] text-gray-400">
          <Link href="/" className="hover:text-blue-500 border-b border-dotted border-gray-400 leading-none">
            Stroyoptorg
          </Link>
          <span className="text-gray-300">::</span>
          <span className="text-gray-400 leading-none">Fikrlar</span>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-6">
            Fikrlar
            {feedbacks.length > 0 && (
              <span className="ml-3 text-sm font-normal text-gray-400">({feedbacks.length} ta)</span>
            )}
          </h1>

          <div className="flex gap-4 mb-8 text-[12px]">
            <button
              onClick={() => { setActiveSort("new"); setCurrentPage(1); }}
              className={`${activeSort === "new" ? "text-blue-600 underline" : "text-gray-400"} hover:text-blue-500`}
            >
              Avval yangilari
            </button>
            <button
              onClick={() => { setActiveSort("old"); setCurrentPage(1); }}
              className={`${activeSort === "old" ? "text-blue-600 underline" : "text-gray-400"} hover:text-blue-500`}
            >
              Avval eskilarini
            </button>
          </div>

          {/* Loading skeleton */}
          {feedbacksLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-32 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-20 mb-4" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {/* Fikrlar ro'yxati */}
          {!feedbacksLoading && (
            <div className="space-y-6">
              {paginated.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">
                  Hali fikrlar yo'q. Birinchi bo'lib yozing!
                </p>
              ) : (
                paginated.map((review) => (
                  <div key={review.id} className="border border-gray-100 rounded-sm p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[15px] text-[#2D2D2D]">{review.name}</h3>
                      {review.rating > 0 && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mb-3">
                      {new Date(review.created_at).toLocaleDateString("uz-UZ")}
                    </div>
                    {review.title && (
                      <p className="text-[13px] font-semibold text-[#2D2D2D] mb-1">{review.title}</p>
                    )}
                    <p className="text-[13px] leading-[1.6] text-[#333]">{review.message}</p>
                    {review.admin_response && (
                      <div className="mt-4 bg-blue-50 border-l-2 border-blue-400 p-3 rounded-sm">
                        <p className="text-[11px] font-bold text-blue-600 mb-1">Admin javobi:</p>
                        <p className="text-[12px] text-blue-700">{review.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[12px] text-gray-400 flex items-center gap-1 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Orqaga
              </button>

              {getPages(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400 text-[12px]">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center text-[12px] rounded-sm transition-colors ${
                      currentPage === page ? "bg-[#1A202C] text-white" : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-[12px] text-gray-400 flex items-center gap-1 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Keyingisi <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* FIKR QOLDIRISH FORMASI */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-[#1A202C] mb-8">Fikr qoldirish</h2>

            {isSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-6">
                <CheckCircle size={18} />
                Fikringiz muvaffaqiyatli yuborildi! Sahifada ko'rinib qoldi.
              </div>
            )}

            {isError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-6">
                <AlertCircle size={18} />
                {(error as any)?.data?.detail ||
                  JSON.stringify((error as any)?.data) ||
                  "Xabar yuborishda xatolik yuz berdi"}
              </div>
            )}

            <form onSubmit={handleCommentSubmit(onCommentSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-700">
                    Ismingiz <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...registerComment("name")}
                    type="text"
                    disabled={isLoading}
                    className={`w-full border p-3 text-sm outline-none rounded-sm bg-[#FBFBFB] disabled:opacity-50 ${
                      commentErrors.name ? "border-red-500" : "border-gray-200 focus:border-blue-400"
                    }`}
                    placeholder="Ismingizni kiriting"
                  />
                  {commentErrors.name && (
                    <p className="text-red-500 text-[10px]">{commentErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...registerComment("email")}
                    type="email"
                    disabled={isLoading}
                    className={`w-full border p-3 text-sm outline-none rounded-sm bg-[#FBFBFB] disabled:opacity-50 ${
                      commentErrors.email ? "border-red-500" : "border-gray-200 focus:border-blue-400"
                    }`}
                    placeholder="Elektron pochtangizni kiriting"
                  />
                  {commentErrors.email && (
                    <p className="text-red-500 text-[10px]">{commentErrors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700">
                  Fikr matni <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerComment("comment")}
                  rows={5}
                  disabled={isLoading}
                  className={`w-full border p-3 text-sm outline-none rounded-sm bg-[#FBFBFB] disabled:opacity-50 ${
                    commentErrors.comment ? "border-red-500" : "border-gray-200 focus:border-blue-400"
                  }`}
                  placeholder="Fikringizni yozing"
                />
                {commentErrors.comment && (
                  <p className="text-red-500 text-[10px]">{commentErrors.comment.message}</p>
                )}
              </div>

              {/* Rasm yuklash */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700">Rasm biriktirish:</label>
                <label className="border-2 border-dashed border-gray-200 rounded-sm p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={24} className="mb-2" />
                  <p className="text-[12px]">Faylni yuklash uchun bosing yoki shu yerga olib keling</p>
                  <p className="text-[11px] text-gray-300 mt-1">PNG, JPG, JPEG (max 5MB)</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* Preview — TO'G'RILANGAN QISM */}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFiles.map((item, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 border border-gray-200 rounded-sm overflow-hidden group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
                          <p className="text-white text-[9px] truncate">{item.file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-[#1E74D2] text-white px-10 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Yuborilmoqda...
                    </>
                  ) : (
                    "YUBORISH"
                  )}
                </button>
                <div className="flex flex-col">
                  <div className="flex items-start gap-2 max-w-md">
                    <input
                      {...registerComment("agree")}
                      type="checkbox"
                      className="mt-1 accent-blue-600"
                      id="form-agree"
                    />
                    <label htmlFor="form-agree" className="text-[10px] text-gray-400 leading-tight cursor-pointer">
                      Maxfiylik siyosatiga muvofiq shaxsiy ma'lumotlarni qayta ishlashga roziman
                    </label>
                  </div>
                  {commentErrors.agree && (
                    <p className="text-red-500 text-[10px] mt-1">{commentErrors.agree.message}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[350px] space-y-6">
          <div className="relative cursor-pointer border border-gray-50 rounded-sm overflow-hidden shadow-sm">
            <div className="relative h-[220px]">
              <Image src={vozrat1} alt="Isitish tizimlari" fill sizes="350px" className="object-cover" />
              <div className="absolute top-1/2 left-6 -translate-y-1/2 max-w-[140px]">
                <h3 className="font-bold text-[18px] leading-tight mb-2 text-gray-800">
                  Isitish tizimlari uchun hammasi
                </h3>
                <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">
                  -30% gacha
                </span>
              </div>
            </div>
          </div>

          <div className="relative cursor-pointer border border-gray-50 rounded-sm overflow-hidden shadow-sm">
            <div className="relative h-[220px]">
              <Image src={vozrat2} alt="Bo'yoqlar" fill sizes="350px" className="object-cover" />
              <div className="absolute top-1/2 left-6 -translate-y-1/2 max-w-[140px]">
                <h3 className="font-bold text-[18px] leading-tight mb-2 text-gray-800">
                  Lok-bo'yoq materiallari
                </h3>
                <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">
                  -30% gacha
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-md border border-gray-100 shadow-sm">
            <h4 className="text-[15px] font-bold mb-2 uppercase">Yangiliklarga obuna bo'ling</h4>
            <p className="text-[12px] text-gray-500 mb-4 leading-snug">
              Doimiy chegirmalar va kompaniya yangiliklaridan xabardor bo'ling.
            </p>
            {isSubscribed ? (
              <div className="text-green-600 text-sm font-medium py-2">Muvaffaqiyatli obuna bo'ldingiz!</div>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)}>
                <div className="mb-3">
                  <input
                    {...register("subscribeEmail")}
                    type="text"
                    placeholder="Email"
                    className={`w-full border p-3 rounded-sm text-[13px] outline-none transition-all ${
                      errors.subscribeEmail
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500 bg-white"
                    }`}
                  />
                  {errors.subscribeEmail && (
                    <p className="text-red-500 text-[10px] mt-1">{errors.subscribeEmail.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2472d1] text-white font-bold py-3 rounded-sm text-[12px] uppercase tracking-wider hover:bg-blue-700 transition-colors"
                >
                  Obuna bo'lish
                </button>
                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      {...register("privacyConsent")}
                      className="mt-1 accent-blue-600"
                    />
                    <label
                      htmlFor="privacy"
                      className={`text-[10px] leading-tight cursor-pointer select-none ${
                        errors.privacyConsent ? "text-red-500 font-medium" : "text-gray-400"
                      }`}
                    >
                      Maxfiylik siyosatiga muvofiq shaxsiy ma'lumotlarni qayta ishlashga roziman.
                    </label>
                  </div>
                  {errors.privacyConsent && (
                    <p className="text-red-500 text-[10px] mt-1">{errors.privacyConsent.message}</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}