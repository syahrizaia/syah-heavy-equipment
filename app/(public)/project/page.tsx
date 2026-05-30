"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const PROJECTS = [
  {
    id: 1,
    title: "Tambang Batubara Kalimantan",
    location: "Kalimantan Timur, Indonesia",
    sector: "Mining",
    description: "Pengerahan 50+ unit ekskavator heavy-duty untuk optimasi jalur logistik tambang.",
    image: "/project-mining.jpg" 
  },
  {
    id: 2,
    title: "Bendungan Irigasi Nasional",
    location: "Jawa Tengah, Indonesia",
    sector: "Infrastructure",
    description: "Pembangunan struktur beton dan pengerukan lahan seluas 200 hektar.",
    image: "/project-dam.jpg"
  },
  {
    id: 3,
    title: "Pipa Transmisi Gas",
    location: "Sumatera Selatan",
    sector: "Oil & Gas",
    description: "Pemasangan jalur pipa sepanjang 150km di medan rawa yang menantang.",
    image: "/project-oil.jpg"
  }
];

export const SECTORS = ["Semua", "Mining", "Infrastructure", "Oil & Gas"];

export default function ProyekPage() {
  const [activeSector, setActiveSector] = useState("Semua");

  const filteredProjects = activeSector === "Semua" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.sector === activeSector);

  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h2 className="text-yellow-600 font-bold tracking-[0.3em] uppercase">Portfolio Utama</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-barlow text-white uppercase mt-2">Rekam Jejak</h1>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-4 mb-12 flex-wrap">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-6 py-2 border font-bold uppercase text-xs tracking-widest transition-all ${
                activeSector === sector 
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950" 
                  : "border-neutral-800 text-white hover:border-yellow-600"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative overflow-hidden bg-neutral-900 border border-neutral-800"
              >
                {/* Image Placeholder */}
                <div className="h-64 bg-neutral-800 flex items-center justify-center text-neutral-600 italic">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                    width={400}
                    height={300}
                  />
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-yellow-600 mb-4">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{project.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-barlow text-white mb-2 group-hover:text-yellow-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-6 text-sm">{project.description}</p>
                  
                  <Link href={`/project/${project.id}`} className="flex items-center gap-2 text-white font-bold text-sm uppercase group-hover:text-yellow-600 transition-colors">
                    Lihat Studi Kasus <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}