/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Wrench, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper komponen untuk statistik
function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex gap-4 items-center">
      <div className="text-yellow-600 shrink-0">{icon}</div>
      <div>
        <div className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest">{label}</div>
        <div className="font-bold text-sm md:text-base">{value}</div>
      </div>
    </div>
  )
}

export default function ProjectDetailContent({ project }: { project: any }) {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Navigation */}
        <Link href="/project" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Kembali ke Portfolio
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs md:text-sm">{project.sector}</span>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase mt-2 mb-6 leading-tight">
            {project.title}
          </h1>
          
          {/* Responsive Image Container */}
          <div className="relative w-full h-64 md:h-96 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </motion.div>

        {/* Body Section */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Description */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl md:text-2xl font-bold font-barlow">Ringkasan Proyek</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-lg">
              {project.description} Kami memberikan solusi komprehensif untuk tantangan di lapangan dengan mengedepankan efisiensi operasional dan standar keselamatan tinggi (K3). Proyek ini menunjukkan kapabilitas kami dalam mengelola logistik alat berat di medan yang kompleks.
            </p>
            
            <h3 className="text-xl md:text-2xl font-bold font-barlow pt-6">Tantangan & Solusi</h3>
            <ul className="space-y-4">
              {["Medan kerja dengan topografi curam", "Target penyelesaian yang ketat", "Integrasi sistem monitoring IoT"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                  <CheckCircle className="text-yellow-600 shrink-0 mt-1" size={18} /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 self-start rounded-xl w-full">
            <h4 className="font-bold font-barlow text-lg md:text-xl mb-6">Detail Proyek</h4>
            <div className="space-y-6">
              <StatItem icon={<MapPin size={20}/>} label="Lokasi" value={project.location} />
              <StatItem icon={<Calendar size={20}/>} label="Durasi" value="6 Bulan (2025)" />
              <StatItem icon={<Wrench size={20}/>} label="Alat Utama" value="Ekskavator, Dump Truck" />
            </div>
            
            <div className="mt-8 border-t border-neutral-800 pt-8">
                <p className="text-slate-400 text-xs mb-6">Tertarik dengan pendekatan teknis kami untuk proyek serupa?</p>
                <Link href="/contact" className="block text-center w-full bg-yellow-600 text-neutral-950 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors text-sm">
                    Diskusi Proyek
                </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}