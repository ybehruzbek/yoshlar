"use client";

import { useState } from "react";
import { MagnifyingGlass, IdentificationCard, ShieldCheck, WarningCircle, UserCircle, MapPin, Phone, Money, TrendUp, Clock, Receipt } from "@phosphor-icons/react";
import Image from "next/image";
import { formatMoney } from "@/lib/utils/format";

export default function FuqaroClient() {
  const [jshshir, setJshshir] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jshshir.length !== 14) {
      setError("JSHSHIR 14 ta raqamdan iborat bo'lishi kerak");
      return;
    }

    setIsLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/fuqaro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jshshir }),
      });

      const result = await res.json();
      
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || "Ma'lumot topilmadi");
      }
    } catch (err) {
      setError("Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uz-UZ");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            YI
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 leading-tight">Yoshlar Ittifoqi</h1>
            <p className="text-xs text-gray-500">Qarzdorlik holatini tekshirish</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-2xl">
          
          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
              <ShieldCheck size={32} weight="duotone" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Qarzdorlikni tekshirish</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              O'zingizning JSHSHIR (PINFL) raqamingizni kiritish orqali Yoshlar Ittifoqidan olingan qarz holatini ko'rishingiz mumkin.
            </p>

            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative flex items-center mb-4">
                <IdentificationCard className="absolute left-4 text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="JSHSHIR (14 ta raqam)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg font-medium tracking-wider"
                  value={jshshir}
                  onChange={(e) => setJshshir(e.target.value.replace(/[^0-9]/g, '').substring(0, 14))}
                  maxLength={14}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 justify-center">
                  <WarningCircle size={20} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || jshshir.length !== 14}
                className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <MagnifyingGlass size={24} />
                    Tekshirish
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          {data && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <UserCircle size={20} className="text-gray-400" />
                  <h3 className="font-medium text-gray-700">Shaxsiy ma'lumotlar</h3>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">{data.fish}</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-gray-50 rounded-lg text-gray-500">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Yashash manzili</p>
                        <p className="text-gray-900 font-medium">{data.manzil}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-gray-50 rounded-lg text-gray-500">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Telefon raqami</p>
                        <p className="text-gray-900 font-medium">{data.telefon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loans list */}
              {data.loans.map((loan: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt size={20} className="text-gray-400" />
                      <h3 className="font-medium text-gray-700">Shartnoma: {loan.turi}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      loan.holat === 'faol' ? 'bg-green-100 text-green-700' :
                      loan.holat === 'yopilgan' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {loan.holat.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Money size={18} />
                          <span className="text-xs font-medium uppercase">Jami qarz</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{formatMoney(loan.qarzSummasi)} s.</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <TrendUp size={18} />
                          <span className="text-xs font-medium uppercase">To'langan</span>
                        </div>
                        <p className="text-xl font-bold text-blue-700">{formatMoney(loan.tolanganSumma)} s.</p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                          <Clock size={18} />
                          <span className="text-xs font-medium uppercase">Qoldiq</span>
                        </div>
                        <p className="text-xl font-bold text-orange-700">{formatMoney(loan.qoldiq)} s.</p>
                      </div>
                    </div>

                    {loan.tolovlar.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">To'lovlar tarixi</h4>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                              <tr>
                                <th className="px-4 py-3 font-medium">Sana</th>
                                <th className="px-4 py-3 font-medium">Summa</th>
                                <th className="px-4 py-3 font-medium">To'lov turi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {loan.tolovlar.slice(0, 5).map((p: any, j: number) => (
                                <tr key={j}>
                                  <td className="px-4 py-3 text-gray-600">{formatDate(p.sana)}</td>
                                  <td className="px-4 py-3 font-medium text-gray-900">{formatMoney(p.summa)} so'm</td>
                                  <td className="px-4 py-3 text-gray-500 capitalize">{p.usul}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {loan.tolovlar.length > 5 && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                              + yana {loan.tolovlar.length - 5} ta to'lov (faqat oxirgi 5 tasi ko'rsatildi)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} O'zbekiston Yoshlar Ittifoqi. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  );
}
