import { PlayCircle, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function StudentOverview() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden bg-white shadow-xl shadow-blue-500/5 border border-blue-100 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 -z-10 translate-x-20 -translate-y-20"></div>
        <div className="z-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-outfit)] mb-3 text-slate-800">Halo, Mahasiswa! 👋</h1>
          <p className="text-slate-500 text-lg">Siap untuk berlatih TOEFL ITP hari ini?</p>
        </div>
        <Link 
          href="/student/dashboard/tests"
          className="z-10 btn-hover px-8 py-4 bg-primary text-white rounded-full font-bold flex items-center gap-3 shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40"
        >
          <PlayCircle size={22} /> Mulai Tes Baru
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skor Terakhir */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-indigo-600/20 overflow-hidden btn-hover flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12"><Target size={180} /></div>
          <div className="z-10">
            <p className="text-sm font-medium text-blue-100 mb-2 uppercase tracking-wider">Skor Simulasi Terakhir</p>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-6xl font-black font-[family-name:var(--font-outfit)] tracking-tight">540</h2>
              <p className="text-blue-200 font-medium">/ 677</p>
            </div>
          </div>
          <div className="z-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-6 mt-4">
            <div className="flex flex-col"><span className="text-xs text-blue-200 uppercase tracking-wider mb-1">Listening</span><span className="font-bold text-xl">52</span></div>
            <div className="flex flex-col"><span className="text-xs text-blue-200 uppercase tracking-wider mb-1">Structure</span><span className="font-bold text-xl">48</span></div>
            <div className="flex flex-col"><span className="text-xs text-blue-200 uppercase tracking-wider mb-1">Reading</span><span className="font-bold text-xl">62</span></div>
          </div>
        </div>
        
        {/* Progress Belajar */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col justify-between btn-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-2xl opacity-80 -z-10"></div>
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 mb-6">
              <TrendingUp size={16} className="text-green-600"/>
              <span className="text-xs font-bold uppercase tracking-wider">Progress Belajar</span>
            </div>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-outfit)] text-slate-800 mb-2">Konsisten! 🔥</h2>
            <p className="text-slate-500">Anda sudah mengerjakan 3 Full Test bulan ini.</p>
          </div>
          <div className="z-10 mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
             <span className="text-slate-600 font-medium text-sm">Kesempatan minggu ini</span>
             <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full font-bold text-primary shadow-sm text-sm">1 Full Test</span>
          </div>
        </div>
      </div>
    </div>
  );
}
