"use client";

import { motion } from "framer-motion";
import { Wrench, Zap, ShieldCheck, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: <Wrench size={40} />,
    title: "Penyewaan Armada",
    desc: "Akses ke armada ekskavator, truk, dan crane kelas dunia dengan masa sewa yang fleksibel untuk proyek jangka panjang maupun pendek."
  },
  {
    icon: <Zap size={40} />,
    title: "Pemeliharaan Prediktif",
    desc: "Memanfaatkan teknologi IoT untuk memantau kesehatan mesin secara real-time guna mencegah downtime yang merugikan proyek Anda."
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Dukungan Teknis Lapangan",
    desc: "Tim mekanik bersertifikasi kami siap 24/7 di lokasi untuk perbaikan darurat dan optimalisasi performa alat berat."
  },
  {
    icon: <Settings size={40} />,
    title: "Optimasi Operasional",
    desc: "Konsultasi sistematis untuk meningkatkan efisiensi penggunaan bahan bakar dan produktivitas operator di medan kerja yang berat."
  }
];

export default function LayananPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <span className="text-yellow-600 font-bold tracking-[0.3em] uppercase text-sm">Industrial Solutions</span>
          <h1 className="text-5xl md:text-7xl font-bold font-barlow text-white uppercase mt-2">Layanan Kami</h1>
          <div className="h-1 w-24 bg-yellow-600 mt-6" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-neutral-900 border border-neutral-800 p-10 hover:border-yellow-600/50 transition-all group"
            >
              <div className="text-yellow-600 mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold font-barlow text-white mb-4">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{service.desc}</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm hover:text-yellow-600 transition-colors"
              >
                Konsultasi Sekarang <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-neutral-950 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-barlow mb-6">Butuh Solusi Khusus untuk Proyek Anda?</h2>
          <p className="mb-8 font-medium">Tim teknisi kami siap merancang strategi pemeliharaan yang sesuai dengan kebutuhan operasional Anda.</p>
          <Link href="/contact" className="inline-block bg-neutral-950 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">
            Hubungi Tim Teknis
          </Link>
        </motion.div>

      </div>
    </main>
  );
}