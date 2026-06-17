"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error('Kredensial tidak valid');
      
      const data = await res.json();
      if (data.user.role !== 'admin') throw new Error('Akses ditolak. Bukan admin.');
      
      // Store token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
      
      <div className="glass w-full max-w-md rounded-3xl p-8 relative z-10 flex flex-col items-center border-orange-500/20">
        <Link href="/" className="self-start text-sm flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={16} /> Kembali
        </Link>
        
        <div className="mb-4 p-3 rounded-full bg-orange-500/10 text-orange-600">
          <ShieldAlert size={32} />
        </div>

        <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-outfit)]">Admin Portal</h1>
        <p className="opacity-70 mb-8 text-center">Akses khusus pengelola sistem</p>
        
        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-600 w-full text-center text-sm font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Email Administrator</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input 
                type="email" 
                placeholder="admin@cordova.ac.id" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input 
                type="password" 
                placeholder="Masukkan password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
          </div>
          
          <button type="submit" className="btn-hover mt-6 w-full bg-orange-600 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2">
            Otorisasi Akses
          </button>
        </form>
      </div>
    </main>
  );
}
