/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldAlert, Cpu, Activity, Database, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PemeliharaanPrediktifPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [telemetry, setTelemetry] = useState({ rpm: 1200, temp: 82, vibration: 0.15 });
  const [diagForm, setDiagForm] = useState({
    fullName: "",
    companyName: "",
    machineModel: "",
    serialNumber: "",
    currentHours: "",
    issueDescription: ""
  });

  // Simulasi Telemetri Sensor IoT Real-Time (Data Science UI Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        rpm: Math.floor(1150 + Math.random() * 100),
        temp: Math.floor(80 + Math.random() * 5),
        vibration: parseFloat((0.12 + Math.random() * 0.06).toFixed(2))
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDiagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("maintenance_requests")
        .insert([
          {
            full_name: diagForm.fullName,
            company_name: diagForm.companyName || null,
            machine_model: diagForm.machineModel,
            serial_number: diagForm.serialNumber,
            current_hours: parseInt(diagForm.currentHours) || 0,
            issue_description: diagForm.issueDescription || null
          }
        ]);

      if (error) throw error;

      toast.success("Registrasi jadwal diagnostik IoT unit Anda telah berhasil disimpan!");
      setDiagForm({ fullName: "", companyName: "", machineModel: "", serialNumber: "", currentHours: "", issueDescription: "" });
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mengirim permintaan diagnostik.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back navigation & Header */}
        <div>
          <Link href="/service" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali ke Layanan
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-yellow-600 animate-pulse" size={28} />
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 font-barlow">IoT Optimization System</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase tracking-tight">Pemeliharaan Prediktif</h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base mt-2">
            Mencegah breakdown fatal sebelum terjadi. Menggunakan sensor getaran, analisis termal, dan telemetri IoT real-time untuk efisiensi alat berat Anda.
          </p>
        </div>

        {/* INTERACTIVE TELEMETRY MONITORING DISPLAY (Simulasi IoT Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Engine Speed</p>
                <h3 className="text-4xl font-mono font-bold mt-2 text-white">{telemetry.rpm} <span className="text-sm text-slate-500">RPM</span></h3>
              </div>
              <Cpu className="text-yellow-600" size={20} />
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-6 overflow-hidden">
              <motion.div animate={{ width: `${(telemetry.rpm / 1500) * 100}%` }} className="bg-yellow-600 h-full rounded-full"/>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Engine Temperature</p>
                <h3 className="text-4xl font-mono font-bold mt-2 text-white">{telemetry.temp} <span className="text-sm text-slate-500">°C</span></h3>
              </div>
              <Activity className="text-emerald-500" size={20} />
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-6 overflow-hidden">
              <motion.div animate={{ width: `${(telemetry.temp / 120) * 100}%` }} className="bg-emerald-500 h-full rounded-full"/>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hydraulic Vibration Index</p>
                <h3 className="text-4xl font-mono font-bold mt-2 text-white">{telemetry.vibration} <span className="text-sm text-slate-500">mm/s</span></h3>
              </div>
              <ShieldAlert className="text-blue-400" size={20} />
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-6 overflow-hidden">
              <motion.div animate={{ width: `${(telemetry.vibration / 0.3) * 100}%` }} className="bg-blue-400 h-full rounded-full"/>
            </div>
          </div>
        </div>

        {/* DATA ANALYTICS INSIGHTS & REGISTRATION FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Sisi Kiri: Penjelasan Alur Kerja Sains Data IoT */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold font-barlow uppercase tracking-wider text-white">Metodologi Deteksi Dini</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-neutral-900/40 rounded-xl border border-neutral-900">
                <Database className="text-yellow-600 flex-shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Algoritma Predictive Machine Learning</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Sistem membandingkan historical log jutaan jam kerja alat berat untuk memprediksi sisa usia pakai komponen mekanikal.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/40 rounded-xl border border-neutral-900">
                <CheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Penghematan Biaya Hingga 35%</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Menghindari downtime mendadak di tengah proyek strategis dengan penjadwalan suku cadang sebelum aus.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Formulir Diagnostik Unit */}
          <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-lg font-bold uppercase tracking-wider font-barlow text-white mb-2">Daftarkan Unit untuk Audit Diagnostik</h3>
            <p className="text-xs text-slate-400 mb-6">Kirimkan spesifikasi alat berat Anda saat ini untuk dianalisis oleh tim ahli telemetri kami.</p>

            <form onSubmit={handleDiagSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Nama Pengaju *</label>
                  <input required type="text" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white focus:outline-none focus:border-yellow-600/50" value={diagForm.fullName} onChange={(e) => setDiagForm({...diagForm, fullName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Nama Perusahaan</label>
                  <input type="text" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white focus:outline-none focus:border-yellow-600/50" value={diagForm.companyName} onChange={(e) => setDiagForm({...diagForm, companyName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-slate-400">Model Alat Berat *</label>
                  <input required type="text" placeholder="Contoh: CAT 320D / Komatsu D85ESS" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white focus:outline-none focus:border-yellow-600/50" value={diagForm.machineModel} onChange={(e) => setDiagForm({...diagForm, machineModel: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">HM (Hour Meter) *</label>
                  <input required type="number" placeholder="Contoh: 4500" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white focus:outline-none focus:border-yellow-600/50" value={diagForm.currentHours} onChange={(e) => setDiagForm({...diagForm, currentHours: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Nomor Seri (Serial Number) *</label>
                <input required type="text" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white focus:outline-none focus:border-yellow-600/50" value={diagForm.serialNumber} onChange={(e) => setDiagForm({...diagForm, serialNumber: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Gejala Kendala Saat Ini (Opsional)</label>
                <textarea rows={3} placeholder="Suhu cepat naik saat load berat, penurunan tekanan hidrolik..." className="p-3 bg-neutral-950 border border-neutral-800 rounded text-sm text-white resize-none focus:outline-none focus:border-yellow-600/50" value={diagForm.issueDescription} onChange={(e) => setDiagForm({...diagForm, issueDescription: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-500 text-neutral-950 font-bold py-3 uppercase text-xs tracking-wider rounded-lg transition-colors">
                {isSubmitting ? "Memproses Analisis..." : "Kirim Pengajuan Diagnostik"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}