/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Redirect ke halaman dashboard atau beranda setelah berhasil login
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden text-white">
      <div className="w-full max-w-md mx-auto">
        
        {/* Header Kartu */}
        <div className="text-center mb-8">
          <span className="text-yellow-600 font-bold tracking-[0.2em] uppercase text-xs">
            Syah Equipment Control Center
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-barlow uppercase mt-2">
            Selamat Datang
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Masuk untuk mengakses sistem telematika dan manajemen armada.
          </p>
        </div>

        {/* Form Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-xl shadow-xl"
        >
          {/* Notifikasi Error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-4 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg"
                />
              </div>
            </div>

            {/* Input Password dengan Fitur Show/Hide */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-slate-500 hover:text-yellow-600 transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} // Mengubah type secara dinamis
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 pl-12 pr-12 py-3.5 focus:border-yellow-600 outline-none transition-colors text-sm rounded-lg"
                />
                {/* Tombol Toggle Mata */}
                <button
                  type="button" // Menghindari form trigger submit otomatis
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
              {loading ? "Memproses..." : "Masuk Ke Sistem"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs md:text-sm text-slate-400">
            Belum memiliki hak akses?{" "}
            <Link href="/sign-up" className="text-yellow-600 font-bold hover:underline">
              Daftar akun di sini
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}