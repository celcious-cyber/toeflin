"use client";
import { useEffect, useState } from 'react';
import { Users, FileText, Activity, ClipboardList, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Kelola Bank Soal', href: '/admin/dashboard/bank-soal', desc: 'Tambah, edit, atau hapus soal ujian' },
  { label: 'Kelola Paket Tes', href: '/admin/dashboard/paket-tes', desc: 'Atur paket dan jenis ujian tersedia' },
  { label: 'Permohonan Ujian', href: '/admin/dashboard/requests', desc: 'Tinjau dan setujui permohonan mahasiswa' },
];

export default function AdminOverview() {
  const [time, setTime] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    totalActiveAttempts: 0,
    totalPendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsDisplay = [
    {
      label: 'Total Mahasiswa',
      value: stats.totalStudents,
      change: 'Terdaftar aktif',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Soal di Bank',
      value: stats.totalQuestions,
      change: 'Uji kompetensi',
      icon: FileText,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
    {
      label: 'Sesi Ujian Aktif',
      value: stats.totalActiveAttempts,
      change: 'Belum disubmit',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Permohonan Pending',
      value: stats.totalPendingRequests,
      change: 'Menunggu approval',
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">

      {/* Welcome banner */}
      <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)' }}>
        <div>
          <p className="text-blue-200 text-sm font-semibold mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-white text-2xl font-black font-[family-name:var(--font-outfit)]">Panel Admin TOEFLin</h1>
          <p className="text-blue-200 text-sm mt-1">Universitas Cordova · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-4xl font-black text-white font-[family-name:var(--font-outfit)]">{time}</p>
          <p className="text-blue-300 text-xs mt-1">Waktu Sekarang</p>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsDisplay.map((s, i) => (
            <div key={i} className={`bg-white border ${s.border} rounded-2xl p-5 hover:shadow-md transition-all duration-200 group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <p className="text-2xl font-black text-slate-800 font-[family-name:var(--font-outfit)]">
                {loading ? '...' : s.value.toLocaleString('id-ID')}
              </p>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{link.label}</p>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-xs text-slate-400">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
