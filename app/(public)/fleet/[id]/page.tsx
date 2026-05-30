/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShieldCheck, Ruler, Weight, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FLEET_DATA } from "../page";

function SpecCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 p-6 text-center">
            <div className="text-yellow-600 flex justify-center mb-3">{icon}</div>
            <div className="text-slate-500 text-xs uppercase mb-1">{label}</div>
            <div className="font-bold font-barlow text-lg">{value}</div>
        </div>
    )
}

export default function FleetDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  
  // Cari data armada berdasarkan ID
  const fleet = FLEET_DATA.find((item) => item.id === id);

  if (!fleet) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2>Armada tidak ditemukan.</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation back */}
        <Link href="/fleet" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-96 bg-neutral-900 border border-neutral-800 flex items-center justify-center relative"
          >
             {/* Replace with actual image tag */}
             {/* <span className="text-neutral-700 uppercase tracking-widest">[Visual Unit: {fleet.title}]</span> */}
             <div className="w-full h-full bg-neutral-950 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={fleet.image} 
                  alt={fleet.title} 
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                />
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold font-barlow mb-2">{fleet.title}</h1>
            <p className="text-yellow-600 text-xl font-bold mb-6">{fleet.model}</p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Unit ini dirancang untuk durabilitas tinggi di medan ekstrem. Menggunakan sistem kontrol IoT terbaru yang memungkinkan pemantauan kesehatan mesin secara real-time.
            </p>
            <Link href="/contact" className="bg-yellow-600 text-neutral-950 px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-all">
              Minta Penawaran
            </Link>
          </motion.div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            <SpecCard icon={<Weight size={24}/>} label="Berat" value={fleet.specs.weight} />
            <SpecCard icon={<Zap size={24}/>} label="Tenaga" value={fleet.specs.power} />
            <SpecCard icon={<Ruler size={24}/>} label="Kapasitas" value={fleet.specs.capacity} />
            <SpecCard icon={<ShieldCheck size={24}/>} label="Status" value="Ready" />
        </div>

        {/* Features List */}
        <div className="bg-neutral-900 p-10 border border-neutral-800">
            <h3 className="text-2xl font-bold font-barlow mb-8">Fitur Unggulan</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {["Sistem Telematika IoT Terintegrasi", "Efisiensi Bahan Bakar Tinggi", "Sertifikasi Keamanan K3", "Pemeliharaan Prediktif"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="text-yellow-600" size={20} />
                        {feat}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}