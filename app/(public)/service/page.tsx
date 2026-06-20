"use client";

import { motion } from "framer-motion";
import { Wrench, Zap, ShieldCheck, Settings, Compass } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import RentalModal from "@/components/services/RentalModal";

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
            <ServiceCard 
              key={idx} 
              service={service} 
              idx={idx} 
              onOpenRentalModal={() => setIsModalOpen(true)} 
            />
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

      {/* MODAL FORMULIR PENYEWAAN ARMADA */}
      <RentalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}