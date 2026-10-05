"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  };
  idx: number;
  onOpenRentalModal: () => void;
}

export default function ServiceCard({ service, idx, onOpenRentalModal }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: idx * 0.07, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden border border-white/[.09] bg-[#111827] p-6 transition-all hover:border-amber-400/50 md:p-10"
    >
      <div className="mb-6 inline-flex bg-[#090d16] p-3 text-amber-400 transition-transform duration-300 group-hover:scale-105 md:mb-8">
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
            onClick={onOpenRentalModal}
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-white font-bold uppercase tracking-widest text-xs md:text-sm transition-colors cursor-pointer"
          >
            Sewa Sekarang <ArrowRight size={16} />
          </button>
        ) : (
          <Link 
            href={
              service.title === "Pelacakan Pengiriman" 
                ? "/tracking" 
                : service.title === "Pemeliharaan Prediktif"
                ? "/service/predictive-maintenance"
                : service.title === "Dukungan Teknis Lapangan"
                ? "/service/field-technical-support"
                : service.title === "Optimasi Operasional"
                ? "/service/operational-optimization"
                : "/contact"
            } 
            className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs md:text-sm hover:text-yellow-600 transition-colors group/link"
          >
            <span className="text-yellow-500 group-hover/link:text-white transition-colors">
              {service.title === "Pelacakan Pengiriman" ? "Lacak Sekarang" : "Lihat Detail"}
            </span>
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
