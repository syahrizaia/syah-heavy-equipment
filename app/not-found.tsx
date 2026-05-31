"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 text-center text-white">
      
      {/* Visual Error */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <AlertTriangle size={120} className="text-yellow-600 animate-pulse" />
          <div className="absolute inset-0 bg-yellow-600/20 blur-2xl rounded-full" />
        </div>
      </motion.div>

      {/* Konten */}
      <h1 className="text-6xl md:text-8xl font-barlow font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-6 font-barlow uppercase tracking-widest">
        Area Tidak Ditemukan
      </h2>
      <p className="max-w-md text-slate-500 mb-10 leading-relaxed">
        Sinyal tidak ditemukan di lokasi ini. Jalur yang Anda tuju mungkin sudah dipindahkan atau sedang dalam perbaikan teknis.
      </p>

      {/* Aksi - Diubah dari Link menjadi Button dengan aksi router.back() */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-3 bg-neutral-900 border border-neutral-700 hover:border-yellow-600 px-8 py-4 text-white font-bold uppercase tracking-widest transition-all cursor-pointer rounded-lg"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
        Kembali ke Lokasi Aman
      </button>
    </main>
  );
}