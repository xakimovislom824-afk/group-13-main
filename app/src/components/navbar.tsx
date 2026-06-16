"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { usePathname } from "next/navigation";
import { useGetCartsQuery } from "../../../services/cartApi";

interface SubCategory {
  id: number;
  name: string;
  items: string[];
}

interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

interface SearchResult {
  item: string;
  subName: string;
  catName: string;
}

interface UserData {
  username: string | null;
  avatar: string | null;
}

const STORAGE_KEYS = {
  user: ["user", "userInfo", "userData", "currentUser", "profile"],
  token: ["access", "access_token", "accessToken", "token"],
};

const catalogData: Category[] = [
  {
    id: 1,
    name: "VODO-GAZOSNABJENIE, OTOPLENIE, VENTILYATSIYA",
    subCategories: [
      { id: 11, name: "Isitish tizimlari", items: ["Radiatorlar", "Kotellar", "Issiq pol", "Nasoslar"] },
      { id: 12, name: "Suv ta'minoti", items: ["Polipropilen quvurlar", "Filtrlar", "Jo'mraklar", "Baklar"] },
      { id: 13, name: "Ventilyatsiya", items: ["Havo haydagichlar", "Gofra quvurlar", "Reshotkalar"] },
    ],
  },
  {
    id: 2,
    name: "OBSHCHESTROITELNIYE MATERIALI",
    subCategories: [
      { id: 21, name: "Quruq aralashmalar", items: ["Sement", "Gipsli suvoq", "Kafel yelimi", "Shpaklyovka"] },
      { id: 22, name: "G'isht va bloklar", items: ["Pishgan g'isht", "Gazoblok", "Penoblok"] },
      { id: 23, name: "Izolyatsiya", items: ["Penoplast", "Shisha paxta", "Gidroizolyatsiya"] },
    ],
  },
  {
    id: 3,
    name: "VSYO DLYA SAUNI I BANI",
    subCategories: [
      { id: 31, name: "Pechlar", items: ["Elektr pechlar", "O'tinli pechlar", "Pech toshlari"] },
      { id: 32, name: "Jihozlar", items: ["Yog'och chelaklar", "Termometrlar", "Supa uchun yog'ochlar"] },
    ],
  },
  {
    id: 4,
    name: "INSTRUMENT",
    subCategories: [
      { id: 41, name: "Izmeritelno-razmetochniy instrument", items: ["Ruletkalar", "Lazer sathlar", "Nivelirlar"] },
      { id: 42, name: "Ruchnoy instrument", items: ["Bolg'alar", "Atvertkalar", "Kalitlar", "Ombirlar"] },
      { id: 43, name: "Svarochnoye oborudovanie", items: ["Invertorlar", "Payvandlash niqoblari", "Elektrodlar"] },
      { id: 46, name: "Elektroinstrument", items: ["Drellar va shurupovertlar", "Perforatorlar", "USHM (Bolgarka)", "Lobziklar", "Generatorlar", "Kompressorlar", "Shtroborezlar", "Pnevmoinstrumentlar"] },
    ],
  },
  {
    id: 5,
    name: "OTDELOCHNIYE MATERIALI",
    subCategories: [
      { id: 51, name: "Devor va ship", items: ["Oboylar", "Kraskalar", "Gipsokarton", "Dekorativ suvoq"] },
      { id: 52, name: "Pol qoplamalari", items: ["Laminat", "Linoleum", "Kafel", "Plintuslar"] },
    ],
  },
  {
    id: 6,
    name: "SANTEXNIKA",
    subCategories: [
      { id: 61, name: "Keramika", items: ["Unitazlar", "Rakovinalar", "Vannalar", "Dush kabinalari"] },
      { id: 62, name: "Mebel va aksessuarlar", items: ["Vanna shkaflari", "Oynalar", "Smeshitelar"] },
    ],
  },
  {
    id: 7,
    name: "METIZNIYE, TAKELAJNIYE I SKOBYANIYE IZDELIYA",
    subCategories: [
      { id: 71, name: "Metizlar", items: ["Samorezdlar", "Boltlar", "Gaykalar", "Ankerlar"] },
      { id: 72, name: "Qulflar", items: ["Eshik qulflari", "Osma qulflar", "Tutqichlar"] },
    ],
  },
  {
    id: 8,
    name: "SPETSODEJDA I SREDSTVA INDIVIDUALNOY ZASHCHITI",
    subCategories: [
      { id: 81, name: "Kiyimlar", items: ["Kombinezonlar", "Nimchalar", "Maxsus poyabzallar"] },
      { id: 82, name: "Himoya", items: ["Kaskalar", "Qo'lqoplar", "Ko'zoynaklar", "Respiratorlar"] },
    ],
  },
  {
    id: 9,
    name: "STOLYARNIYE IZDELIYA",
    subCategories: [
      { id: 91, name: "Yog'och mahsulotlari", items: ["Eshiklar", "Zinapoyalar", "Fanera", "DSP / MDF"] },
    ],
  },
  {
    id: 10,
    name: "TOVARI DLYA DOMA, SADA I OGORODA",
    subCategories: [
      { id: 101, name: "Bog' asboblari", items: ["Lopatkalar", "Tokqaychilar", "Suv sepkichlar"] },
      { id: 102, name: "Texnika", items: ["O't o'rgichlar", "Kultivatorlar", "Zanjirli arralar"] },
    ],
  },
  {
    id: 11,
    name: "ELEKTROTOVARI",
    subCategories: [
      { id: 111, name: "Yoritish", items: ["Lustralar", "LED lampalar", "Projektorlar"] },
      { id: 112, name: "Elektromontaj", items: ["Kabellar", "Avtomatlar", "Rozetkalar", "Stabilizatorlar"] },
    ],
  },
];

