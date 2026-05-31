/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

// Helper component agar kode lebih rapi dan konsisten
function ContactInfoItem({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-4 items-start border-l-4 border-yellow-600 pl-4 md:pl-6">
      <div className="text-yellow-600 mt-1 shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-base md:text-lg mb-1">{title}</h4>
        <p className="text-slate-400 text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16">
          <h2 className="text-yellow-600 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
            Bantuan & Konsultasi
          </h2>
          <h1 className="text-4xl md:text-7xl font-bold font-barlow uppercase mt-2">
            Hubungi Tim Kami
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* Form Section */}
          <motion.form 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900 p-6 md:p-12 border border-neutral-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <input type="text" placeholder="Nama Lengkap" className="bg-neutral-950 border border-neutral-800 p-4 focus:border-yellow-600 outline-none transition-colors w-full" />
              <input type="email" placeholder="Email Perusahaan" className="bg-neutral-950 border border-neutral-800 p-4 focus:border-yellow-600 outline-none transition-colors w-full" />
            </div>
            <select className="w-full bg-neutral-950 border border-neutral-800 p-4 mb-6 outline-none focus:border-yellow-600">
              <option>Pilih Layanan</option>
              <option>Sewa Alat Berat</option>
              <option>Pemeliharaan & Servis</option>
              <option>Konsultasi Proyek</option>
            </select>
            <textarea placeholder="Ceritakan kebutuhan proyek Anda..." className="w-full h-32 bg-neutral-950 border border-neutral-800 p-4 mb-8 focus:border-yellow-600 outline-none transition-colors" />
            
            <button className="w-full py-4 bg-yellow-600 text-neutral-950 font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 text-sm md:text-base">
              Kirim Pesan <ArrowRight size={20} />
            </button>
          </motion.form>

          {/* Contact Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <ContactInfoItem icon={<MapPin size={24} />} title="Kantor Pusat" text="Jl. Kp. Kartika Murni, Wangunharja, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat, Indonesia" />
            <ContactInfoItem icon={<Phone size={24} />} title="Kontak Operasional" text="+62 812 2813 4488" />
            <ContactInfoItem icon={<Mail size={24} />} title="Email Kemitraan" text="ulunsyahroni57@gmail.com" />
            <ContactInfoItem icon={<Clock size={24} />} title="Jam Operasional" text="Senin - Jumat: 08:00 - 17:00 | Sabtu: 08:00 - 13:00" />
          </motion.div>
        </div>
      </div>
    </main>
  );
}