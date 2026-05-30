"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cog, BarChart3 } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    { icon: <ShieldCheck size={40} />, title: "Durabilitas Tinggi", desc: "Material konstruksi kelas militer untuk pemakaian ekstrem." },
    { icon: <Cog size={40} />, title: "Inovasi IoT", desc: "Monitor performa mesin secara real-time via satelit." },
    { icon: <BarChart3 size={40} />, title: "Efisiensi Maksimal", desc: "Optimasi konsumsi bahan bakar hingga 25% lebih hemat." }
  ];

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
      {features.map((item, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -10 }}
          className="p-8 border-l-2 border-yellow-600 bg-neutral-900"
        >
          <div className="text-yellow-600 mb-6">{item.icon}</div>
          <h3 className="text-2xl font-bold mb-4 font-barlow">{item.title}</h3>
          <p className="text-slate-400">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}