"use client";

import { motion } from "framer-motion";
import { Wifi, BrainCircuit, Activity, ShieldCheck, Cog } from "lucide-react";
import dynamic from "next/dynamic";

const IotDashboard = dynamic(() => import("@/components/IotDashboard"), { 
  ssr: false 
});

const techFeatures = [
  {
    icon: <Wifi size={28} />,
    title: "Sistem Telematika Terpusat",
    desc: "Setiap unit dilengkapi dengan sensor satelit yang mengirimkan data performa secara real-time ke pusat kendali kami."
  },
  {
    icon: <BrainCircuit size={28} />,
    title: "Analitik Prediktif (AI)",
    desc: "Algoritma kami memproses ribuan data mesin untuk memprediksi potensi kerusakan sebelum terjadi, meminimalisir downtime."
  },
  {
    icon: <Activity size={28} />,
    title: "Pemantauan Efisiensi",
    desc: "Monitor konsumsi bahan bakar, jam kerja engine, dan produktivitas operator dengan akurasi 99%."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Sistem Keamanan IoT",
    desc: "Geo-fencing dan pematian mesin jarak jauh untuk perlindungan aset maksimal di area proyek berbahaya."
  }
];

export default function TeknologiPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-20 text-center"
        >
          <span className="text-yellow-600 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
            Industrial 4.0 Ready
          </span>
          <h1 className="text-4xl md:text-7xl font-bold font-barlow uppercase mt-4 mb-6">
            Inovasi <span className="text-white">Digital</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg px-2">
            Kami mengintegrasikan teknologi IoT mutakhir ke dalam setiap unit kami untuk memastikan operasional Anda berjalan dengan presisi dan efisiensi tingkat tinggi.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {techFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-lg hover:border-yellow-600 transition-all group"
            >
              <div className="text-yellow-600 mb-6 bg-neutral-950 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg group-hover:bg-yellow-600 group-hover:text-neutral-950 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold font-barlow mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Diagram/Section */}
        <div className="mt-12 md:mt-24 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2">
                <h2 className="text-2xl md:text-4xl font-bold font-barlow mb-6">MENGAPA IoT PENTING?</h2>
                <ul className="space-y-4 text-slate-300">
                    <li className="flex gap-3 text-sm md:text-base"> 
                      <Cog className="text-yellow-600 shrink-0" /> Pengurangan biaya pemeliharaan hingga 30%.
                    </li>
                    <li className="flex gap-3 text-sm md:text-base"> 
                      <Cog className="text-yellow-600 shrink-0" /> Peningkatan umur pakai komponen mesin.
                    </li>
                    <li className="flex gap-3 text-sm md:text-base"> 
                      <Cog className="text-yellow-600 shrink-0" /> Keamanan data aset yang terenkripsi.
                    </li>
                </ul>
            </div>
            
            {/* Dashboard Container */}
            <div className="bg-neutral-950 h-56 md:h-64 w-full md:w-1/2 rounded-lg border border-neutral-800 p-4 relative overflow-hidden">
                <IotDashboard />
            </div>
        </div>

      </div>
    </main>
  );
}