/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Wrench, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PROJECTS } from "../page";
import Image from "next/image";

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex gap-4 items-center">
            <div className="text-yellow-600">{icon}</div>
            <div>
                <div className="text-slate-500 text-xs uppercase">{label}</div>
                <div className="font-bold">{value}</div>
            </div>
        </div>
    )
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return <div className="min-h-screen text-white flex items-center justify-center">Proyek tidak ditemukan.</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <Link href="/project" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Portfolio
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-sm">{project.sector}</span>
          <h1 className="text-4xl md:text-6xl font-bold font-barlow uppercase mt-2 mb-6">{project.title}</h1>
          <div className="h-64 md:h-96 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-700">
            <Image
                src={project.image}
                alt={project.title}
                className="object-cover w-full h-full"
                width={800}
                height={600}
            />
          </div>
        </motion.div>

        {/* Body Section */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column: Description */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold font-barlow">Ringkasan Proyek</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              {project.description} Kami memberikan solusi komprehensif untuk tantangan di lapangan dengan mengedepankan efisiensi operasional dan standar keselamatan tinggi (K3). Proyek ini menunjukkan kapabilitas kami dalam mengelola logistik alat berat di medan yang kompleks.
            </p>
            
            <h3 className="text-2xl font-bold font-barlow pt-6">Tantangan & Solusi</h3>
            <ul className="space-y-4">
              {["Medan kerja dengan topografi curam", "Target penyelesaian yang ketat", "Integrasi sistem monitoring IoT"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="text-yellow-600" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="bg-neutral-900 border border-neutral-800 p-8 self-start">
            <h4 className="font-bold font-barlow text-xl mb-6">Detail Proyek</h4>
            <div className="space-y-6">
              <StatItem icon={<MapPin size={20}/>} label="Lokasi" value={project.location} />
              <StatItem icon={<Calendar size={20}/>} label="Durasi" value="6 Bulan (2025)" />
              <StatItem icon={<Wrench size={20}/>} label="Alat Utama" value="Ekskavator, Dump Truck" />
            </div>
            
            <div className="mt-10 border-t border-neutral-800 pt-8">
                <p className="text-slate-400 text-sm mb-6">Tertarik dengan pendekatan teknis kami untuk proyek serupa?</p>
                <Link href="/contact" className="block text-center w-full bg-yellow-600 text-neutral-950 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Diskusi Proyek
                </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
