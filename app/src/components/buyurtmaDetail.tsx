"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    FaChevronLeft, FaBoxOpen, FaTruck, FaCheckCircle,
    FaTimesCircle, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave
} from "react-icons/fa";

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

function StatusBadge({ status }: { status: string }) {
    const s = status.toUpperCase();
    let icon = <FaBoxOpen size={13} />;
    let cls = "bg-orange-50 text-orange-500 border-orange-200";

    if (s.includes("YETKAZILDI") || s.includes("BAJARILDI")) {
        icon = <FaCheckCircle size={13} />;
        cls = "bg-emerald-50 text-emerald-600 border-emerald-300";
    } else if (s.includes("BEKOR")) {
        icon = <FaTimesCircle size={13} />;
        cls = "bg-red-50 text-red-500 border-red-200";
    } else if (s.includes("YO'LDA") || s.includes("YOLDA")) {
        icon = <FaTruck size={13} />;
        cls = "bg-blue-50 text-blue-500 border-blue-200";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold uppercase ${cls}`}>
            {icon} {status}
        </span>
    );
}

export default function BuyurtmaDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [order, setOrder] = useState<SavedOrder | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const orderId = searchParams.get("id");
        if (!orderId) { setNotFound(true); return; }

        const raw = localStorage.getItem("userOrders");
        if (!raw) { setNotFound(true); return; }

        try {
            const orders: SavedOrder[] = JSON.parse(raw);
            const found = orders.find(o => o.id === orderId);
            if (found) setOrder(found);
            else setNotFound(true);
        } catch {
            setNotFound(true);
        }
    }, [searchParams]);

    if (notFound) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-5xl">📦</p>
                <p className="text-xl font-bold text-gray-700">Buyurtma topilmadi</p>
                <Link href="/kabinet?tab=orders" className="text-blue-500 text-sm hover:underline">
                    ← Buyurtmalarga qaytish
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const deliveryLabel: Record<string, string> = {
        pickup: "Olib ketish",
        delivery: "Yetkazib berish",
        post: "Pochta",
    };
    const paymentLabel: Record<string, string> = {
        card: "Kartadan",
        cash: "Naqd",
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <p className="text-xs text-gray-400 mb-2">
                    Bosh sahifa /{" "}
                    <Link href="/kabinet?tab=orders" className="hover:underline">Buyurtmalar</Link>
                    {" "}/ {order.id}
                </p>

                {/* Sarlavha */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.push("/kabinet?tab=orders")}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                            Buyurtma {order.id}
                        </h1>
                        <p className="text-sm text-gray-400 mt-0.5">{order.date}</p>
                    </div>
                    <div className="ml-auto">
                        <StatusBadge status={order.status} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* CHAP — Mahsulotlar */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <FaBoxOpen className="text-blue-500" size={16} />
                                <h2 className="font-bold text-gray-800">Buyurtma tarkibi</h2>
                                <span className="ml-auto text-xs text-gray-400 font-medium">
                                    {order.items.length} ta mahsulot
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 px-6 py-5">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 p-1.5">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="object-contain max-h-full max-w-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-gray-800 leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-[12px] text-gray-400 mt-1">
                                                {item.quantity} dona × {item.price.toLocaleString()} so'm
                                            </p>
                                        </div>
                                        <p className="text-[15px] font-bold text-blue-600 whitespace-nowrap">
                                            {(item.price * item.quantity).toLocaleString()} so'm
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Jami summa */}
                            <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Jami to'lov:</span>
                                <span className="text-xl font-black text-blue-600">
                                    {order.amount} so'm
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* O'NG — Ma'lumotlar */}
                    <div className="lg:w-[300px] space-y-4">

                        {/* Mijoz */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                                Mijoz ma'lumotlari
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ism</span>
                                    <span className="font-semibold text-gray-700">
                                        {order.customer.name} {order.customer.surname}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Telefon</span>
                                    <span className="font-semibold text-gray-700">{order.customer.phone}</span>
                                </div>
                                {order.customer.email && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Email</span>
                                        <span className="font-semibold text-gray-700 text-right break-all ml-2">
                                            {order.customer.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Yetkazib berish */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                                Yetkazib berish
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                    <FaMapMarkerAlt size={15} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {deliveryLabel[order.delivery] || order.delivery}
                                </span>
                            </div>
                        </div>

                        {/* To'lov */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                                To'lov usuli
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                                    {order.payment === "card"
                                        ? <FaCreditCard size={15} />
                                        : <FaMoneyBillWave size={15} />
                                    }
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {paymentLabel[order.payment] || order.payment}
                                </span>
                            </div>
                        </div>

                        {/* Qaytish tugmasi */}
                        <button
                            onClick={() => router.push("/kabinet?tab=orders")}
                            className="w-full py-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                        >
                            ← Buyurtmalarga qaytish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}