"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { useGetWishlistQuery } from "../../../services/wishlistApi";
import { useGetCartsQuery } from "../../../services/cartApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProductSearch } from "../../hooks/useProductSearch";
import { formatPrice } from "../../../lib/site-config";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface UserData { username: string | null; avatar: string | null }

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const STORAGE_KEYS = {
  user: ["user", "userInfo", "userData", "currentUser", "profile"],
  token: ["access", "access_token", "accessToken", "token"],
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getUserDataFromStorage = (): UserData => {
  try {
    for (const key of STORAGE_KEYS.user) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const p = JSON.parse(raw);
        const username =
          p.username || p.first_name || p.name || p.full_name ||
          (p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : null) ||
          p.email || null;
        const avatar = p.avatar || p.avatar_url || p.profile_image || p.image || p.photo || null;
        return { username, avatar };
      } catch { return { username: raw, avatar: null }; }
    }
  } catch { }
  return { username: null, avatar: null };
};

const checkIsLoggedIn = (): boolean => {
  try { return STORAGE_KEYS.token.some(k => !!localStorage.getItem(k)); }
  catch { return false; }
};

const getInitials = (name: string | null): string => {
  if (!name) return "U";
  const p = name.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
};

function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[#c5c9d0] font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─────────────────────────────────────────────
// UserAvatar
// ─────────────────────────────────────────────
interface UserAvatarProps { avatar: string | null; username: string | null; size?: "sm" | "md" | "lg" }
const UserAvatar = ({ avatar, username, size = "md" }: UserAvatarProps) => {
  const sz = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" }[size];
  if (avatar) return (
    <div className={`${sz} rounded-full overflow-hidden border-2 border-blue-100 shrink-0`}>
      <Image src={avatar} alt={username || "avatar"} width={40} height={40} className="w-full h-full object-cover" />
    </div>
  );
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shrink-0 border-2 border-blue-100`}>
      {getInitials(username)}
    </div>
  );
};

// ─────────────────────────────────────────────
// NavIcon
// ─────────────────────────────────────────────
interface NavIconProps { href: string; icon: React.ReactNode; label: string; badge?: number | string; className?: string }
const NavIcon = ({ href, icon, label, badge, className = "" }: NavIconProps) => (
  <Link href={href} aria-label={label} className={`flex flex-col items-center text-[#d4d4d4] transition-colors hover:text-white ${className}`}>
    <div className="relative">
      {icon}
      {badge !== undefined && badge !== "" && (
        <span className="absolute -top-1 -right-2 min-w-[18px] rounded-full border-2 border-black bg-[#c5c9d0] px-1.5 text-center text-[9px] text-black">
          {badge}
        </span>
      )}
    </div>
    <span className="text-[10px] mt-1 font-medium hidden md:block">{label}</span>
  </Link>
);

// ─────────────────────────────────────────────
// SearchBoxContent
// ─────────────────────────────────────────────
interface SearchBoxProps { isMobile?: boolean }

function SearchBoxContent({ isMobile = false }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUrlSearchRef = useRef<string>("");

  const { products: results, isError: searchError, isFetching: searchFetching, refetch: refetchSearch } = useProductSearch(searchQuery);

  useEffect(() => {
    if (selected || searchQuery.trim().length < 2 || (!searchError && !searchFetching && results.length === 0)) return;
    const timeoutId = window.setTimeout(() => setIsOpen(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, [results, searchError, searchFetching, selected, searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Faqat URL'dagi "search" parametri TASHQARIDAN (masalan "Tozalash" havolasi orqali)
  // bo'shatilganda inputni tozalaydi. inputValue endi dependency emas, shuning uchun
  // foydalanuvchi yozayotganda bu effekt ishga tushmaydi va inputni to'sib qo'ymaydi.
  useEffect(() => {
    if (pathname !== "/katalog") {
      prevUrlSearchRef.current = "";
      return;
    }
    const urlSearch = urlSearchParams.get("search") || "";
    if (urlSearch === "" && prevUrlSearchRef.current !== "") {
      setInputValue("");
      setSearchQuery("");
      setSelected(false);
      setIsOpen(false);
    }
    prevUrlSearchRef.current = urlSearch;
  }, [urlSearchParams, pathname]);

  const handleChange = (val: string) => {
    setInputValue(val);
    setSelected(false);

    if (val.trim().length >= 2) {
      setSearchQuery(val);
    } else {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    setIsOpen(false);
    setSelected(false);
    inputRef.current?.focus();

    if (pathname === "/katalog") {
      router.push("/katalog");
    }
  };

  const handleSubmit = () => {
    setIsOpen(false);
    setSelected(true);
    const trimmed = inputValue.trim();

    if (!trimmed) {
      router.push("/katalog");
      return;
    }

    router.push(`/katalog?search=${encodeURIComponent(trimmed)}`);
  };

  const handleFocus = () => {
    if (!selected && searchQuery.trim().length >= 2 && (results.length > 0 || searchError || searchFetching)) {
      setIsOpen(true);
    }
  };

  const showClear = inputValue.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={`flex items-center border border-[#3a3a3a] rounded-xl bg-[#111] overflow-hidden ${isMobile ? "h-11" : "h-10"}`}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => handleChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229 && handleSubmit()}
          placeholder="Mahsulot qidirish..."
          className="w-full min-w-0 px-3 outline-none text-sm h-full"
        />

        {showClear && (
          <button
            onMouseDown={e => { e.preventDefault(); handleClear(); }}
            className="px-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            tabIndex={-1}
            aria-label="Tozalash"
          >
            <IoClose size={18} />
          </button>
        )}

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] px-4 h-full shrink-0 flex items-center justify-center text-black transition-colors hover:brightness-110"
          aria-label="Qidirish"
        >
          <FaSearch size={14} />
        </button>
      </div>

      {isOpen && searchQuery.trim().length >= 2 && (
        <div
          className={`absolute top-full left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-b-md z-[1100] overflow-hidden flex flex-col ${isMobile ? "max-h-[60vh]" : "max-h-[420px]"
            }`}
        >
          {searchError ? (
            <div role="alert" className="px-5 py-6 text-center text-sm text-muted-foreground">
              <p>Qidiruv natijalarini yuklab bo&apos;lmadi.</p>
              <button type="button" onClick={() => void refetchSearch()} className="mt-2 font-semibold text-primary hover:underline">Qayta urinish</button>
            </div>
          ) : searchFetching && results.length === 0 ? (
            <p role="status" className="px-5 py-8 text-center text-sm text-muted-foreground">Qidirilmoqda...</p>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              <FaSearch className="mx-auto mb-2 text-gray-300" size={22} />
              <p>«{searchQuery}» bo&apos;yicha mahsulot topilmadi</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Mahsulotlar</span>
                <span className="text-[11px] text-[#c5c9d0] font-semibold">{results.length} ta topildi</span>
              </div>

              <div className="overflow-y-auto flex-1">
                {results.map(product => (
                  <Link
                    key={product.id}
                    href={`/detail/${product.id}`}
                    onClick={() => { setIsOpen(false); setSelected(true); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors group"
                  >
                    <div className="w-11 h-11 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} width={44} height={44} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FaSearch size={14} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                        {highlightMatch(product.name, searchQuery)}
                      </p>
                      {product.category && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{product.category}</p>
                      )}
                    </div>

                    {product.price != null && (
                      <span className="text-sm font-bold text-[#c5c9d0] whitespace-nowrap shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchBox({ isMobile = false }: SearchBoxProps) {
  return (
    <Suspense fallback={<div className="w-full h-10 bg-gray-100 animate-pulse rounded-sm" />}>
      <SearchBoxContent isMobile={isMobile} />
    </Suspense>
  );
}

// ─────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: null, avatar: null });

  const { data: wishlist = [] } = useGetWishlistQuery();
  const { data: cart = [] } = useGetCartsQuery();
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity ?? 0), 0);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSidebarOpen]);

  const refreshAuth = useCallback(() => {
    const ok = checkIsLoggedIn();
    setIsLoggedIn(ok);
    setUserData(ok ? getUserDataFromStorage() : { username: null, avatar: null });
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(refreshAuth, 0);
    window.addEventListener("storage", refreshAuth);
    window.addEventListener("authChange", refreshAuth);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("storage", refreshAuth);
      window.removeEventListener("authChange", refreshAuth);
    };
  }, [refreshAuth]);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeSidebar, isSidebarOpen]);
  const navLinks = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/katalog", label: "Mahsulotlar" },
    { href: "/yetkazib-berish", label: "Yetkazib berish" },
    { href: "/tolov", label: "To'lov" },
    { href: "/aloqa", label: "Aloqa" },
  ];

  return (
    <>
    <header className="sticky top-0 z-[1000] w-full border-b border-[#2a2a2a] bg-black text-[#d4d4d4] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1508px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <button type="button" onClick={openSidebar} className="flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#c5c9d0] md:hidden" aria-label="Menyuni ochish" aria-expanded={isSidebarOpen}>
          <IoMenu size={23} />
        </button>
        <Link href="/" aria-label="Bosh sahifa" className="shrink-0">
          <Image src="/logo.png" alt="Islomx7 logo" width={320} height={100} priority className="h-9 w-auto object-contain md:h-11" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex" aria-label="Asosiy navigatsiya">
          {navLinks.map(({ href, label }) => <Link key={href} href={href} className={`text-sm font-medium transition-colors hover:text-white ${pathname === href ? "text-white" : "text-[#a3a3a3]"}`}>{label}</Link>)}
        </nav>
        <div className="flex shrink-0 items-center gap-3 md:gap-5">
          <NavIcon href="/wishlist" icon={<FaHeart size={19} />} label="Saralangan" badge={wishlist.length || ""} />
          <NavIcon href="/savatcha" icon={<FaShoppingCart size={20} />} label="Savat" badge={cartCount || ""} />
          <Link href="/kirish" aria-label={isLoggedIn ? "Shaxsiy hisob" : "Kirish"} className="flex flex-col items-center gap-1 text-[#d4d4d4] hover:text-white">
            {isLoggedIn ? <UserAvatar avatar={userData.avatar} username={userData.username} size="sm" /> : <FaUser size={18} />}
            <span className="hidden text-[10px] md:block">{isLoggedIn ? "Hisob" : "Kirish"}</span>
          </Link>
        </div>
      </div>
      <div className={`fixed inset-0 z-[1100] bg-black/70 transition-opacity md:hidden ${isSidebarOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`} aria-hidden={!isSidebarOpen}>
        <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={closeSidebar} aria-label="Menyuni yopish" />
        <aside className={`absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col border-r border-[#292929] bg-[#090909] p-5 shadow-2xl transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="Mobil navigatsiya" role="dialog" aria-modal="true">
          <div className="mb-6 flex items-center justify-between">
            <Image src="/logo.png" alt="Islomx7 logo" width={260} height={80} className="h-9 w-auto" />
            <button type="button" onClick={closeSidebar} aria-label="Menyuni yopish" className="rounded-lg p-2 hover:bg-white/10"><IoClose size={22} /></button>
          </div>
          <nav className="flex flex-col" aria-label="Mobil navigatsiya">
            {navLinks.map(({ href, label }) => <Link key={href} href={href} onClick={closeSidebar} className="border-b border-[#222] py-4 text-sm font-medium hover:text-white">{label}</Link>)}
            <Link href="/wishlist" onClick={closeSidebar} className="border-b border-[#222] py-4 text-sm font-medium hover:text-white">Saralangan</Link>
            <Link href="/kirish" onClick={closeSidebar} className="py-4 text-sm font-medium hover:text-white">{isLoggedIn ? "Shaxsiy hisob" : "Kirish"}</Link>
          </nav>
        </aside>
      </div>
    </header>
    <div className="border-b border-[#222] bg-black px-4 pb-3 md:px-6"><div className="mx-auto max-w-[1508px]"><SearchBox /></div></div>
    </>
  );
}
