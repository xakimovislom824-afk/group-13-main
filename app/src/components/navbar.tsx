"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { BarChart2 } from "lucide-react";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { useModal } from "../../context/ModalContext";
import { useGetWishlistQuery } from "../../../services/wishlistApi";
import { useGetCartsQuery } from "../../../services/cartApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProductSearch } from "../../hooks/useProductSearch";
import { categories, siteConfig } from "../../../lib/site-config";
import { useGetCompanyInfoQuery } from "../../../services/companyApi";

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

const topLinks = [
  { href: "/tolov", label: "To'lov" },
  { href: "/yetkazib-berish", label: "Yetkazib berish" },
  { href: "/fikrlar", label: "Fikrlar" },
  { href: "/blog", label: "Yangiliklar" },
  { href: "/aloqa", label: "Aloqa" },
];

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
      <span className="text-blue-600 font-bold">{text.slice(idx, idx + query.length)}</span>
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
  <Link href={href} className={`flex flex-col items-center hover:text-blue-600 transition-colors ${className}`}>
    <div className="relative">
      {icon}
      {badge !== undefined && badge !== "" && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] px-1.5 rounded-full border-2 border-white min-w-[18px] text-center">
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

  const results = useProductSearch(searchQuery);

  useEffect(() => {
    if (!selected && searchQuery.trim().length >= 2) {
      setIsOpen(true);
    }
  }, [results, selected, searchQuery]);

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

  const handleSelect = (name: string) => {
    setInputValue(name);
    setIsOpen(false);
    setSelected(true);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    const trimmed = inputValue.trim();

    if (!trimmed) {
      router.push("/katalog");
      return;
    }

    router.push(`/katalog?search=${encodeURIComponent(trimmed)}`);
  };

  const handleFocus = () => {
    if (!selected && searchQuery.trim().length >= 2 && results.length > 0) {
      setIsOpen(true);
    }
  };

  const showClear = inputValue.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={`flex items-center border-2 border-blue-600 rounded-sm overflow-hidden ${isMobile ? "h-11" : "h-10"}`}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => handleChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-full shrink-0 flex items-center justify-center transition-colors"
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
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              <FaSearch className="mx-auto mb-2 text-gray-300" size={22} />
              <p>«{searchQuery}» bo'yicha mahsulot topilmadi</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Mahsulotlar</span>
                <span className="text-[11px] text-blue-600 font-semibold">{results.length} ta topildi</span>
              </div>

              <div className="overflow-y-auto flex-1">
                {results.map(product => (
                  <div
                    key={product.id}
                    onMouseDown={e => { e.preventDefault(); handleSelect(product.name); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors group"
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
                      <span className="text-sm font-bold text-blue-700 whitespace-nowrap shrink-0">
                        {Number(product.price).toLocaleString("uz-UZ")} so'm
                      </span>
                    )}
                  </div>
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
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: null, avatar: null });

  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();
  const { data: cart } = useGetCartsQuery();
  const { data: companyInfo } = useGetCompanyInfoQuery();

  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, c) => {
        if (Array.isArray((c as any)?.items)) return sum + (c as any).items.length;
        if (c && ((c as any).product !== undefined || (c as any).product_data || (c as any).product_detail)) return sum + 1;
        return sum;
      }, 0)
    : Array.isArray((cart as any)?.items)
      ? (cart as any).items.length
      : 0;

  const updateNavbarHeight = useCallback(() => {
    if (navbarRef.current) setNavbarHeight(navbarRef.current.getBoundingClientRect().bottom);
  }, []);

  useEffect(() => {
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    window.addEventListener("scroll", updateNavbarHeight);
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      window.removeEventListener("scroll", updateNavbarHeight);
    };
  }, [updateNavbarHeight]);

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
    refreshAuth();
    window.addEventListener("storage", refreshAuth);
    window.addEventListener("authChange", refreshAuth);
    return () => {
      window.removeEventListener("storage", refreshAuth);
      window.removeEventListener("authChange", refreshAuth);
    };
  }, [refreshAuth]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    let themeMode = "light";

    try {
      const parsedTheme = savedTheme ? JSON.parse(savedTheme) : null;
      themeMode = parsedTheme?.mode === "dark" ? "dark" : "light";
    } catch {
      themeMode = savedTheme === "dark" ? "dark" : "light";
    }

    const dark = themeMode === "dark";
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", JSON.stringify({ mode: themeMode }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", JSON.stringify({ mode: next ? "dark" : "light" }));
      return next;
    });
  }, []);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);

  const sidebarLinks = useMemo(() => [
    { href: "/aksiyalar", label: "Barcha aksiyalar", icon: <FiGift size={20} /> },
    { href: "/tulov", label: "To'lov" },
    { href: "/yetkazibBerish", label: "Yetkazib berish" },
    { href: "/fikrlar", label: "Fikrlar" },
    { href: "/blog", label: "Yangiliklar" },
    { href: "/aloqa", label: "Aloqa" },
  ], []);

  return (
    <div ref={navbarRef} className="sticky top-0 z-[1000] w-full border-b border-[var(--border)] bg-[var(--surface)]">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--primary)] px-3 py-2 text-xs text-white sm:px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 lg:hidden">
            <button onClick={openSidebar} className="flex items-center gap-1.5" aria-label="Menyuni ochish">
              <IoMenu size={20} className="sm:hidden" />
              <IoMenu size={24} className="hidden sm:block" />
              <span className="whitespace-nowrap text-xs font-bold sm:text-sm">Menyu</span>
            </button>
          </div>
          <a href={`tel:${siteConfig.phone.replace(/[^+\\d]/g, "")}`} className="hidden font-semibold hover:text-[var(--accent)] sm:inline">{siteConfig.phone}</a>
          <span className="hidden text-white/75 md:inline">{siteConfig.hours}</span>
        </div>
        <nav className="hidden items-center gap-4 font-medium lg:flex" aria-label="Yordam havolalari">
          {topLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`transition-colors ${pathname === link.href ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <span aria-label="Tanlangan til: O'zbekcha" className="hidden font-semibold sm:inline">UZ</span>
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Yorug' rejimni yoqish" : "Tungi rejimni yoqish"}
            title={isDarkMode ? "Yorug' rejim" : "Tungi rejim"}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-[var(--accent)]"
          >
            {isDarkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>
          <button onClick={openModal} className="hidden cursor-pointer border-b border-dotted border-[var(--accent)] font-bold uppercase text-[10px] text-[var(--accent)] sm:block">
            Qo&apos;ng&apos;iroq qilishni so&apos;rang
          </button>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:gap-4 md:px-6">
        <Link href="/" aria-label="Islomx7 bosh sahifasi" className="flex shrink-0 items-center gap-2 text-[var(--primary)]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]"><FaShoppingCart size={20} /></span>
          <span className="font-heading text-xl font-extrabold tracking-tight md:text-2xl">Islomx7</span>
        </Link>
        <details className="group relative hidden shrink-0 sm:block">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[10px] bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--primary)] hover:bg-[var(--accent-hover)]">
            Katalog <span aria-hidden="true">⌄</span>
          </summary>
          <div className="absolute left-0 top-full z-[1100] mt-2 grid w-[min(90vw,520px)] grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
            {categories.map((category) => <Link key={category.href} href={category.href} className="rounded-lg px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--secondary-soft)] hover:text-[var(--primary)]">{category.label}</Link>)}
          </div>
        </details>

        {/* Desktop SearchBox */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <SearchBox />
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-gray-500">
          <NavIcon href="/aksiyalar" icon={<FiGift size={20} />} label="Barcha aksiyalar" className="hidden lg:flex ml-6" />
          <NavIcon href="/wishlist" icon={<FaHeart size={20} />} label="Saralangan" badge={wishlist.length || ""} />
          <NavIcon href="/savatcha" icon={<FaShoppingCart size={20} />} label="Savat" badge={cartCount || ""} />
          {isLoggedIn ? (
            <Link href="/kabnet" className="flex flex-col items-center hover:text-blue-600 transition-colors group">
              <UserAvatar avatar={userData.avatar} username={userData.username} size="md" />
              <span className="text-[10px] mt-1 font-medium hidden md:block text-center truncate max-w-[80px] group-hover:text-blue-600">
                {userData.username || "Shaxsiy hisob"}
              </span>
            </Link>
          ) : (
            <Link href="/kirish" className="flex flex-col items-center hover:text-blue-600 transition-colors">
              <FaUser size={20} />
              <span className="text-[10px] mt-1 font-medium hidden md:block">Kirish</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── MOBILE SEARCH ── */}
      <div className="flex md:hidden items-center px-3 sm:px-4 pb-4">
        <div className="flex-1 min-w-0">
          <SearchBox isMobile />
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className={`fixed inset-0 bg-black/60 z-[2000] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
          <div className="flex justify-between items-center p-4 border-b bg-white shrink-0">
            <span className="font-bold text-[18px] text-gray-800">Menyu</span>
            <button onClick={closeSidebar} className="p-1 bg-gray-100 rounded-md text-blue-600" aria-label="Menyuni yopish">
              <IoClose size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col">
              {sidebarLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={closeSidebar}
                  className={`p-4 border-b flex items-center ${l.icon ? "gap-3 text-gray-800 font-medium" : "text-gray-700 uppercase text-[13px] font-bold"} ${pathname === l.href ? "text-red-600 bg-red-50" : "hover:bg-gray-50"}`}>
                  {l.icon && <span className="text-gray-400">{l.icon}</span>}
                  {l.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link href="/kabnet" onClick={closeSidebar} className="p-4 border-b flex items-center gap-3 text-gray-700 hover:bg-gray-50">
                  <UserAvatar avatar={userData.avatar} username={userData.username} size="lg" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold uppercase">Shaxsiy hisob</span>
                    {userData.username && <span className="text-blue-600 text-[12px] font-medium truncate">{userData.username}</span>}
                  </div>
                </Link>
              ) : (
                <Link href="/kirish" onClick={closeSidebar} className="p-4 border-b flex items-center text-gray-700 uppercase text-[13px] font-bold hover:bg-gray-50">
                  Kirish
                </Link>
              )}
            </nav>
            <div className="p-6 text-center border-t mt-4 mb-8">
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Yorug' rejimni yoqish" : "Tungi rejimni yoqish"}
                className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <FiSun size={21} /> : <FiMoon size={21} />}
              </button>
              <button onClick={openModal} className="w-full py-4 px-4 bg-[#f0f4f8] text-blue-600 font-bold rounded-md uppercase text-[13px] tracking-widest mb-3">
                Qo'ng'iroq qilishni so'rang
              </button>
              <div className="text-[13px] text-gray-500 italic">Har kuni, 8:00 dan 18:00 gacha</div>
            </div>
          </div>
        </div>
        <div className="w-full h-full" onClick={closeSidebar} />
      </div>

    </div>
  );
}
