"use client";
import Link from 'next/link';
import { ArrowLeft, KeyRound, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal mendaftar');
      }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="glass w-full max-w-md rounded-3xl p-8 relative z-10 flex flex-col items-center">
        <Link href="/" className="self-start text-sm flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={16} /> Kembali
        </Link>

        <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-outfit)]">Buat Akun</h1>
        <p className="opacity-70 mb-8 text-center">Daftar untuk memulai simulasi TOEFL ITP</p>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-600 w-full text-center text-sm font-medium">{error}</div>}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contoh@cordova.ac.id" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
          </div>
          <button type="submit" className="btn-hover mt-4 w-full bg-primary text-white font-semibold rounded-xl py-3.5">Daftar</button>
        </form>

        <p className="mt-8 text-sm opacity-70">
          Sudah punya akun? <Link href="/student/login" className="text-primary hover:underline font-medium">Masuk</Link>
        </p>
      </div>
    </main>
  );
}
