"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiGift, FiHeart, FiMenu, FiMoon, FiSearch, FiShoppingBag, FiShoppingCart, FiSun, FiUser, FiX } from "react-icons/fi";
import BrandLogo from "./BrandLogo";
import { useModal } from "../../context/ModalContext";
import { useGetWishlistQuery } from "../../../services/wishlistApi";
import { useGetCartsQuery } from "../../../services/cartApi";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../../../services/categoryApi";
import { useAuthSession } from "../../../lib/auth/use-session";
import { useProductSearch } from "../../hooks/useProductSearch";
import { formatPrice } from "../../../lib/site-config";
import { notify } from "../../../lib/notifications";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const primaryLinks = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/katalog", label: "Mahsulotlar" },
  { href: "/biz-haqimizda", label: "Biz haqimizda" },
  { href: "/aloqa", label: "Aloqa" },
];

const menuLinks = [
  ...primaryLinks,
  { href: "/aksiyalar", label: "Barcha aksiyalar", icon: <FiGift aria-hidden="true" /> },
  { href: "/tulov", label: "To'lov" },
  { href: "/yetkazibBerish", label: "Yetkazib berish" },
  { href: "/fikrlar", label: "Fikrlar" },
  { href: "/blog", label: "Yangiliklar" },
  { href: "/savolJavob", label: "Savol-javob" },
];

