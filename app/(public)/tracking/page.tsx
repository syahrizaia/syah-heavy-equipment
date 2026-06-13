"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Search, ArrowRight, AlertCircle, HelpCircle, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function TrackingLandingPage() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = trackingNumber.trim();

    if (!targetId) {
      toast.error("Silakan masukkan Nomor Resi atau ID Pengiriman.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cek ke database Supabase (mencari berdasarkan ID atau No. Resi)
      const { data, error } = await supabase
        .from("shipments")
        .select("id, tracking_number")
        .or(`id.eq.${targetId},tracking_number.eq.${targetId}`)
        .single();

      if (data) {
        toast.success("Pengiriman ditemukan! Mengalihkan...");
        router.push(`/tracking/${data.id}`);
        return;
      }

      // 2. Fallback Demo Mode: Jika user memasukkan nomor resi mock dari halaman sebelumnya
      if (targetId === "SHE-TRK-20260614A" || targetId.toLowerCase() === "ship-9901") {
        toast.success("Mengakses data pengiriman demo...");
        router.push(`/tracking/ship-9901`);
        return;
      }

      // 3. Jika benar-benar tidak ditemukan
      toast.error("Nomor resi atau ID tidak terdaftar di sistem kami.");
    } catch (err) {
      // Jika terjadi error (misal tabel belum dibuat), tetap ijinkan redirect demo untuk kenyamanan testing
      if (targetId === "SHE-TRK-20260614A" || targetId.toLowerCase() === "ship-9901") {
        router.push(`/tracking/ship-9901`);
      } else {
        console.error("Tracking lookup error:", err);
        toast.error("Gagal memverifikasi resi. Pastikan format benar atau gunakan kode demo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-4 md:px-6 w-full flex flex-col justify-center items-center overflow-x-hidden relative">
      
      {/* Background Dekoratf Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-bold tracking-wider uppercase mb-4">
            <Compass size={14} className="animate-spin-slow" /> Real-Time Telemetry System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-barlow text-white uppercase tracking-tight">
            Lacak Mobilisasi <br className="hidden sm:inline"/> Alat Berat
          </h1>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Pantau pergerakan armada, status logistik log, dan koordinat GPS langsung dari satelit murni 3D terrain engine.
          </p>
        </motion.div>

        {/* Search Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden group hover:border-neutral-700 transition-colors"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
                Masukkan Nomor Resi / ID Mobilisasi
              </label>
              
              <div className="relative flex flex-col sm:flex-row gap-3 mt-1">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Contoh: SHE-TRK-20260614A"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-yellow-600/50 transition-colors text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-500 text-neutral-950 font-bold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase text-xs tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Memverifikasi..." : "Lacak Unit"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Demo Helper Box */}
          <div className="mt-6 pt-5 border-t border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle size={14} className="text-yellow-600 shrink-0" />
              <span>Ingin mencoba fitur simulasi peta live 3D?</span>
            </div>
            <button
              onClick={() => setTrackingNumber("SHE-TRK-20260614A")}
              className="text-yellow-500 hover:text-yellow-400 font-bold font-mono underline underline-offset-4 text-left transition-colors"
            >
              Gunakan Resi Demo
            </button>
          </div>
        </motion.div>

        {/* Panduan Tambahan Informasi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-4 mt-8"
        >
          <div className="bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-lg flex gap-3">
            <HelpCircle size={18} className="text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Dimana Nomor Resi Saya?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nomor resi logistik otomatis dikirimkan ke email korporat Anda atau tertera pada dokumen Surat Jalan (SAJ) bagian kanan atas.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-lg flex gap-3">
            <Truck size={18} className="text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Butuh Bantuan Logistik?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jika armada mengalami kendala lapangan atau status tidak berubah selama 2x24 jam, hubungi pusat kendali SHE Command Center.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}