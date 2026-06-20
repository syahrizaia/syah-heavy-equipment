"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RentalModal from "@/components/services/RentalModal";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Armada", href: "/fleet" },
  { label: "Suku Cadang", href: "/spare-part" },
  { 
    label: "Layanan", 
    href: "/service",
    subLinks: [
      { label: "Penyewaan Armada", href: "#", isModal: true },
      { label: "Pelacakan Pengiriman", href: "/tracking" },
      { label: "Pemeliharaan Prediktif", href: "/service/predictive-maintenance" },
      { label: "Dukungan Teknis Lapangan", href: "/service/field-technical-support" },
      { label: "Optimasi Operasional", href: "/service/operational-optimization" },
    ]
  },
  { label: "Teknologi", href: "/technology" },
];

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSubOpen, setIsMobileSubOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo Perusahaan */}
          <Link href="/" className="font-barlow font-bold text-lg md:text-2xl tracking-tight md:tracking-widest text-white flex justify-center items-center gap-2">
            <Image
              src="/icon.png"
              alt="Syah Heavy Equipment Logo"
              width={32}
              height={32}
              className="inline-block mr-2"
            />
            SYAH <span className="text-yellow-600">HEAVY EQUIPMENT</span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              if (link.subLinks) {
                return (
                  <div 
                    key={link.label}
                    className="relative py-2"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-1">
                      <Link href={link.href} className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-yellow-600 transition-colors">
                        {link.label}
                      </Link>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </div>

                    {/* Menu Turunan Desktop */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 z-50"
                        >
                          {link.subLinks.map((sub) => (
                            sub.isModal ? (
                              <button
                                key={sub.label}
                                onClick={() => {
                                  setIsRentalModalOpen(true);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-neutral-950 hover:text-yellow-500 transition-colors cursor-pointer"
                              >
                                {sub.label}
                              </button>
                            ) : (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-neutral-950 hover:text-yellow-500 transition-colors"
                              >
                                {sub.label}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link key={link.label} href={link.href} className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-yellow-600 transition-colors">
                  {link.label}
                </Link>
              );
            })}
            
            <Link href="/contact" className="px-5 py-2 border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-neutral-950 font-bold uppercase text-xs transition-all">
              Hubungi Kami
            </Link>
          </div>

          {/* Tombol Pemicu Menu Mobile */}
          <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Panel Navigasi Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-neutral-950 border-b border-neutral-800 overflow-hidden"
            >
              <div className="flex flex-col p-4 md:p-6 gap-2">
                {links.map((link) => {
                  if (link.subLinks) {
                    return (
                      <div key={link.label} className="w-full flex flex-col">
                        <div className="flex justify-between items-center py-2.5 px-2 border-b border-neutral-900/60">
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-white text-sm font-bold uppercase tracking-wider grow"
                          >
                            {link.label}
                          </Link>
                          <button 
                            onClick={() => setIsMobileSubOpen(!isMobileSubOpen)}
                            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronDown size={18} className={`transition-transform duration-200 ${isMobileSubOpen ? "rotate-180" : ""}`} />
                          </button>
                        </div>

                        {/* Sub Menu Akordion Mobile */}
                        <AnimatePresence initial={false}>
                          {isMobileSubOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-neutral-900/40 pl-4 rounded-lg mt-1"
                            >
                              {link.subLinks.map((sub) => (
                                sub.isModal ? (
                                  <button
                                    key={sub.label}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setIsRentalModalOpen(true);
                                    }}
                                    className="w-full text-left text-slate-400 text-xs font-bold uppercase tracking-wide py-2 px-2 border-b border-neutral-900/40 hover:text-yellow-500 cursor-pointer"
                                  >
                                    {sub.label}
                                  </button>
                                ) : (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-slate-400 text-xs font-bold uppercase tracking-wide py-2 px-2 border-b border-neutral-900/40 hover:text-yellow-500"
                                  >
                                    {sub.label}
                                  </Link>
                                )
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-white text-sm font-bold uppercase tracking-wider flex justify-between items-center py-2.5 px-2 border-b border-neutral-900/60 active:bg-neutral-900/40 transition-colors"
                    >
                      {link.label} <ChevronRight size={16} />
                    </Link>
                  );
                })}

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-yellow-600 text-sm font-bold uppercase tracking-wider flex justify-between items-center py-2.5 px-2 border-b border-neutral-900/60 active:bg-neutral-900/40 transition-colors"
                >
                  Hubungi Kami <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Kontainer Formulir Penyewaan Armada */}
      <RentalModal isOpen={isRentalModalOpen} onClose={() => setIsRentalModalOpen(false)} />
    </>
  );
}