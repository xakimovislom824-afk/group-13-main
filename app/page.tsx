"use client";



import Image from "next/image";

import { BarChart2, ChevronLeft, ChevronRight, CreditCard, Heart, Package, Percent, ShoppingCart, Truck } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import Carousel from "../components/Carousel";
import HomAksiya from "../components/homAksiya";
import Tabs1 from "../components/engKopSotilganlar";
import Tabs2 from "../components/engYaxshiTakliflar";
import MashhurBrendlar from "../components/brendlar";
import SungiYangliklar from "../components/homYanglik";

export default function Home() {
  return (
    <div>
      <Carousel />

      <div className="grid grid-cols-2 m-5 md:grid-cols-4 gap-y-6 gap-x-4 mb-8 border-b pb-8 mt-6">
        {/* 1. To'lov */}
        <div className="flex items-start gap-3 text-gray-700">
          <CreditCard size={24} className="text-blue-500 shrink-0" />
          <span className="text-[13px] sm:text-sm font-medium leading-tight">
            Istalgan usulda to'lov
          </span>
        </div>

        {/* 2. Tanlov */}
        <div className="flex items-start gap-3 text-gray-600">
          <Package size={24} className="text-blue-500 shrink-0" />
          <span className="text-[13px] sm:text-sm font-medium leading-tight">
            Katalogda keng tanlov
          </span>
        </div>

        {/* 3. Yetkazib berish */}
        <div className="flex items-start gap-3 text-gray-600">
          <Truck size={24} className="text-blue-500 shrink-0" />
          <span className="text-[13px] sm:text-sm font-medium leading-tight">
            Tezkor yetkazib berish
          </span>
        </div>

        {/* 4. Chegirmalar */}
        <div className="flex items-start gap-3 text-gray-600">
          <Percent size={24} className="text-blue-500 shrink-0" />
          <span className="text-[13px] sm:text-sm font-medium leading-tight">
            Yirik xaridlar uchun chegirmalar
          </span>
        </div>
      </div>
      

      <HomAksiya />
      <Tabs1 />
      <MashhurBrendlar />
      <Tabs2 />
      <SungiYangliklar />

    </div>
  );
}
