/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Wrench, Zap, ShieldCheck, Settings, ArrowRight, MessageSquareShare, X, Compass } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const services = [
  {
    icon: <Wrench size={32} className="md:w-10 md:h-10" />,
    title: "Penyewaan Armada",
    desc: "Akses ke armada ekskavator, truk, dan crane kelas dunia dengan masa sewa yang fleksibel untuk proyek jangka panjang maupun pendek."
  },
  {
    icon: <Compass size={32} className="md:w-10 md:h-10" />,
    title: "Pelacakan Pengiriman",
    desc: "Pantau posisi mobilisasi alat berat Anda secara real-time dengan akurasi telemetri satelit GPS dan peta visualisasi makro 3D."
  },
  {
    icon: <Zap size={32} className="md:w-10 md:h-10" />,
    title: "Pemeliharaan Prediktif",
    desc: "Memanfaatkan teknologi IoT untuk memantau kesehatan mesin secara real-time guna mencegah downtime yang merugikan proyek Anda."
  },
  {
    icon: <ShieldCheck size={32} className="md:w-10 md:h-10" />,
    title: "Dukungan Teknis Lapangan",
    desc: "Tim mekanik bersertifikasi kami siap 24/7 di lokasi untuk perbaikan darurat dan optimalisasi performa alat berat."
  },
  {
    icon: <Settings size={32} className="md:w-10 md:h-10" />,
    title: "Optimasi Operasional",
    desc: "Konsultasi sistematis untuk meningkatkan efisiensi penggunaan bahan bakar dan produktivitas operator di medan kerja yang berat."
  },
];

