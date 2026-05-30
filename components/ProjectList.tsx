/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SECTORS = ["Semua", "Mining", "Infrastructure", "Oil & Gas"];

export default function ProjectList({ projects }: { projects: any[] }) {
  const [activeSector, setActiveSector] = useState("Semua");

  const filteredProjects = activeSector === "Semua" 
    ? projects 
    : projects.filter(p => p.sector === activeSector);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filter - Sekarang Horizontal Scroll */}
      {/* 
        flex-nowrap: Mencegah tombol turun ke bawah
        overflow-x-auto: Mengaktifkan scroll horizontal
        [&::-webkit-scrollbar]:hidden: Menyembunyikan scrollbar (khusus Chrome/Safari/Edge)
        pb-4: Memberikan ruang agar scrollbar tidak menempel pada konten
      */}
      <div className="flex gap-4 mb-12 flex-nowrap overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            // flex-shrink-0: Penting agar tombol tidak mengecil saat di-scroll
            className={`px-6 py-2 border font-bold uppercase text-xs tracking-widest transition-all flex-shrink-0 whitespace-nowrap ${
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
              <div className="h-64 bg-neutral-800 flex items-center justify-center relative">
                <Image
                  src={project.image_url} 
                  alt={project.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              
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
  );
}