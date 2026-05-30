/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Zap, Gauge } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex gap-4 items-center">
      <div className="text-yellow-600 shrink-0">{icon}</div>
      <div>
        <div className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest">{label}</div>
        <div className="font-bold text-sm md:text-base">{value}</div>
      </div>
    </div>
  );
}

export default function FleetDetailContent({ fleet }: { fleet: any }) {
//   const whatsappNumber = "6281228134488";
  const whatsappNumber = "6282114487163"; 

  const message = `Halo, saya tertarik untuk membeli unit berikut:

Nama Unit: ${fleet.title || "-"}
Kategori: ${fleet.category || "-"}
Model: ${fleet.model || "-"}

Mohon informasi lebih lanjut mengenai ketersediaan dan prosedur pembeliannya. Terima kasih.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Navigation */}
        <Link href="/fleet" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs md:text-sm">{fleet.category}</span>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase mt-2 mb-6 leading-tight">{fleet.title}</h1>
          
          {/* Responsive Image Container */}
          <div className="relative w-full h-64 md:h-[400px] bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <Image
                src={fleet.image_url || "/placeholder.jpg"}
                alt={fleet.title}
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
            <h3 className="text-xl md:text-2xl font-bold font-barlow">Deskripsi Unit</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-lg">
              {fleet.description || "Unit ini dirancang untuk performa maksimal di medan yang menantang. Dengan efisiensi bahan bakar yang optimal dan durabilitas tinggi, unit ini menjadi pilihan utama untuk operasional skala besar."}
            </p>
            
            <h3 className="text-xl md:text-2xl font-bold font-barlow pt-6">Spesifikasi Teknis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pastikan data spesifikasi ada */}
              {fleet.specs && Object.entries(fleet.specs).map(([key, value]: any) => (
                <div key={key} className="p-4 border border-neutral-800 rounded bg-neutral-900/50">
                    <span className="text-slate-500 text-xs block uppercase mb-1">{key}</span>
                    <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 self-start rounded-xl">
            <h4 className="font-bold font-barlow text-lg md:text-xl mb-6">Ringkasan Unit</h4>
            <div className="space-y-6">
              <StatItem icon={<Gauge size={20}/>} label="Model" value={fleet.model || "-"} />
              <StatItem icon={<Zap size={20}/>} label="Kategori" value={fleet.category || "-"} />
              <StatItem icon={<MapPin size={20}/>} label="Status" value="Tersedia" />
            </div>
            
            {/* Tombol Beli Unit Terintegrasi WhatsApp */}
            <div className="mt-8 border-t border-neutral-800 pt-8">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full bg-yellow-600 text-neutral-950 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors text-sm"
                >
                    Beli Unit
                </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}