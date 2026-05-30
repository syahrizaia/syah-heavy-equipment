/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "@/components/FleetCard";

const categories = ["Semua", "Excavator", "Truck", "Crane"];

export default function FleetSection({ data }: { data: any[] }) {
  const [activeCat, setActiveCat] = useState("Semua");

  const filteredData = activeCat === "Semua" 
    ? data 
    : data.filter((i) => i.category === activeCat);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold font-barlow mb-12">ARMADA KAMI</h2>
      
      {/* Kontrol Filter */}
      <div className="flex gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-6 py-2 border font-bold uppercase transition-all ${
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
          {filteredData.map((fleet) => (
            <motion.div
              key={fleet.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Kirim sebagai prop 'fleet' sesuai perbaikan sebelumnya */}
              <FleetCard fleet={fleet} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}