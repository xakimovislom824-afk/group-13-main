"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaPlus, FaTimes } from "react-icons/fa";
import {
  useGetOrderAddressesQuery,
  useCreateOrderAddressMutation,
  useDeleteOrderAddressMutation,
  useUpdateOrderAddressMutation,
  OrderAddress,
  CreateOrderAddressBody,
} from "../../services/orderAddressApi";

// ── Bo'sh forma qiymatlari ──
const EMPTY_FORM: CreateOrderAddressBody = {
  first_name: "",
  last_name: "",
  phone: "",
  country: "O'zbekiston",
  region: "",
  city: "",
  district: "",
  street: "",
  house: "",
  apartment: "",
  postal_code: "",
  note: "",
  is_default: false,
};

// ── Forma maydonlari konfiguratsiyasi ──
const FIELDS: {
  key: keyof CreateOrderAddressBody;
  label: string;
  placeholder: string;
  required?: boolean;
  half?: boolean;
}[] = [
  { key: "first_name",   label: "Ism",           placeholder: "Ismingiz",          required: true,  half: true  },
  { key: "last_name",    label: "Familiya",       placeholder: "Familiyangiz",      required: true,  half: true  },
  { key: "phone",        label: "Telefon",        placeholder: "+998 90 123 45 67", required: true,  half: true  },
  { key: "country",      label: "Mamlakat",       placeholder: "O'zbekiston",                        half: true  },
  { key: "region",       label: "Viloyat",        placeholder: "Toshkent viloyati", required: true,  half: true  },
  { key: "city",         label: "Shahar",         placeholder: "Toshkent",          required: true,  half: true  },
  { key: "district",     label: "Tuman",          placeholder: "Yunusobod tumani",                   half: true  },
  { key: "street",       label: "Ko'cha",         placeholder: "Amir Temur ko'chasi",required: true, half: true  },
  { key: "house",        label: "Uy raqami",      placeholder: "37",                required: true,  half: true  },
  { key: "apartment",    label: "Xonadon",        placeholder: "5",                                  half: true  },
  { key: "postal_code",  label: "Pochta indeksi", placeholder: "100084",                             half: true  },
  { key: "note",         label: "Izoh",           placeholder: "Qo'shimcha ma'lumot",               half: false },
];

export default function AddressTab() {
  const { data: addresses = [], isLoading } = useGetOrderAddressesQuery();
  const [createAddress, { isLoading: creating }] = useCreateOrderAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteOrderAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateOrderAddressMutation();

  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [formValues, setFormValues] = useState<CreateOrderAddressBody>(EMPTY_FORM);
  const [formError, setFormError]   = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // ── Forma ochish (yangi) ──
  const handleOpenNew = () => {
    setEditId(null);
    setFormValues(EMPTY_FORM);
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  // ── Forma ochish (tahrirlash) ──
  const handleEdit = (addr: OrderAddress) => {
    setEditId(addr.id);
    setFormValues({
      first_name:  addr.first_name,
      last_name:   addr.last_name,
      phone:       addr.phone,
      country:     addr.country,
      region:      addr.region,
      city:        addr.city,
      district:    addr.district,
      street:      addr.street,
      house:       addr.house,
      apartment:   addr.apartment,
      postal_code: addr.postal_code,
      note:        addr.note,
      is_default:  addr.is_default,
    });
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  // ── Saqlash (create yoki update) ──
  const handleSave = async () => {
    setFormError("");
    setFormSuccess("");

    // Majburiy maydonlar tekshiruvi
    const required = FIELDS.filter((f) => f.required);
    for (const f of required) {
      if (!String(formValues[f.key] ?? "").trim()) {
        setFormError(`"${f.label}" maydonini to'ldiring`);
        return;
      }
    }

    try {
      if (editId !== null) {
        await updateAddress({ id: editId, body: formValues }).unwrap();
        setFormSuccess("Manzil muvaffaqiyatli yangilandi!");
      } else {
        await createAddress(formValues).unwrap();
        setFormSuccess("Yangi manzil qo'shildi!");
      }
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess("");
      }, 1200);
    } catch (err: any) {
      setFormError(
        err?.data?.detail ||
        err?.data?.phone?.[0] ||
        err?.data?.non_field_errors?.[0] ||
        "Xatolik yuz berdi"
      );
    }
  };

  // ── O'chirish ──
  const handleDelete = async (id: number) => {
    if (!confirm("Bu manzilni o'chirishni xohlaysizmi?")) return;
    try {
      await deleteAddress(id).unwrap();
    } catch {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="space-y-6">
      {/* Sarlavha + Qo'shish tugmasi */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Yetkazib berish manzillari</h2>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-[#1D71D4] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1659a8] transition-all"
        >
          <FaPlus size={12} /> Yangi manzil
        </button>
      </div>

      {/* ── Yuklanmoqda ── */}
      {isLoading && (
        <div className="text-center py-12 text-gray-400 text-sm">Yuklanmoqda...</div>
      )}

      {/* ── Manzillar ro'yxati ── */}
      {!isLoading && addresses.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FaMapMarkerAlt className="mx-auto mb-3 text-4xl text-gray-200" />
          <p className="text-gray-400 text-sm mb-4">Hali manzil qo'shilmagan</p>
          <button
            onClick={handleOpenNew}
            className="text-blue-500 text-sm font-semibold hover:underline"
          >
            + Yangi manzil qo'shish
          </button>
        </div>
      )}

      {!isLoading && addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Manzil ma'lumotlari */}
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800">
                    {addr.first_name} {addr.last_name}
                  </p>
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
                        addr.apartment ? `${addr.apartment}-xonadon` : ""
                      ].filter(Boolean).join(", ")}
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
            </div>
          </div>

          {/* Tahrirlash / O'chirish */}
          <div className="flex border-t border-gray-50 bg-gray-50/20 font-bold text-[10px] uppercase tracking-widest">
            <button
              onClick={() => handleEdit(addr)}
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

      {/* ── Forma (yangi / tahrirlash) ── */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-800">
              {editId !== null ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ key, label, placeholder, required, half }) => {
              if (key === "note") {
                return (
                  <div key={key} className="sm:col-span-2 grid gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">{label}</label>
                    <textarea
                      rows={3}
                      placeholder={placeholder}
                      value={String(formValues[key] ?? "")}
                      onChange={(e) =>
                        setFormValues((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none text-sm"
                    />
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  className={`${half ? "" : "sm:col-span-2"} grid gap-1.5`}
                >
                  <label className="text-sm font-semibold text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={String(formValues[key] ?? "")}
                    onChange={(e) =>
                      setFormValues((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                  />
                </div>
              );
            })}

            {/* is_default checkbox */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={!!formValues.is_default}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, is_default: e.target.checked }))
                  }
                  className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Asosiy manzil sifatida belgilash
                </span>
              </label>
            </div>
          </div>

          {/* Xato / muvaffaqiyat */}
          {formError && (
            <p className="mt-4 text-red-500 text-sm font-medium">{formError}</p>
          )}
          {formSuccess && (
            <p className="mt-4 text-green-500 text-sm font-medium">{formSuccess}</p>
          )}

          {/* Tugmalar */}
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