"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Armada", href: "/fleet" },
  { label: "Layanan", href: "/service" },
  { label: "Teknologi", href: "/technology" },
  { label: "Proyek", href: "/project" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek transisi background saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-barlow font-bold text-2xl tracking-widest text-white">
          SYAH <span className="text-yellow-600">HEAVY EQUIPMENT</span>
        </Link>

        {/* Navigasi Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-yellow-600 transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="px-5 py-2 border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-neutral-950 font-bold uppercase text-xs transition-all">
            Hubungi Kami
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-950 border-b border-neutral-800"
          >
            <div className="flex flex-col p-6 gap-4">
              {links.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white font-bold uppercase flex justify-between items-center py-2 border-b border-neutral-900"
                >
                  {link.label} <ChevronRight size={16} />
                </Link>
              ))}

                <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-yellow-600 font-bold uppercase flex justify-between items-center py-2 border-b border-neutral-900"
                >
                Hubungi Kami <ChevronRight size={16} />
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}