const getUserDataFromStorage = (): UserData => {
  try {
    for (const key of STORAGE_KEYS.user) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const username =
            parsed.username || parsed.first_name || parsed.name || parsed.full_name ||
            (parsed.first_name && parsed.last_name ? `${parsed.first_name} ${parsed.last_name}` : null) ||
            parsed.email || null;
          const avatar = parsed.avatar || parsed.avatar_url || parsed.profile_image || parsed.image || parsed.photo || null;
          return { username, avatar };
        } catch {
          return { username: raw, avatar: null };
        }
      }
    }
  } catch {
    return { username: null, avatar: null };
  }
  return { username: null, avatar: null };
};

const checkIsLoggedIn = (): boolean => {
  try {
    return STORAGE_KEYS.token.some((key) => !!localStorage.getItem(key));
  } catch {
    return false;
  }
};

const getInitials = (name: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

interface UserAvatarProps {
  avatar: string | null;
  username: string | null;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ avatar, username, size = "md" }: UserAvatarProps) => {
  const sizeClasses = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" };
  if (avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-blue-100 shrink-0`}>
        <Image src={avatar} alt={username || "User avatar"} width={40} height={40} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shrink-0 border-2 border-blue-100`}>
      {getInitials(username)}
    </div>
  );
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const SearchInput = ({ value, onChange, onFocus, placeholder = "Qidirish...", className = "", inputClassName = "" }: SearchInputProps) => (
  <div className={`flex items-center border-2 border-blue-600 rounded-sm overflow-hidden ${className}`}>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} placeholder={placeholder} className={`w-full px-4 outline-none text-sm ${inputClassName}`} />
    <button className="bg-blue-600 text-white px-5 h-full shrink-0"><FaSearch /></button>
  </div>
);

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  isMobile?: boolean;
}

const SearchResults = ({ results, onSelect, isMobile = false }: SearchResultsProps) => (
  <div className={`absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl rounded-b-sm z-[1100] overflow-y-auto ${isMobile ? "max-h-64" : "max-h-80"}`}>
    {results.map((result, idx) => (
      <div key={`${result.item}-${result.subName}-${idx}`} onClick={() => onSelect(result)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
        <div className="text-sm font-semibold text-gray-800">{result.item}</div>
        <div className="text-xs text-gray-400 mt-0.5 truncate">
          {isMobile ? result.subName : `${result.catName.slice(0, 35)}... → ${result.subName}`}
        </div>
      </div>
    ))}
  </div>
);

interface NavIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  className?: string;
}

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

