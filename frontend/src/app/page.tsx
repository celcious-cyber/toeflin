"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const highlights = [
  'Simulasi ujian TOEFL ITP format asli',
  'Penilaian otomatis skala 310–677',
  'Analisis kekuatan & kelemahan per seksi',
  'Sertifikat hasil ujian resmi',
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStudentLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => {
      router.push('/student/login');
    }, 750);
  };

  if (!mounted) return null;

  return (
    <main
      ref={mainRef}
      className={`min-h-screen bg-white flex flex-col transition-all duration-[750ms] ease-in-out ${leaving ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >

      {/* Top Nav Bar */}
      <nav className="opacity-0-init animate-fade-in w-full border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Image src="/toeflin.svg" alt="TOEFLin" width={140} height={40} className="h-8 w-auto" priority />
          <Link
            href="/admin/login"
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
          >
            Portal Admin
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20 md:py-28">

        {/* Badge */}
        <div className="opacity-0-init animate-fade-up mb-7">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full tracking-widest uppercase border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Platform Resmi TOEFL ITP — Universitas Cordova
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="opacity-0-init animate-fade-up delay-100 font-[family-name:var(--font-outfit)] font-black text-slate-900 tracking-tight leading-[1.08] mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
        >
          Ukur Kemampuan Bahasa Inggris
          <br />
          Anda Secara Akurat.
        </h1>

        {/* Sub */}
        <p className="opacity-0-init animate-fade-up delay-200 text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed mb-10">
          Simulasi TOEFL ITP yang dirancang untuk mahasiswa Universitas Cordova — hasil instan, analisis mendalam, dan sertifikat resmi.
        </p>

        {/* CTA */}
        <div className="opacity-0-init animate-fade-up delay-300 mb-14">
          <button
            onClick={handleStudentLogin}
            className="group inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-base rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }}
          >
            Mulai Simulasi Sekarang
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Highlight list */}
        <ul className="opacity-0-init animate-fade-up delay-400 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="opacity-0-init animate-fade-in delay-600 py-5 border-t border-slate-100 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TOEFLin — Universitas Cordova. All rights reserved.
      </footer>
    </main>
  );
}
