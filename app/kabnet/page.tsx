"use client";

import { useGetProfileQuery, useEditProfilMutation } from "../../services/editProfileApi";
import { useChangeParolMutation } from "../../services/changePasswordApi";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaUserCircle, FaListUl, FaMapMarkerAlt, FaShieldAlt,
  FaSignOutAlt, FaChevronRight, FaEdit, FaTrash,
  FaHeart, FaBars, FaShoppingCart,
  FaRegEye, FaRegEyeSlash, FaPlus, FaTimes,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useGetWishlistQuery, useRemoveWishlistMutation } from "../../services/wishlistApi";
import { useGetPaymentsQuery } from "../../services/paymentsApi";
import {
  useGetOrderAddressesQuery,
  useCreateOrderAddressMutation,
  useDeleteOrderAddressMutation,
  useUpdateOrderAddressMutation,
  OrderAddress,
  CreateOrderAddressBody,
} from "../../services/orderAddressApi";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type SavedOrder = {
  id: string;
  date: string;
  status: string;
  amount: string;
  items: { id: number; name: string; image: string; price: number; quantity: number }[];
  delivery: string;
  payment: string;
  customer: { name: string; surname: string; phone: string; email: string };
};

type UserInfo = {
  username?: string;
  name?: string;
  surname?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
};

// ─────────────────────────────────────────────
// ADDRESS FORM CONFIG
// ─────────────────────────────────────────────
const EMPTY_ADDR: CreateOrderAddressBody = {
  first_name: "", last_name: "", phone: "", country: "O'zbekiston",
  region: "", city: "", district: "", street: "", house: "",
  apartment: "", postal_code: "", note: "", is_default: false,
};

const ADDR_FIELDS: {
  key: keyof CreateOrderAddressBody;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}[] = [
    { key: "first_name", label: "Ism", placeholder: "Ismingiz", required: true },
    { key: "last_name", label: "Familiya", placeholder: "Familiyangiz", required: true },
    { key: "phone", label: "Telefon", placeholder: "+998 90 123 45 67", required: true },
    { key: "country", label: "Mamlakat", placeholder: "O'zbekiston" },
    { key: "region", label: "Viloyat", placeholder: "Toshkent viloyati", required: true },
    { key: "city", label: "Shahar", placeholder: "Toshkent", required: true },
    { key: "district", label: "Tuman", placeholder: "Yunusobod tumani" },
    { key: "street", label: "Ko'cha", placeholder: "Amir Temur ko'chasi", required: true },
    { key: "house", label: "Uy raqami", placeholder: "37", required: true },
    { key: "apartment", label: "Xonadon", placeholder: "5" },
    { key: "postal_code", label: "Pochta indeksi", placeholder: "100084" },
    { key: "note", label: "Izoh", placeholder: "Qo'shimcha ma'lumot", textarea: true },
  ];

