/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react"; // 1. Tambahkan useEffect di sini
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Truck, 
  Briefcase, 
  LogOut, 
  Menu, 
  X, 
  User 
} from "lucide-react";

export default function PrivateSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 2. State untuk menampung data user secara dinamis
  const [userData, setUserData] = useState({
    fullName: "Memuat...",
    role: "Operator"
  });

  // 3. Ambil data session user yang sedang aktif
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          fullName: user.user_metadata?.full_name || "User Tanpa Nama",
          role: user.user_metadata?.role || "Operator",
        });
      }
    };

    fetchUserData();
  }, []);

  // Fungsi Eksekusi Sesi Keluar
  const executeLogout = async () => {
    const toastId = toast.loading("Sedang memproses keluar...");
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Berhasil keluar dari sistem", { id: toastId });
      router.push("/sign-in");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal melakukan logout. Silakan coba lagi.", { id: toastId });
    }
  };

  // Fungsi Pemicu Konfirmasi Logout
  const handleLogout = () => {
    toast.warning("Apakah Anda yakin ingin keluar?", {
      description: "Aksi ini akan mengakhiri sesi aktif Anda saat ini.",
      action: {
        label: "Keluar",
        onClick: () => executeLogout(),
      },
      cancel: {
        label: "Batal",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Daftar Menu Navigasi
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Armada", href: "/fleet-management", icon: Truck },
    { name: "Proyek Situs", href: "/site-project", icon: Briefcase },
    { name: "Pengaturan Akun", href: "/account", icon: User },
  ];

  return (
    <>
      {/* --- NAVBAR ATAS (HANYA MUNCUL DI MOBILE) --- */}
      <header className="md:hidden w-full h-16 bg-neutral-900 border-b border-neutral-800 fixed top-0 left-0 z-50 px-4 flex items-center justify-between">
        <span className="font-bold tracking-wider text-yellow-600 font-barlow uppercase text-sm">
          Syah Control Center
        </span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* --- SIDEBAR UTAMA (DESKTOP & MOBILE DRAWER) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0 md:static md:h-screen pt-20 md:pt-6
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="space-y-8">
          {/* Logo Brand (Hanya Terlihat di Desktop) */}
          <div className="hidden md:block text-yellow-600 font-bold tracking-[0.1em] uppercase text-sm border-b border-neutral-800 pb-4">
            Syah Equipment Control
          </div>
          
          {/* Menu Navigasi Dinamis */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-600 text-neutral-950 font-bold shadow-lg shadow-yellow-600/10"
                      : "text-slate-400 hover:text-yellow-600 hover:bg-neutral-950/50"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* --- AREA INFORMASI PENGGUNA DINAMIS --- */}
        <div className="space-y-4 border-t border-neutral-800 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-neutral-950 rounded-full text-slate-500 flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              {/* Nama Lengkap User */}
              <span className="text-xs text-white font-medium truncate">
                {userData.fullName}
              </span>
              {/* Role/Jabatan User */}
              <span className="text-[11px] text-slate-400 truncate capitalize">
                {userData.role}
              </span>
              {/* Status Online */}
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-red-400 hover:text-red-500 font-medium py-2.5 px-4 transition-colors w-full text-left rounded-lg hover:bg-red-500/5"
          >
            <LogOut size={18} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Overlay Background */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}