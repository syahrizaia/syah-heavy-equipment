/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Wrench, Clock, ShieldCheck, AlertTriangle, MapPin, PhoneCall, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function FieldTechnicalSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportForm, setSupportForm] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    projectLocation: "",
    machineModel: "",
    urgencyLevel: "Normal",
    issueDetails: ""
  });

  const whatsappNumber = "6281228134488";

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Langkah 1: Simpan data pelaporan ke database Supabase
      const { error } = await supabase
        .from("field_support_requests")
        .insert([
          {
            full_name: supportForm.fullName,
            company_name: supportForm.companyName || null,
            phone_number: supportForm.phoneNumber,
            project_location: supportForm.projectLocation,
            machine_model: supportForm.machineModel,
            urgency_level: supportForm.urgencyLevel,
            issue_details: supportForm.issueDetails
          }
        ]);

      if (error) throw error;

      // Langkah 2: Format pesan untuk diteruskan ke tim dispatch WhatsApp
      const message = `PANGGILAN DARURAT TEKNISI FIELD SUPPORT

Nama Pengaju: ${supportForm.fullName}
Perusahaan: ${supportForm.companyName || "-"}
Nomor Kontak: ${supportForm.phoneNumber}
Lokasi Unit: ${supportForm.projectLocation}
Model Alat Berat: ${supportForm.machineModel}
Tingkat Urgensi: ${supportForm.urgencyLevel.toUpperCase()}
Detail Kendala: ${supportForm.issueDetails}

Mohon segera koordinasikan mekanik terdekat ke lokasi proyek.`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Buka tautan komunikasi darurat
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      toast.success("Laporan kendala berhasil dikirim dan tersimpan di sistem.");
      setSupportForm({
        fullName: "",
        companyName: "",
        phoneNumber: "",
        projectLocation: "",
        machineModel: "",
        urgencyLevel: "Normal",
        issueDetails: ""
      });

    } catch (error: any) {
      console.error("Error dispatching support:", error);
      toast.error("Gagal mengirim laporan darurat. Silakan periksa koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigasi dan Judul Utama */}
        <div>
          <Link href="/service" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali ke Layanan
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="text-yellow-600" size={28} />
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 font-barlow">24/7 Rapid Emergency Response</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase tracking-tight">Dukungan Teknis Lapangan</h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base mt-2">
            Minimalisir waktu henti operasional proyek Anda. Tim mekanik bersertifikasi kami siap melakukan mobilisasi langsung ke lokasi kerja untuk menangani segala jenis perbaikan darurat komponen mekanikal dan hidrolikal.
          </p>
        </div>

        {/* Tiga Pilar Parameter Keunggulan Teknis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600/10 flex items-center justify-center text-yellow-600">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold font-barlow uppercase">Respon Cepat 4 Jam</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Komitmen penanganan cepat untuk wilayah jangkauan utama. Mekanik terdekat akan diberangkatkan menuju lokasi dalam kurun waktu kurang dari empat jam setelah validasi laporan.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold font-barlow uppercase">Mekanik Bersertifikasi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seluruh teknisi lapangan kami memegang sertifikasi kompetensi resmi dari keagenan tunggal pemegang merek alat berat, menjamin keakuratan metode troubleshooting.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
              <MapPin size={20} />
            </div>
            <h3 className="text-lg font-bold font-barlow uppercase">Peralatan Diagnostik Mobile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Armada servis kami dilengkapi dengan perkakas khusus, software scanner pressure hidrolik, serta suku cadang kritikal dasar untuk mempercepat proses penyelesaian di tempat.
            </p>
          </div>
        </div>

        {/* Formulir Pengajuan Tiket Bantuan */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold font-barlow uppercase text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-600" />
                Alur Kerja Penanganan
              </h3>
              <ol className="space-y-3 text-xs text-slate-400 list-decimal pl-4 leading-relaxed">
                <li>Formulir pengaduan diterima oleh pusat kendali teknis Syah Heavy Equipment.</li>
                <li>Analisis awal gejala kerusakan dilakukan oleh Service Engineer untuk menentukan estimasi bawaan suku cadang.</li>
                <li>Pemberangkatan Service Van beserta tim mekanik langsung ke koordinat proyek Anda.</li>
              </ol>
            </div>
            
            <div className="p-4 bg-yellow-600/5 border border-yellow-600/20 rounded-xl text-center">
              <p className="text-xs text-yellow-600 font-medium font-barlow uppercase tracking-wider">Butuh Panduan Instan?</p>
              <p className="text-slate-400 text-xs mt-1">Gunakan layanan telpon jika alat berat berada di kondisi bahaya struktural.</p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider font-barlow text-white mb-1">Formulir Laporan Kendala Lapangan</h3>
            <p className="text-xs text-slate-400 mb-6">Isi informasi di bawah ini secara lengkap untuk mempercepat persiapan tim mekanik.</p>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Pengaju (Wajib)</label>
                  <input required type="text" placeholder="Contoh: Rian Hidayat" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.fullName} onChange={(e) => setSupportForm({...supportForm, fullName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Perusahaan (Opsional)</label>
                  <input type="text" placeholder="Contoh: PT. Sumber Energi" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.companyName} onChange={(e) => setSupportForm({...supportForm, companyName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nomor WhatsApp Aktif (Wajib)</label>
                  <input required type="tel" placeholder="Contoh: 0812xxxxxxxx" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.phoneNumber} onChange={(e) => setSupportForm({...supportForm, phoneNumber: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Model dan Seri Alat Berat (Wajib)</label>
                  <input required type="text" placeholder="Contoh: Excavator Caterpillar 320 GC" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.machineModel} onChange={(e) => setSupportForm({...supportForm, machineModel: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-medium">Lokasi Proyek Penempatan Unit (Wajib)</label>
                  <input required type="text" placeholder="Contoh: Site Kutai Timur, Kalimantan Timur" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.projectLocation} onChange={(e) => setSupportForm({...supportForm, projectLocation: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Tingkat Urgensi (Wajib)</label>
                  <select className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors cursor-pointer" value={supportForm.urgencyLevel} onChange={(e) => setSupportForm({...supportForm, urgencyLevel: e.target.value})}>
                    <option value="Normal">Normal (Masih Bisa Beroperasi)</option>
                    <option value="Tinggi">Tinggi (Performa Menurun Drastis)</option>
                    <option value="Kritis">Kritis (Unit Mati Total / Breakdown)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Detail Kronologi Gejala Kerusakan (Wajib)</label>
                <textarea required rows={4} placeholder="Jelaskan secara mendetail kendala yang terjadi, misalnya: Kebocoran seal silinder boom utama, keluar asap putih pekat dari engine saat akselerasi, atau kegagalan sistem kelistrikan..." className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm resize-none focus:outline-none focus:border-yellow-600/50 transition-colors" value={supportForm.issueDetails} onChange={(e) => setSupportForm({...supportForm, issueDetails: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-500 text-neutral-950 py-3.5 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-600/10">
                <PhoneCall size={18} />
                {isSubmitting ? "Memproses Laporan..." : "Kirim Panggilan Darurat"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}