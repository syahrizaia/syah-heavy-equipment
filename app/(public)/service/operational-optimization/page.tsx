/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, TrendingUp, Gauge, Fuel, Calculator, ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OperationalOptimizationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fuelInput, setFuelInput] = useState("");
  const [estimatedSavings, setEstimatedSavings] = useState<number | null>(null);
  
  const [optForm, setOptForm] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    fleetSize: "",
    optimizationFocus: "Efisiensi Bahan Bakar",
    additionalNotes: ""
  });

  const whatsappNumber = "6281228134488";

  // Fungsi kalkulator simulasi penghematan bahan bakar (Rata-rata optimasi kami sebesar 15 persen)
  const calculateSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelCost = parseFloat(fuelInput);
    if (!isNaN(fuelCost) && fuelCost > 0) {
      const savings = fuelCost * 0.15;
      setEstimatedSavings(savings);
    } else {
      setEstimatedSavings(null);
    }
  };

  const handleOptimizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Langkah 1: Simpan data ke database Supabase
      const { error } = await supabase
        .from("operational_optimization_requests")
        .insert([
          {
            full_name: optForm.fullName,
            company_name: optForm.companyName || null,
            phone_number: optForm.phoneNumber,
            fleet_size: parseInt(optForm.fleetSize) || 0,
            optimization_focus: optForm.optimizationFocus,
            additional_notes: optForm.additionalNotes || null
          }
        ]);

      if (error) throw error;

      // Langkah 2: Format pesan untuk konsultasi WhatsApp
      const message = `PENGAJUAN AUDIT OPTIMASI OPERASIONAL ARMADA

Nama Pengaju: ${optForm.fullName}
Perusahaan: ${optForm.companyName || "-"}
Nomor Kontak: ${optForm.phoneNumber}
Jumlah Armada: ${optForm.fleetSize} Unit
Fokus Utama: ${optForm.optimizationFocus}
Catatan Tambahan: ${optForm.additionalNotes || "-"}

Mohon jadwalkan sesi presentasi dan audit awal operasional bersama tim konsultan ahli.`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      toast.success("Data konsultasi berhasil disimpan dan diteruskan ke WhatsApp.");
      setOptForm({
        fullName: "",
        companyName: "",
        phoneNumber: "",
        fleetSize: "",
        optimizationFocus: "Efisiensi Bahan Bakar",
        additionalNotes: ""
      });

    } catch (error: any) {
      console.error("Error saving optimization request:", error);
      toast.error("Gagal mengirim data pengajuan. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Tombol Kembali dan Judul Halaman */}
        <div>
          <Link href="/service" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali ke Layanan
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-yellow-600 animate-spin-slow" size={28} />
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 font-barlow">Fleet Productivity Engineering</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase tracking-tight">Optimasi Operasional</h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base mt-2">
            Tingkatkan profitabilitas proyek bermargin ketat. Kami menganalisis pola kerja operator, rute mobilisasi site, serta memangkas pemborosan bahan bakar akibat mesin menyala statis tanpa produktivitas.
          </p>
        </div>

        {/* Tiga Metrik Keberhasilan Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-600/10 flex items-center justify-center text-yellow-600 flex-shrink-0">
              <Fuel size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Reduksi Konsumsi BBM</h3>
              <p className="text-2xl font-bold font-barlow text-white mt-1">Hingga 15 Persen</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Melalui eliminasi perilaku idle berlebih dan optimalisasi beban angkut mekanis unit.</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Efisiensi Siklus Kerja</h3>
              <p className="text-2xl font-bold font-barlow text-white mt-1">Meningkat 22 Persen</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Penyusunan ulang pola gerak kombinasi excavator dan dump truck berdasarkan kontur tanah.</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Gauge size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Skor Kompetensi Operator</h3>
              <p className="text-2xl font-bold font-barlow text-white mt-1">Terpantau Digital</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rapor performa individu untuk mendeteksi tindakan operasional ekstrim yang merusak komponen.</p>
            </div>
          </div>
        </div>

        {/* Simulasi Interaktif dan Formulir Pendaftaran */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Kolom Kiri: Kalkulator Finansial */}
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold font-barlow uppercase text-white flex items-center gap-2">
              <Calculator size={18} className="text-yellow-600" />
              Kalkulator Potensi Penghematan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Masukkan total estimasi biaya pengeluaran bahan bakar solar seluruh armada proyek Anda dalam satu bulan untuk melihat potensi efisiensi struktur anggaran setelah program audit operasional kami diterapkan.
            </p>

            <form onSubmit={calculateSavings} className="space-y-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Biaya BBM Bulanan saat ini (Rupiah)</label>
                <input 
                  required
                  type="number" 
                  placeholder="Contoh: 100000000" 
                  className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={fuelInput}
                  onChange={(e) => setFuelInput(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 font-bold rounded text-xs uppercase tracking-wider transition-colors">
                Kalkulasikan Estimasi
              </button>
            </form>

            {estimatedSavings !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg space-y-1"
              >
                <p className="text-xs text-yellow-600 uppercase tracking-wider font-bold">Potensi Anggaran yang Terselamatkan</p>
                <p className="text-xl font-mono font-bold text-white">
                  Rp {estimatedSavings.toLocaleString("id-ID")} <span className="text-xs text-slate-400">/ Bulan</span>
                </p>
                <p className="text-slate-500 font-medium text-xs pt-1 leading-relaxed">
                  Nilai di atas dihitung berdasarkan rata-rata rekam keberhasilan reduksi emisi dan jam kerja statis tanpa beban pada proyek serupa.
                </p>
              </motion.div>
            )}
          </div>

          {/* Kolom Kanan: Formulir Pengajuan Konsultasi Strategis */}
          <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider font-barlow text-white mb-1">Ajukan Evaluasi Efisiensi Site</h3>
            <p className="text-xs text-slate-400 mb-6">Hubungkan sistem manajemen armada Anda dengan metodologi sains data terapan kami.</p>

            <form onSubmit={handleOptimizationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Lengkap Pemohon (Wajib)</label>
                  <input required type="text" placeholder="Contoh: Hendra Wijaya" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={optForm.fullName} onChange={(e) => setOptForm({...optForm, fullName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Perusahaan / Instansi (Opsional)</label>
                  <input type="text" placeholder="Contoh: PT. Borneo Konstruksi" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={optForm.companyName} onChange={(e) => setOptForm({...optForm, companyName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nomor Konten Telepon Aktif (Wajib)</label>
                  <input required type="tel" placeholder="Contoh: 0813xxxxxxxx" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={optForm.phoneNumber} onChange={(e) => setOptForm({...optForm, phoneNumber: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Total Jumlah Armada Unit di Lapangan (Wajib)</label>
                  <input required type="number" placeholder="Contoh: 12" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={optForm.fleetSize} onChange={(e) => setOptForm({...optForm, fleetSize: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Fokus Utama Penghematan yang Diinginkan (Wajib)</label>
                <select className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors cursor-pointer" value={optForm.optimizationFocus} onChange={(e) => setOptForm({...optForm, optimizationFocus: e.target.value})}>
                  <option value="Efisiensi Bahan Bakar">Efisiensi Bahan Bakar Solar (Fuel Management System)</option>
                  <option value="Peningkatan Ritase Operator">Peningkatan Ritase Angkut Operator (Operator Performance Scoring)</option>
                  <option value="Penyusunan Ulang Layout Rute Site">Penyusunan Ulang Layout Rute Logistik Site (Cycle Time Audit)</option>
                  <option value="Manajemen Kombinasi Menyeluruh">Kombinasi Seluruh Aspek Operasional</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Keterangan Tambahan Mengenai Kondisi Medan Kerja</label>
                <textarea rows={3} placeholder="Contoh: Area tambang terbuka dengan rute menanjak terjal, kendala komunikasi sinyal seluler di lapangan, atau tipe material batuan keras..." className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm resize-none focus:outline-none focus:border-yellow-600/50 transition-colors" value={optForm.additionalNotes} onChange={(e) => setOptForm({...optForm, additionalNotes: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-500 text-neutral-950 py-3.5 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                <BarChart3 size={18} />
                {isSubmitting ? "Mengamankan Jadwal..." : "Ajukan Sesi Paparan Strategis"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}