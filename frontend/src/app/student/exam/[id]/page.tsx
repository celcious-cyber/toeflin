"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, Volume2, CheckCircle, AlertTriangle, LayoutGrid, X, Menu, XCircle } from 'lucide-react';

interface Question {
  id: string;
  section: string;
  content: string;
  choices: { a: string; b: string; c: string; d: string };
  answerKey: string;
  passage?: { title: string; content: string };
  shuffledEntries?: [string, any][];
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [doubtful, setDoubtful] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 2 hours total
  const [attemptId, setAttemptId] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlayed, setAudioPlayed] = useState<Record<string, boolean>>({});
  
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Security Measures Effect
  useEffect(() => {
    if (!hasStarted || submitted) return;

    // Prevent context menu (right click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("⚠️ Tindakan dilarang: Klik kanan dinonaktifkan selama ujian.");
    };

    // Prevent copy, cut, paste
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("⚠️ Tindakan dilarang: Menyalin/menempel teks dinonaktifkan selama ujian.");
    };

    // Prevent certain keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+C, Ctrl+V, etc)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (Developer Tools & View Source)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
        alert("⚠️ Tindakan dilarang: Akses ke Developer Tools dinonaktifkan.");
      }

      // Prevent Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ['C', 'V', 'X'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        alert("⚠️ Tindakan dilarang: Menyalin teks dinonaktifkan.");
      }
    };

    // Warn if leaving full screen or window loses focus (optional, but good for CBT)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
         // In a strict CBT, this might auto-submit or record a violation
         console.warn("User navigated away from the exam tab!");
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasStarted, submitted]);

  useEffect(() => {
    const fetchQuestions = async () => {
      // Fetch questions
      const qRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions`);
      if (qRes.ok) {
        const allQuestions = await qRes.json();
        // Sort questions by TOEFL section order
        const sectionOrder: Record<string, number> = { 'Listening': 1, 'Structure': 2, 'Reading': 3 };
        allQuestions.sort((a: any, b: any) => {
           const orderA = sectionOrder[a.section] || 99;
           const orderB = sectionOrder[b.section] || 99;
           return orderA - orderB;
        });

        // Shuffle choices for each question so it's randomized per student
        const shuffleArray = (array: any[]) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

        const processedQuestions = allQuestions.map((q: any) => ({
          ...q,
          shuffledEntries: shuffleArray(Object.entries(q.choices))
        }));

        setQuestions(processedQuestions);
      }
    };
    fetchQuestions();
  }, [packageId]);

  const startTest = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert("Sesi login Anda tidak ditemukan. Silakan login kembali.");
        return;
      }
      const user = JSON.parse(userStr);

      const startRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/start`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, packageId })
      });
      
      if (startRes.ok) {
        const attempt = await startRes.json();
        setAttemptId(attempt.id);
        setHasStarted(true);
        
        // Request Full Screen
        try {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
          } else if ((docEl as any).webkitRequestFullscreen) {
            await (docEl as any).webkitRequestFullscreen();
          } else if ((docEl as any).msRequestFullscreen) {
            await (docEl as any).msRequestFullscreen();
          }
        } catch (e) {
          console.warn("Fullscreen request failed", e);
        }

      } else {
        const errorData = await startRes.json();
        if (errorData.code === 'WEEKLY_LIMIT_REACHED') {
          setBlockedReason(errorData.message);
        } else {
          alert(`Gagal memulai ujian: ${errorData.message || "Kesalahan pada server"}`);
        }
      }
    } catch (err) {
      console.error("Error starting test:", err);
      alert("Terjadi kesalahan jaringan. Gagal menghubungi server.");
    }
  };

  const handleRequestAttempt = async () => {
    try {
      setRequestStatus('LOADING');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/request-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, packageId })
      });

      if (res.ok) {
        setRequestStatus('SUCCESS');
      } else {
        const err = await res.json();
        alert(`Gagal mengirim permohonan: ${err.message}`);
        setRequestStatus('ERROR');
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
      setRequestStatus('ERROR');
    }
  };

  // Timer logic


  useEffect(() => {
    if (!hasStarted || submitted || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { handleSubmit(); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [hasStarted, submitted, timeLeft]);

  // Auto-save every 30s
  useEffect(() => {
    if (!attemptId || submitted) return;
    const t = setInterval(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/${attemptId}/save`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, durationSeconds: 120 * 60 - timeLeft })
      });
    }, 30000);
    return () => clearInterval(t);
  }, [attemptId, answers, timeLeft, submitted]);

  const currentQ = questions[currentIdx];

  const selectAnswer = (key: string) => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-engine/${attemptId}/submit`, { method: 'POST' });
    if (res.ok) {
      setResult(await res.json());
      setSubmitted(true);
      
      // Exit fullscreen
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.warn("Exit fullscreen failed", e);
      }
    }
    setShowConfirm(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sc.toString().padStart(2, '0')}`;
  };

  if (submitted && result) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[120px]" />
        <div className="glass max-w-lg w-full rounded-3xl p-10 text-center flex flex-col items-center gap-6">
          <CheckCircle size={64} className="text-green-500" />
          <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">Simulasi Selesai!</h1>
          <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <p className="text-sm opacity-70 mb-1">Total Skor TOEFL ITP</p>
            <h2 className="text-5xl font-bold text-primary font-[family-name:var(--font-outfit)]">{result.totalScore}</h2>
            <p className="text-sm opacity-50 mt-1">Skala 310 - 677</p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs opacity-60">Listening</p>
              <p className="text-2xl font-bold text-blue-600">{result.scaledScores?.listening || '-'}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-xs opacity-60">Structure</p>
              <p className="text-2xl font-bold text-green-600">{result.scaledScores?.structure || '-'}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs opacity-60">Reading</p>
              <p className="text-2xl font-bold text-purple-600">{result.scaledScores?.reading || '-'}</p>
            </div>
          </div>
          <button onClick={() => router.push('/student/dashboard')} className="btn-hover w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold">
            Kembali ke Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!hasStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        
        <div className="bg-white max-w-2xl w-full rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center z-10 relative">
          <button 
            onClick={() => router.push('/student/dashboard/tests')}
            className="absolute top-6 left-6 px-4 py-2 bg-white text-slate-600 rounded-xl font-bold text-sm shadow-sm border border-slate-200 hover:bg-slate-50 flex items-center gap-2 z-20"
          >
            <ChevronLeft size={16} /> Kembali
          </button>
          
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <LayoutGrid size={40} />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-800 font-[family-name:var(--font-outfit)] mb-2">Persiapan Ujian 📝</h1>
          <p className="text-slate-500 text-center mb-8">Harap baca dengan cermat aturan dan informasi berikut sebelum memulai.</p>
          
          <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <Clock size={24} className="text-blue-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi Ujian</p>
                <p className="font-bold text-lg text-slate-700">120 Menit</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <LayoutGrid size={24} className="text-purple-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah Soal</p>
                <p className="font-bold text-lg text-slate-700">{questions.length > 0 ? `${questions.length} Soal` : 'Memuat...'}</p>
              </div>
            </div>

            {/* AUDIO TEST BOX */}
            <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-4">
                <Volume2 size={24} className="text-blue-500" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengecekan Audio</p>
                  <p className="font-medium text-sm text-slate-700">Pastikan suara terdengar dengan jelas.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (!testAudioRef.current) {
                    testAudioRef.current = new Audio('/audio-test.mp3');
                  }
                  const audio = testAudioRef.current;
                  audio.pause();
                  audio.currentTime = 0;
                  audio.play().catch(err => alert("Gagal memutar audio. Pastikan file audio-test.mp3 sudah ada."));
                }}
                className="px-4 py-2 bg-white text-blue-600 font-bold text-sm rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 hover:shadow transition-all"
              >
                Tes Suara
              </button>
            </div>
          </div>
          
          <ul className="w-full space-y-3 mb-10 text-sm text-slate-600">
            <li className="flex gap-3">
              <CheckCircle size={20} className="text-green-500 shrink-0" />
              <span>Waktu akan mulai berjalan secara otomatis ketika Anda menekan tombol <b>Mulai Ujian Sekarang</b>.</span>
            </li>
            <li className="flex gap-3">
              <AlertTriangle size={20} className="text-orange-500 shrink-0" />
              <span>Sistem keamanan akan mengunci layar menjadi <b>Mode Penuh (Full Screen)</b>. Klik Kanan, Salin, Tempel (Copy-Paste), dan Inspect Element dinonaktifkan. Pelanggaran dapat membatalkan ujian Anda.</span>
            </li>
            <li className="flex gap-3">
              <Volume2 size={20} className="text-blue-500 shrink-0" />
              <span>Untuk soal Listening, pastikan volume perangkat Anda sudah sesuai. Audio hanya dapat diputar SATU KALI.</span>
            </li>
          </ul>

          <button 
            onClick={() => setShowStartConfirm(true)} 
            disabled={questions.length === 0}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Mulai Ujian Sekarang <ChevronRight size={20} />
          </button>
        </div>

        {/* Modal Konfirmasi Mulai Ujian */}
        {showStartConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setShowStartConfirm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="text-blue-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 font-[family-name:var(--font-outfit)]">Mulai Ujian?</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Kesempatan ujian <b>hanya 1 kali dalam seminggu</b>. Apakah Anda yakin sudah siap dan ingin memulai tes sekarang?
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowStartConfirm(false)}
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowStartConfirm(false);
                      startTest();
                    }}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-blue-700 transition-all shadow-md"
                  >
                    Ya, Mulai Tes!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Pop Up untuk Akses Ditolak */}
        {blockedReason && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setBlockedReason(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="text-orange-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 font-[family-name:var(--font-outfit)]">Mohon Maaf...</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{blockedReason}</p>
                
                {requestStatus === 'SUCCESS' ? (
                  <div className="bg-green-100 text-green-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Permohonan Terkirim
                  </div>
                ) : (
                  <button
                    onClick={handleRequestAttempt}
                    disabled={requestStatus === 'LOADING'}
                    className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {requestStatus === 'LOADING' ? 'Mengirim...' : 'Ajukan Permohonan Akses'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-[var(--background)]">
      <div className="w-full max-w-7xl flex flex-col flex-1">
        {/* Top Bar */}
        <header className="h-16 glass m-3 mb-0 rounded-2xl flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNav(!showNav)} className="p-2 -ml-2 rounded-xl hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground">
              <Menu size={24} />
            </button>
            <div className="flex gap-1">
              <span className="font-bold text-lg hidden sm:block font-[family-name:var(--font-outfit)]">TOEFL CBT Simulation</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono font-bold text-lg opacity-40 hover:opacity-100 transition-opacity ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
              <Clock size={18} /> {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        {/* Question Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-3 p-3">
          {/* Question Navigator */}
          {showNav && (
            <aside className="glass w-full md:w-64 shrink-0 rounded-2xl p-4 overflow-y-auto flex flex-col">
            <p className="text-xs font-medium opacity-60 mb-3 uppercase tracking-wider">Navigasi Soal</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isDoubtful = doubtful[q.id];
                const isActive = i === currentIdx;
                
                let bgClass = '';
                if (isActive) {
                  if (isDoubtful) bgClass = 'bg-orange-500 text-white border-transparent scale-105 shadow-lg shadow-orange-500/30';
                  else if (isAnswered) bgClass = 'bg-green-500 text-white border-green-600 scale-105 shadow-lg shadow-green-500/30';
                  else bgClass = 'bg-blue-600 text-white border-blue-600 scale-105 shadow-lg shadow-blue-600/30';
                } else {
                  if (isDoubtful) bgClass = 'bg-orange-500 text-white border-transparent hover:bg-orange-600 shadow-md shadow-orange-500/20';
                  else if (isAnswered) bgClass = 'bg-green-500/10 text-green-600 border-green-500/50 hover:bg-green-500/20';
                  else bgClass = 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10';
                }

                return (
                  <button key={q.id} onClick={() => setCurrentIdx(i)}
                    className={`relative w-full aspect-square rounded-xl flex items-center justify-center transition-all border-2 ${bgClass}`}>
                    
                    {isAnswered ? (
                      <>
                        <div className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${(isActive || isDoubtful) ? 'border-white text-white' : 'border-green-600 text-green-600'}`}>
                          {answers[q.id].toUpperCase()}
                        </div>
                        <span className={`absolute bottom-0.5 left-1.5 text-sm sm:text-base font-bold ${(isActive || isDoubtful) ? 'text-white' : 'text-foreground'}`}>{i + 1}</span>
                      </>
                    ) : (
                      <span className={`text-base sm:text-lg font-bold ${(isActive || isDoubtful) ? 'text-white' : 'opacity-70'}`}>{i + 1}</span>
                    )}

                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-foreground/10 text-xs opacity-60 space-y-1">
              <p>Terjawab: {questions.filter(q => answers[q.id]).length}/{questions.length}</p>
            </div>
          </aside>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row gap-3">
            {currentQ?.passage && (
              <div className="flex-1 lg:max-w-[50%] glass rounded-2xl p-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {currentQ.passage.title && <h3 className="font-bold text-xl mb-4 font-[family-name:var(--font-outfit)]">{currentQ.passage.title}</h3>}
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed opacity-90 select-none">
                  {currentQ.passage.content}
                </div>
              </div>
            )}
            
            <div className={`glass rounded-2xl p-8 flex flex-col overflow-y-auto max-h-[calc(100vh-8rem)] ${currentQ?.passage ? 'flex-1 lg:max-w-[50%]' : 'flex-1'}`}>
            {currentQ ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium opacity-60">Soal {currentIdx + 1} dari {questions.length}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${currentQ.section === 'Listening' ? 'bg-blue-500/10 text-blue-600' : currentQ.section === 'Structure' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>
                    {currentQ.section}
                  </span>
                </div>

                {/* Audio player for Listening */}
                {currentQ.section === 'Listening' && (
                  <div className="mb-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                    <Volume2 size={24} className="text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Audio Soal</p>
                      <p className="text-xs opacity-50">Audio hanya dapat diputar 1 kali</p>
                    </div>
                    <button
                      disabled={audioPlayed[currentQ.id]}
                      onClick={() => setAudioPlayed(prev => ({ ...prev, [currentQ.id]: true }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${audioPlayed[currentQ.id] ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed' : 'bg-blue-500 text-white'}`}>
                      {audioPlayed[currentQ.id] ? 'Sudah Diputar' : 'Putar Audio'}
                    </button>
                  </div>
                )}

                <div className="text-lg leading-relaxed mb-8 select-none">{currentQ.content}</div>

                <div className="flex flex-col gap-3 flex-1">
                  {currentQ.shuffledEntries?.map(([origKey, val]: [string, any], index: number) => {
                    const displayLabel = String.fromCharCode(65 + index); // 0 -> A, 1 -> B
                    return (
                      <button key={origKey} onClick={() => selectAnswer(origKey)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          answers[currentQ.id] === origKey
                            ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
                            : 'bg-foreground/[0.02] border-foreground/10 hover:bg-foreground/5 hover:border-foreground/20'
                        }`}>
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-3 ${answers[currentQ.id] === origKey ? 'bg-primary text-white' : 'bg-foreground/10 text-foreground/60'}`}>
                          {displayLabel}
                        </span>
                        {val}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-foreground/10 gap-3">
                <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl font-medium text-sm disabled:opacity-30 w-full sm:w-auto justify-center">
                  <ChevronLeft size={16} /> Sebelumnya
                </button>

                <button onClick={() => {
                  if (currentQ) setDoubtful(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
                }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors w-full sm:w-auto justify-center ${doubtful[currentQ?.id] ? 'bg-orange-500 text-white' : 'glass hover:bg-orange-500/10 hover:text-orange-600'}`}>
                  Ragu-ragu
                </button>

                {currentIdx === questions.length - 1 ? (
                  <button onClick={() => setShowConfirm(true)} className="w-full sm:w-auto justify-center px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> Selesai & Kirim
                  </button>
                ) : (
                  <button onClick={() => {
                    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
                  }} className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
                    Selanjutnya <ChevronRight size={16} />
                  </button>
                )}
              </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-3">
                <AlertTriangle size={40} className="opacity-30" />
                <p>Tidak ada soal untuk section ini.</p>
                <p className="text-sm">Admin perlu menambahkan soal terlebih dahulu.</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-sm rounded-3xl p-8 text-center flex flex-col gap-4">
            <AlertTriangle size={40} className="text-orange-500 mx-auto" />
            <h2 className="text-xl font-bold">Kirim Jawaban?</h2>
            <p className="text-sm opacity-70">Pastikan Anda sudah menjawab semua soal. Jawaban tidak bisa diubah setelah dikirim.</p>
            <p className="text-sm">Terjawab: <b>{Object.keys(answers).length}</b> / {questions.length} soal</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-5 py-2.5 glass rounded-xl font-medium text-sm">Cek Lagi</button>
              <button onClick={handleSubmit} className="flex-1 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm">Ya, Kirim!</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
