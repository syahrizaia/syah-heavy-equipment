/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Weight, Gauge, Zap, Radio } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FleetCard({ fleet }: { fleet: any }) {
  const getFirstImage = () => {
    if (!fleet?.image_url) return "/placeholder.png";

    const images = Array.isArray(fleet.image_url) ? fleet.image_url : [fleet.image_url];
    const firstUrl = images[0] || "/placeholder.png";
    
    // Sanitasi URL agar tetap konsisten dengan perbaikan sebelumnya
    return firstUrl.startsWith("http") ? firstUrl : `/${firstUrl.replace(/^\//, '')}`;
  };

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return "Hubungi Kami";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const specs = fleet?.specs || {};

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden border border-white/[.09] bg-[#111827] p-4 transition-colors hover:border-amber-400/50 sm:p-5"
    >
      {/* Garis Aksen Industrial */}
      <div className="absolute left-0 top-0 z-10 h-full w-0.5 bg-amber-400/30 transition-colors group-hover:bg-amber-400" />
      
      <div className="relative mb-5 h-48 overflow-hidden border border-white/[.06] bg-[#090d16]">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 bg-[#090d16]/85 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300"><Radio size={11} className="signal-glow"/> Unit tersedia</div>
        <Image
          src={getFirstImage()}
          alt={fleet?.title || "Unit alat berat"}
          width={400}
          height={300}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 400px"
          className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-2xl font-bold font-barlow text-white mb-1 tracking-tight">
          {fleet?.title || "Tanpa Nama"}
        </h3>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-400">
          {fleet?.model || "-"}
        </p>
      </div>

      <div className="mb-5">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-[.18em] text-slate-500">
          Estimasi Harga
        </span>
        <span className={`font-mono text-lg font-bold ${
          fleet?.price ? "text-white" : "text-amber-400 italic text-sm"
        }`}>
          {formatPrice(fleet?.price)}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2 border-y border-white/[.08] py-4">
        <div className="text-center">
          <Weight size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="font-mono text-[9px] uppercase text-slate-400">{specs.weight || "-"}</span>
        </div>
        <div className="text-center border-x border-neutral-800">
          <Gauge size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="font-mono text-[9px] uppercase text-slate-400">{specs.power || "-"}</span>
        </div>
        <div className="text-center">
          <Zap size={18} className="mx-auto text-slate-400 mb-1" />
          <span className="font-mono text-[9px] uppercase text-slate-400">{specs.capacity || "-"}</span>
        </div>
      </div>

      <Link href={`/fleet/${fleet?.id}`} className="flex w-full items-center justify-center gap-2 border border-white/10 bg-white/[.03] py-3 text-xs font-bold uppercase tracking-[.14em] transition-all hover:border-amber-400 hover:bg-amber-400 hover:text-[#111827]">
        Lihat Detail <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
