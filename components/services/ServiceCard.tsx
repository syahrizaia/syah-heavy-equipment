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
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="bg-neutral-900 border border-neutral-800 p-6 md:p-10 hover:border-yellow-600/50 transition-all group rounded-xl"
    >
      <div className="text-yellow-600 mb-6 md:mb-8 transform group-hover:scale-110 transition-transform duration-300">
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