function getInitials(name: string | null) {
  if (!name) return "U";
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousSearchRef = useRef("");
  const { products, isError, isFetching, refetch } = useProductSearch(searchQuery);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (pathname !== "/katalog") {
      previousSearchRef.current = "";
      return;
    }
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch === "" && previousSearchRef.current !== "") {
      setInputValue("");
      setSearchQuery("");
      setSelected(false);
      setIsOpen(false);
    }
    previousSearchRef.current = urlSearch;
  }, [pathname, searchParams]);

  const submitSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsOpen(false);
    setSelected(true);
    const query = inputValue.trim();
    router.push(query ? `/katalog?search=${encodeURIComponent(query)}` : "/katalog");
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    setSelected(false);
    const hasSearchableQuery = value.trim().length >= 2;
    setSearchQuery(hasSearchableQuery ? value : "");
    setIsOpen(hasSearchableQuery);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setIsOpen(false);
    setSelected(false);
    inputRef.current?.focus();
    if (pathname === "/katalog") router.push("/katalog");
  };

  const highlightMatch = (name: string) => {
    const start = name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (start < 0) return name;
    return <>{name.slice(0, start)}<strong className="text-[#1476F2]">{name.slice(start, start + searchQuery.length)}</strong>{name.slice(start + searchQuery.length)}</>;
  };

  return (
    <div ref={wrapperRef} className="relative min-w-0 w-full">
      <form onSubmit={submitSearch} role="search" className="group flex h-11 w-full items-center rounded-full border border-white/15 bg-white/[0.08] px-1.5 text-white transition-all duration-200 focus-within:border-[#1682FF] focus-within:bg-white/[0.12] focus-within:ring-4 focus-within:ring-[#1682FF]/20">
        <FiSearch aria-hidden="true" className="ml-3 shrink-0 text-white/55 transition-colors group-focus-within:text-white" size={17} />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => { if (searchQuery.trim().length >= 2 && !selected) setIsOpen(true); }}
          placeholder="Mahsulotlarni qidirish..."
          aria-label="Mahsulotlarni qidirish"
          aria-expanded={isOpen}
          aria-controls="product-search-results"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/50"
        />
        {inputValue && <button type="button" onClick={clearSearch} aria-label="Qidiruvni tozalash" className="mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"><FiX aria-hidden="true" size={16} /></button>}
        <button type="submit" aria-label="Qidirish" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1476F2] text-white transition hover:bg-[#328AFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><FiSearch aria-hidden="true" size={16} /></button>
      </form>

      {isOpen && searchQuery.trim().length >= 2 && (
        <div id="product-search-results" role="listbox" aria-label="Mahsulot qidiruv natijalari" className="absolute left-0 top-[calc(100%+10px)] z-[1200] max-h-[min(420px,65vh)] w-full min-w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_22px_60px_rgba(2,8,23,0.24)] dark:border-slate-700 dark:bg-[#172536] dark:text-white">
          {isError ? (
            <div role="alert" className="px-5 py-6 text-center text-sm text-slate-500 dark:text-slate-300"><p>Qidiruv natijalarini yuklab bo&apos;lmadi.</p><button type="button" onClick={() => void refetch()} className="mt-2 font-semibold text-[#1476F2] hover:underline">Qayta urinish</button></div>
          ) : isFetching && products.length === 0 ? (
            <p role="status" className="px-5 py-7 text-center text-sm text-slate-500 dark:text-slate-300">Mahsulotlar qidirilmoqda...</p>
          ) : products.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-300"><FiSearch aria-hidden="true" className="mx-auto mb-2 text-slate-400" size={22} /><p>“{searchQuery}” bo&apos;yicha mahsulot topilmadi</p></div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800/80"><span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Mahsulotlar</span><span className="text-xs font-semibold text-[#1476F2]">{products.length} ta topildi</span></div>
              <div className="max-h-[360px] overflow-y-auto">
                {products.map((product) => (
                  <Link key={product.id} href={`/detail/${product.id}`} role="option" aria-selected="false" onClick={() => { setIsOpen(false); setSelected(true); }} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">{product.image ? <Image src={product.image} alt="" width={44} height={44} className="size-full object-cover" /> : <FiShoppingBag aria-hidden="true" className="text-slate-400" size={18} />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{highlightMatch(product.name)}</span>{product.category && <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{product.category}</span>}</span>
                    {product.price != null && <span className="shrink-0 whitespace-nowrap text-sm font-bold text-[#1476F2]">{formatPrice(product.price)}</span>}
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

function SearchBoxFallback() {
  return <div aria-hidden="true" className="h-11 w-full animate-pulse rounded-full bg-white/10" />;
}

function SearchBoxSlot() {
  return <Suspense fallback={<SearchBoxFallback />}><SearchBox /></Suspense>;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const hasMounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const { data: authSession } = useAuthSession();
  const isLoggedIn = Boolean(authSession?.user);
  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();
  const { data: cart = [] } = useGetCartsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity ?? 0), 0);
  const username = authSession?.user.name || authSession?.user.email || null;
  const avatar = authSession?.user.image ? (authSession.user.image.startsWith("avatars/") ? "/api/avatar" : authSession.user.image) : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get("auth");
    if (authResult === "google-error") notify.error("Google orqali kirishda xatolik yuz berdi.");
    else if (authResult === "google-success" && authSession?.user) notify.success("Google orqali muvaffaqiyatli kirdingiz.");
    else return;
    params.delete("auth");
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [authSession?.user, pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const readSavedMode = () => {
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
    const applyTheme = (dark: boolean) => {
      setIsDarkMode(dark);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };
    const syncTheme = () => {
      const saved = readSavedMode();
      applyTheme(saved === null ? media.matches : saved === "dark");
    };
    const syncSystemTheme = (event: MediaQueryListEvent) => { if (readSavedMode() === null) applyTheme(event.matches); };
    const syncStoredTheme = (event: StorageEvent) => { if (event.key === null || event.key === "theme") syncTheme(); };
    syncTheme();
    media.addEventListener("change", syncSystemTheme);
    window.addEventListener("storage", syncStoredTheme);
    return () => { media.removeEventListener("change", syncSystemTheme); window.removeEventListener("storage", syncStoredTheme); };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const drawer = document.getElementById("mobile-navigation");
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsMenuOpen(false); return; }
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); previousFocus?.focus(); };
  }, [isMenuOpen]);

  const toggleDarkMode = useCallback(() => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    localStorage.setItem("theme", JSON.stringify({ mode: next ? "dark" : "light" }));
    setIsDarkMode(next);
  }, [isDarkMode]);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const userInitials = useMemo(() => getInitials(username), [username]);

  const utilityLinkClass = "relative shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] w-full px-2 pt-2 sm:px-5 sm:pt-4">
      <div className="mx-auto max-w-[1508px] rounded-[26px] border border-white/[0.08] bg-[#071525]/95 p-2 text-white shadow-[0_16px_48px_rgba(4,16,31,0.22)] backdrop-blur-xl min-[480px]:p-3 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-1 min-[480px]:gap-2 xl:gap-3">
          <BrandLogo compact inverse />

          <nav aria-label="Asosiy navigatsiya" className="hidden shrink-0 items-center justify-center gap-0.5 xl:flex">
            {primaryLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
              return <Link key={link.label} href={link.href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[12px] font-semibold transition-colors hover:bg-white/10 hover:text-white xl:px-2.5 min-[1440px]:px-3 ${active ? "bg-white/10 text-white" : "text-white/70"}`}>{link.label}</Link>;
            })}
          </nav>

          <div className="min-w-0 flex-1">
            <SearchBoxSlot />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-0 min-[480px]:gap-1">
            <Link href={isLoggedIn ? "/kabnet" : "/kirish"} aria-label={isLoggedIn ? username || "Shaxsiy hisob" : "Kirish"} title={username || "Kirish"} className={`${utilityLinkClass} hidden min-[480px]:inline-flex size-10`}>
              {avatar ? <Image src={avatar} alt="" width={30} height={30} unoptimized className="size-7 rounded-full object-cover ring-2 ring-white/20" /> : isLoggedIn ? <span className="text-xs font-bold">{userInitials}</span> : <FiUser aria-hidden="true" size={18} />}
            </Link>
            <Link href="/savatcha" aria-label={`Savat${cartCount ? `, ${cartCount} ta mahsulot` : ""}`} className={`${utilityLinkClass} inline-flex size-9 min-[480px]:size-10`}><FiShoppingCart aria-hidden="true" size={18} />{cartCount > 0 && <span className="absolute right-0 top-0 flex min-w-4 items-center justify-center rounded-full bg-[#1476F2] px-1 text-[10px] font-bold leading-4 text-white">{cartCount}</span>}</Link>
            <Link href="/wishlist" aria-label={`Sevimlilar${wishlist.length ? `, ${wishlist.length} ta mahsulot` : ""}`} className={`${utilityLinkClass} hidden min-[480px]:inline-flex size-10`}><FiHeart aria-hidden="true" size={18} />{wishlist.length > 0 && <span className="absolute right-0 top-0 flex min-w-4 items-center justify-center rounded-full bg-[#1476F2] px-1 text-[10px] font-bold leading-4 text-white">{wishlist.length}</span>}</Link>
            <button type="button" onClick={toggleDarkMode} aria-label={isDarkMode ? "Yorug' rejimni yoqish" : "Tungi rejimni yoqish"} aria-pressed={isDarkMode} className={`${utilityLinkClass} hidden min-[480px]:inline-flex size-10`} title={isDarkMode ? "Yorug' rejim" : "Tungi rejim"}>{isDarkMode ? <FiSun aria-hidden="true" size={18} /> : <FiMoon aria-hidden="true" size={18} />}</button>
            <button type="button" onClick={isMenuOpen ? closeMenu : openMenu} className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[480px]:size-10" aria-label={isMenuOpen ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">{isMenuOpen ? <FiX aria-hidden="true" size={20} /> : <FiMenu aria-hidden="true" size={20} />}</button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[2000] bg-slate-950/55 transition-opacity duration-200 motion-reduce:transition-none ${isMenuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`} onClick={closeMenu} aria-hidden={!isMenuOpen}>
        <aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Sayt menyusi" inert={!isMenuOpen} onClick={(event) => event.stopPropagation()} className={`absolute inset-y-0 right-0 flex w-[min(88vw,390px)] flex-col bg-[#071525] text-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex min-h-[76px] items-center justify-between border-b border-white/10 px-5"><BrandLogo compact inverse /><button type="button" onClick={closeMenu} aria-label="Menyuni yopish" className="inline-flex size-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"><FiX aria-hidden="true" size={21} /></button></div>
          <nav aria-label="Mobil navigatsiya" className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-1">
              {menuLinks.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
                return <Link key={`${link.href}-${link.label}`} href={link.href} onClick={closeMenu} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white"}`}>{"icon" in link && link.icon ? <span className="text-[#62A8FF]">{link.icon}</span> : null}{link.label}</Link>;
              })}
            </div>
            {hasMounted && categories.length > 0 && <section className="mt-5 border-t border-white/10 pt-5"><h2 className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Mahsulot kategoriyalari</h2><div className="flex flex-col gap-1">{categories.map((category) => <Link key={category.slug} href={`/katalog/${category.slug}`} onClick={closeMenu} aria-current={pathname === `/katalog/${category.slug}` ? "page" : undefined} className="rounded-xl px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white">{getCategoryDisplayName(category)}</Link>)}</div></section>}
          </nav>
          <div className="border-t border-white/10 p-4">
            <Link href={isLoggedIn ? "/kabnet" : "/kirish"} onClick={closeMenu} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.07]">{avatar ? <Image src={avatar} alt="" width={30} height={30} unoptimized className="size-7 rounded-full object-cover" /> : <FiUser aria-hidden="true" size={18} />}{isLoggedIn ? username || "Shaxsiy hisob" : "Kirish / Shaxsiy hisob"}</Link>
            <button type="button" onClick={() => { closeMenu(); openModal(); }} className="mt-3 min-h-12 w-full rounded-full bg-[#1476F2] px-4 text-sm font-bold text-white transition hover:bg-[#328AFF]">Qo&apos;ng&apos;iroq qilishni so&apos;rang</button>
            <button type="button" onClick={toggleDarkMode} aria-pressed={isDarkMode} className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white">{isDarkMode ? <FiSun aria-hidden="true" size={17} /> : <FiMoon aria-hidden="true" size={17} />}{isDarkMode ? "Yorug' rejim" : "Tungi rejim"}</button>
          </div>
        </aside>
      </div>
    </header>
  );
}
