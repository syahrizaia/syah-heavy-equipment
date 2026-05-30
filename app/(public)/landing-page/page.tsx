/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Cog, BarChart3 } from "lucide-react";
import FleetCard from "@/components/FleetCard";
import MachineHealthChart from "@/components/MachineHealthChart";
import { useState } from "react";
import Link from "next/link";

const fleetData = [
  { id: 1, title: "Excavator XE-900", category: "Excavator", model: "Series-X", specs: { weight: "45 Ton", power: "350 hp", capacity: "2.5m³" }, image: "/excavator.jpg" },
  { id: 2, title: "Dump Truck DT-500", category: "Truck", model: "Heavy Haul", specs: { weight: "30 Ton", power: "500 hp", capacity: "20m³" }, image: "/truck.jpg" },
  { id: 3, title: "Crane CR-120", category: "Crane", model: "Precision Lift", specs: { weight: "60 Ton", power: "400 hp", capacity: "120 Ton" }, image: "/crane.jpg" },
];

const categories = ["Semua", "Excavator", "Truck", "Crane"];

function StatusIndicator({ label, status, alert }: any) {
  return (
    <div className="flex justify-between items-center p-3 border-b border-neutral-800">
      <span className="text-white text-sm">{label}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded ${alert ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
        {status}
      </span>
    </div>
  );
}

export default function LandingPage() {
    const [activeCat, setActiveCat] = useState("Semua");
    const filteredData = activeCat === "Semua" ? fleetData : fleetData.filter(i => i.category === activeCat);
  
  return (
    <main className="bg-neutral-950 min-h-screen text-white overflow-hidden">
      
      {/* 1. Hero Section: Dramatis & Industrial */}
      <section className="relative h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-yellow-600/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-yellow-600 font-barlow font-bold tracking-[0.4em] uppercase mb-4">Membangun Masa Depan</h2>
            <h1 className="text-6xl md:text-9xl font-bold font-barlow leading-none mb-8">
              SYAH <br/><span className="stroke-white">HEAVY EQUIPMENT</span>
            </h1>
            <p className="max-w-lg text-slate-400 text-lg mb-10 leading-relaxed">
              Solusi alat berat terintegrasi dengan teknologi IoT untuk efisiensi operasional maksimal di lokasi kerja tersulit sekalipun.
            </p>
            <div className="flex gap-6">
              <Link href="/fleet" className="bg-yellow-600 text-neutral-950 px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Lihat Katalog
              </Link>
              <Link href="/contact" className="border border-neutral-700 px-8 py-4 font-bold uppercase tracking-widest hover:border-yellow-600 transition-colors">
                Konsultasi Proyek
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

        <section className="p-6 md:p-16 bg-neutral-950">
            <h1 className="text-4xl font-barlow font-bold text-white mb-8">OPERATIONAL STATUS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Chart */}
                <div className="lg:col-span-2">
                <MachineHealthChart />
                </div>
                
                {/* Kolom Kanan: Status Mesin */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                <h4 className="text-slate-400 text-sm uppercase mb-4">Status Komponen</h4>
                <div className="space-y-4">
                    <StatusIndicator label="Hidrolik" status="Optimal" />
                    <StatusIndicator label="Sistem Bahan Bakar" status="Perlu Perawatan" alert />
                    <StatusIndicator label="Engine Oil" status="Normal" />
                </div>
                </div>
            </div>
        </section>

      {/* 2. Features Section: Keunggulan Teknis */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { icon: <ShieldCheck size={40} />, title: "Durabilitas Tinggi", desc: "Material konstruksi kelas militer untuk pemakaian ekstrem." },
            { icon: <Cog size={40} />, title: "Inovasi IoT", desc: "Monitor performa mesin secara real-time via satelit." },
            { icon: <BarChart3 size={40} />, title: "Efisiensi Maksimal", desc: "Optimasi konsumsi bahan bakar hingga 25% lebih hemat." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 border-l-2 border-yellow-600 bg-neutral-900"
            >
              <div className="text-yellow-600 mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4 font-barlow">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fleet Section dengan Filter Terintegrasi */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold font-barlow mb-12">ARMADA KAMI</h2>
        
        {/* Kontrol Filter */}
        <div className="flex gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2 border font-bold uppercase transition-all ${
                activeCat === cat ? "bg-yellow-600 border-yellow-600 text-neutral-950" : "border-neutral-800 hover:border-yellow-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Kartu dengan Animasi Filter */}
        <motion.div layout className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FleetCard {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

    </main>
  );
}