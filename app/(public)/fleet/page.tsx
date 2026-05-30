"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FleetCard from "@/components/FleetCard";

export const FLEET_DATA = [
  {
    id: 1,
    title: "Excavator XE-900",
    category: "Excavator",
    model: "Series-X Heavy Duty",
    image: "/excavator.jpg",
    specs: { weight: "45 Ton", power: "350 HP", capacity: "2.5 m³" }
  },
  {
    id: 2,
    title: "Dump Truck DT-500",
    category: "Truck",
    model: "Heavy Haul Pro",
    image: "/truck.jpg",
    specs: { weight: "30 Ton", power: "500 HP", capacity: "20 m³" }
  },
  {
    id: 3,
    title: "Crane CR-120",
    category: "Crane",
    model: "Precision Lift",
    image: "/crane.jpg",
    specs: { weight: "60 Ton", power: "400 HP", capacity: "120 Ton" }
  }
];

const categories = ["Semua", "Excavator", "Truck", "Crane"];

export default function ArmadaPage() {
  const [activeCat, setActiveCat] = useState("Semua");

  const filteredData = activeCat === "Semua" 
    ? FLEET_DATA 
    : FLEET_DATA.filter(item => item.category === activeCat);

  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-barlow text-white uppercase">Armada Kami</h1>
          <div className="h-1 w-20 bg-yellow-600 mt-4" />
        </motion.div>

        {/* Filter Section */}
        <div className="flex gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-8 py-3 border font-bold uppercase tracking-widest text-sm transition-all ${
                activeCat === cat 
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950" 
                  : "border-neutral-800 text-white hover:border-yellow-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <FleetCard {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}