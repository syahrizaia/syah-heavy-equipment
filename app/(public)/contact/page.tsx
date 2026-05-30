"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h2 className="text-yellow-600 font-bold tracking-[0.3em] uppercase">Bantuan & Konsultasi</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-barlow uppercase mt-2">Hubungi Tim Kami</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Form Section */}
          <motion.form 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900 p-8 md:p-12 border border-neutral-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input type="text" placeholder="Nama Lengkap" className="bg-neutral-950 border border-neutral-800 p-4 focus:border-yellow-600 outline-none transition-colors" />
              <input type="email" placeholder="Email Perusahaan" className="bg-neutral-950 border border-neutral-800 p-4 focus:border-yellow-600 outline-none transition-colors" />
            </div>
            <select className="w-full bg-neutral-950 border border-neutral-800 p-4 mb-6 outline-none focus:border-yellow-600">
              <option>Pilih Layanan</option>
              <option>Sewa Alat Berat</option>
              <option>Pemeliharaan & Servis</option>
              <option>Konsultasi Proyek</option>
            </select>
            <textarea placeholder="Ceritakan kebutuhan proyek Anda..." className="w-full h-32 bg-neutral-950 border border-neutral-800 p-4 mb-8 focus:border-yellow-600 outline-none transition-colors" />
            
            <button className="w-full py-4 bg-yellow-600 text-neutral-950 font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
              Kirim Pesan <ArrowRight size={20} />
            </button>
          </motion.form>

          {/* Contact Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-6 items-start border-l-4 border-yellow-600 pl-6">
              <MapPin className="text-yellow-600 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-1">Kantor Pusat</h4>
                <p className="text-slate-400">Jl. Kp. Kartika Murni, Wangunharja, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat, Indonesia</p>
              </div>
            </div>

            <div className="flex gap-6 items-start border-l-4 border-yellow-600 pl-6">
              <Phone className="text-yellow-600 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-1">Kontak Operasional</h4>
                <p className="text-slate-400">+62 812 2813 4488</p>
              </div>
            </div>

            <div className="flex gap-6 items-start border-l-4 border-yellow-600 pl-6">
              <Mail className="text-yellow-600 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-1">Email Kemitraan</h4>
                <p className="text-slate-400">ulunsyahroni@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-start border-l-4 border-yellow-600 pl-6">
              <Clock className="text-yellow-600 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-1">Jam Operasional</h4>
                <p className="text-slate-400">Senin - Jumat: 08:00 - 17:00<br />Sabtu: 08:00 - 13:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}