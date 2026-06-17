"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Award, Printer, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function CertificatePage() {
  const params = useParams();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch attempt details from API in a real scenario
    // Since we're using mock data in history, we will mock the response here if API fails
    const init = async () => {
      try {
        const uStr = localStorage.getItem('user');
        if (uStr) setUser(JSON.parse(uStr));

        // For now, let's mock the data for demonstration based on the ID
        // In reality, you'd do: fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/${attemptId}`)
        setTimeout(() => {
          setAttempt({
            id: attemptId,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            totalScore: 540,
            scaledScores: { listening: 52, structure: 48, reading: 62 }
          });
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    init();
  }, [attemptId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Menyiapkan sertifikat...</div>;
  }

  if (!attempt) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Sertifikat tidak ditemukan.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8 print:p-0 print:m-0 print:bg-white print:block">
      {/* Floating Action Buttons - Hidden when printing */}
      <div className="fixed top-6 left-6 right-6 flex justify-between z-50 print:hidden">
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-white text-slate-600 rounded-xl font-bold text-sm shadow-sm border border-slate-200 hover:bg-slate-50 flex items-center gap-2"
        >
          <ChevronLeft size={16} /> Tutup
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          <Printer size={18} /> Cetak / Simpan PDF
        </button>
      </div>

      {/* Certificate Container */}
      <div
        className="certificate-container bg-white shadow-2xl relative overflow-hidden print:shadow-none"
        style={{ width: '297mm', height: '210mm' }}
      >
        {/* Background PNG Template */}
        <img
          src="/template-sertifikat.png"
          alt="Certificate Template"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Dynamic Content Overlay */}
        <div className="relative z-10 w-full h-full">

          {/* =========================================================
              PENGATURAN POSISI TEKS (KOORDINAT MANUAL)
              =========================================================
              Cara mengubah posisi:
              - 'top': Jarak dari atas kertas (0% paling atas, 100% paling bawah)
              - 'left': Jarak dari kiri kertas (0% paling kiri, 100% paling kanan, 50% persis di tengah)
              Anda cukup mengubah angka persentasenya saja, lalu 'Save' file ini. 
          */}

          {/* 1. NOMOR SERTIFIKAT */}
          <div className="absolute tracking-widest text-sm font-normal text-slate-600 font-[family-name:var(--font-roboto)]"
            style={{ top: '32.5%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            Certificate No : TFL-{attempt.id.split('-')[0].toUpperCase()}-{new Date().getFullYear()}
          </div>

          {/* 2. NAMA MAHASISWA */}
          <div className="absolute font-serif font-bold text-3xl text-slate-800 uppercase tracking-wider"
            style={{ top: '43.5%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {user?.name || "Nama Mahasiswa"}
          </div>

          {/* 3. DESKRIPSI & TANGGAL UJIAN (Menggantikan area kosong di PNG) */}
          <div className="absolute text-[15px] text-slate-700 font-normal font-[family-name:var(--font-roboto)] text-center w-full max-w-3xl leading-relaxed px-8"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            has successfully completed the <b>TOEFL ITP Simulation</b> Test on <b>{attempt.date}</b> <br />
            and achieved the following scores, demonstrating proficiency in English as a foreign language.
          </div>

          {/* 4. SKOR LISTENING (Masuk ke baris ke-1 tabel) */}
          <div className="absolute text-lg text-slate-800 font-normal font-[family-name:var(--font-roboto)]"
            style={{ top: '56%', left: '66.8%', transform: 'translate(-50%, -50%)' }}>
            {attempt.scaledScores?.listening || 0}
          </div>

          {/* 5. SKOR STRUCTURE (Masuk ke baris ke-2 tabel) */}
          <div className="absolute text-lg text-slate-800 font-normal font-[family-name:var(--font-roboto)]"
            style={{ top: '59.7%', left: '66.8%', transform: 'translate(-50%, -50%)' }}>
            {attempt.scaledScores?.structure || 0}
          </div>

          {/* 6. SKOR READING (Masuk ke baris ke-3 tabel) */}
          <div className="absolute text-lg text-slate-800 font-normal font-[family-name:var(--font-roboto)]"
            style={{ top: '63.5%', left: '66.8%', transform: 'translate(-50%, -50%)' }}>
            {attempt.scaledScores?.reading || 0}
          </div>

          {/* 7. SKOR TOTAL (Masuk ke baris paling bawah tabel) */}
          <div className="absolute text-xl text-slate-900 font-bold font-[family-name:var(--font-roboto)]"
            style={{ top: '67.5%', left: '66.8%', transform: 'translate(-50%, -50%)' }}>
            {attempt.totalScore}
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
          .certificate-container {
            width: 297mm !important;
            height: 210mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
