import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-slate-400 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href="/" className="font-barlow font-bold text-2xl tracking-widest text-white">
            SYAH <span className="text-yellow-600">HEAVY EQUIPMENT</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Solusi alat berat terintegrasi dengan teknologi IoT untuk efisiensi operasional maksimal di sektor tambang, infrastruktur, dan energi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest">Navigasi</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/" className="hover:text-yellow-600 transition-colors">Beranda</Link></li>
            <li><Link href="/fleet" className="hover:text-yellow-600 transition-colors">Armada</Link></li>
            <li><Link href="/service" className="hover:text-yellow-600 transition-colors">Layanan</Link></li>
            <li><Link href="/technology" className="hover:text-yellow-600 transition-colors">Teknologi</Link></li>
            <li><Link href="/project" className="hover:text-yellow-600 transition-colors">Proyek</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest">Dukungan</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/contact" className="hover:text-yellow-600 transition-colors">Pusat Bantuan</Link></li>
            <li><Link href="/careers" className="hover:text-yellow-600 transition-colors">Karir</Link></li>
            <li><Link href="/privacy" className="hover:text-yellow-600 transition-colors">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest">Kontak</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-yellow-600 shrink-0" />
              <span>Jl. Kp. Kartika Murni, Wangunharja, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-yellow-600 shrink-0" />
              <span>+62 812 2813 4488</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-yellow-600 shrink-0" />
              <span>ulunsyahroni@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Syah Heavy Equipment. All rights reserved.</p>
        <div className="flex gap-6">
          <FaLinkedin size={20} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaInstagram size={20} className="hover:text-yellow-600 cursor-pointer transition-colors" />
          <FaFacebook size={20} className="hover:text-yellow-600 cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}