export default function LayananPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rentalForm, setRentalForm] = useState({
    fullName: "",
    companyName: "",
    equipmentType: "",
    duration: "",
    projectLocation: "",
    startDate: "",
    additionalNotes: ""
  });

  const whatsappNumber = "6281228134488";

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Langkah A: Amankan data ke database Supabase terlebih dahulu
      const { error } = await supabase
        .from("rental_requests")
        .insert([
          {
            full_name: rentalForm.fullName,
            company_name: rentalForm.companyName || null, // ubah string kosong jadi null
            equipment_type: rentalForm.equipmentType,
            duration: rentalForm.duration,
            project_location: rentalForm.projectLocation,
            start_date: rentalForm.startDate,
            additional_notes: rentalForm.additionalNotes || null
          }
        ]);

      if (error) throw error;

      const message = `Halo Syah Heavy Equipment, saya ingin berkonsultasi mengenai kebutuhan Penyewaan Armada dengan detail berikut:

Nama Lengkap: ${rentalForm.fullName}
Perusahaan: ${rentalForm.companyName || "-"}
Jenis Alat Berat: ${rentalForm.equipmentType}
Durasi Sewa: ${rentalForm.duration}
Lokasi Proyek: ${rentalForm.projectLocation}
Rencana Mulai: ${rentalForm.startDate}
Catatan Tambahan: ${rentalForm.additionalNotes || "-"}

Mohon informasi ketersediaan unit dan penawaran harganya. Terima kasih.`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Buka WhatsApp di tab baru
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      // Reset dan tutup modal
      setIsModalOpen(false);
      setRentalForm({
        fullName: "",
        companyName: "",
        equipmentType: "",
        duration: "",
        projectLocation: "",
        startDate: "",
        additionalNotes: ""
      });

    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error("Gagal memproses formulir sewa. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-20"
        >
          <span className="text-yellow-600 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
            Industrial Solutions
          </span>
          <h1 className="text-4xl md:text-7xl font-bold font-barlow text-white uppercase mt-2">
            Layanan Kami
          </h1>
          <div className="h-1 w-16 md:w-24 bg-yellow-600 mt-4 md:mt-6" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-neutral-900 border border-neutral-800 p-6 md:p-10 hover:border-yellow-600/50 transition-all group"
            >
              <div className="text-yellow-600 mb-6 md:mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-barlow text-white mb-3 md:mb-4">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">
                {service.desc}
              </p>
              <div>
                {service.title === "Penyewaan Armada" ? (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-white font-bold uppercase tracking-widest text-xs md:text-sm transition-colors cursor-pointer"
                  >
                    Konsultasi Sekarang <ArrowRight size={16} />
                  </button>
                ) : (
                  <Link 
                    href={service.title === "Pelacakan Pengiriman" ? "/tracking" : "/contact"} 
                    className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs md:text-sm hover:text-yellow-600 transition-colors group/link"
                  >
                    {service.title === "Pelacakan Pengiriman" ? (
                      <span className="text-yellow-500 group-hover/link:text-white transition-colors">Lacak Sekarang</span>
                    ) : (
                      "Konsultasi Sekarang"
                    )}
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 md:mt-24 p-8 md:p-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-neutral-950 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold font-barlow mb-4 md:mb-6">
            Butuh Solusi Khusus untuk Proyek Anda?
          </h2>
          <p className="mb-6 md:mb-8 font-medium text-sm md:text-base">
            Tim teknisi kami siap merancang strategi pemeliharaan yang sesuai dengan kebutuhan operasional Anda.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-neutral-950 text-white px-8 py-3 md:px-10 md:py-4 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all text-xs md:text-sm"
          >
            Hubungi Tim Teknis
          </Link>
        </motion.div>

      </div>

      {/* ─── MODAL FORMULIR PENYEWAAN ARMADA ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-start z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 p-5 sm:p-8 rounded-xl w-full max-w-xl space-y-4 my-auto sm:my-8"
          >
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-barlow">Form Kebutuhan Sewa</h2>
                <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk mempercepat kalkulasi penawaran</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleRentalSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Lengkap *</label>
                  <input 
                    required 
                    type="text"
                    placeholder="Contoh: Syahriza Ikhsan" 
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                    value={rentalForm.fullName}
                    onChange={(e) => setRentalForm({...rentalForm, fullName: e.target.value})} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Nama Perusahaan (Opsional)</label>
                  <input 
                    type="text"
                    placeholder="Contoh: PT. Maju Karya" 
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                    value={rentalForm.companyName}
                    onChange={(e) => setRentalForm({...rentalForm, companyName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Jenis Alat Berat yang Dibutuhkan *</label>
                  <input 
                    required 
                    type="text"
                    placeholder="Contoh: Excavator PC200 / Crane 50T" 
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                    value={rentalForm.equipmentType}
                    onChange={(e) => setRentalForm({...rentalForm, equipmentType: e.target.value})} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Durasi Sewa *</label>
                  <label className="text-xs text-slate-500 font-medium">Minimal 100 Jam Kerja untuk Sewa, 1 Hari untuk Borongan</label>
                  <input 
                    required 
                    type="text"
                    placeholder="Contoh: 100 Jam Kerja / 7 Hari" 
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                    value={rentalForm.duration}
                    onChange={(e) => setRentalForm({...rentalForm, duration: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Lokasi Proyek / Penempatan *</label>
                  <input 
                    required 
                    type="text"
                    placeholder="Contoh: Morowali, Sulawesi Tengah" 
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                    value={rentalForm.projectLocation}
                    onChange={(e) => setRentalForm({...rentalForm, projectLocation: e.target.value})} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Rencana Tanggal Mulai *</label>
                  <input 
                    required 
                    type="date"
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors cursor-pointer"
                    value={rentalForm.startDate}
                    onChange={(e) => setRentalForm({...rentalForm, startDate: e.target.value})} 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Spesifikasi Khusus / Catatan Tambahan</label>
                <textarea 
                  placeholder="Contoh: Butuh dengan Operator + BBM, Medan Berbatu, atau kapasitas bucket khusus..." 
                  className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm h-24 resize-none focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={rentalForm.additionalNotes}
                  onChange={(e) => setRentalForm({...rentalForm, additionalNotes: e.target.value})} 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-neutral-950 py-3.5 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-600/10"
              >
                <MessageSquareShare size={18} />
                {isSubmitting ? "Menyimpan Data..." : "Kirim via WhatsApp"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}