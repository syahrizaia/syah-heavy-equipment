"use client";

import { motion } from "framer-motion";
import { Wifi, BrainCircuit, Activity, ShieldCheck, Cog } from "lucide-react";
import dynamic from "next/dynamic";

const IotDashboard = dynamic(() => import("@/components/IotDashboard"), { 
  ssr: false 
});

const techFeatures = [
  {
    icon: <Wifi size={32} />,
    title: "Sistem Telematika Terpusat",
    desc: "Setiap unit dilengkapi dengan sensor satelit yang mengirimkan data performa secara real-time ke pusat kendali kami."
  },
  {
    icon: <BrainCircuit size={32} />,
    title: "Analitik Prediktif (AI)",
    desc: "Algoritma kami memproses ribuan data mesin untuk memprediksi potensi kerusakan sebelum terjadi, meminimalisir downtime."
  },
  {
    icon: <Activity size={32} />,
    title: "Pemantauan Efisiensi",
    desc: "Monitor konsumsi bahan bakar, jam kerja engine, dan produktivitas operator dengan akurasi 99%."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Sistem Keamanan IoT",
    desc: "Geo-fencing dan pematian mesin jarak jauh untuk perlindungan aset maksimal di area proyek berbahaya."
  }
];

export default function TeknologiPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <span className="text-yellow-600 font-bold tracking-[0.3em] uppercase text-sm">Industrial 4.0 Ready</span>
          <h1 className="text-5xl md:text-7xl font-bold font-barlow uppercase mt-4 mb-6">Inovasi <span className="stroke-white">Digital</span></h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            Kami mengintegrasikan teknologi IoT mutakhir ke dalam setiap unit kami untuk memastikan operasional Anda berjalan dengan presisi dan efisiensi tingkat tinggi.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-yellow-600 transition-all group"
            >
              <div className="text-yellow-600 mb-6 bg-neutral-950 w-16 h-16 flex items-center justify-center rounded-lg group-hover:bg-yellow-600 group-hover:text-neutral-950 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-barlow mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Diagram/Section */}
        <div className="mt-12 md:mt-24 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 px-4 pt-4">
                <h2 className="text-4xl font-bold font-barlow mb-6">MENGAPA IoT PENTING?</h2>
                <ul className="space-y-4 text-slate-300">
                    <li className="flex gap-3"> <Cog className="text-yellow-600" /> Pengurangan biaya pemeliharaan hingga 30%.</li>
                    <li className="flex gap-3"> <Cog className="text-yellow-600" /> Peningkatan umur pakai komponen mesin.</li>
                    <li className="flex gap-3"> <Cog className="text-yellow-600" /> Keamanan data aset yang terenkripsi.</li>
                </ul>
            </div>
            
            {/* Dashboard Container */}
            <div className="md:w-1/2 bg-neutral-950 h-64 w-full rounded-lg border border-neutral-800 p-4 relative">
                <IotDashboard />
            </div>
        </div>

      </div>
    </main>
  );
}