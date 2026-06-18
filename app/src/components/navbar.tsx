"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { BarChart2 } from "lucide-react";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaGripLines,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import Logo from "../assets/imgs/logo1.png";
import { useModal } from "../../context/ModalContext";
import { useGetWishlistQuery } from "../../../services/wishlistApi";
import { usePathname, useRouter } from "next/navigation";
import { useProductSearch } from "../../hooks/useProductSearch";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface SubCategory { id: number; name: string; items: string[] }
interface Category { id: number; name: string; subCategories: SubCategory[] }
interface UserData { username: string | null; avatar: string | null }

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const STORAGE_KEYS = {
  user: ["user", "userInfo", "userData", "currentUser", "profile"],
  token: ["access", "access_token", "accessToken", "token"],
};

const topLinks = [
  { href: "/kompaneyaHaqida", label: "Kompaniya haqida" },
  { href: "/tulov", label: "To'lov" },
  { href: "/yetkazibBerish", label: "Yetkazib berish" },
  { href: "/qaytarish", label: "Qaytarish" },
  { href: "/fikrlar", label: "Fikrlar" },
  { href: "/blog", label: "Yangiliklar" },
  { href: "/aloqa", label: "Aloqa" },
];

const catalogData: Category[] = [
  {
    id: 1, name: "VODO-GAZOSNABJENIE, OTOPLENIE, VENTILYATSIYA",
    subCategories: [
      { id: 11, name: "Isitish tizimlari", items: ["Radiatorlar", "Kotellar", "Issiq pol", "Nasoslar"] },
      { id: 12, name: "Suv ta'minoti", items: ["Polipropilen quvurlar", "Filtrlar", "Jo'mraklar", "Baklar"] },
      { id: 13, name: "Ventilyatsiya", items: ["Havo haydagichlar", "Gofra quvurlar", "Reshotkalar"] },
    ]
  },
  {
    id: 2, name: "OBSHCHESTROITELNIYE MATERIALI",
    subCategories: [
      { id: 21, name: "Quruq aralashmalar", items: ["Sement", "Gipsli suvoq", "Kafel yelimi", "Shpaklyovka"] },
      { id: 22, name: "G'isht va bloklar", items: ["Pishgan g'isht", "Gazoblok", "Penoblok"] },
      { id: 23, name: "Izolyatsiya", items: ["Penoplast", "Shisha paxta", "Gidroizolyatsiya"] },
    ]
  },
  {
    id: 3, name: "VSYO DLYA SAUNI I BANI",
    subCategories: [
      { id: 31, name: "Pechlar", items: ["Elektr pechlar", "O'tinli pechlar", "Pech toshlari"] },
      { id: 32, name: "Jihozlar", items: ["Yog'och chelaklar", "Termometrlar", "Supa uchun yog'ochlar"] },
    ]
  },
  {
    id: 4, name: "INSTRUMENT",
    subCategories: [
      { id: 41, name: "Izmeritelno-razmetochniy instrument", items: ["Ruletkalar", "Lazer sathlar", "Nivelirlar"] },
      { id: 42, name: "Ruchnoy instrument", items: ["Bolg'alar", "Atvertkalar", "Kalitlar", "Ombirlar"] },
      { id: 43, name: "Svarochnoye oborudovanie", items: ["Invertorlar", "Payvandlash niqoblari", "Elektrodlar"] },
      { id: 46, name: "Elektroinstrument", items: ["Drellar va shurupovertlar", "Perforatorlar", "USHM (Bolgarka)", "Lobziklar", "Generatorlar", "Kompressorlar", "Shtroborezlar", "Pnevmoinstrumentlar"] },
    ]
  },
  {
    id: 5, name: "OTDELOCHNIYE MATERIALI",
    subCategories: [
      { id: 51, name: "Devor va ship", items: ["Oboylar", "Kraskalar", "Gipsokarton", "Dekorativ suvoq"] },
      { id: 52, name: "Pol qoplamalari", items: ["Laminat", "Linoleum", "Kafel", "Plintuslar"] },
    ]
  },
  {
    id: 6, name: "SANTEXNIKA",
    subCategories: [
      { id: 61, name: "Keramika", items: ["Unitazlar", "Rakovinalar", "Vannalar", "Dush kabinalari"] },
      { id: 62, name: "Mebel va aksessuarlar", items: ["Vanna shkaflari", "Oynalar", "Smeshitelar"] },
    ]
  },
  {
    id: 7, name: "METIZNIYE, TAKELAJNIYE I SKOBYANIYE IZDELIYA",
    subCategories: [
      { id: 71, name: "Metizlar", items: ["Samorezdlar", "Boltlar", "Gaykalar", "Ankerlar"] },
      { id: 72, name: "Qulflar", items: ["Eshik qulflari", "Osma qulflar", "Tutqichlar"] },
    ]
  },
  {
    id: 8, name: "SPETSODEJDA I SREDSTVA INDIVIDUALNOY ZASHCHITI",
    subCategories: [
      { id: 81, name: "Kiyimlar", items: ["Kombinezonlar", "Nimchalar", "Maxsus poyabzallar"] },
      { id: 82, name: "Himoya", items: ["Kaskalar", "Qo'lqoplar", "Ko'zoynaklar", "Respiratorlar"] },
    ]
  },
  {
    id: 9, name: "STOLYARNIYE IZDELIYA",
    subCategories: [
      { id: 91, name: "Yog'och mahsulotlari", items: ["Eshiklar", "Zinapoyalar", "Fanera", "DSP / MDF"] },
    ]
  },
  {
    id: 10, name: "TOVARI DLYA DOMA, SADA I OGORODA",
    subCategories: [
      { id: 101, name: "Bog' asboblari", items: ["Lopatkalar", "Tokqaychilar", "Suv sepkichlar"] },
      { id: 102, name: "Texnika", items: ["O't o'rgichlar", "Kultivatorlar", "Zanjirli arralar"] },
    ]
  },
  {
    id: 11, name: "ELEKTROTOVARI",
    subCategories: [
      { id: 111, name: "Yoritish", items: ["Lustralar", "LED lampalar", "Projektorlar"] },
      { id: 112, name: "Elektromontaj", items: ["Kabellar", "Avtomatlar", "Rozetkalar", "Stabilizatorlar"] },
    ]
  },
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
// SearchBox  — Uzum uslubidagi mustaqil search
//
// Holat mashinkasi:
//   IDLE      — input bo'sh, dropdown yopiq
//   TYPING    — foydalanuvchi yozmoqda, dropdown ochiq
//   SELECTED  — ro'yxatdan mahsulot tanlandi, dropdown yopiq
//              (input'da mahsulot nomi turadi)
//   X bosilsa → IDLE ga qaytadi, dropdown qayta ochilmaydi
//   SELECTED holatda yana yozilsa → TYPING
// ─────────────────────────────────────────────
interface SearchBoxProps { isMobile?: boolean }

function SearchBox({ isMobile = false }: SearchBoxProps) {
  const router = useRouter();

  // inputValue — foydalanuvchi ko'rgan matn
  // searchQuery — useProductSearch'ga beriladigan so'rov
  //   (tanlanganda searchQuery o'zgartirilmaydi — avvalgi natijalar qoladi)
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false); // mahsulot tanlandi holati

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useProductSearch(searchQuery);

  // Natijalar debounce tugagach keladi — shu payt dropdown ochiladi
  useEffect(() => {
    if (!selected && searchQuery.trim().length >= 2) {
      setIsOpen(true);
    }
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tashqaridan click → dropdown yopiladi
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Input o'zgarganda
  const handleChange = (val: string) => {
    setInputValue(val);
    setSelected(false); // yana yoza boshladi → tanlangan holat tugadi

    if (val.trim().length >= 2) {
      setSearchQuery(val); // debounce useProductSearch ichida
    } else {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  // × tugmasi bosildi
  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    setIsOpen(false);
    setSelected(false);
    inputRef.current?.focus();
  };

  // Dropdown'dan mahsulot tanlandi
  const handleSelect = (name: string) => {
    setInputValue(name);  // input'ga mahsulot nomi
    setIsOpen(false);     // dropdown yopiladi
    setSelected(true);    // tanlangan holat — searchQuery o'zgarmaydi
  };

  // Enter yoki qidiruv tugmasi
  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setIsOpen(false);
    router.push(`/katalog?search=${encodeURIComponent(inputValue.trim())}`);
  };

  // Focus → tanlangan holat bo'lmasa va natijalar bor bo'lsa — qayta ochiladi
  const handleFocus = () => {
    if (!selected && searchQuery.trim().length >= 2 && results.length > 0) {
      setIsOpen(true);
    }
  };

  const showClear = inputValue.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input qatori */}
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

        {/* × — input bo'sh bo'lmasa ko'rinadi */}
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

        {/* Qidiruv tugmasi */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-full shrink-0 flex items-center justify-center transition-colors"
          aria-label="Qidirish"
        >
          <FaSearch size={14} />
        </button>
      </div>

      {/* Dropdown */}
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
              {/* header */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Mahsulotlar</span>
                <span className="text-[11px] text-blue-600 font-semibold">{results.length} ta topildi</span>
              </div>

              {/* list */}
              <div className="overflow-y-auto flex-1">
                {results.map(product => (
                  <div
                    key={product.id}
                    // onMouseDown — blur'dan oldin ishlashi uchun
                    onMouseDown={e => { e.preventDefault(); handleSelect(product.name); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors group"
                  >
                    {/* rasm */}
                    <div className="w-11 h-11 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} width={44} height={44} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FaSearch size={14} />
                        </div>
                      )}
                    </div>

                    {/* nom + kategoriya */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                        {highlightMatch(product.name, searchQuery)}
                      </p>
                      {product.category && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{product.category}</p>
                      )}
                    </div>
                    [18/06/2026 17:15] Abdug'afur:

                    {/* narx */}
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

// ─────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [isKatalogOpen, setIsKatalogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<SubCategory | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: null, avatar: null });

  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();

  // navbar balandligi
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
  useEffect(() => { updateNavbarHeight(); }, [isKatalogOpen, updateNavbarHeight]);

  // auth
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

  // katalog toggle
  const toggleKatalog = useCallback(() => {
    setIsKatalogOpen(prev => {
      if (!prev) {
        if (window.innerWidth <= 768) { setActiveCat(null); setActiveSub(null); }
        else { setActiveCat(catalogData[0]); setActiveSub(catalogData[0].subCategories[0]); }
      } else { setActiveCat(null); setActiveSub(null); }
      return !prev;
    });
  }, []);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);

  const sidebarLinks = useMemo(() => [
    { href: "/aksiyalar", label: "Barcha aksiyalar", icon: <FiGift size={20} /> },
    { href: "/kompaneyaHaqida", label: "Kompaniya haqida" },
    { href: "/tulov", label: "To'lov" },
    { href: "/yetkazibBerish", label: "Yetkazib berish" },
    { href: "/qaytarish", label: "Qaytarish" },
    { href: "/fikrlar", label: "Fikrlar" },
    { href: "/savol-javob", label: "Savol-javob" },
    { href: "/blog", label: "Yangiliklar" },
    { href: "/aloqa", label: "Aloqa" },
  ], []);

  return (
    <div ref={navbarRef} className="w-full border-b bg-white relative z-[1000]">
      [18/06/2026 17:15] Abdug'afur:

      {/* ── TOP BAR ── */}
      <div className="flex justify-between items-center px-4 md:px-6 py-2 text-[12px] text-gray-500 bg-gray-100 border-b">
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={openSidebar} className="flex items-center gap-1 text-gray-800" aria-label="Menyuni ochish">
            <IoMenu size={24} />
            <span className="font-bold text-[14px] hidden sm:block">Menyu</span>
          </button>
        </div>
        <nav className="hidden lg:flex gap-4 font-medium">
          {topLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`transition-colors ${pathname === l.href ? "text-red-600 border-b-2 border-red-600 pb-0.5" : "hover:text-red-600"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4 items-center">
          <span className="font-bold text-black text-[14px]">8 800 444 00 65</span>
          <button onClick={openModal}
            className="hidden sm:block cursor-pointer text-blue-600 font-bold border-b border-blue-600 border-dotted text-[10px] uppercase">
            Qo'ng'iroq qilishni so'rang
          </button>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src={Logo} alt="Logo" width={180} height={45} className="w-30 md:w-45" priority />
        </Link>

        <button onClick={toggleKatalog} aria-expanded={isKatalogOpen}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-sm font-bold bg-blue-600 text-white hover:bg-slate-800 transition-all shrink-0">
          {isKatalogOpen ? <IoClose size={22} /> : <FaGripLines size={20} />}
          <span className="tracking-wider text-sm">KATALOG</span>
        </button>

        {/* Desktop SearchBox */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <SearchBox />
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-gray-500">
          <NavIcon href="/aksiyalar" icon={<FiGift size={20} />} label="Barcha aksiyalar" className="hidden lg:flex ml-6" />
          <NavIcon href="/taqqoslash" icon={<BarChart2 size={20} />} label="Taqqoslash" />
          <NavIcon href="/wishlist" icon={<FaHeart size={20} />} label="Saralangan" badge={wishlist.length || ""} />
          <NavIcon href="/savatcha" icon={<FaShoppingCart size={20} />} label="Savat" />
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

      {/* ── MOBILE: KATALOG + SEARCH ── */}
      <div className="flex md:hidden items-center gap-2 px-4 pb-4">
        <button onClick={toggleKatalog} aria-expanded={isKatalogOpen}
          className="bg-blue-600 text-white rounded-sm flex items-center justify-center gap-2 shrink-0 h-11 px-3">
          {isKatalogOpen ? <IoClose size={18} /> : <FaGripLines size={16} />}
          <span className="tracking-wider text-xs font-bold whitespace-nowrap">KATALOG</span>
        </button>
        <div className="flex-1 min-w-0">
          <SearchBox isMobile />
        </div>
      </div>
      [18/06/2026 17:15] Abdug'afur:

      {/* ── KATALOG DROPDOWN ── */}
      {isKatalogOpen && (
        <div className="fixed left-0 w-full bg-white shadow-2xl border-t z-[1001]" style={{ top: `${navbarHeight}px` }}>
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row h-[70vh] md:h-[600px] overflow-hidden bg-white items-start">

            {/* kategoriyalar */}
            <div className={`w-full md:w-[320px] border-r bg-gray-50 overflow-y-auto h-full ${activeCat ? "hidden md:block" : "block"}`}>
              {catalogData.map(cat => (
                <div key={cat.id}
                  onClick={() => { setActiveCat(cat); setActiveSub(null); }}
                  onMouseEnter={() => { if (window.innerWidth > 768) { setActiveCat(cat); setActiveSub(cat.subCategories[0]); } }}
                  className={`px-5 py-4 flex justify-between items-center cursor-pointer text-[11px] font-bold uppercase border-b border-gray-100 transition-all ${activeCat?.id === cat.id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                  <span className="pr-2">{cat.name}</span>
                  <FaChevronRight size={12} className="shrink-0" />
                </div>
              ))}
            </div>

            {/* subkategoriyalar */}
            {activeCat && !activeSub && (
              <div className="w-full md:w-80 border-r bg-white overflow-y-auto h-full">
                <div onClick={() => setActiveCat(null)}
                  className="md:hidden p-4 bg-gray-100 flex items-center text-blue-600 font-bold border-b cursor-pointer sticky top-0 z-10">
                  <FaChevronLeft className="mr-2" /> Kategoriyalar
                </div>
                {activeCat.subCategories.map(sub => (
                  <div key={sub.id} onClick={() => setActiveSub(sub)}
                    className="px-6 py-4 flex justify-between items-center cursor-pointer text-sm font-bold border-b border-gray-50 text-gray-800 hover:bg-gray-50">
                    {sub.name}<FaChevronRight size={12} className="shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* itemlar */}
            {activeSub && (
              <div className="w-full flex-1 bg-white overflow-y-auto h-full">
                <div onClick={() => setActiveSub(null)}
                  className="md:hidden p-4 bg-gray-100 flex items-center text-blue-600 font-bold border-b cursor-pointer sticky top-0 z-10">
                  <FaChevronLeft className="mr-2" /> {activeCat?.name.slice(0, 20)}...
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 content-start">
                  {activeSub.items.map((item, i) => (
                    <div key={i} className="text-gray-600 text-[14px] hover:text-blue-600 cursor-pointer font-medium p-2 border-b border-gray-50 md:border-transparent transition-all">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      [18/06/2026 17:15] Abdug'afur:

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
              <div className="text-[22px] font-bold text-[#0c1c2b] mb-3">8 800 444 00 65</div>
              <button onClick={openModal} className="w-full py-4 px-4 bg-[#f0f4f8] text-blue-600 font-bold rounded-md uppercase text-[13px] tracking-widest mb-3">
                Qo'ng'iroq qilishni so'rang
              </button>
              <div className="text-[13px] text-gray-500 italic">Har kuni, 8:00 dan 18:00 gacha</div>
            </div>
          </div>
        </div>
        <div className="w-full h-full" onClick={closeSidebar} />
      </div>

      {/* Overlay */}
      {isKatalogOpen && (
        <div className="fixed left-0 w-full bg-black/20 backdrop-blur-[1px] z-[999]"
          style={{ top: `${navbarHeight}px`, bottom: 0 }}
          onClick={() => setIsKatalogOpen(false)} />
      )}
    </div>
  );
}