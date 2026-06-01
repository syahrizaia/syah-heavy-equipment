/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, ChevronLeft, ChevronRight, ShoppingCart, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function SparePartsCatalog() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12; // 12 item agar pas di grid 2, 3, atau 4 kolom
//   const WHATSAPP_NUMBER = "6281228134488";
  const WHATSAPP_NUMBER = "6281228134488";

  const fetchParts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("spare_parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error: any) {
      console.error("Gagal mengambil katalog suku cadang:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const categories = useMemo(() => {
    return ["Semua", ...Array.from(new Set(parts.map((item) => item.category))).sort()];
  }, [parts]);

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const matchesCategory = activeCat === "Semua" || part.category === activeCat;
      const matchesSearch =
        part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.part_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatibility?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [parts, searchQuery, activeCat]);

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);
  const paginatedParts = useMemo(() => {
    return filteredParts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredParts, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCat(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getWhatsAppLink = (part: any) => {
    const statusOrder = part.stock > 0 ? "READY STOCK" : "INDENT";
    
    const message = 
      `Halo Admin Spare Parts Center,\n\n` +
      `Saya tertarik untuk memesan suku cadang berikut ini:\n` +
      `--------------------------------------------------\n` +
      `• *Nama Barang* : ${part.name}\n` +
      `• *Part Number* : ${part.part_number}\n` +
      `• *Kategori* : ${part.category}\n` +
      `• *Kesesuaian* : ${part.compatibility}\n` +
      `• *Estimasi Harga* : ${part.price}\n` +
      `• *Status Unit* : *${statusOrder}*\n` +
      `--------------------------------------------------\n\n` +
      `Apakah suku cadang ini bisa segera diproses? Mohon informasi petunjuk transaksi selanjutnya. Terima kasih.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="bg-black text-white min-h-screen py-24 px-4 md:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="mb-12 border-b border-neutral-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="text-yellow-600" size={28} />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 font-barlow">Spare Parts Center</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-barlow uppercase mb-4 tracking-tight">
          Katalog Suku Cadang
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          Suku cadang asli dan berkualitas tinggi untuk memastikan unit alat berat Anda selalu beroperasi dengan performa maksimal tanpa kendala.
        </p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 w-full">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Cari nama suku cadang, part number, atau kecocokan..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 whitespace-nowrap scrollbar-none [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 border font-bold uppercase text-xs tracking-wider transition-all rounded-md ${
                activeCat === cat
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                  : "border-neutral-800 bg-neutral-900/50 text-slate-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS GRID & LOADER */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
          <Loader2 className="animate-spin text-yellow-600" size={32} />
          <span className="text-sm tracking-wider font-medium">Sinkronisasi produk Supabase...</span>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedParts.length > 0 ? (
              paginatedParts.map((part) => (
                <motion.div
                  key={part.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all group shadow-lg"
                >
                  {/* Foto Produk */}
                  <div className="relative h-44 w-full bg-neutral-950 overflow-hidden border-b border-neutral-800/60">
                    <Image
                      src={
                        (Array.isArray(part.image) 
                          ? part.image.filter((img: string) => img && img.trim() !== "")[0] 
                          : part.image) || 
                        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500"
                      }
                      alt={part.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-800 text-slate-400 rounded tracking-wider">
                        {part.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm ${
                        part.stock > 0 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {part.stock > 0 ? `Stok: ${part.stock}` : "Habis"}
                      </span>
                    </div>
                  </div>

                  {/* Spesifikasi Teknis */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-100 group-hover:text-yellow-500 transition-colors line-clamp-2 mb-1 min-h-[40px]">
                        {part.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mb-4">P/N: {part.part_number}</p>
                    </div>
                    
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/40 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-medium tracking-wider mb-0.5">Kesesuaian Unit:</span>
                      <span className="text-slate-300 font-medium line-clamp-1">{part.compatibility || "-"}</span>
                    </div>
                  </div>

                  {/* Harga & Tombol Interaksi */}
                  <div className="px-5 pb-5 border-t border-neutral-800/40 bg-neutral-950/20 flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-slate-500 tracking-wider">Estimasi Harga</span>
                      <span className="text-lg font-black text-white">{formatIDR(part.price)}</span>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <Link 
                        href={`/spare-part/${part.id}`} 
                        className="p-2.5 border border-neutral-800 hover:border-neutral-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors aspect-square"
                        title="Detail Produk"
                      >
                        <Info size={16} />
                      </Link>
                      
                      <Link
                        href={getWhatsAppLink(part)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          part.stock > 0 
                            ? "bg-yellow-600 hover:bg-yellow-500 text-neutral-950" 
                            : "bg-neutral-800 text-amber-500 hover:bg-neutral-700"
                        }`}
                      >
                        <ShoppingCart size={14} />
                        {part.stock > 0 ? "Pesan" : "Indent"}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
                <Info className="mx-auto mb-3 text-slate-600" size={32} />
                <p className="italic text-sm">Tidak ada produk suku cadang yang cocok dengan kriteria pencarian Anda.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* COMPONENT PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 border-t border-neutral-900 pt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-3 border border-neutral-800 bg-neutral-900/40 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-11 h-11 border font-bold text-xs rounded-lg transition-all ${
                currentPage === page
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                  : "border-neutral-800 bg-neutral-900/40 text-slate-400 hover:text-white hover:border-neutral-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-3 border border-neutral-800 bg-neutral-900/40 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      
    </section>
  );
}