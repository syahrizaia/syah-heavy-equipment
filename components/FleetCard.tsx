/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Weight, Gauge, Zap } from "lucide-react";
import Link from "next/link";

export default function FleetCard({ fleet }: { fleet: any }) {
  const getFirstImage = () => {
    const images = Array.isArray(fleet.image_url) ? fleet.image_url : [fleet.image_url];
    const firstUrl = images[0] || "/placeholder.png";
    
    // Sanitasi URL agar tetap konsisten dengan perbaikan sebelumnya
    return firstUrl.startsWith("http") ? firstUrl : `/${firstUrl.replace(/^\//, '')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative bg-neutral-900 border border-neutral-800 p-6 rounded-2xl overflow-hidden hover:border-yellow-600/50 transition-colors"
    >
      {/* Garis Aksen Industrial */}
      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600/20 group-hover:bg-yellow-600 transition-colors" />
      
      <div className="mb-6 h-48 bg-neutral-950 rounded-lg flex items-center justify-center overflow-hidden">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          src={getFirstImage()} 
          alt={fleet.title} 
          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <h3 className="text-2xl font-bold font-barlow text-white mb-1 tracking-tight">{fleet.title}</h3>
      <p className="text-yellow-600 font-medium mb-6">{fleet.model}</p>

      <div className="grid grid-cols-3 gap-2 mb-6 border-y border-neutral-800 py-4">
        <div className="text-center">
          <Weight size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="text-[10px] text-slate-500 uppercase">{fleet.specs.weight}</span>
        </div>
        <div className="text-center border-x border-neutral-800">
          <Gauge size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="text-[10px] text-slate-500 uppercase">{fleet.specs.power}</span>
        </div>
        <div className="text-center">
          <Zap size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="text-[10px] text-slate-500 uppercase">{fleet.specs.capacity}</span>
        </div>
      </div>

      <Link href={`/fleet/${fleet.id}`} className="w-full py-3 flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 hover:bg-yellow-600 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">
        Lihat Detail <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}