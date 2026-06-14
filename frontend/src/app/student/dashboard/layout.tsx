"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserCircle } from 'lucide-react';

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Paket Tes', path: '/student/dashboard/tests' },
    { name: 'Riwayat', path: '/student/dashboard/history' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1">
        <header className="h-20 glass m-4 mb-0 rounded-3xl flex items-center justify-between px-8 z-20 shadow-sm border border-slate-100">
          <Link href="/student/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/toeflin.svg" alt="TOEFLin Logo" width={120} height={32} className="h-8 w-auto" priority />
          </Link>
          
          <nav className="hidden md:flex gap-1 p-1 bg-slate-50/50 rounded-full border border-slate-100">
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-primary shadow-sm shadow-slate-200/50 border border-slate-100' 
                      : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700 border border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <UserCircle size={24} />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
