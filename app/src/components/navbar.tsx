"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo, useRef, useSyncExternalStore, Suspense } from "react";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import BrandLogo from "./BrandLogo";
import { useModal } from "../../context/ModalContext";
import { useGetWishlistQuery } from "../../../services/wishlistApi";
import { useGetCartsQuery } from "../../../services/cartApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProductSearch } from "../../hooks/useProductSearch";
import { formatPrice } from "../../../lib/site-config";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../../../services/categoryApi";

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

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

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
  <Link href={href} aria-label={label} className={`flex flex-col items-center hover:text-[var(--secondary)] transition-colors ${className}`}>
    <div className="relative">
      {icon}
      {badge !== undefined && badge !== "" && (
        <span className="absolute -right-2 -top-1 min-w-[18px] rounded-full border-2 border-[var(--surface)] bg-red-600 px-1.5 text-center text-[9px] text-white">
          {badge}
        </span>
      )}
    </div>
    <span className="mt-1 hidden text-[10px] font-medium lg:block">{label}</span>
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
      <div className={`flex items-center border-2 border-blue-600 rounded-sm overflow-hidden ${isMobile ? "h-11" : "h-10"}`}>
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
                <span className="text-[11px] text-blue-600 font-semibold">{results.length} ta topildi</span>
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
                      <span className="text-sm font-bold text-blue-700 whitespace-nowrap shrink-0">
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const hasMounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: null, avatar: null });

  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();
  const { data: cart = [] } = useGetCartsQuery();
  const { data: apiCategories = [] } = useGetCategoriesQuery();
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity ?? 0), 0);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const drawer = document.getElementById("mobile-navigation");
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
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

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (dark: boolean) => {
      setIsDarkMode(dark);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };
    const getSavedMode = () => {
      const saved = localStorage.getItem("theme");
      try {
        const parsed: unknown = saved ? JSON.parse(saved) : null;
        if (parsed && typeof parsed === "object" && "mode" in parsed) {
          const mode = (parsed as { mode?: unknown }).mode;
          if (mode === "dark" || mode === "light") return mode;
        }
      } catch {
        if (saved === "dark" || saved === "light") return saved;
      }
      return null;
    };
    const syncTheme = () => {
      const saved = getSavedMode();
      applyTheme(saved === null ? media.matches : saved === "dark");
    };
    const syncSystemTheme = (event: MediaQueryListEvent) => {
      if (getSavedMode() === null) applyTheme(event.matches);
    };
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.key === null || event.key === "theme") syncTheme();
    };
    syncTheme();
    media.addEventListener("change", syncSystemTheme);
    window.addEventListener("storage", syncStoredTheme);
    return () => {
      media.removeEventListener("change", syncSystemTheme);
      window.removeEventListener("storage", syncStoredTheme);
    };
  }, []);

  const toggleDarkMode = useCallback(() => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    localStorage.setItem("theme", JSON.stringify({ mode: next ? "dark" : "light" }));
    setIsDarkMode(next);
  }, [isDarkMode]);

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
    <div className="sticky top-0 z-[1000] w-full border-b border-[var(--border)] bg-[var(--surface)]">

      {/* ── MAIN NAVBAR ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:gap-4 md:px-6">
        <BrandLogo />

        <div className="hidden lg:flex min-w-0 max-w-2xl flex-1 px-3">
          <SearchBox />
        </div>

        <div className="flex shrink-0 items-center gap-2 text-[var(--text-muted)] sm:gap-3 lg:gap-5">
          <button type="button" onClick={openSidebar} className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-[var(--surface-muted)] lg:hidden" aria-label={isSidebarOpen ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={isSidebarOpen} aria-controls="mobile-navigation">
            <IoMenu size={23} />
          </button>
          <NavIcon href="/wishlist" icon={<FaHeart size={19} />} label="Saralangan" badge={wishlist.length || ""} />
          <NavIcon href="/savatcha" icon={<FaShoppingCart size={19} />} label="Savat" badge={cartCount || ""} />
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Yorug' rejimni yoqish" : "Tungi rejimni yoqish"}
            aria-pressed={isDarkMode}
            className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            {isDarkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>
          {isLoggedIn ? (
            <Link href="/kabnet" aria-label="Shaxsiy hisob" className="hidden lg:flex flex-col items-center hover:text-[var(--secondary)] transition-colors group">
              <UserAvatar avatar={userData.avatar} username={userData.username} size="md" />
              <span className="mt-1 hidden max-w-[90px] truncate text-[10px] font-medium text-center group-hover:text-[var(--secondary)] lg:block">
                {userData.username || "Shaxsiy hisob"}
              </span>
            </Link>
          ) : (
            <Link href="/kirish" aria-label="Kirish" className="hidden lg:flex flex-col items-center hover:text-[var(--secondary)] transition-colors">
              <FaUser size={19} />
              <span className="mt-1 hidden text-[10px] font-medium lg:block">Kirish</span>
            </Link>
          )}
        </div>
      </div>

      <nav aria-label="Asosiy navigatsiya" className="hidden border-t border-[var(--border)] px-4 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex min-h-12 items-center whitespace-nowrap rounded-md px-3 text-[12px] font-semibold transition-all hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] hover:shadow-sm xl:px-4 ${isActive ? "text-[var(--secondary)] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--accent)] xl:after:inset-x-4" : "text-[var(--text-muted)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/katalog"
            aria-current={pathname === "/katalog" || pathname?.startsWith("/katalog/") ? "page" : undefined}
            className={`relative inline-flex min-h-12 items-center whitespace-nowrap rounded-md px-3 text-[12px] font-semibold transition-all hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] hover:shadow-sm xl:px-4 ${pathname === "/katalog" || pathname?.startsWith("/katalog/") ? "text-[var(--secondary)] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--accent)] xl:after:inset-x-4" : "text-[var(--text-muted)]"}`}
          >
            Kategoriyalar
          </Link>
        </div>
      </nav>

      {/* ── MOBILE SEARCH ── */}
      <div className="flex lg:hidden items-center px-3 pb-4 sm:px-4">
        <div className="flex-1 min-w-0">
          <SearchBox isMobile />
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className={`fixed inset-0 z-[2000] bg-black/60 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Sayt menyusi" className={`fixed left-0 top-0 flex h-full w-[min(85vw,360px)] flex-col bg-[var(--surface)] text-[var(--text)] shadow-2xl transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-end items-center p-4 border-b bg-white shrink-0">
            <button onClick={closeSidebar} className="p-1 bg-gray-100 rounded-md text-blue-600" aria-label="Menyuni yopish">
              <IoClose size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col">
              {sidebarLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={closeSidebar} aria-current={pathname === l.href ? "page" : undefined}
                  className={`p-4 border-b flex items-center ${l.icon ? "gap-3 text-gray-800 font-medium" : "text-gray-700 uppercase text-[13px] font-bold"} ${pathname === l.href ? "text-red-600 bg-red-50" : "hover:bg-gray-50"}`}>
                  {l.icon && <span className="text-gray-400">{l.icon}</span>}
                  {l.label}
                </Link>
              ))}
              {hasMounted && apiCategories.length > 0 && (
                <div className="border-b border-border p-4">
                  <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Kategoriyalar</p>
                  {apiCategories.map((category) => <Link key={category.slug} href={`/katalog/${category.slug}`} onClick={closeSidebar} aria-current={pathname === `/katalog/${category.slug}` ? "page" : undefined} className="block rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted">{getCategoryDisplayName(category)}</Link>)}
                </div>
              )}
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
                Qo&apos;ng&apos;iroq qilishni so&apos;rang
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
