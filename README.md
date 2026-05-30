# Syah Heavy Equipment | Industrial Portal

Platform digital untuk pengadaan, penyewaan, dan pemeliharaan alat berat berskala industri.

## 🏗️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Language:** TypeScript
- **Backend:** Supabase (Auth, Database, Storage)
- **UI Components:** Shadcn/UI
- **Icons**: Lucide React
- **Analytics**: Recharts (untuk monitoring IoT)

## Struktur Folder
- `app/` : Halaman utama dan routing
- `components/` : Komponen UI reusable (FleetCard, Charts, Nav)
- `lib/` : Utilitas Supabase & Helper functions

## Komitmen Desain
Desain mengusung tema **"Industrial High-Tech"** dengan dominasi warna *Construction Yellow* (`#ca8a04`) dan *Matte Black* (`#0a0a0a`) untuk memberikan kesan profesional, kokoh, dan modern bagi klien industri skala besar.

## 🚀 Fitur Utama
- **Interactive Fleet Catalog:** Navigasi katalog alat berat dengan filter dinamis.
- **Predictive Maintenance Module:** Dashboard untuk memantau status kesehatan mesin (IoT Integration ready).
- **Industrial Animation Suite:** Animasi *scroll* yang terinspirasi dari gerakan mekanis alat berat.
- **Client Portal:** Sistem manajemen sewa dan pemeliharaan berbasis akun.

## 🛠️ Persiapan Pengembangan
1. Clone repositori ini.
2. Jalankan `npm install`.
3. Konfigurasi `.env.local` dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.
4. Jalankan `npm run dev` untuk memulai pengembangan.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
