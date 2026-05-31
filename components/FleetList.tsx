/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "./FleetCard";

const categories = ["Semua", "Excavator", "Truck", "Crane"];

export default function FleetList({ initialData }: { initialData: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");
  
  // Filter untuk unit yang tersedia
  const availableData = initialData.filter((i) => 
    !i.is_sold && (activeCat === "Semua" || i.category === activeCat)
  );

  // Filter untuk unit yang terjual (selalu ditampilkan di bagian bawah)
  const soldData = initialData.filter((i) => i.is_sold === true);

  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* --- SECTION: UNIT TERSEDIA --- */}
      <div className="mb-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-barlow text-white uppercase mb-4">
            Armada Tersedia
          </h2>
          <p className="text-slate-400 max-w-xl text-sm md:text-base">
            Jelajahi unit alat berat siap pakai yang mendukung produktivitas proyek Anda.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 md:gap-4 mb-10 overflow-x-auto pb-2 whitespace-nowrap scrollbar-none snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {availableData.length > 0 ? (
              availableData.map((fleet) => (
                <motion.div key={fleet.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                  <FleetCard fleet={fleet} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-slate-500 italic">Tidak ada unit tersedia dalam kategori ini.</p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- SECTION: ARSIP UNIT TERJUAL --- */}
      <div className="pt-12 border-t border-neutral-800">
        <h3 className="text-2xl md:text-3xl font-bold font-barlow text-white uppercase mb-8">
          Arsip Armada Terjual
        </h3>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-80 grayscale">
          {soldData.map((fleet) => (
            <div key={fleet.id} className="w-full">
              <FleetCard fleet={fleet} />
            </div>
          ))}
        </motion.div>
      </div>
      
    </section>
  );
}