"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { FiMoon, FiSun, FiGrid } from "react-icons/fi";
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
import { useAuthSession } from "../../../lib/auth/use-session";
import { notify } from "../../../lib/notifications";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
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
      <Image src={avatar} alt={username ? `${username} profil rasmi` : "Profil rasmi"} width={40} height={40} unoptimized className="w-full h-full object-cover" />
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
  <Link href={href} aria-label={label} className={`relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] sm:size-10 ${className}`}>
    {icon}
    {badge !== undefined && badge !== "" && (
      <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full border-2 border-[var(--surface)] bg-red-600 px-1 text-center text-[9px] leading-[14px] text-white">
        {badge}
      </span>
    )}
    <span className="sr-only">{label}</span>
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
      <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] focus-within:border-[var(--secondary)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--secondary)_14%,transparent)]">
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={e => handleChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229 && handleSubmit()}
          placeholder="Mahsulot qidirish..."
          aria-label="Mahsulot qidirish"
          className="h-full w-full min-w-0 bg-transparent px-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
        />
        {showClear && (
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); handleClear(); }}
            className="mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            tabIndex={-1}
            aria-label="Tozalash"
          >
            <IoClose size={17} />
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)]"
          aria-label="Qidirish"
        >
          <FaSearch aria-hidden="true" size={14} />
        </button>
      </div>

      {isOpen && searchQuery.trim().length >= 2 && (
        <div
          className={`absolute left-0 top-[calc(100%+8px)] z-[1100] flex w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-xl ${isMobile ? "max-h-[60vh]" : "max-h-[420px]"}`}
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
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Mahsulotlar</span>
                <span className="text-[11px] font-semibold text-[var(--secondary)]">{results.length} ta topildi</span>
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const hasMounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const { data: authSession } = useAuthSession();
  const isLoggedIn = Boolean(authSession?.user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get("auth");
    if (!authResult) return;
    if (authResult === "google-error") {
      notify.error("Google orqali kirishda xatolik yuz berdi.");
    } else if (authResult === "google-success" && authSession?.user) {
      notify.success("Google orqali muvaffaqiyatli kirdingiz.");
    } else {
      return;
    }
    params.delete("auth");
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [authSession?.user, pathname]);
  const userData = {
    username: authSession?.user.name || authSession?.user.email || null,
    avatar: authSession?.user.image
      ? authSession.user.image.startsWith("avatars/")
        ? "/api/avatar"
        : authSession.user.image
      : null,
  };

  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();
  const { data: cart = [] } = useGetCartsQuery();
  const { data: apiCategories = [] } = useGetCategoriesQuery();
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity ?? 0), 0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = previousOverflow; };
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
    { href: "/katalog", label: "Kategoriyalar", icon: <FiGrid size={18} /> },
  ], []);

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_12px_rgb(15_23_42_/_0.04)]">
      <div className="mx-auto max-w-[1508px] px-3 sm:px-5 xl:px-6">
        <div className="flex min-h-[68px] items-center gap-2 sm:gap-3 xl:gap-5">
          <BrandLogo compact />

          <nav aria-label="Asosiy navigatsiya" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1440px]:flex">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined} className={`relative whitespace-nowrap rounded-md px-1.5 py-2 text-[11px] font-semibold transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[var(--secondary)] after:content-[''] after:scale-x-0 after:transition-transform hover:after:scale-x-100 min-[1366px]:px-2 min-[1440px]:px-2.5 min-[1440px]:text-xs ${isActive ? "text-[var(--secondary)] after:scale-x-100" : "text-[var(--text-muted)]"}`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden w-[clamp(190px,18vw,240px)] shrink min-[1440px]:block">
            <SearchBox />
          </div>

          <div className="hidden w-[clamp(180px,24vw,260px)] shrink-0 min-[768px]:block min-[1440px]:hidden">
            <SearchBox />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 text-[var(--text-muted)] sm:gap-1">
            <button type="button" onClick={() => setIsSearchOpen((open) => !open)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] min-[768px]:hidden sm:size-10" aria-label={isSearchOpen ? "Qidiruvni yopish" : "Mahsulot qidirish"} aria-expanded={isSearchOpen} aria-controls="compact-search">
              {isSearchOpen ? <IoClose size={21} /> : <FaSearch size={17} />}
            </button>
            {isLoggedIn ? (
              <Link href="/kabnet" aria-label="Shaxsiy hisob" title={userData.username || "Shaxsiy hisob"} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] sm:size-10">
                {userData.avatar ? <UserAvatar avatar={userData.avatar} username={userData.username} size="md" /> : <FaUser size={18} />}
              </Link>
            ) : (
              <Link href="/kirish" aria-label="Kirish" title="Kirish" className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] sm:size-10">
                <FaUser size={18} />
              </Link>
            )}
            <NavIcon href="/savatcha" icon={<FaShoppingCart size={18} />} label="Savat" badge={cartCount || ""} />
            <NavIcon href="/wishlist" icon={<FaHeart size={18} />} label="Sevimlilar" badge={wishlist.length || ""} className="!hidden min-[768px]:!inline-flex" />
            <button type="button" onClick={isSidebarOpen ? closeSidebar : openSidebar} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--surface-muted)] min-[768px]:hidden sm:size-10" aria-label={isSidebarOpen ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={isSidebarOpen} aria-controls="mobile-navigation">
              {isSidebarOpen ? <IoClose size={22} /> : <IoMenu size={23} />}
            </button>
            <button type="button" onClick={toggleDarkMode} aria-label={isDarkMode ? "Yorug' rejimni yoqish" : "Tungi rejimni yoqish"} aria-pressed={isDarkMode} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] sm:size-10" title={isDarkMode ? "Yorug' rejim" : "Tungi rejim"}>
              {isDarkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
            </button>
          </div>
        </div>

        <nav aria-label="Asosiy navigatsiya" className="hidden min-[768px]:flex min-[1440px]:hidden min-h-11 flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-[var(--border)] py-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined} className={`relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--secondary)] after:absolute after:bottom-0.5 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[var(--secondary)] after:content-[''] after:scale-x-0 after:transition-transform hover:after:scale-x-100 ${isActive ? "text-[var(--secondary)] after:scale-x-100" : "text-[var(--text-muted)]"}`}>{link.label}</Link>;
          })}
        </nav>

        <div id="compact-search" className={`grid transition-[grid-template-rows,opacity,padding] duration-200 min-[768px]:hidden ${isSearchOpen ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"}`} aria-hidden={!isSearchOpen}>
          <div className="min-h-0 overflow-visible" inert={!isSearchOpen}>
            <SearchBox isMobile />
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[2000] bg-black/45 transition-opacity duration-200 ${isSidebarOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`} onClick={closeSidebar} aria-hidden={!isSidebarOpen}>
        <aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Sayt menyusi" inert={!isSidebarOpen} onClick={(event) => event.stopPropagation()} className={`absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col border-l border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex min-h-[68px] items-center justify-between border-b border-[var(--border)] px-5">
            <BrandLogo compact />
            <button type="button" onClick={closeSidebar} className="inline-flex size-10 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)]" aria-label="Menyuni yopish"><IoClose size={23} /></button>
          </div>
          <nav aria-label="Mobil navigatsiya" className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                return <Link key={link.href} href={link.href} onClick={closeSidebar} aria-current={isActive ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${isActive ? "bg-[var(--secondary-soft)] text-[var(--secondary)]" : "text-[var(--text)] hover:bg-[var(--surface-muted)]"}`}>
                  {link.icon && <span className="text-[var(--secondary)]">{link.icon}</span>}{link.label}
                </Link>;
              })}
              <Link href="/wishlist" onClick={closeSidebar} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)]"><FaHeart className="text-[var(--secondary)]" />Saralangan{wishlist.length > 0 && <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{wishlist.length}</span>}</Link>
            </div>
            {hasMounted && apiCategories.length > 0 && <div className="mt-4 border-t border-[var(--border)] pt-4"><p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Mahsulot kategoriyalari</p><div className="flex flex-col gap-1">{apiCategories.map((category) => <Link key={category.slug} href={`/katalog/${category.slug}`} onClick={closeSidebar} aria-current={pathname === `/katalog/${category.slug}` ? "page" : undefined} className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${pathname === `/katalog/${category.slug}` ? "bg-[var(--secondary-soft)] font-semibold text-[var(--secondary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"}`}>{getCategoryDisplayName(category)}</Link>)}</div></div>}
          </nav>
          <div className="border-t border-[var(--border)] p-4">
            <Link href={isLoggedIn ? "/kabnet" : "/kirish"} onClick={closeSidebar} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)]">
              {isLoggedIn ? <UserAvatar avatar={userData.avatar} username={userData.username} size="sm" /> : <FaUser className="ml-1 text-[var(--secondary)]" />}
              <span>{isLoggedIn ? userData.username || "Shaxsiy hisob" : "Kirish / Shaxsiy hisob"}</span>
            </Link>
            <button type="button" onClick={openModal} className="mt-3 min-h-11 w-full rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:opacity-90">Qo&apos;ng&apos;iroq qilishni so&apos;rang</button>
          </div>
        </aside>
      </div>
    </header>
  );
}
