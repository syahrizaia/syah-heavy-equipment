import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATED_AI_API_KEY;
    if (!apiKey) {
      console.error("➔ [ERROR API]: GOOGLE_GENERATED_AI_API_KEY belum dikonfigurasi di .env.local!");
      return NextResponse.json(
        { reply: "⚠️ API Key Google Gemini belum dikonfigurasi pada server Syah Heavy Equipment." },
        { status: 200 }
      );
    }

    const geminiContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `Anda adalah AI Consultant ahli untuk "Syah Heavy Equipment" (https://syahheavyequipment.vercel.app). 
    Tugas utama Anda adalah melayani konsultasi mengenai:
    1. Jual beli alat berat dan suku cadang (spare parts).
    2. Perbaikan (repair/maintenance) alat berat dan suku cadang.
    3. Penyewaan (rental) alat berat.
    4. Hal-hal teknis lainnya terkait alat berat.

    ATURAN FORMAT PENTING:
    1. Jawablah dengan bahasa Indonesia yang ramah, profesional, ringkas, dan solutif.
    2. JANGAN PERNAH menggunakan format markdown seperti tanda bintang (contoh: **teks** atau *teks*) untuk menebalkan teks. Gunakan teks polos biasa tanpa hiasan apa pun.
    3. Jika ingin memberikan link, tuliskan langsung URL lengkapnya atau gunakan format teks biasa, jangan gunakan format kurung siku markdown seperti [Nama](Link).
    4. Jika ada pertanyaan di luar topik alat berat atau suku cadang, arahkan kembali pengguna dengan sopan ke layanan utama Syah Heavy Equipment.
    
    Jawablah dengan bahasa Indonesia yang ramah, profesional, ringkas, dan solutif. Jika ada pertanyaan di luar topik alat berat atau suku cadang, arahkan kembali pengguna dengan sopan ke layanan utama Syah Heavy Equipment.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("➔ [GEMINI API ERROR]:", errorData);
      return NextResponse.json(
        { reply: "Maaf, server Google Gemini sedang mengalami kendala pembacaan data." },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    // Extract text jawaban dari response JSON Google Gemini
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak menangkap maksud Anda.";

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.error("➔ [CRITICAL ERROR]:", error);
    return NextResponse.json({ reply: "Terjadi kesalahan internal pada sistem integrasi Gemini." }, { status: 200 });
  }
}