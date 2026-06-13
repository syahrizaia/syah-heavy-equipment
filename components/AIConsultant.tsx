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
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* TOMBOL UTAMA (FLOATING BUTTON) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center border-2 border-slate-800"
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
        <div className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center space-x-3">
            <span className="text-2xl"><FaGear /></span>
            <div>
              <h3 className="font-bold text-sm text-yellow-500">Syah Heavy Equipment</h3>
              <p className="text-xs text-slate-300">AI Expert Consultant</p>
            </div>
          </div>

          {/* Area Percakapan */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, index) => (
              <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    m.role === "user"
                      ? "bg-yellow-500 text-slate-900 rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{formatMessageText(m.content)}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl p-3 text-xs italic shadow-sm animate-pulse">
                  Consultant sedang mengetik...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Wrapper Kontrol Bawah dengan Batas Kanan-Kiri Konsisten */}
          <div className="bg-white border-t border-slate-200 p-3 space-y-3">
            
            {/* Bagian Tombol Tanya Cepat (Bisa Digeser Horizontal / Scrollable) */}
            {!isLoading && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(undefined, question)}
                    className="bg-slate-100 hover:bg-yellow-100 border border-slate-200 hover:border-yellow-400 text-slate-700 hover:text-slate-900 text-xs px-3 py-1.5 rounded-full transition-all duration-150 font-medium whitespace-nowrap flex-shrink-0"
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
                className={`p-2.5 rounded-xl transition flex-shrink-0 ${
                  isListening 
                    ? "bg-red-500 text-white animate-bounce" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
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
                className="text-slate-800 flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 disabled:bg-slate-50"
              />

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition flex-shrink-0"
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