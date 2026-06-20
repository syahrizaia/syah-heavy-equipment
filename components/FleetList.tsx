/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "./FleetCard";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FleetList({ initialData }: { initialData: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSoldPage, setCurrentSoldPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const ITEMS_PER_PAGE = 15; // Batas maksimal data per halaman

  const categories = [
    "Semua",
    ...Array.from(
      new Set(
        initialData
          .map((item) => item.category)
          .filter(Boolean)
      )
    ).sort()
  ];

  const sortedData = [...initialData].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA; // Mengurutkan dari waktu paling besar/baru
  });

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
    setCurrentSoldPage(1);

    if (!searchTerm.trim()) return;

    // Cari item yang cocok dengan kata kunci pencarian saat ini
    const matchingItems = sortedData.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.model?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    });

    // Jika ada item yang cocok, kirim array ID ke fungsi RPC Supabase
    if (matchingItems.length > 0) {
      const targetIds = matchingItems.map((item) => item.id);
      const { error } = await supabase.rpc("increment_fleet_search_count", {
        item_ids: targetIds,
      });

      if (error) {
        console.error("Gagal memperbarui data search_count:", error);
      }
    }
  };
  
  const filteredData = sortedData.filter((item) => {
    if (!appliedSearch) return true;
    const searchLower = appliedSearch.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.model?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });
  
  const availableData = filteredData.filter((i) => 
    !i.is_sold && (activeCat === "Semua" || i.category === activeCat)
  );
  const totalPages = Math.ceil(availableData.length / ITEMS_PER_PAGE);
  const paginatedAvailableData = availableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const soldData = filteredData.filter((i) => i.is_sold === true);
  const totalSoldPages = Math.ceil(soldData.length / ITEMS_PER_PAGE);
  const paginatedSoldData = soldData.slice(
    (currentSoldPage - 1) * ITEMS_PER_PAGE,
    currentSoldPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCat(cat);
    setCurrentPage(1);
  };

  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* --- SECTION: UNIT TERSEDIA --- */}
      <div className="mb-20">
       <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-barlow text-white uppercase mb-4">
              Armada Tersedia
            </h2>
            <p className="text-slate-400 max-w-xl text-sm md:text-base">
              Jelajahi unit alat berat siap pakai yang mendukung produktivitas proyek Anda.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Cari armada atau model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-600 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-600 text-neutral-950 px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 md:gap-4 mb-10 overflow-x-auto pb-2 whitespace-nowrap scrollbar-none snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 border font-bold uppercase text-xs tracking-widest transition-all flex-shrink-0 snap-start ${
                activeCat === cat 
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950" 
                  : "border-neutral-800 text-white hover:border-yellow-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Data - Menggunakan paginatedAvailableData */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedAvailableData.length > 0 ? (
              paginatedAvailableData.map((fleet) => (
                <motion.div key={fleet.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                  <FleetCard fleet={fleet} />
                </motion.div>
              ))
            ) : (
              <motion.p 
                key="empty-available"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="col-span-full text-slate-500 italic py-8"
              >
                Tidak ada unit tersedia dalam kategori ini.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- UI KOMPONEN PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {/* Tombol Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-3 border border-neutral-800 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Nomor Halaman */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 border font-bold text-xs transition-all ${
                  currentPage === page
                    ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                    : "border-neutral-800 text-white hover:border-yellow-600"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Tombol Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-3 border border-neutral-800 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* --- SECTION: ARSIP UNIT TERJUAL --- */}
      <div className="pt-12 border-t border-neutral-800">
        <h3 className="text-2xl md:text-3xl font-bold font-barlow text-white uppercase mb-8">
          Arsip Armada Terjual
        </h3>
        
        {/* Grid Data Terjual (Menggunakan paginatedSoldData) */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-80 grayscale">
          <AnimatePresence mode="popLayout">
            {paginatedSoldData.length > 0 ? (
              paginatedSoldData.map((fleet) => (
                <motion.div key={fleet.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                  <FleetCard fleet={fleet} />
                </motion.div>
              ))
            ) : (
              <motion.p 
                key="empty-sold"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="col-span-full text-slate-500 italic py-8"
              >
                Belum ada arsip unit yang terjual.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- TAMBAHAN: UI KOMPONEN PAGINATION UNTUK UNIT TERJUAL --- */}
        {totalSoldPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {/* Tombol Previous */}
            <button
              disabled={currentSoldPage === 1}
              onClick={() => setCurrentSoldPage((prev) => Math.max(prev - 1, 1))}
              className="p-3 border border-neutral-800 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Nomor Halaman */}
            {Array.from({ length: totalSoldPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentSoldPage(page)}
                className={`w-11 h-11 border font-bold text-xs transition-all ${
                  currentSoldPage === page
                    ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                    : "border-neutral-800 text-white hover:border-yellow-600"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Tombol Next */}
            <button
              disabled={currentSoldPage === totalSoldPages}
              onClick={() => setCurrentSoldPage((prev) => Math.min(prev + 1, totalSoldPages))}
              className="p-3 border border-neutral-800 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      
    </section>
  );
}