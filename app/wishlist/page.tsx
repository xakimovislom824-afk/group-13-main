"use client";

import React from "react";
import ProductCard from "../../components/ProductCard"; // ✅ path ni o'zgartiring
import { useGetWishlistQuery } from "../../services/wishlistApi";
import { Heart } from "lucide-react";

function Wishlist() {
  const { data: wishlists = [], isLoading } = useGetWishlistQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (wishlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Heart className="w-14 h-14 text-gray-200 mb-4" />
        <p className="text-gray-400 text-sm font-medium">Saralanganlar hozircha bo'sh</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wishlists.map((wishlist) => (
        <ProductCard
          key={wishlist.id}
          product={wishlist.product_detail}
        />
      ))}
    </div>
  );
}

export default Wishlist;
