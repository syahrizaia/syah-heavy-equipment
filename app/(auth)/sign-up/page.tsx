/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, RefreshCw, Phone } from "lucide-react"; // Tambahkan Phone icon
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setSuccessMsg] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // Mendaftarkan user ke Supabase Auth dengan menyertakan metadata tambahan
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            role: "Operator",
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        if (data.session) {
          toast.success("Akun berhasil dibuat! Mengalihkan...");
        } else {
          toast.success("Registrasi sukses! Silakan periksa kotak masuk email Anda untuk konfirmasi.");
        }

        router.push("/sign-in");
      }
    } catch (error: any) {
      const rawMessage = error.message || "Terjadi kesalahan saat mendaftar.";
      
      // Menerjemahkan beberapa error umum pendaftaran agar lebih rapi
      if (rawMessage.includes("User already registered")) {
        toast.error("Email ini sudah terdaftar di sistem Syah Equipment.");
      } else if (rawMessage.includes("Password should be at least")) {
        toast.warning("Password terlalu pendek. Gunakan minimal 6 karakter.");
      } else {
        toast.error(rawMessage);
      }
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="w-full max-w-md mx-auto">
        
        {/* Header Kartu */}
        <div className="text-center mb-8">
          <span className="text-yellow-600 font-bold tracking-[0.2em] uppercase text-xs">
            Join Syah Equipment
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-barlow uppercase mt-2">
            Buat Akun Baru
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Daftar untuk mulai mengelola armada dan proyek Anda.
          </p>
        </div>

        {/* Form Registrasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-xl shadow-xl"
        >

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Input Nama Lengkap */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 text-slate-500" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-4 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input Nomor Telepon (BARU) */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                Nomor Telepon
              </label>
              <div className="relative flex items-center">
                <Phone size={18} className="absolute left-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  disabled={loading}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-4 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                Email Perusahaan
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-4 text-slate-500" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-4 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-12 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-yellow-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-600 text-neutral-950 font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 text-xs md:text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Mendaftar...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs md:text-sm text-slate-400">
            Sudah memiliki akun?{" "}
            <Link href="/sign-in" className="text-yellow-600 font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}