const topLinks = [
  { href: "/kompaneyaHaqida", label: "Kompaniya haqida" },
  { href: "/tulov", label: "To'lov" },
  { href: "/yetkazibBerish", label: "Yetkazib berish" },
  { href: "/qaytarish", label: "Qaytarish" },
  { href: "/fikrlar", label: "Fikrlar" },
  { href: "/blog", label: "Yangiliklar" },
  { href: "/aloqa", label: "Aloqa" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isKatalogOpen, setIsKatalogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<SubCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: null, avatar: null });

  const { openModal } = useModal();
  const { data: wishlist = [] } = useGetWishlistQuery();

  const refreshAuthState = useCallback(() => {
    const loggedIn = checkIsLoggedIn();
    setIsLoggedIn(loggedIn);
    setUserData(loggedIn ? getUserDataFromStorage() : { username: null, avatar: null });
  }, []);

  useEffect(() => {
    refreshAuthState();
    const handleStorageChange = () => refreshAuthState();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, [refreshAuthState]);

  useEffect(() => {
    const handleClickOutside = () => setIsSearchOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); setIsSearchOpen(false); return; }
    const q = query.toLowerCase();
    const results: SearchResult[] = [];
    catalogData.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        if (sub.name.toLowerCase().includes(q)) {
          sub.items.forEach((item) => results.push({ item, subName: sub.name, catName: cat.name }));
        }
        sub.items.forEach((item) => {
          if (item.toLowerCase().includes(q)) results.push({ item, subName: sub.name, catName: cat.name });
        });
      });
    });
    const unique = results.filter((r, i, arr) => arr.findIndex((x) => x.item === r.item && x.subName === r.subName) === i);
    setSearchResults(unique.slice(0, 10));
    setIsSearchOpen(unique.length > 0);
  }, []);

  const handleSelectResult = useCallback((result: SearchResult) => {
    setSearchQuery(result.item);
    setIsSearchOpen(false);
  }, []);

  // ✅ Katalog ochilganda birinchi kategoriya default
  const toggleKatalog = useCallback(() => {
    setIsKatalogOpen((prev) => {
      if (!prev) {
        setActiveCat(catalogData[0]);
        setActiveSub(catalogData[0].subCategories[0]);
      } else {
        setActiveCat(null);
        setActiveSub(null);
      }
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
    <div className="w-full border-b bg-white relative z-[1000]">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 md:px-6 py-2 text-[12px] text-gray-500 bg-gray-100 border-b">
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={openSidebar} className="flex items-center gap-1 text-gray-800" aria-label="Menyuni ochish">
            <IoMenu size={24} />
            <span className="font-bold text-[14px] hidden sm:block">Menyu</span>
          </button>
        </div>

        {/* ✅ Aktiv link styling */}
        <nav className="hidden lg:flex gap-4 font-medium">
          {topLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${pathname === link.href
                ? "text-red-600 border-b-2 border-red-600 pb-0.5"
                : "hover:text-red-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4 items-center">
          <span className="font-bold text-black text-[14px]">8 800 444 00 65</span>
          <button onClick={openModal} className="hidden sm:block cursor-pointer text-blue-600 font-bold border-b border-blue-600 border-dotted text-[10px] uppercase">
            {"Qo'ng'iroq qilishni so'rang"}
          </button>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src={Logo} alt="Logo" width={180} height={45} className="w-30 md:w-45" priority />
        </Link>

        <button
          onClick={toggleKatalog}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-sm font-bold bg-blue-600 text-white hover:bg-slate-800 transition-all shrink-0"
          aria-expanded={isKatalogOpen}
        >
          {isKatalogOpen ? <IoClose size={22} /> : <FaGripLines size={20} />}
          <span className="tracking-wider text-sm">KATALOG</span>
        </button>

        <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
            className="w-full h-10"
          />
          {isSearchOpen && searchResults.length > 0 && (
            <SearchResults results={searchResults} onSelect={handleSelectResult} />
          )}
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

      {/* MOBIL QIDIRUV VA KATALOG */}
      <div className="flex md:hidden gap-2 px-4 pb-4">
        <button onClick={toggleKatalog} className="bg-blue-600 text-white p-3 rounded-sm flex items-center justify-center gap-2" aria-expanded={isKatalogOpen}>
          {isKatalogOpen ? <IoClose size={22} /> : <FaGripLines size={20} />}
          <span className="tracking-wider text-sm">KATALOG</span>
        </button>

        <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
          <SearchInput value={searchQuery} onChange={handleSearch} onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)} className="h-11" inputClassName="px-3 h-full" />
          {isSearchOpen && searchResults.length > 0 && (
            <SearchResults results={searchResults} onSelect={handleSelectResult} isMobile />
          )}
        </div>
      </div>

      {/* KATALOG DROPDOWN */}
      {isKatalogOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t z-[1001] animate-in fade-in duration-200">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row h-auto md:h-[600px] overflow-hidden bg-white">

            {/* Kategoriyalar */}
            <div className={`w-full md:w-[320px] border-r bg-gray-50 overflow-y-auto ${activeCat ? "hidden md:block" : "block"}`}>
              {catalogData.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => { setActiveCat(cat); setActiveSub(null); }}
                  onMouseEnter={() => {
                    if (window.innerWidth > 768) {
                      setActiveCat(cat);
                      setActiveSub(cat.subCategories[0]);
                    }
                  }}
                  className={`px-5 py-4 flex justify-between items-center cursor-pointer text-[11px] font-bold uppercase border-b border-gray-100 transition-all ${activeCat?.id === cat.id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="pr-2">{cat.name}</span>
                  <FaChevronRight size={12} />
                </div>
              ))}
            </div>

            {/* Subkategoriyalar */}
            {activeCat && (
              <div className={`w-full md:w-80 border-r bg-white overflow-y-auto ${activeSub ? "hidden md:block" : "block"}`}>
                <div onClick={() => setActiveCat(null)} className="md:hidden p-4 bg-gray-100 flex items-center text-blue-600 font-bold border-b cursor-pointer">
                  <FaChevronLeft className="mr-2" /> Kategoriyalar
                </div>
                {activeCat.subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setActiveSub(sub)}
                    onMouseEnter={() => { if (window.innerWidth > 768) setActiveSub(sub); }}
                    className={`px-6 py-4 flex justify-between items-center cursor-pointer text-sm font-bold border-b border-gray-50 transition-all ${activeSub?.id === sub.id ? "text-blue-600 bg-blue-50" : "text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    {sub.name}
                    <FaChevronRight size={12} />
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            {activeSub && (
              <div className="w-full flex-1 bg-white overflow-y-auto">
                <div onClick={() => setActiveSub(null)} className="md:hidden p-4 bg-gray-100 flex items-center text-blue-600 font-bold border-b cursor-pointer">
                  <FaChevronLeft className="mr-2" /> {activeCat?.name.slice(0, 20)}...
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 content-start">
                  {activeSub.items.map((item, idx) => (
                    <div key={idx} className="text-gray-600 text-[14px] hover:text-blue-600 cursor-pointer font-medium p-2 border-b border-gray-50 md:border-transparent transition-all">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
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
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-4 border-b flex items-center ${link.icon ? "gap-3 text-gray-800 font-medium" : "text-gray-700 uppercase text-[13px] font-bold"
                    } ${pathname === link.href ? "text-red-600 bg-red-50" : "hover:bg-gray-50"}`}
                  onClick={closeSidebar}
                >
                  {link.icon && <span className="text-gray-400">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <Link href="/kabnet" className="p-4 border-b flex items-center gap-3 text-gray-700 hover:bg-gray-50" onClick={closeSidebar}>
                  <UserAvatar avatar={userData.avatar} username={userData.username} size="lg" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold uppercase">Shaxsiy hisob</span>
                    {userData.username && (
                      <span className="text-blue-600 text-[12px] font-medium truncate">{userData.username}</span>
                    )}
                  </div>
                </Link>
              ) : (
                <Link href="/kirish" className="p-4 border-b flex items-center text-gray-700 uppercase text-[13px] font-bold hover:bg-gray-50" onClick={closeSidebar}>
                  Kirish
                </Link>
              )}
            </nav>

            <div className="p-6 text-center border-t mt-4 mb-8">
              <div className="text-[22px] font-bold text-[#0c1c2b] mb-3">8 800 444 00 65</div>
              <button onClick={openModal} className="w-full py-4 px-4 bg-[#f0f4f8] text-blue-600 font-bold rounded-md uppercase text-[13px] tracking-widest mb-3">
                ZAKASAT ZVONOK
              </button>
              <div className="text-[13px] text-gray-500 italic">Har kuni, 8:00 dan 18:00 gacha</div>
            </div>
          </div>
        </div>
        <div className="w-full h-full" onClick={closeSidebar} />
      </div>

      {/* Overlay */}
      {isKatalogOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[999] mt-35 md:mt-40" onClick={() => setIsKatalogOpen(false)} />
      )}
    </div>
  );
}