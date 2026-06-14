"use client";
import { Clock, Award, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  // Mock data for now — will be connected to API
  const history = [
    { id: '1', date: '10 Jun 2026', type: 'Full Test', totalScore: 540, listening: 52, structure: 48, reading: 62 },
    { id: '2', date: '3 Jun 2026', type: 'Full Test', totalScore: 510, listening: 48, structure: 45, reading: 58 },
    { id: '3', date: '27 Mei 2026', type: 'Section Practice', totalScore: 480, listening: 44, structure: 42, reading: 54 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold font-[family-name:var(--font-outfit)] mb-3 text-slate-800">Riwayat Tes 🏆</h1>
        <p className="text-slate-500 text-lg">Pantau perkembangan skor TOEFL ITP Anda dan identifikasi kelemahan Anda.</p>
      </div>

      {/* Trend mini-chart */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 mb-10 overflow-hidden text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
          <TrendingUp size={32} className="text-white" />
        </div>
        <div>
          <h2 className="font-extrabold text-2xl font-[family-name:var(--font-outfit)] mb-2">Tren Positif! 📈</h2>
          <p className="text-blue-100 text-lg">Luar biasa! Skor Anda naik <b className="text-white bg-white/20 px-2 py-0.5 rounded-md mx-1">+30 poin</b> dalam 2 minggu terakhir. Terus pertahankan ritme belajar Anda.</p>
        </div>
      </div>

      <div className="space-y-4">
        {history.map(h => (
          <div key={h.id} className="group relative p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Award size={28} />
              </div>
              <div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="font-black text-3xl text-slate-800 font-[family-name:var(--font-outfit)]">{h.totalScore}</p>
                  <p className="text-sm font-medium text-slate-400 mb-1">/ 677</p>
                </div>
                <p className="text-sm font-medium text-slate-500">{h.date} <span className="mx-2 text-slate-300">•</span> <span className="text-primary">{h.type}</span></p>
              </div>
            </div>
            
            {/* Score Breakdown & Action */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex gap-3 w-full md:w-auto bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">List.</p>
                  <p className="font-bold text-blue-600">{h.listening}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Struct.</p>
                  <p className="font-bold text-green-600">{h.structure}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Read.</p>
                  <p className="font-bold text-purple-600">{h.reading}</p>
                </div>
              </div>

              <a 
                href={`/student/certificate/${h.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 shadow-sm"
              >
                <Award size={18} />
                <span>Unduh Sertifikat</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
