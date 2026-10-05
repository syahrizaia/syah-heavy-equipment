/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya AI Consultant Syah Heavy Equipment. Ada yang bisa saya bantu terkait jual-beli, sewa, atau perbaikan alat berat?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions = [
    "Sewa Alat Berat",
    "Jual Beli Sparepart",
    "Layanan Perbaikan",
    "Konsultasi Teknik",
  ];

  // Auto-scroll ke pesan paling baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Inisialisasi Speech Recognition bawaan Browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = "id-ID";
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
          toast.info("Mikrofon aktif, silakan berbicara...");
        };
        rec.onend = () => setIsListening(false);
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          toast.success("Suara berhasil direkam!");
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Fitur suara tidak didukung di browser ini. Gunakan Chrome atau Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customContent?: string) => {
    if (e) e.preventDefault();
    
    const messageContent = customContent || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageContent };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    if (!customContent) setInput(""); // Hanya kosongkan input teks jika bukan dari tombol tanya cepat
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, sistem sedang sibuk. Silakan coba sesaat lagi." }]);
        toast.warning("Server AI memberikan respons kosong. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Koneksi terputus. Gagal menghubungi consultant." }]);
      toast.error("Koneksi terputus! Gagal menghubungi AI Consultant.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageText = (text: string) => {
    if (!text) return "";
    
    let cleanedText = text.replace(/\*/g, "");

    const markdownLinkRegex = /\[([^\]]+)\]\s*\((https?:\/\/[^\s)]+)\)/g;
    
    // Pecah teks berdasarkan pencarian link untuk dirender dengan aman sebagai elemen React
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(cleanedText)) !== null) {
      // Masukkan teks biasa sebelum link ditemukan
      if (match.index > lastIndex) {
        parts.push(cleanedText.substring(lastIndex, match.index));
      }

      // Masukkan elemen link HTML yang rapi dan aman
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a 
          key={match.index} 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 underline font-semibold hover:text-blue-800 break-all"
        >
          {linkText}
        </a>
      );

      lastIndex = markdownLinkRegex.lastIndex;
    }

    // Masukkan sisa teks setelah link terakhir
    if (lastIndex < cleanedText.length) {
      parts.push(cleanedText.substring(lastIndex));
    }

    return parts.length > 0 ? parts : cleanedText;
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 font-sans sm:right-6">
      {/* TOMBOL UTAMA (FLOATING BUTTON) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center border border-amber-200/40 bg-amber-400 p-4 text-[#090d16] shadow-[0_12px_44px_rgba(245,158,11,.22)] transition-all hover:scale-[1.03] hover:bg-amber-300"
        title="Konsultasi AI Alat Berat"
      >
        {isOpen ? (
          <span className="text-xl font-bold"><X /></span>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-2xl"><GrUserWorker /></span>
            <span className="text-sm font-bold pr-1">AI Consultant</span>
          </div>
        )}
      </button>

      {/* JENDELA POP-UP CHAT */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex h-[min(31rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden border border-white/10 bg-[#0d131f] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 sm:w-96">
          {/* Header */}
          <div className="flex items-center space-x-3 border-b border-white/10 bg-[#111827] p-4 text-white">
            <span className="text-2xl"><FaGear /></span>
            <div>
              <h3 className="text-sm font-bold text-amber-400">Syah Heavy Equipment</h3>
              <p className="text-xs text-slate-300">AI Expert Consultant</p>
            </div>
          </div>

          {/* Area Percakapan */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#090d16] p-4">
            {messages.map((m, index) => (
              <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    m.role === "user"
                      ? "rounded-br-none bg-amber-400 text-[#090d16]"
                      : "rounded-bl-none border border-white/10 bg-[#111827] text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-line">{formatMessageText(m.content)}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="animate-pulse rounded-2xl rounded-bl-none border border-white/10 bg-[#111827] p-3 text-xs italic text-slate-400">
                  Consultant sedang mengetik...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Wrapper Kontrol Bawah dengan Batas Kanan-Kiri Konsisten */}
          <div className="space-y-3 border-t border-white/10 bg-[#0d131f] p-3">
            
            {/* Bagian Tombol Tanya Cepat (Bisa Digeser Horizontal / Scrollable) */}
            {!isLoading && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(undefined, question)}
                    className="shrink-0 whitespace-nowrap border border-white/10 bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-amber-400/50 hover:text-amber-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Area Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              {/* Tombol Suara */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl transition shrink-0 ${
                  isListening 
                    ? "bg-red-500 text-white animate-bounce" 
                    : "bg-[#1f2937] text-slate-300 hover:bg-[#334155]"
                }`}
                title={isListening ? "Berhenti mendengarkan" : "Bicara dengan suara"}
              >
                <FaMicrophone />
              </button>

              {/* Input Teks */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Mendengarkan suara Anda..." : "Tanya seputar alat berat/sparepart..."}
                disabled={isListening}
                className="flex-1 border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white focus:border-amber-400 disabled:opacity-60"
              />

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 bg-amber-400 p-2.5 text-sm font-bold text-[#090d16] transition hover:bg-amber-300 disabled:opacity-40"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
