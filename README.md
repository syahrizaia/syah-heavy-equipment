# Syah Heavy Equipment

> Platform digital terpadu untuk **pengadaan, penyewaan, mobilisasi, dan pemeliharaan alat berat** berskala industri.

Syah Heavy Equipment adalah portal industrial enterprise yang menghubungkan pemilik proyek, kontraktor, dan operator tambang dengan armada alat berat (ekskavator, crane, truk, dozer, dsb.) serta pusat suku cadang — dilengkapi teknologi IoT, pelacakan GPS 3D real-time, dan konsultan AI.

---

## Daftar Isi

- [Ikhtisar](#ikhtisar)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur & Alur Kerja](#arsitektur--alur-kerja)
- [Struktur Folder](#struktur-folder)
- [Rute Aplikasi](#rute-aplikasi)
- [Skema Data (Supabase)](#skema-data-supabase)
- [Konfigurasi Lingkungan](#konfigurasi-lingkungan)
- [Menjalankan Proyek](#menjalankan-proyek)
- [SEO & Performa](#seo--performa)
- [Keamanan](#keamanan)
- [Deployment](#deployment)

---

## Ikhtisar

Aplikasi ini dibangun sebagai **ekosistem end-to-end** untuk industri alat berat di Indonesia:

| Sisi | Deskripsi |
|---|---|
| **Publik** | Katalog armada & suku cadang, landing page, layanan, pelacakan pengiriman 3D, halaman proyek & wilayah, karier, kontak, pusat bantuan. |
| **Privat (Client Portal)** | Dashboard operasional, manajemen armada, suku cadang, proyek lapangan, dan penyewaan — khusus pengguna terautentikasi. |
| **AI** | Konsultan virtual (Google Gemini) untuk jual-beli, rental, dan konsultasi teknis alat berat. |
| **IoT** | Monitoring kesehatan mesin (grafik real-time), analitik operasional, dan prediksi permintaan sewa. |

---

## Fitur Utama

### 1. Katalog Armada Interaktif (`/fleet`)
- Filter & pencarian dinamis unit alat berat.
- Halaman detail per unit dengan **gambar, spesifikasi, harga, dan status** (Ready / Maintenance / Sold).
- Pencatatan tren *view* per unit (RPC `increment_fleet_view`).
- Kartu produk dengan gambar teroptimasi (`next/image`).

### 2. Pusat Suku Cadang (`/spare-part`)
- Katalog komponen dengan **P/N, kompatibilitas, stok, garansi, dan harga**.
- Status ketersediaan: `READY STOCK` vs `INDENT`.
- Pemesanan langsung via **WhatsApp** (jumlah, harga, status otomatis).
- Berbagi produk (Web Share API / clipboard) dan galeri multi-foto.
- Pencatatan tren *view* per part (RPC `increment_part_view`).

### 3. Pelacakan Pengiriman 3D (`/tracking`, `/tracking/[id]`)
- Visualisasi **peta 3D** posisi mobilisasi alat berat (Mapbox GL).
- Telemetri satelit GPS real-time.

### 4. Layanan Industri (`/service`)
- Penyewaan armada, pelacakan pengiriman, pemeliharaan prediktif, dukungan teknis lapangan, dan optimasi operasional.
- Sub-halaman detail per layanan + formulir kebutuhan sewa (terkirim ke WhatsApp & Supabase).

### 5. IoT & Analitik (`/landing-page`)
- **Machine Health Chart** — grafik suhu & tekanan mesin real-time (Recharts).
- **Operational Analytics** — big data operasional proyek & pengiriman.
- **Rental Demand** — prediksi permintaan sewa.
- **Market Trends** — tren pasar armada & suku cadang.

### 6. Konsultan AI (`AIConsultant`)
- Chatbot berbasis **Google Gemini** (`gemini-3.5-flash`).
- Menjawab konsultasi jual-beli, rental, perbaikan, dan pertanyaan teknis dalam Bahasa Indonesia.

### 7. Client Portal (Terproteksi)
- **Dashboard** — ringkasan operasional.
- **Manajemen Armada** — CRUD unit (termasuk upload foto & spesifikasi dinamis).
- **Manajemen Suku Cadang**, **Proyek Lapangan**, **Penyewaan**.
- Autentikasi email (sign-in / sign-up) via Supabase Auth.

### 8. PWA (Progressive Web App)
- `public/manifest.json` + `public/sw.js` — dapat diinstal sebagai aplikasi & berjalan offline.

---

## Tech Stack

| Lapisan | Teknologi | Versi |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, Turbopack) | 16.2.x |
| Bahasa | TypeScript (strict) | 5.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Backend-as-a-Service | Supabase (Auth, DB, Storage, RPC) | `@supabase/ssr` |
| Animasi | Framer Motion | 12.x |
| Grafik/Analitik | Recharts | 3.x |
| Peta 3D | Mapbox GL | 3.x |
| Ikon | Lucide React, React Icons | — |
| Notifikasi | Sonner (toast) | 2.x |
| AI | Google Gemini (`@ai-sdk/google`) | — |

---

## Arsitektur & Alur Kerja

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  Komponen "use client" → lib/supabase.ts (createBrowserClient)│
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────┐
│                    Next.js (Server / RSC)                    │
│  Server Components → lib/supabase-server.ts (createServerClient)│
│  Route Handlers → app/api/ai/chat (Google Gemini)            │
│  Server Actions → actions/*.ts                               │
│  Middleware → middleware.ts (Auth guard, refresh session)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Supabase (Backend)                       │
│  Auth · Postgres DB · Storage · RPC (increment_*_view)       │
└─────────────────────────────────────────────────────────────┘
```

**Prinsip pemisahan klien server:**
- **Server Components / Server Actions / Route Handlers** → `createServerSupabase()` (`lib/supabase-server.ts`).
- **Client Components** → `supabase` browser client (`lib/supabase.ts`).
- **Middleware** → `createServerClient` khusus untuk membaca/menyegarkan session cookie.

> Pemisahan ini mencegah bug cookie pada React Server Components (RSC) dan menjaga auth tetap aman.

**Alur data (revalidate):**
Halaman katalog & detail memakai `export const revalidate = 60` — data di-*cache* 60 detik lalu di-refresh (Incremental Static Regeneration).

---

## Struktur Folder

```
syah-heavy-equipment/
├── app/
│   ├── layout.tsx              # Root layout: metadata, font, JSON-LD, Toaster
│   ├── page.tsx                # Landing (redirect ke /landing-page)
│   ├── robots.ts               # Konfigurasi robots.txt
│   ├── sitemap.ts              # Sitemap statis 15 rute
│   ├── (public)/               # Rute publik
│   │   ├── layout.tsx          # Navbar publik + footer + widget mengambang
│   │   ├── landing-page/       # Beranda (hero, analitik, status)
│   │   ├── fleet/              # Katalog armada
│   │   ├── fleet/[id]/         # Detail unit
│   │   ├── spare-part/         # Katalog suku cadang
│   │   ├── spare-part/[id]/    # Detail part (server-fetched)
│   │   ├── service/            # Layanan + sub-halaman
│   │   ├── tracking/           # Pelacakan pengiriman
│   │   ├── tracking/[id]/      # Detail pelacakan (peta 3D)
│   │   ├── project/            # Proyek & studi kasus
│   │   ├── project/[id]/       # Detail proyek
│   │   ├── region/             # Cakupan wilayah
│   │   ├── region/[city]/      # Detail kota
│   │   ├── technology/         # Teknologi IoT
│   │   ├── careers/            # Karier
│   │   ├── contact/            # Kontak
│   │   ├── help-center/        # Pusat bantuan
│   │   └── privacy/            # Kebijakan privasi
│   ├── (auth)/                 # Autentikasi
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (private)/              # Client portal (terproteksi)
│   │   ├── layout.tsx          # Sidebar privat
│   │   ├── dashboard/
│   │   ├── account/
│   │   ├── fleet-management/
│   │   ├── spare-part-management/
│   │   ├── site-project/
│   │   └── rental-management/
│   └── api/
│       └── ai/chat/route.ts    # Endpoint konsultan AI (Gemini)
├── actions/                    # Server Actions (fleet, spare-part)
├── components/                 # Komponen UI reusable
│   ├── services/               # ServiceCard, RentalModal
│   ├── FleetCard.tsx           # Kartu armada
│   ├── FleetDetailContent.tsx  # Detail unit
│   ├── PartDetailContent.tsx   # Detail part
│   ├── FleetFormModal.tsx      # Form CRUD unit
│   ├── SparePartModalDialog.tsx# Form CRUD part
│   ├── MapTracking3D.tsx       # Peta 3D
│   ├── MachineHealthChart.tsx  # Grafik kesehatan mesin
│   ├── IotDashboard.tsx        # Dashboard IoT
│   ├── AIConsultant.tsx        # Chatbot AI
│   ├── PublicNavbar.tsx        # Navbar publik
│   ├── PrivateSidebar.tsx      # Sidebar privat
│   └── ... (seksi analitik, footer, dll.)
├── lib/
│   ├── supabase.ts             # Browser client (client components)
│   ├── supabase-server.ts      # Server client (RSC & actions)
│   └── fleet-service.ts        # Helper CRUD armada
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── ... (gambar, ikon, favicon)
├── middleware.ts               # Auth guard + session refresh
├── next.config.ts              # Remote image patterns
├── tailwind.config.ts
└── package.json
```

---

## Rute Aplikasi

### Publik (tanpa login)
| Rute | Deskripsi |
|---|---|
| `/` / `/landing-page` | Beranda — hero, analitik, status operasional |
| `/fleet` & `/fleet/[id]` | Katalog & detail armada |
| `/spare-part` & `/spare-part/[id]` | Katalog & detail suku cadang |
| `/service` + 3 sub-layanan | Layanan industri |
| `/tracking` & `/tracking/[id]` | Pelacakan pengiriman |
| `/project` & `/project/[id]` | Proyek / studi kasus |
| `/region` & `/region/[city]` | Cakupan wilayah |
| `/technology` | Teknologi IoT |
| `/careers`, `/contact`, `/help-center`, `/privacy` | Halaman informasi |

### Autentikasi
| Rute | Deskripsi |
|---|---|
| `/sign-in` | Masuk |
| `/sign-up` | Daftar |

### Privat (wajib login — dijaga middleware)
| Rute | Deskripsi |
|---|---|
| `/dashboard` | Ringkasan operasional |
| `/fleet-management` | CRUD armada |
| `/spare-part-management` | CRUD suku cadang |
| `/site-project` | Manajemen proyek |
| `/rental-management` | Manajemen penyewaan |
| `/account` | Pengaturan akun |

### API
| Rute | Metode | Deskripsi |
|---|---|---|
| `/api/ai/chat` | POST | Konsultan AI (Google Gemini) |

---

## Skema Data (Supabase)

Tabel utama yang digunakan aplikasi:

| Tabel | Kolom Kunci | Fungsi |
|---|---|---|
| `fleet` | `id, title, category, model, price, status, health_score, image_url[], specs, description, is_sold` | Data armada |
| `spare_parts` | `id, name, part_number, category, price, stock, compatibility, warranty, image[], description` | Data suku cadang |
| `projects` | `id, ...` | Data proyek / studi kasus |
| `shipments` | `id, ...` | Data pengiriman (pelacakan) |
| `rental_requests` | `id, full_name, company_name, equipment_type, duration, project_location, start_date, additional_notes` | Permintaan sewa |

**RPC (Remote Procedure Calls):**
- `increment_fleet_view(target_id)` — menambah counter tren view armada.
- `increment_part_view(target_id)` — menambah counter tren view suku cadang.

---

## Konfigurasi Lingkungan

Buat file `.env.local` di root proyek:

```bash
# Supabase (wajib)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Google Gemini — untuk konsultan AI (opsional)
GOOGLE_GENERATED_AI_API_KEY=<gemini-api-key>

# Mapbox — untuk peta 3D pelacakan (opsional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<mapbox-token>

# URL publik — untuk canonical & JSON-LD (opsional)
NEXT_PUBLIC_SITE_URL=https://syahheavyequipment.vercel.app
```

> Aplikasi menampilkan fallback yang ramah jika `GOOGLE_GENERATED_AI_API_KEY` atau `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` belum diatur.

---

## Menjalankan Proyek

```bash
# 1. Clone repositori
git clone https://github.com/syahrizaia/syah-heavy-equipment.git
cd syah-heavy-equipment

# 2. Install dependensi
npm install

# 3. Konfigurasi .env.local (lihat bagian di atas)

# 4. Jalankan mode pengembangan
npm run dev
# buka http://localhost:3000

# 5. Build produksi
npm run build

# 6. Jalankan build produksi
npm start
```

**Skrip lain:**
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Mode pengembangan (Turbopack) |
| `npm run build` | Build produksi |
| `npm start` | Menjalankan build produksi |
| `npm run lint` | ESLint |

---

## SEO & Performa

- **Metadata dinamis** — `generateMetadata` per halaman detail (`fleet/[id]`, `spare-part/[id]`).
- **Open Graph & Twitter Cards** — pratinjau sosial lengkap dengan gambar.
- **Structured Data (JSON-LD)** — skema `EquipmentRentalAgency` (root) & `Product`/`Offer` (detail armada & suku cadang) untuk rich snippet Google.
- **Canonical URL** — mencegah duplikat konten.
- **`sitemap.xml`** — 15 rute statis terdaftar.
- **`robots.txt`** — memblokir rute privat (`/dashboard`, `/api`, dll.).
- **Gambar teroptimasi** — `next/image` (lazy-load, sizing, format otomatis).
- **Code splitting** — `next/dynamic` untuk komponen berat (peta, grafik, chatbot, modal).
- **ISR** — `revalidate = 60` pada halaman data untuk cache + kesegaran.

---

## Keamanan

- **Autentikasi** — Supabase Auth (email) dengan session cookie `httpOnly`.
- **Middleware guard** — rute `/dashboard`, `/fleet-management`, `/spare-part-management`, `/site-project`, `/account` hanya bisa diakses pengguna login.
- **Pemisahan klien-server** — anon key hanya diekspos ke browser (tidak ada secret server yang bocor).
- **Validasi input** — formulir menggunakan atribut `required` dan sanitasi di server actions.
- **Row Level Security (RLS)** — direkomendasikan diaktifkan pada semua tabel Supabase.

---

## Deployment

Proyek siap deploy ke **Vercel**:

1. Push ke GitHub.
2. Import repositori di [Vercel](https://vercel.com/new).
3. Tambahkan semua environment variable (lihat [Konfigurasi Lingkungan](#konfigurasi-lingkungan)).
4. Deploy — build & route di-handle otomatis oleh Next.js.

**Live URL:** https://syahheavyequipment.vercel.app

---

## Komitmen Desain

Desain mengusung tema **"Industrial High-Tech"**:
- **Construction Yellow** (`#ca8a04`) — aksen aksi & CTA.
- **Matte Black** (`#0a0a0a`) — latar profesional & kokoh.
- Tipografi industrial (`font-barlow`) untuk kesan mekanis & tegas.
- Animasi *scroll* terinspirasi gerakan mekanis alat berat.

---

Dibangun dengan [Next.js](https://nextjs.org) — © Syah Heavy Equipment.
