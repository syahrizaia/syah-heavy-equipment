/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "./FleetCard";

const categories = ["Semua", "Excavator", "Truck", "Crane"];

export default function FleetList({ initialData }: { initialData: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");
  
  const filteredData = activeCat === "Semua" 
    ? initialData 
    : initialData.filter((i) => i.category === activeCat);

  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-bold font-barlow text-white uppercase mb-4">
          Armada Kami
        </h2>
        <p className="text-slate-400 max-w-xl text-sm md:text-base">
          Jelajahi unit alat berat kami yang siap mendukung produktivitas proyek Anda di medan tersulit sekalipun.
        </p>
      </div>

      {/* Filter Buttons - Menggunakan flex-wrap agar rapi di mobile */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 md:px-6 md:py-2 border font-bold uppercase text-xs tracking-widest transition-all ${
              activeCat === cat 
                ? "bg-yellow-600 border-yellow-600 text-neutral-950" 
                : "border-neutral-800 text-white hover:border-yellow-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid - Menggunakan responsive grid columns */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((fleet) => (
            <motion.div
              key={fleet.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <FleetCard fleet={fleet} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}