// ─────────────────────────────────────────────
// ADDRESS TAB
// ─────────────────────────────────────────────
function AddressTab() {
  const { data: addresses = [], isLoading: addrLoading } = useGetOrderAddressesQuery();
  const [createAddress, { isLoading: creating }] = useCreateOrderAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteOrderAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateOrderAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateOrderAddressBody>(EMPTY_ADDR);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const openNew = () => {
    setEditId(null); setForm(EMPTY_ADDR);
    setFormError(""); setFormSuccess(""); setShowForm(true);
  };

  const openEdit = (a: OrderAddress) => {
    setEditId(a.id);
    setForm({
      first_name: a.first_name, last_name: a.last_name, phone: a.phone,
      country: a.country, region: a.region, city: a.city, district: a.district,
      street: a.street, house: a.house, apartment: a.apartment,
      postal_code: a.postal_code, note: a.note, is_default: a.is_default,
    });
    setFormError(""); setFormSuccess(""); setShowForm(true);
  };

  const handleSave = async () => {
    setFormError(""); setFormSuccess("");
    const missing = ADDR_FIELDS.find((f) => f.required && !String(form[f.key] ?? "").trim());
    if (missing) { setFormError(`"${missing.label}" maydonini to'ldiring`); return; }
    try {
      if (editId !== null) {
        await updateAddress({ id: editId, body: form }).unwrap();
        setFormSuccess("Manzil yangilandi!");
      } else {
        await createAddress(form).unwrap();
        setFormSuccess("Yangi manzil qo'shildi!");
      }
      setTimeout(() => { setShowForm(false); setFormSuccess(""); }, 1200);
    } catch (err: any) {
      setFormError(err?.data?.detail || err?.data?.phone?.[0] || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu manzilni o'chirishni xohlaysizmi?")) return;
    try { await deleteAddress(id).unwrap(); }
    catch { alert("O'chirishda xatolik"); }
  };

  return (
    <div className="space-y-6">
      {/* FIX: 360px ekranda uzun sarlavha + "Yangi manzil" tugmasi bitta qatorga
          sig'masdi va tugma siqilib chiqib ketardi. Endi mobilda ular ustma-ust
          joylashadi, tugma to'liq kenglikni egallaydi; sm: dan boshlab (640px+)
          avvalgidek bitta qatorda, o'ng tomonda joylashadi. */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Yetkazib berish manzillari</h2>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-[#1D71D4] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1659a8] transition-all w-full sm:w-auto"
        >
          <FaPlus size={12} /> Yangi manzil
        </button>
      </div>

      {addrLoading && (
        <div className="text-center py-12 text-gray-400 text-sm">Yuklanmoqda...</div>
      )}

      {!addrLoading && addresses.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FaMapMarkerAlt className="mx-auto mb-3 text-4xl text-gray-200" />
          <p className="text-gray-400 text-sm mb-4">Hali manzil qo'shilmagan</p>
          <button onClick={openNew} className="text-blue-500 text-sm font-semibold hover:underline">
            + Yangi manzil qo'shish
          </button>
        </div>
      )}

      {!addrLoading && addresses.map((addr) => (
        <div key={addr.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-3 mb-3">
              <p className="font-bold text-gray-800">{addr.first_name} {addr.last_name}</p>
              {addr.is_default && (
                <span className="bg-[#F4F7FE] text-[#1D71D4] text-[10px] font-extrabold uppercase tracking-widest border border-blue-100 px-2.5 py-0.5 rounded">
                  Asosiy
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">{addr.phone}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-0.5">Manzil</p>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {[addr.postal_code, addr.country, addr.region, addr.city,
                  addr.district, addr.street, addr.house,
                  addr.apartment ? `${addr.apartment}-xonadon` : ""]
                    .filter(Boolean).join(", ")}
                </p>
              </div>
              {addr.note && (
                <div>
                  <p className="text-gray-400 mb-0.5">Izoh</p>
                  <p className="text-gray-700 font-medium">{addr.note}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex border-t border-gray-50 bg-gray-50/20 font-bold text-[10px] uppercase tracking-widest">
            <button
              onClick={() => openEdit(addr)}
              className="flex-1 p-4 flex items-center justify-center gap-2 text-gray-400 hover:bg-white hover:text-blue-500 border-r transition-all"
            >
              <FaEdit size={14} /> Tahrirlash
            </button>
            <button
              onClick={() => handleDelete(addr.id)}
              disabled={deleting}
              className="flex-1 p-4 flex items-center justify-center gap-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
            >
              <FaTrash size={14} /> O'chirish
            </button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-800">
              {editId !== null ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <FaTimes size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADDR_FIELDS.map(({ key, label, placeholder, required, textarea }) => (
              <div key={key} className={`${textarea ? "sm:col-span-2" : ""} grid gap-1.5`}>
                <label className="text-sm font-semibold text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {textarea ? (
                  <textarea
                    rows={3}
                    placeholder={placeholder}
                    value={String(form[key] ?? "")}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={String(form[key] ?? "")}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                  />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={!!form.is_default}
                  onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Asosiy manzil sifatida belgilash</span>
              </label>
            </div>
          </div>
          {formError && <p className="mt-4 text-red-500 text-sm font-medium">{formError}</p>}
          {formSuccess && <p className="mt-4 text-green-500 text-sm font-medium">{formSuccess}</p>}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              disabled={creating || updating}
              className="flex-1 bg-[#1D71D4] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1659a8] transition-all disabled:opacity-60"
            >
              {creating || updating ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
function ShaxsiyKabinetContent() {
  const { data: payments = [] } = useGetPaymentsQuery();
  const { data: wishlists = [], isLoading: wishlistLoading } = useGetWishlistQuery();
  const [removeWishlist] = useRemoveWishlistMutation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userOrders, setUserOrders] = useState<SavedOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // ── localStorage dan user ma'lumotlari ──
  useEffect(() => {
    const keys = ["user", "userInfo", "userData", "authUser", "currentUser"];
    let found: UserInfo | null = null;
    for (const key of keys) {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        try { found = JSON.parse(raw); break; }
        catch { found = { username: raw }; break; }
      }
    }
    setUserInfo(found);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "orders" || activeTab === "dashboard") {
      const raw = localStorage.getItem("userOrders");
      try { setUserOrders(raw ? JSON.parse(raw) : []); }
      catch { setUserOrders([]); }
      setCurrentPage(1);
    }
  }, [activeTab]);

  const handleLogout = () => {
    [
      "user", "userInfo", "userData", "authUser", "currentUser",
      "token", "access", "access_token", "accessToken",
      "refresh_token", "refresh", "refreshToken", "userOrders",
    ].forEach((k) => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    window.dispatchEvent(new Event("authChange"));
    setUserInfo(null); setUserOrders([]);
    router.push("/kirish");
  };

  const getUserDisplayName = () => {
    if (!userInfo) return "Foydalanuvchi";
    if (userInfo.full_name) return userInfo.full_name;
    if (userInfo.first_name && userInfo.last_name) return `${userInfo.first_name} ${userInfo.last_name}`;
    if (userInfo.name && userInfo.surname) return `${userInfo.name} ${userInfo.surname}`;
    return userInfo.name || userInfo.first_name || userInfo.username || "Foydalanuvchi";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const totalPages = Math.ceil(userOrders.length / ITEMS_PER_PAGE);
  const currentOrders = userOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes("YETKAZILDI") || s.includes("BAJARILDI")) return "border-emerald-400 text-emerald-600 bg-emerald-50";
    if (s.includes("JARAYONDA") || s.includes("KUTILMOQDA") || s.includes("YO'LDA")) return "border-orange-300 text-orange-500 bg-orange-50";
    if (s.includes("BEKOR")) return "border-red-300 text-red-500 bg-red-50";
    return "border-blue-300 text-blue-500 bg-blue-50";
  };

  // ── Password state ──
  const [passValues, setPassValues] = useState({ old: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [changeParol, { isLoading: passLoading }] = useChangeParolMutation();

  const handleChangePassword = async () => {
    setPassError(""); setPassSuccess("");
    if (!passValues.old || !passValues.new || !passValues.confirm) { setPassError("Barcha maydonlarni to'ldiring"); return; }
    if (passValues.new !== passValues.confirm) { setPassError("Yangi parollar mos kelmadi"); return; }
    try {
      await changeParol({ old_password: passValues.old, new_password: passValues.new } as any).unwrap();
      setPassSuccess("Parol muvaffaqiyatli o'zgartirildi!");
      setPassValues({ old: "", new: "", confirm: "" });
    } catch (err: any) {
      setPassError(err?.data?.detail || err?.data?.old_password?.[0] || "Xatolik yuz berdi");
    }
  };

  // ── Profile state ──
  const [profileValues, setProfileValues] = useState({ username: "", email: "", first_name: "", last_name: "" });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const { data: profile } = useGetProfileQuery();
  const [editProfil, { isLoading: profileLoading }] = useEditProfilMutation();

  useEffect(() => {
    if (profile) {
      setProfileValues({
        username: profile.username || "", email: profile.email || "",
        first_name: profile.first_name || "", last_name: profile.last_name || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setProfileError(""); setProfileSuccess("");
    if (!profileValues.username.trim()) { setProfileError("Username majburiy"); return; }
    if (!profileValues.email.trim()) { setProfileError("Email majburiy"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileValues.email)) { setProfileError("Email formati noto'g'ri"); return; }
    if (
      profile?.email === profileValues.email &&
      profile?.username === profileValues.username &&
      profile?.first_name === profileValues.first_name &&
      profile?.last_name === profileValues.last_name
    ) { setProfileError("Hech qanday o'zgarish yo'q"); return; }
    try {
      await editProfil(profileValues).unwrap();
      setProfileSuccess("Profil muvaffaqiyatli yangilandi!");
    } catch (err: any) {
      const d = err?.data;
      if (d?.email?.[0]?.includes("already exists")) setProfileError("Bu email allaqachon ro'yxatdan o'tgan");
      else if (d?.username?.[0]?.includes("already exists")) setProfileError("Bu username allaqachon band");
      else setProfileError(d?.email?.[0] || d?.username?.[0] || d?.detail || "Xatolik yuz berdi");
    }
  };

  // ── Nav items ──
  const navItems = [
    { id: "dashboard", label: "Mening hisobim", icon: <FaUserCircle size={18} /> },
    { id: "profile", label: "Profilni tahrirlash", icon: <LiaUserEditSolid size={18} /> },
    { id: "orders", label: "Mening buyurtmalarim", icon: <FaListUl size={18} />, badge: payments.length },
    { id: "address", label: "Yetkazib berish manzili", icon: <FaMapMarkerAlt size={18} /> },
    { id: "favorites", label: "Tanlangan tovarlar", icon: <FaHeart size={18} />, badge: wishlists.length },
    { id: "password", label: "Parolni o'zgartirish", icon: <FaShieldAlt size={18} /> },
  ];

  const menuCards = [
    { id: "orders", label: "MENING BUYURTMALARIM", icon: <FaListUl size={24} />, badge: payments.length },
    { id: "profile", label: "PROFILNI TAHRIRLASH", icon: <FiUser size={24} /> },
    { id: "address", label: "YETKAZIB BERISH MANZILI", icon: <FaMapMarkerAlt size={24} /> },
    { id: "favorites", label: "TANLANGAN TOVARLAR", icon: <FaHeart size={24} />, badge: wishlists.length },
    { id: "password", label: "PAROLNI O'ZGARTIRISH", icon: <FaShieldAlt size={24} /> },
    { id: "logout", label: "CHIQISH", icon: <FaSignOutAlt size={24} /> },
  ];

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label || "Mening hisobim";

  const handleTabChange = (id: string) => {
    if (id === "logout") { handleLogout(); return; }
    setActiveTab(id); setMobileMenuOpen(false);
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">

        <p className="text-xs text-gray-400 mb-2">Bosh sahifa / Shaxsiy kabinet</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shaxsiy kabinet</h1>

        {/* Foydalanuvchi kartochkasi */}
        {userInfo && (
          <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#1D71D4] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {getUserInitials()}
            </div>
            <div>
              <p className="font-bold text-gray-800">{getUserDisplayName()}</p>
              {userInfo.email && <p className="text-sm text-gray-400">{userInfo.email}</p>}
            </div>
          </div>
        )}

        {/* Mobile menyu */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="w-full flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700"
          >
            <div className="flex items-center gap-2"><FaBars size={16} /><span>Menyu profili</span></div>
            <span className="text-gray-400 text-xs">{activeLabel}</span>
          </button>
          {mobileMenuOpen && (
            <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between p-4 border-b last:border-b-0 text-sm transition-all ${activeTab === item.id ? "bg-[#0F172A] text-white" : "hover:bg-gray-50 text-gray-600"
                    }`}
                >
                  <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
                  {(item as any).badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-red-500 text-white" : "bg-red-100 text-red-500"}`}>
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 text-sm font-bold"
              >
                <FaSignOutAlt size={18} /> Chiqish
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-5">
            {userInfo && (
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-[#1D71D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {getUserInitials()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-sm text-gray-800 truncate">{getUserDisplayName()}</p>
                  {userInfo.email && <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>}
                </div>
              </div>
            )}
            <nav className="flex flex-col text-sm font-medium">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center justify-between p-4 border-b transition-all ${activeTab === item.id ? "bg-[#0F172A] text-white" : "hover:bg-gray-50 text-gray-600"
                    }`}
                >
                  <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
                  {(item as any).badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-red-500 text-white" : "bg-red-100 text-red-500"}`}>
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 transition-all font-bold"
              >
                <FaSignOutAlt size={18} /> Chiqish
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 w-full">

            {/* ── DASHBOARD ── */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <p className="text-lg md:text-xl font-medium">
                  Assalomu alaykum, <span className="font-bold text-[#1D71D4]">{getUserDisplayName()}</span>!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                  {menuCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleTabChange(card.id)}
                      className={`relative flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border bg-white transition-all duration-200 group ${card.id === "logout" ? "hover:bg-red-50" : "hover:bg-blue-50"
                        }`}
                    >
                      {(card as any).badge > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {(card as any).badge}
                        </span>
                      )}
                      <div className={`mb-3 text-gray-400 ${card.id === "logout" ? "group-hover:text-red-500" : "group-hover:text-blue-600"}`}>
                        {card.icon}
                      </div>
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase text-center tracking-wider ${card.id === "logout" ? "group-hover:text-red-500" : ""}`}>
                        {card.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Joriy buyurtmalar</h2>
                  <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-4 md:px-6 py-4">Raqam</th>
                          <th className="px-4 md:px-6 py-4">Sana</th>
                          <th className="px-4 md:px-6 py-4">Status</th>
                          <th className="px-4 md:px-6 py-4">Jami</th>
                          <th className="px-4 md:px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {userOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">
                              Hozircha buyurtmalar yo'q
                            </td>
                          </tr>
                        ) : (
                          userOrders.slice(0, 5).map((o, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 md:px-6 py-4 text-sm text-gray-600 font-medium">{o.id}</td>
                              <td className="px-4 md:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{o.date}</td>
                              <td className="px-4 md:px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-[10px] font-bold uppercase ${getStatusStyles(o.status)}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />{o.status}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-base font-semibold text-[#1D406E] whitespace-nowrap">{o.amount} so'm</td>
                              <td className="px-4 md:px-6 py-4 text-right">
                                <Link
                                  href={`/buyurtma/${encodeURIComponent(o.id.replace("#", ""))}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                                >
                                  <FaChevronRight size={11} />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Profilni tahrirlash</h2>
                <div className="space-y-4">
                  {[
                    { label: "Username", type: "text", placeholder: "Username kiriting", key: "username", required: true },
                    { label: "Email", type: "email", placeholder: "Emailingizni kiriting", key: "email", required: true },
                    { label: "Ism", type: "text", placeholder: "Ismingizni kiriting", key: "first_name", required: false },
                    { label: "Familiya", type: "text", placeholder: "Familiyangizni kiriting", key: "last_name", required: false },
                  ].map(({ label, type, placeholder, key, required }) => (
                    <div key={key} className="grid gap-2">
                      <label className="text-sm font-semibold">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={profileValues[key as keyof typeof profileValues]}
                        onChange={(e) => setProfileValues((p) => ({ ...p, [key]: e.target.value }))}
                        className={`w-full p-3 border rounded-lg outline-none transition-all ${required && !profileValues[key as keyof typeof profileValues]
                          ? "border-red-200 focus:border-red-400"
                          : "border-gray-200 focus:border-blue-500"
                          }`}
                      />
                    </div>
                  ))}
                  {profileError && <p className="text-red-500 text-sm font-medium">{profileError}</p>}
                  {profileSuccess && <p className="text-green-500 text-sm font-medium">{profileSuccess}</p>}
                  <button
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    className="w-full bg-[#1D71D4] text-white py-4 rounded-lg font-bold hover:bg-[#1659a8] transition-all uppercase mt-4 disabled:opacity-60"
                  >
                    {profileLoading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                  </button>
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === "orders" && (
              <div className="w-full bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-[#1D2939]">Buyurtma tarixi</h2>

                {userOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl w-15 mx-auto mb-4 flex justify-center text-gray-300">
                      <FaShoppingCart />
                    </p>
                    <p className="text-gray-400 text-sm">Hozircha buyurtmalar yo'q</p>
                    <Link
                      href="/katalog"
                      className="inline-block mt-4 text-blue-500 text-sm font-semibold hover:underline"
                    >
                      Xaridni boshlash →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[480px]">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-4 md:px-6 py-4">Raqam</th>
                            <th className="px-4 md:px-6 py-4">Sana</th>
                            <th className="px-4 md:px-6 py-4">Status</th>
                            <th className="px-4 md:px-6 py-4">Jami</th>
                            <th className="px-4 md:px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentOrders.map((o, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 md:px-6 py-4 text-sm text-gray-600 font-medium">
                                {o.id}
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {o.date}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-[10px] font-bold uppercase ${getStatusStyles(o.status)}`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  {o.status}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-base font-semibold text-[#1D406E] whitespace-nowrap">
                                {o.amount} so'm
                              </td>
                              <td className="px-4 md:px-6 py-4 text-right">
                                <Link href={`/buyurtma/${encodeURIComponent(o.id.replace("#", ""))}`}>
                                  <button className="p-2.5 bg-gray-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                                    <FaChevronRight size={12} />
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          ← Nazad
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${currentPage === page
                              ? "bg-[#1a1a1a] text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          Dalye →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Mening yetkazib berish manzilim</h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between p-5 md:p-6 gap-4 md:gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-4">{getUserDisplayName()}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Manzil</p>
                          <p className="text-gray-700 font-medium leading-relaxed">056734, Toshkent, O'zbekiston, Amir Temur ko'chasi, 37/5</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Telefon</p>
                          <p className="text-gray-700 font-medium">{userInfo?.phone || '+998 (90) 123-45-67'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Email</p>
                          <p className="text-gray-700 font-medium break-all">{userInfo?.email || 'example@gmail.com'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#F4F7FE] text-[#1D71D4] h-fit px-4 py-2 rounded flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest border border-blue-50 self-start">
                      <Link href="/aloqa" className="flex justify-center gap-2 items-center">
                        <FaMapMarkerAlt /> Tasdiqlangan manzil
                      </Link>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-50 bg-gray-50/20 font-bold text-[10px] uppercase tracking-widest">
                    <button className="flex-1 p-4 flex items-center justify-center gap-2 text-gray-400 hover:bg-white hover:text-blue-500 border-r transition-all">
                      <FaEdit size={14} /> Tahrirlash
                    </button>
                    <button className="flex-1 p-4 flex items-center justify-center gap-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                      <FaTrash size={14} /> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── ADDRESS ── */}
            {activeTab === "address" && <AddressTab />}

            {/* ── FAVORITES ── */}
            {activeTab === "favorites" && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Sevimlilar</h2>
                {wishlistLoading ? (
                  <div className="py-10 text-center text-gray-400 text-sm">Yuklanmoqda...</div>
                ) : wishlists.length === 0 ? (
                  <p className="text-gray-400 text-sm py-10 text-center">Hali sevimlilar yo'q</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {wishlists.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.product_detail?.image
                              ? <img src={item.product_detail.image} alt={item.product_detail.name} className="object-contain w-full h-full p-1" />
                              : <span className="text-[10px] text-gray-400">Rasm</span>}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{item.product_detail?.name}</h3>
                            <p className="text-red-500 font-medium text-sm">{item.product_detail?.price?.toLocaleString()} so'm</p>
                          </div>
                        </div>
                        <button onClick={() => removeWishlist(item.id)} className="p-2">
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PASSWORD ── */}
            {activeTab === "password" && (
              <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-8 text-[#1D2939]">Parolni o'zgartirish</h2>
                <div className="space-y-5">
                  {[
                    { key: "old", label: "Amaldagi parol", placeholder: "Amaldagi parol" },
                    { key: "new", label: "Yangi parol", placeholder: "Parolni kiriting" },
                    { key: "confirm", label: "Parolni takrorlang", placeholder: "Parolni kiriting" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="grid gap-2">
                      <label className="text-sm font-semibold text-[#344054]">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPass[key as keyof typeof showPass] ? "text" : "password"}
                          placeholder={placeholder}
                          value={passValues[key as keyof typeof passValues]}
                          onChange={(e) => setPassValues((p) => ({ ...p, [key]: e.target.value }))}
                          className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((p) => ({ ...p, [key]: !p[key as keyof typeof showPass] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPass[key as keyof typeof showPass] ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {passError && <p className="text-red-500 text-sm font-medium">{passError}</p>}
                  {passSuccess && <p className="text-green-500 text-sm font-medium">{passSuccess}</p>}
                  <button
                    onClick={handleChangePassword}
                    disabled={passLoading}
                    className="w-full bg-[#1D71D4] text-white py-4 rounded-xl font-bold hover:bg-[#1659a8] transition-all uppercase tracking-wider disabled:opacity-60"
                  >
                    {passLoading ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}


export default function ShaxsiyKabinet() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-400 text-sm">
        Yuklanmoqda...
      </div>
    }>
      <ShaxsiyKabinetContent />
    </Suspense>
  );
}