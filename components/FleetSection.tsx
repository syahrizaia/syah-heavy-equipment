/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "@/components/FleetCard";

const categories = ["Semua", "Excavator", "Truck", "Crane"];

export default function FleetSection({ data }: { data: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");

  // Tambahkan filter: hanya tampilkan unit jika is_sold adalah false/falsy
  const filteredData = data.filter((i) => {
    const isCategoryMatch = activeCat === "Semua" || i.category === activeCat;
    const isNotSold = !i.is_sold; // Menghilangkan unit yang sudah terjual
    return isCategoryMatch && isNotSold;
  });

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full overflow-hidden">
      <h2 className="text-4xl font-bold font-barlow mb-12">ARMADA KAMI</h2>
      
      {/* Kontrol Filter */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-3 whitespace-nowrap scrollbar-none snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-6 py-2.5 border font-bold uppercase transition-all text-xs md:text-sm snap-start flex-shrink-0 ${
              activeCat === cat 
                ? "bg-yellow-600 border-yellow-600 text-neutral-950" 
                : "border-neutral-800 hover:border-yellow-600 text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Kartu */}
      <motion.div layout className="grid md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredData.length > 0 ? (
            filteredData.map((fleet) => (
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