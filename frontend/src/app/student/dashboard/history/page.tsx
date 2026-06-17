"use client";
import { useState, useEffect } from 'react';
import { Clock, Award, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/attempts/user/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setHistory(data || []);
          }
        } catch (err) {
          console.error('Error fetching history:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const getTrendData = () => {
    if (history.length < 2) return null;
    const latest = history[0].totalScore;
    const oldest = history[history.length - 1].totalScore;
    const diff = latest - oldest;
    
    if (diff > 0) {
      return {
        type: 'UP',
        bg: 'from-blue-600 to-purple-600 shadow-blue-500/20',
        icon: <TrendingUp size={32} className="text-white" />,
        title: 'Tren Positif! 📈',
        text: `Luar biasa! Skor Anda naik +${diff} poin sejak simulasi pertama Anda. Terus pertahankan ritme belajar Anda!`
      };
    } else if (diff < 0) {
      return {
        type: 'DOWN',
        bg: 'from-orange-500 to-red-500 shadow-red-500/20',
        icon: <TrendingDown size={32} className="text-white" />,
        title: 'Tetap Semangat! 💪',
        text: `Skor Anda turun ${diff} poin dari simulasi pertama. Yuk, identifikasi kelemahan Anda di bawah ini dan coba lagi!`
      };
    } else {
      return {
        type: 'STABLE',
        bg: 'from-indigo-600 to-blue-600 shadow-indigo-500/20',
        icon: <Minus size={32} className="text-white" />,
        title: 'Konsisten! 📊',
        text: `Skor Anda stabil di angka ${latest} poin. Fokuslah melatih bagian sub-materi yang masih kurang agar skor Anda meningkat!`
      };
    }
  };

  const trend = getTrendData();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold font-[family-name:var(--font-outfit)] mb-3 text-slate-800">Riwayat Tes 🏆</h1>
        <p className="text-slate-500 text-lg">Pantau perkembangan skor TOEFL ITP Anda dan identifikasi kelemahan Anda secara langsung.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Memuat riwayat ujian Anda...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Target size={64} className="text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 font-[family-name:var(--font-outfit)] mb-1">Belum Ada Riwayat Tes</h3>
          <p className="text-slate-500 max-w-sm mb-6">Anda belum pernah mengambil simulasi TOEFL ITP. Mulailah berlatih hari ini!</p>
          <Link
            href="/student/dashboard/tests"
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all text-sm"
          >
            Mulai Ujian Pertama
          </Link>
        </div>
      ) : (
        <>
          {/* Trend mini-chart */}
          {trend && (
            <div className={`relative p-8 rounded-3xl bg-gradient-to-r ${trend.bg} mb-10 overflow-hidden text-white shadow-xl flex flex-col md:flex-row items-center gap-8`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                {trend.icon}
              </div>
              <div>
                <h2 className="font-extrabold text-2xl font-[family-name:var(--font-outfit)] mb-2">{trend.title}</h2>
                <p className="text-blue-100 text-lg">{trend.text}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {history.map(h => (
              <div key={h.id} className="group relative p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Award size={28} />
                  </div>
                  <div>
                    <div className="flex items-end gap-2 mb-1">
                      <p className="font-black text-3xl text-slate-800 font-[family-name:var(--font-outfit)]">{h.totalScore}</p>
                      <p className="text-sm font-medium text-slate-400 mb-1">/ 677</p>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      {formatDate(h.date)} <span className="mx-2 text-slate-300">•</span> 
                      <span className="text-primary font-semibold">{h.testPackage?.name || 'Full Test'}</span>
                    </p>
                  </div>
                </div>
                
                {/* Score Breakdown & Action */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="flex gap-3 w-full md:w-auto bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">List.</p>
                      <p className="font-bold text-blue-600">{h.scaledScores?.listening || '-'}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Struct.</p>
                      <p className="font-bold text-green-600">{h.scaledScores?.structure || '-'}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white w-16 py-2 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Read.</p>
                      <p className="font-bold text-purple-600">{h.scaledScores?.reading || '-'}</p>
                    </div>
                  </div>

                  <a 
                    href={`/student/certificate/${h.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-4 py-3 bg-blue-50/50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm"
                  >
                    <Award size={18} />
                    <span>Unduh Sertifikat</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
