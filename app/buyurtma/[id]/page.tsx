"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaChevronLeft, FaBoxOpen } from "react-icons/fa";

type OrderItem = {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
};

type SavedOrder = {
    id: string;
    date: string;
    status: string;
    amount: string;
    items: OrderItem[];
    delivery: string;
    payment: string;
    customer: {
        name: string;
        surname: string;
        phone: string;
        email: string;
    };
};

const deliveryLabels: Record<string, string> = {
    pickup: "Olib ketish",
    delivery: "Yetkazib berish",
    post: "Pochta",
};

const paymentLabels: Record<string, string> = {
    card: "Kartadan",
    cash: "Naqd",
};

function getStatusStyles(status: string) {
    const s = status.toUpperCase();
    if (s.includes("YETKAZILDI") || s.includes("BAJARILDI"))
        return "border-emerald-400 text-emerald-600 bg-emerald-50";
    if (
        s.includes("JARAYONDA") ||
        s.includes("KUTILMOQDA") ||
        s.includes("YO'LDA")
    )
        return "border-orange-300 text-orange-500 bg-orange-50";
    if (s.includes("BEKOR")) return "border-red-300 text-red-500 bg-red-50";
    return "border-blue-300 text-blue-500 bg-blue-50";
}

export default function BuyurtmaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<SavedOrder | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem("userOrders");
        if (!raw) { setNotFound(true); return; }
        try {
            const orders: SavedOrder[] = JSON.parse(raw);
            // URL da "#" belgisi bo'lishi mumkin, shuning uchun ikkalasini tekshiramiz
            const rawId = decodeURIComponent(params.id as string);
            const found = orders.find(
                (o) => o.id === rawId || o.id === `#${rawId}` || o.id.replace("#", "") === rawId
            );
            if (found) setOrder(found);
            else setNotFound(true);
        } catch {
            setNotFound(true);
        }
    }, [params.id]);

    if (notFound) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] flex flex-col items-center justify-center gap-4">
                <FaBoxOpen size={48} className="text-gray-300" />
                <p className="text-gray-500 text-lg font-medium">Buyurtma topilmadi</p>
                <Link
                    href="/shaxsiy-kabinet?tab=orders"
                    className="text-blue-500 text-sm font-semibold hover:underline"
                >
                    ← Buyurtmalarga qaytish
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
                <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const finalAmount = Number(order.amount.replace(/\s/g, "").replace(/,/g, ""));

    return (
        <div className="min-h-screen bg-[#f5f7fb] py-10">
            <div className="max-w-4xl mx-auto px-4">

                {/* Breadcrumb */}
                <button
                    onClick={() => router.push("/kabnet")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
                >
                    <FaChevronLeft size={12} />
                    Buyurtmalarga qaytish
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">
                            Buyurtma {order.id}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">{order.date}</p>
                    </div>
                    <span
                        className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold uppercase self-start sm:self-auto ${getStatusStyles(order.status)}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {order.status}
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* CHAP — Mahsulotlar */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800">
                                    Buyurtma tarkibi
                                    <span className="ml-2 text-sm font-normal text-gray-400">
                                        ({order.items.length} ta mahsulot)
                                    </span>
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 px-6 py-5"
                                    >
                                        {/* Rasm */}
                                        <div className="w-18 h-18 w-[72px] h-[72px] bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0 p-2">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="object-contain max-h-full max-w-full"
                                                />
                                            ) : (
                                                <FaBoxOpen className="text-gray-300 text-2xl" />
                                            )}
                                        </div>

                                        {/* Ma'lumot */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 leading-snug mb-1 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {item.quantity} dona ×{" "}
                                                {item.price.toLocaleString()} so'm
                                            </p>
                                        </div>

                                        {/* Narx */}
                                        <p className="text-[15px] font-bold text-blue-600 whitespace-nowrap shrink-0">
                                            {(item.price * item.quantity).toLocaleString()} so'm
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Jami */}
                            <div className="px-6 py-4 border-t border-dashed border-gray-200 bg-gray-50/50 space-y-2">
                                {subtotal !== finalAmount && (
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Chegirma</span>
                                        <span className="font-medium text-green-600">
                                            -{(subtotal - finalAmount).toLocaleString()} so'm
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                    <span className="text-base font-bold text-gray-800">Jami to'lov</span>
                                    <span className="text-xl font-black text-blue-600">
                                        {order.amount} so'm
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* O'NG — Tafsilotlar */}
                    <div className="lg:w-[280px] space-y-4">

                        {/* Yetkazib berish */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                                Yetkazib berish
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Usul</span>
                                    <span className="font-semibold text-gray-800">
                                        {deliveryLabels[order.delivery] ?? order.delivery}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* To'lov */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                                To'lov
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Usul</span>
                                <span className="font-semibold text-gray-800">
                                    {paymentLabels[order.payment] ?? order.payment}
                                </span>
                            </div>
                        </div>

                        {/* Mijoz */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                                Mijoz ma'lumotlari
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between gap-2">
                                    <span className="text-gray-500 shrink-0">Ism</span>
                                    <span className="font-semibold text-gray-800 text-right">
                                        {order.customer.name} {order.customer.surname}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-gray-500 shrink-0">Telefon</span>
                                    <span className="font-semibold text-gray-800 text-right">
                                        +{order.customer.phone}
                                    </span>
                                </div>
                                {order.customer.email && (
                                    <div className="flex justify-between gap-2">
                                        <span className="text-gray-500 shrink-0">Email</span>
                                        <span className="font-semibold text-gray-800 text-right break-all">
                                            {order.customer.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}