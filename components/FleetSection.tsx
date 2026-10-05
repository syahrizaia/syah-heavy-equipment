/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "@/components/FleetCard";
import Link from "next/link";

export default function FleetSection({ data }: { data: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");

  const categories = [
    "Semua",
    ...Array.from(
      new Set(
        data
          .map((item) => item.category) // Ambil semua kategori dari data
          .filter(Boolean)              // Saring nilai null / undefined jika ada
      )
    ).sort()                            // Urutkan dari A-Z agar rapi
  ];

  const sortedData = [...data].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  // Tambahkan filter: hanya tampilkan unit jika is_sold adalah false/falsy
  const filteredData = sortedData.filter((i) => {
    const isCategoryMatch = activeCat === "Semua" || i.category === activeCat;
    const isNotSold = !i.is_sold; // Menghilangkan unit yang sudah terjual
    return isCategoryMatch && isNotSold;
  });

  const limitedData = filteredData.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-5 py-20 sm:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
        <div><p className="mb-2 font-mono text-[10px] uppercase tracking-[.24em] text-amber-400">Fleet / ready for deployment</p><h2 className="font-barlow text-4xl font-bold uppercase sm:text-5xl">Armada kami</h2></div>
        <Link
          href="/fleet" 
          className="inline-block shrink-0 border border-white/15 bg-white/[.03] px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[.16em] text-white transition hover:border-amber-400 hover:text-amber-300 sm:text-left"
        >
          Lihat Semua Armada
        </Link>
      </div>
      
      {/* Kontrol Filter */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-3 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`shrink-0 snap-start border px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all md:text-xs ${
              activeCat === cat 
                ? "border-amber-400 bg-amber-400 text-[#090d16]"
                : "border-white/10 text-slate-300 hover:border-amber-400/60 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Kartu */}
      <motion.div layout className="grid md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {limitedData.length > 0 ? (
            limitedData.map((fleet) => (
              <motion.div
                key={fleet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FleetCard fleet={fleet} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500 py-10">
              Mohon maaf, saat ini tidak ada unit tersedia dalam kategori ini.
            </p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
