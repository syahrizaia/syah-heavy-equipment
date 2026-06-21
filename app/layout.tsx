import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://syahheavyequipment.vercel.app"),
  title: {
    default: "Syah Heavy Equipment | Sewa & Mobilisasi Alat Berat Premium",
    template: "%s | Syah Heavy Equipment"
  },
  description: "Pantau kesehatan dan status operasional alat berat secara real-time. Mitra penyewaan alat berat (Excavator, Crane, Truk, dll) standar HSE di Bekasi, dan lokasi lainnya. Dilengkapi sistem pantau Live Telemetri Satelit 3D.",
  keywords: [
    "sewa alat berat", "rental excavator", "sewa crane pc200", 
    "heavy equipment indonesia", "pelacakan alat berat 3d", 
    "sewa ekskavator bekasi", "rental lowbed balikpapan"
  ],
  authors: [{ name: "Syah Heavy Equipment" }],
  openGraph: {
    title: "Syah Heavy Equipment | Sewa & Mobilisasi Alat Berat Premium",
    description: "Penyewaan armada alat berat standar HSE dengan dukungan tracking GPS live 3D.",
    url: "https://syahheavyequipment.vercel.app",
    siteName: "Syah Heavy Equipment",
    locale: "id_ID",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "EquipmentRentalAgency",
    "@id": "https://syahheavyequipment.vercel.app/#organization",
    "name": "Syah Heavy Equipment",
    "url": "https://syahheavyequipment.vercel.app",
    "logo": "https://syahheavyequipment.vercel.app/icon.png",
    "description": "Penyewaan dan pemeliharaan alat berat kelas dunia dengan dukungan tracking GPS live 3D.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Workshop Utama SHE, Bekasi",
      "addressRegion": "Jawa Barat",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.2349, 
      "longitude": 106.9896
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-812-2813-4488",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Suntikkan JSON-LD Schema Ke dalam Tag Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      
      <body className="min-h-full flex flex-col">
        {children}

        <Toaster theme="dark" position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
