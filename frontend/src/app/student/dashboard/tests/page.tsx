"use client";
import { useState, useEffect } from 'react';
import { PlayCircle, Clock, Zap, Package } from 'lucide-react';
import Link from 'next/link';

interface TestPackage {
  id: string;
  name: string;
  type: string;
  sections: string[];
  description?: string;
}

export default function TestsPage() {
  const [packages, setPackages] = useState<TestPackage[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/test-packages')
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold font-[family-name:var(--font-outfit)] mb-3 text-slate-800">Pilih Paket Tes 📝</h1>
        <p className="text-slate-500 text-lg">Pilih jenis simulasi yang ingin Anda kerjakan untuk mencapai target skor Anda.</p>
      </div>

      {packages.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center animate-pulse">
            <Package size={40} className="text-slate-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-700 font-[family-name:var(--font-outfit)]">Belum ada paket tes</h3>
            <p className="text-slate-500">Hubungi admin untuk menambahkan paket tes simulasi baru.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="relative bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group overflow-hidden">
              {/* Colorful gradient line at the top */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${pkg.type === 'Full Test' ? 'from-orange-400 to-red-500' : 'from-blue-400 to-indigo-500'}`} />
              
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${pkg.type === 'Full Test' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                    {pkg.type === 'Full Test' ? <><Clock size={14} /> Full Test</> : <><Zap size={14} /> Practice</>}
                  </span>
                  <h3 className="font-extrabold text-xl mt-4 text-slate-800 font-[family-name:var(--font-outfit)]">{pkg.name}</h3>
                </div>
              </div>
              
              {pkg.description && <p className="text-sm text-slate-500 leading-relaxed">{pkg.description}</p>}
              
              <div className="flex gap-2 flex-wrap mt-1">
                {(Array.isArray(pkg.sections) ? pkg.sections : []).map((s: string) => (
                  <span key={s} className={`text-xs font-bold px-3 py-1 rounded-full ${s === 'Listening' ? 'bg-blue-50 text-blue-700' : s === 'Structure' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>{s}</span>
                ))}
              </div>
              
              <Link href={`/student/exam/${pkg.id}`} className="mt-auto w-full px-5 py-3.5 bg-slate-50 text-slate-700 hover:bg-primary hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-colors shadow-sm">
                <PlayCircle size={18} /> Mulai Simulasi
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
