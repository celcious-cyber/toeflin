import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "TOEFLin Undova | Simulasi TOEFL ITP Resmi",
  description: "Aplikasi CBT Simulasi Ujian TOEFL ITP Resmi untuk Mahasiswa Universitas Cordova. Dapatkan prediksi skor akurat, analisis detail, dan sertifikat langsung.",
  keywords: ["TOEFL ITP", "Simulasi TOEFL", "Universitas Cordova", "CBT TOEFL", "TOEFLin", "Tes Bahasa Inggris"],
  authors: [{ name: "Universitas Cordova" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "TOEFLin Undova - Platform Simulasi TOEFL ITP",
    description: "Ukur Kemampuan Bahasa Inggris Anda Secara Akurat. Simulasi TOEFL ITP format asli dengan penilaian otomatis.",
    url: "https://toeflin.my.id",
    siteName: "TOEFLin Undova",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOEFLin Undova | Simulasi TOEFL ITP Resmi",
    description: "Ukur Kemampuan Bahasa Inggris Anda Secara Akurat dengan simulasi CBT TOEFLin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
