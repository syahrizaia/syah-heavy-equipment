"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Field Service Engineer",
    location: "Kalimantan Timur",
    type: "Full-time",
    department: "Technical Support"
  },
  {
    id: 2,
    title: "IoT Systems Architect",
    location: "Jakarta (Hybrid)",
    type: "Full-time",
    department: "Innovation"
  },
  {
    id: 3,
    title: "Heavy Equipment Operator",
    location: "Sumatera Selatan",
    type: "Contract",
    department: "Operations"
  }
];

export default function KarirPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-16 md:mb-20 text-center"
        >
          <h2 className="text-yellow-600 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
            Karir
          </h2>
          <h1 className="text-4xl md:text-7xl font-bold font-barlow uppercase mt-4">
            Bangun Masa Depan <br/> Bersama Kami
          </h1>
        </motion.div>

        {/* Why Us Section */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
            {[
                { title: "Teknologi Terdepan", desc: "Bekerja dengan alat berat IoT dan sistem prediktif mutakhir." },
                { title: "Budaya Keamanan", desc: "Keselamatan Anda adalah prioritas utama operasional kami." },
                { title: "Pengembangan Diri", desc: "Sertifikasi profesional dan pelatihan berkelanjutan." }
            ].map((item, i) => (
                <div key={i} className="border-l-2 border-yellow-600 pl-4 md:pl-6">
                    <h3 className="text-lg md:text-xl font-bold font-barlow mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Job Listings */}
        <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold font-barlow mb-6 md:mb-10 border-b border-neutral-800 pb-4">
              Lowongan Terbuka
            </h2>
            <div className="space-y-4">
                {OPEN_POSITIONS.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-neutral-900 p-5 md:p-6 border border-neutral-800 hover:border-yellow-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group"
                    >
                        <div>
                            <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-yellow-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-400 mt-2">
                                <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
                                <span className="flex items-center gap-2"><Clock size={14} /> {job.type}</span>
                            </div>
                        </div>
                        <button className="w-full md:w-auto px-6 py-3 border border-neutral-700 text-white font-bold text-xs md:text-sm uppercase hover:bg-yellow-600 hover:border-yellow-600 hover:text-neutral-950 transition-all flex items-center justify-center gap-2">
                            Lamar Sekarang <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold font-barlow mb-4">Tidak menemukan posisi yang cocok?</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm md:text-base">
              Kami selalu mencari talenta berbakat. Kirimkan CV dan profil Anda ke email kami, dan kami akan menghubungi Anda jika ada posisi yang relevan.
            </p>
            <a href="mailto:ulunsyahroni@gmail.com" className="inline-block px-8 py-3 md:px-10 md:py-4 bg-yellow-600 text-neutral-950 font-bold uppercase tracking-widest hover:bg-white transition-all text-sm md:text-base">
                Kirim CV ke HR
            </a>
        </div>
      </div>
    </main>
  );
}