import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#090d16] px-4 pb-28 pt-14 text-slate-400 md:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      {/* Grid diatur menjadi 2 kolom di mobile, 4 kolom di desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section - Menempati 2 kolom di mobile agar full width */}
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-barlow text-xl font-bold tracking-widest text-white md:text-2xl">
            <Image
              src="/icon.png"
              alt="Syah Heavy Equipment Logo"
              width={32}
              height={32}
              className="inline-block mr-2"
            />
            <span>SYAH <span className="text-amber-400">HEAVY EQUIPMENT</span></span>
          </Link>
          <p className="max-w-xs text-xs leading-relaxed md:text-sm">
            Solusi alat berat terintegrasi dengan teknologi IoT untuk efisiensi operasional maksimal.
          </p>
        </div>

        {/* Navigasi - Berdampingan dengan Dukungan di mobile */}
        <div className="col-span-1">
          <h4 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-white md:text-xs">Navigasi</h4>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link href="/" className="hover:text-yellow-600 transition-colors">Beranda</Link></li>
            <li><Link href="/fleet" className="hover:text-yellow-600 transition-colors">Armada</Link></li>
            <li><Link href="/spare-part" className="hover:text-yellow-600 transition-colors">Suku Cadang</Link></li>
            <li><Link href="/service" className="hover:text-yellow-600 transition-colors">Layanan</Link></li>
            <li><Link href="/technology" className="hover:text-yellow-600 transition-colors">Teknologi</Link></li>
          </ul>
        </div>

        {/* Dukungan */}
        <div className="col-span-1">
          <h4 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-white md:text-xs">Dukungan</h4>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link href="/region" className="hover:text-yellow-600 transition-colors">Wilayah</Link></li>
            <li><Link href="/project" className="hover:text-yellow-600 transition-colors">Proyek</Link></li>
            <li><Link href="/careers" className="hover:text-yellow-600 transition-colors">Karir</Link></li>
            <li><Link href="/help-center" className="hover:text-yellow-600 transition-colors">Pusat Bantuan</Link></li>
            <li><Link href="/privacy" className="hover:text-yellow-600 transition-colors">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Kontak - Menempati 2 kolom di mobile agar rapi */}
        <div className="col-span-2 lg:col-span-1">
          <h4 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-white md:text-xs">Kontak</h4>
          <ul className="space-y-3 text-xs md:text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-yellow-600 shrink-0 mt-0.5" />
              <span>Jl. Kp. Kartika Murni, Wangunharja, Cikarang Utara, Bekasi, Jawa Barat</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-yellow-600 shrink-0" />
              <span>+62 812 2813 4488</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-yellow-600 shrink-0" />
              <span>ulunsyahroni57@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[10px] uppercase tracking-widest md:flex-row md:text-xs">
        <p className="text-center md:text-left">© {new Date().getFullYear()} <Link href="/sign-in" className="text-yellow-600">Syah Heavy Equipment</Link>. All rights reserved.</p>
        <div className="flex gap-6">
          <FaLinkedin size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaInstagram size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaFacebook size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
