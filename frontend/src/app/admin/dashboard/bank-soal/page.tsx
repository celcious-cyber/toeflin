"use client";
import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit, Search, FileSpreadsheet, ChevronDown, Eye } from 'lucide-react';

interface Question {
  id: string;
  section: string;
  skillCategory?: string;
  content: string;
  choices: { a: string; b: string; c: string; d: string };
  answerKey: string;
  explanation?: string;
  packageId?: string;
  passageId?: string;
  passage?: { id: string; title: string; content: string };
  audio?: { id: string; fileUrl: string };
}

interface TestPackage {
  id: string;
  name: string;
  type: string;
}

interface Passage {
  id: string;
  title: string;
  content: string;
}

export default function BankSoalPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState(''); // For import Excel
  const [search, setSearch] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState('');

  const [form, setForm] = useState<Partial<Question & { packageId: string; audioUrl: string; passageId: string; passageTitle: string; passageContent: string }>>({
    section: 'Listening', content: '', choices: { a: '', b: '', c: '', d: '' }, answerKey: 'a', explanation: '', packageId: '', audioUrl: '', passageId: '', passageTitle: '', passageContent: ''
  });

  const fetchQuestions = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions`);
    if (res.ok) setQuestions(await res.json());
  };

  const fetchPackages = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/test-packages`);
    if (res.ok) setPackages(await res.json());
  };

  const fetchPassages = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/passages`);
    if (res.ok) setPassages(await res.json());
  };

  useEffect(() => {
    fetchQuestions();
    fetchPackages();
    fetchPassages();
  }, []);

  const openAddModal = () => {
    setEditingQuestionId(null);
    setForm({
      section: 'Listening',
      content: '',
      choices: { a: '', b: '', c: '', d: '' },
      answerKey: 'a',
      explanation: '',
      packageId: '',
      audioUrl: '',
      passageId: '',
      passageTitle: '',
      passageContent: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestionId(q.id);
    setForm({
      section: q.section,
      content: q.content,
      choices: q.choices,
      answerKey: q.answerKey.toLowerCase(),
      explanation: q.explanation || '',
      packageId: q.packageId || '',
      audioUrl: q.audio?.fileUrl || '',
      passageId: q.passageId || '',
      passageTitle: '',
      passageContent: ''
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    const isEdit = !!editingQuestionId;
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/${editingQuestionId}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions`;
    const method = isEdit ? 'PUT' : 'POST';

    // Build the request body
    const body: any = {
      section: form.section,
      content: form.content,
      choices: form.choices,
      answerKey: form.answerKey?.toUpperCase(),
      explanation: form.explanation || '',
      packageId: form.packageId || null,
      audioUrl: form.audioUrl || null,
    };

    if (form.section === 'Reading') {
      if (form.passageId === 'new') {
        body.passageTitle = form.passageTitle;
        body.passageContent = form.passageContent;
        body.passageId = null;
      } else if (form.passageId) {
        body.passageId = form.passageId;
      } else {
        body.passageId = null;
      }
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowAddModal(false);
      fetchQuestions();
      fetchPassages(); // Refresh passages dropdown
      setEditingQuestionId(null);
      setForm({
        section: 'Listening', content: '', choices: { a: '', b: '', c: '', d: '' }, answerKey: 'a', explanation: '', packageId: '', audioUrl: '', passageId: '', passageTitle: '', passageContent: ''
      });
    } else {
      alert("Gagal menyimpan soal.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/${id}`, { method: 'DELETE' });
      fetchQuestions();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/import`);
    if (selectedPackageId) {
      url.searchParams.append('packageId', selectedPackageId);
    }
    
    const res = await fetch(url.toString(), { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      setImportMsg(`Berhasil import ${data.importedCount} soal!`);
      fetchQuestions();
      fetchPassages();
      setTimeout(() => setImportMsg(''), 3000);
    }
  };

  const filtered = questions.filter(q =>
    (!filterSection || q.section === filterSection) &&
    (!search || q.content.toLowerCase().includes(search.toLowerCase()) || (q.passage?.title && q.passage.title.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">Bank Soal</h1>
          <p className="opacity-70 mt-1">{questions.length} soal tersedia</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative">
            <select
              value={selectedPackageId}
              onChange={e => setSelectedPackageId(e.target.value)}
              className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm font-semibold text-slate-700"
            >
              <option value="">Latihan Umum (Tanpa Paket)</option>
              {packages.filter(p => p.type === 'Full Test').map(p => (
                <option key={p.id} value={p.id}>Target: {p.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>

          <button
            onClick={async () => {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/template`);
              if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template_import_soal.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
              } else {
                alert("Gagal men-download template.");
              }
            }}
            className="btn-hover px-5 py-2.5 glass rounded-xl font-medium flex items-center gap-2 text-sm text-slate-700"
          >
            <FileSpreadsheet size={16} /> Download Template
          </button>
          <label className="btn-hover px-5 py-2.5 glass rounded-xl font-medium cursor-pointer flex items-center gap-2 text-sm">
            <Upload size={16} /> Import Excel
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={openAddModal} className="btn-hover px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 text-sm">
            <Plus size={16} /> Tambah Soal
          </button>
        </div>
      </div>

      {importMsg && <div className="p-3 rounded-xl bg-green-500/20 text-green-600 text-sm font-medium">{importMsg}</div>}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari soal atau passage..." className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm" />
        </div>
        <div className="relative">
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm">
            <option value="">Semua Section</option>
            <option value="Listening">Listening</option>
            <option value="Structure">Structure</option>
            <option value="Reading">Reading</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5">
            <tr>
              <th className="text-left p-4 font-semibold">Section</th>
              <th className="text-left p-4 font-semibold">Paket</th>
              <th className="text-left p-4 font-semibold">Konten Soal</th>
              <th className="text-left p-4 font-semibold">Jawaban</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center opacity-50">
                <FileSpreadsheet size={32} className="mx-auto mb-2 opacity-30" />
                Belum ada soal. Tambahkan atau import dari Excel.
              </td></tr>
            )}
            {filtered.map(q => (
              <tr key={q.id} className="border-t border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${q.section === 'Listening' ? 'bg-blue-500/10 text-blue-600' : q.section === 'Structure' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>{q.section}</span></td>
                <td className="p-4">
                  {q.packageId ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 font-semibold">
                      {packages.find(p => p.id === q.packageId)?.name || 'Paket Ujian'}
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                      Latihan Umum
                    </span>
                  )}
                </td>
                <td className="p-4 max-w-sm">
                  <div className="truncate font-medium text-slate-800">{q.content}</div>
                  {q.passage && (
                    <div className="text-[10px] text-purple-600 font-semibold mt-1 bg-purple-500/10 px-2 py-0.5 rounded-full w-max inline-flex items-center gap-1">
                      📖 {q.passage.title}
                    </div>
                  )}
                </td>
                <td className="p-4 font-mono uppercase">{q.answerKey}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewingQuestion(q)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-500/10 transition-colors" title="Lihat Detail Soal">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => openEditModal(q)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass w-full max-w-lg rounded-3xl p-8 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
              {editingQuestionId ? 'Edit Soal' : 'Tambah Soal Baru'}
            </h2>
            <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm">
              <option value="Listening">Listening</option>
              <option value="Structure">Structure</option>
              <option value="Reading">Reading</option>
            </select>
            <select
              value={form.packageId || ''}
              onChange={e => setForm({ ...form, packageId: e.target.value })}
              className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm"
            >
              <option value="">Latihan Umum (Tanpa Paket)</option>
              {packages.filter(p => p.type === 'Full Test').map(p => (
                <option key={p.id} value={p.id}>Target: {p.name}</option>
              ))}
            </select>

            {/* Listening specific form fields */}
            {form.section === 'Listening' && (
              <div className="flex flex-col gap-2 border border-foreground/10 p-4 rounded-xl bg-foreground/[0.02]">
                <label className="text-xs font-bold opacity-75">Upload File Audio (MP3/WAV)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/media/upload`, {
                          method: 'POST',
                          body: fd
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setForm(prev => ({ ...prev, audioUrl: data.url }));
                          alert("Audio berhasil di-upload!");
                        } else {
                          alert("Gagal meng-upload audio.");
                        }
                      } catch (err) {
                        alert("Terjadi kesalahan jaringan saat upload.");
                      }
                    }}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20"
                  />
                  {form.audioUrl && (
                    <span className="text-[10px] bg-green-500/10 text-green-600 font-bold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                      Ready: {form.audioUrl.split('/').pop()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Reading specific form fields */}
            {form.section === 'Reading' && (
              <div className="flex flex-col gap-3 border border-foreground/10 p-4 rounded-xl bg-foreground/[0.02]">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-75">Pilih Bacaan (Passage)</label>
                  <select
                    value={form.passageId || ''}
                    onChange={e => setForm({ ...form, passageId: e.target.value })}
                    className="bg-background border border-foreground/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  >
                    <option value="">Tanpa Passage (Teks menyatu di soal)</option>
                    <option value="new">+ Buat Passage Baru</option>
                    {passages.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                {form.passageId === 'new' && (
                  <div className="flex flex-col gap-2 animate-fade-in mt-1">
                    <input
                      value={form.passageTitle || ''}
                      onChange={e => setForm({ ...form, passageTitle: e.target.value })}
                      placeholder="Judul Passage Baru"
                      className="bg-background border border-foreground/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                    <textarea
                      value={form.passageContent || ''}
                      onChange={e => setForm({ ...form, passageContent: e.target.value })}
                      placeholder="Tulis konten bacaan di sini..."
                      rows={4}
                      className="bg-background border border-foreground/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-y"
                    />
                  </div>
                )}
              </div>
            )}

            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Konten soal..." rows={3} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm resize-none" />
            
            <div className="grid grid-cols-2 gap-3">
              {['a', 'b', 'c', 'd'].map(k => (
                <input key={k} value={(form.choices as any)?.[k] || ''} onChange={e => setForm({ ...form, choices: { ...form.choices as any, [k]: e.target.value } })} placeholder={`Pilihan ${k.toUpperCase()}`} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm" />
              ))}
            </div>
            
            <select value={form.answerKey} onChange={e => setForm({ ...form, answerKey: e.target.value })} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm">
              <option value="a">Jawaban: A</option>
              <option value="b">Jawaban: B</option>
              <option value="c">Jawaban: C</option>
              <option value="d">Jawaban: D</option>
            </select>
            
            <textarea value={form.explanation || ''} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Penjelasan (opsional)" rows={2} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm resize-none" />
            
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 glass rounded-xl font-medium text-sm">Batal</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
      {viewingQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingQuestion(null)}>
          <div className="glass w-full max-w-lg rounded-3xl p-8 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Detail Soal</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${viewingQuestion.section === 'Listening' ? 'bg-blue-500/10 text-blue-600' : viewingQuestion.section === 'Structure' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>
                {viewingQuestion.section}
              </span>
            </div>

            {viewingQuestion.packageId && (
              <div className="text-xs bg-orange-500/10 text-orange-600 font-semibold px-3 py-1.5 rounded-xl w-max">
                Paket: {packages.find(p => p.id === viewingQuestion.packageId)?.name || 'Paket Ujian'}
              </div>
            )}

            {viewingQuestion.skillCategory && (
              <div className="text-xs bg-foreground/5 text-foreground/70 font-semibold px-3 py-1.5 rounded-xl w-max">
                Skill: {viewingQuestion.skillCategory}
              </div>
            )}

            {viewingQuestion.section === 'Listening' && viewingQuestion.audio && (
              <div className="flex flex-col gap-1 border border-foreground/10 p-3 rounded-xl bg-foreground/[0.02]">
                <label className="text-xs font-bold opacity-75">Audio Player</label>
                <audio controls src={viewingQuestion.audio.fileUrl.startsWith('http') ? viewingQuestion.audio.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${viewingQuestion.audio.fileUrl}`} className="w-full mt-1" />
              </div>
            )}

            {viewingQuestion.section === 'Reading' && viewingQuestion.passage && (
              <div className="flex flex-col gap-1 border border-foreground/10 p-4 rounded-xl bg-purple-500/[0.02] max-h-48 overflow-y-auto">
                <label className="text-xs font-bold text-purple-600">📖 Bacaan: {viewingQuestion.passage.title}</label>
                <p className="text-xs opacity-80 mt-1 whitespace-pre-line">{viewingQuestion.passage.content}</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold opacity-75">Pertanyaan</label>
              <p className="text-sm font-medium text-slate-800 bg-foreground/5 p-3 rounded-xl whitespace-pre-line">{viewingQuestion.content}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold opacity-75">Pilihan Jawaban</label>
              <div className="grid grid-cols-1 gap-2">
                {['a', 'b', 'c', 'd'].map(k => {
                  const isCorrect = viewingQuestion.answerKey.toLowerCase() === k;
                  return (
                    <div
                      key={k}
                      className={`text-sm p-3 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 font-semibold'
                          : 'bg-foreground/5 border-foreground/5 text-slate-600'
                      }`}
                    >
                      <span>{k.toUpperCase()}. {(viewingQuestion.choices as any)?.[k]}</span>
                      {isCorrect && <span className="text-[10px] bg-green-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">Kunci</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {viewingQuestion.explanation && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-75">Pembahasan</label>
                <p className="text-xs text-slate-600 bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl whitespace-pre-line">{viewingQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <button onClick={() => setViewingQuestion(null)} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-medium text-sm btn-hover">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
