import { useState, useEffect } from "react";
import { useGetProductsQuery } from "../../services/productApi";
import { IProduct } from "../../Types/index.types";

// Qidiruv natijasida kerak bo'ladigan maydonlar
export interface SearchProduct {
    id: number;
    name: string;
    price: number;
    image?: string;
    category?: number;
}

export function useProductSearch(query: string) {
    // API dan barcha mahsulotlarni olamiz
    const { data: products = [] } = useGetProductsQuery();

    // Filtrlangan natijalarni saqlash uchun state
    const [results, setResults] = useState<SearchProduct[]>([]);

    useEffect(() => {
        // Foydalanuvchi yozishni tugatishini 250ms kutamiz
        const timer = setTimeout(() => {
            // Agar query bo'sh yoki 2 ta harfdan kam bo'lsa
            if (!query || query.trim().length < 2) {
                setResults([]);
                return;
            }

            // Qidiruvni kichik harflarda qilamiz
            const lower = query.toLowerCase();

            const matched: SearchProduct[] = (products as IProduct[])
                // Nomi query ga mos mahsulotlarni olamiz
                .filter((p) =>
                    p.name.toLowerCase().includes(lower)
                )

                // Maksimal 8 ta mahsulot chiqaramiz
                .slice(0, 8)

                // Faqat kerakli maydonlarni qaytaramiz
                .map((p) => ({
                    id: p.id,
                    name: p.name,

                    // price string bo'lgani uchun number ga aylantiramiz
                    price: Number(p.price),

                    image: p.image,

                    // category sizning IProduct da number
                    category: p.category,
                }));

            // Natijalarni state ga saqlaymiz
            setResults(matched);
        }, 250);

        // Query o'zgarsa eski timer ni tozalaymiz
        return () => clearTimeout(timer);
    }, [query, products]);

    return results;
}
