/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, MessageSquareShare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalModal({ isOpen, onClose }: RentalModalProps) {
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

  if (!isOpen) return null;

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("rental_requests")
        .insert([
          {
            full_name: rentalForm.fullName,
            company_name: rentalForm.companyName || null,
            equipment_type: rentalForm.equipmentType,
            duration: rentalForm.duration,
            project_location: rentalForm.projectLocation,
            start_date: rentalForm.startDate,
            additional_notes: rentalForm.additionalNotes || null
          }
        ]);

      if (error) throw error;

      const message = `Halo Syah Heavy Equipment, saya ingin berkonsultasi mengenai kebutuhan Penyewaan Armada dengan detail berikut:\n\nNama Lengkap: ${rentalForm.fullName}\nPerusahaan: ${rentalForm.companyName || "-"}\nJenis Alat Berat: ${rentalForm.equipmentType}\nDurasi Sewa: ${rentalForm.duration}\nLokasi Proyek: ${rentalForm.projectLocation}\nRencana Mulai: ${rentalForm.startDate}\nCatatan Tambahan: ${rentalForm.additionalNotes || "-"}\n\nMohon informasi ketersediaan unit dan penawaran harganya. Terima kasih.`;

      window.open(`https://wa.me/6281228134488?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      
      onClose();
      setRentalForm({ fullName: "", companyName: "", equipmentType: "", duration: "", projectLocation: "", startDate: "", additionalNotes: "" });
      toast.success("Formulir berhasil dikirim!");
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error("Gagal memproses formulir sewa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleRentalSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Nama Lengkap *</label>
              <input required type="text" placeholder="Syahriza Ikhsan" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.fullName} onChange={(e) => setRentalForm({...rentalForm, fullName: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Nama Perusahaan (Opsional)</label>
              <input type="text" placeholder="PT. Maju Karya" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.companyName} onChange={(e) => setRentalForm({...rentalForm, companyName: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Jenis Alat Berat *</label>
              <input required type="text" placeholder="Excavator PC200" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.equipmentType} onChange={(e) => setRentalForm({...rentalForm, equipmentType: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Durasi Sewa *</label>
              <input required type="text" placeholder="100 Jam Kerja" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.duration} onChange={(e) => setRentalForm({...rentalForm, duration: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Lokasi Proyek *</label>
              <input required type="text" placeholder="Morowali" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.projectLocation} onChange={(e) => setRentalForm({...rentalForm, projectLocation: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Rencana Mulai *</label>
              <input required type="date" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.startDate} onChange={(e) => setRentalForm({...rentalForm, startDate: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Spesifikasi Khusus / Catatan</label>
            <textarea placeholder="Kapasitas bucket khusus, dll..." className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm h-20 resize-none focus:outline-none focus:border-yellow-600/50 transition-colors" value={rentalForm.additionalNotes} onChange={(e) => setRentalForm({...rentalForm, additionalNotes: e.target.value})} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-500 text-neutral-950 py-3.5 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
            <MessageSquareShare size={18} />
            {isSubmitting ? "Menyimpan..." : "Kirim via WhatsApp"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}