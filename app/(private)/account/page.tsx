/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Save, 
  RefreshCw, 
  Camera,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SettingsPage() {
  // State untuk Profil
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // State untuk Keamanan (Password)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // State untuk Notifikasi
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSystem, setNotifSystem] = useState(false);

  // Ambil data user yang sedang login saat halaman dimuat
  const fetchUserAccount = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        setEmail(user.email || "");
        
        // Ambil data tambahan dari tabel 'account'
        const { data: account, error: accountError } = await supabase
          .from("account")
          .select("full_name, phone_number, role, avatar_url")
          .eq("id", user.id)
          .single();

        if (accountError && accountError.code !== "PGRST116") {
          throw accountError;
        }

        if (account) {
          setFullName(account.full_name || "");
          setPhone(account.phone_number || "");
          setRole(account.role || "Operator");
          setAvatarUrl(account.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80");
        }
      }
    } catch (error: any) {
      alert("Gagal memuat profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  // Fungsi Update Profil
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      const { error } = await supabase
        .from("account")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone_number: phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert("Profil berhasil diperbarui!");
    } catch (error: any) {
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Update Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      alert("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert("Gagal memperbarui password: " + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pengaturan Akun</h1>
        <p className="text-sm text-slate-400">Perbarui informasi profil, keamanan, dan preferensi sistem Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* --- MENU NAVIGASI KIRI (SHORTCUT) --- */}
        <div className="space-y-2">
          <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-neutral-900 text-yellow-500 border border-neutral-800 font-medium text-sm transition-all">
            <User size={18} /> Informasi Profil
          </Link>
          <Link href="/account/security" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-neutral-900/50 hover:text-slate-200 font-medium text-sm transition-all">
            <Lock size={18} /> Keamanan & Sandi
          </Link>
          <Link href="/account/notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-neutral-900/50 hover:text-slate-200 font-medium text-sm transition-all">
            <Bell size={18} /> Notifikasi Sistem
          </Link>
        </div>

        {/* --- FORM KONTEN UTAMA --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* SEKSI 1: INFORMASI PROFIL */}
          <section id="account" className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <User className="text-yellow-500" size={20} />
              <h2 className="text-lg font-bold text-slate-100">Informasi Profil</h2>
            </div>

            {/* Foto Profil / Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <Image
                  src={avatarUrl || "https://via.placeholder.com/150"} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-neutral-800 group-hover:opacity-70 transition-opacity"
                  width={80}
                  height={80}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Foto Profil Anda</p>
                <p className="text-xs text-slate-500 mt-1">Format PNG, JPG maksimal 2MB.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-600/50"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nomor Telepon</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-slate-600" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-600/50"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat Email (Locked)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-700" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-neutral-950/60 border border-neutral-800/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hak Akses / Peran</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-3 text-slate-700" />
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="w-full bg-neutral-950/60 border border-neutral-800/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-yellow-500 disabled:opacity-50 transition-all"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  Simpan Akun
                </button>
              </div>
            </form>
          </section>

          {/* SEKSI 2: KEAMANAN & PASSWORD */}
          <section id="security" className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <Shield className="text-yellow-500" size={20} />
              <h2 className="text-lg font-bold text-slate-100">Keamanan & Sandi</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-600/50"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-600/50"
                  placeholder="Ulangi password baru"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-700 disabled:opacity-50 transition-all"
                >
                  {passwordLoading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </section>

          {/* SEKSI 3: PREFERENSI NOTIFIKASI */}
          <section id="notifications" className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <Bell className="text-yellow-500" size={20} />
              <h2 className="text-lg font-bold text-slate-100">Notifikasi Sistem</h2>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="mt-1 accent-yellow-600 h-4 w-4 rounded border-neutral-800 bg-neutral-950"
                />
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Laporan Email Mingguan</p>
                  <p className="text-xs text-slate-500">Kirimkan ringkasan utilitas armada dan performa proyek ke email saya.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notifSystem}
                  onChange={(e) => setNotifSystem(e.target.checked)}
                  className="mt-1 accent-yellow-600 h-4 w-4 rounded border-neutral-800 bg-neutral-950"
                />
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Peringatan Kerusakan Alat Berat</p>
                  <p className="text-xs text-slate-500">Aktifkan notifikasi langsung di web jika health score armada di bawah 50%.</p>
                </div>
              </label>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}