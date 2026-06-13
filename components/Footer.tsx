import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-slate-400 pt-12 pb-28 px-4 md:px-6 w-full overflow-hidden">
      {/* Grid diatur menjadi 2 kolom di mobile, 4 kolom di desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section - Menempati 2 kolom di mobile agar full width */}
        <div className="col-span-2 lg:col-span-1 space-y-4">
          <Link href="/" className="font-barlow font-bold text-xl md:text-2xl tracking-widest text-white flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Syah Heavy Equipment Logo"
              width={32}
              height={32}
              className="inline-block mr-2"
            />
            SYAH <span className="text-yellow-600">HEAVY EQUIPMENT</span>
          </Link>
          <p className="text-xs md:text-sm leading-relaxed max-w-xs">
            Solusi alat berat terintegrasi dengan teknologi IoT untuk efisiensi operasional maksimal.
          </p>
        </div>

        {/* Navigasi - Berdampingan dengan Dukungan di mobile */}
        <div className="col-span-1">
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs md:text-sm">Navigasi</h4>
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
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs md:text-sm">Dukungan</h4>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link href="/region" className="hover:text-yellow-600 transition-colors">Wilayah</Link></li>
            <li><Link href="/project" className="hover:text-yellow-600 transition-colors">Proyek</Link></li>
            <li><Link href="/careers" className="hover:text-yellow-600 transition-colors">Karir</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-600 transition-colors">Pusat Bantuan</Link></li>
            <li><Link href="/privacy" className="hover:text-yellow-600 transition-colors">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Kontak - Menempati 2 kolom di mobile agar rapi */}
        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs md:text-sm">Kontak</h4>
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
      <div className="max-w-7xl mx-auto border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs uppercase tracking-widest">
        <p className="text-center md:text-left">© {new Date().getFullYear()} <span className="text-yellow-600">Syah Heavy Equipment</span>. All rights reserved.</p>
        <div className="flex gap-6">
          <FaLinkedin size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaInstagram size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaFacebook size={18} className="hover:text-yellow-600 cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}