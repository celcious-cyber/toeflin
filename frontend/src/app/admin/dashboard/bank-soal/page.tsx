"use client";
import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit, Search, FileSpreadsheet, ChevronDown } from 'lucide-react';

interface Question {
  id: string;
  section: string;
  skillCategory?: string;
  content: string;
  choices: { a: string; b: string; c: string; d: string };
  answerKey: string;
  explanation?: string;
}

export default function BankSoalPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const [form, setForm] = useState<Partial<Question>>({
    section: 'Listening', content: '', choices: { a: '', b: '', c: '', d: '' }, answerKey: 'a', explanation: ''
  });

  const fetchQuestions = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions`);
    if (res.ok) setQuestions(await res.json());
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAdd = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setShowAddModal(false); fetchQuestions(); setForm({ section: 'Listening', content: '', choices: { a: '', b: '', c: '', d: '' }, answerKey: 'a' }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/questions/import`, { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      setImportMsg(`Berhasil import ${data.importedCount} soal!`);
      fetchQuestions();
      setTimeout(() => setImportMsg(''), 3000);
    }
  };

  const filtered = questions.filter(q =>
    (!filterSection || q.section === filterSection) &&
    (!search || q.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">Bank Soal</h1>
          <p className="opacity-70 mt-1">{questions.length} soal tersedia</p>
        </div>
        <div className="flex gap-3">
          <label className="btn-hover px-5 py-2.5 glass rounded-xl font-medium cursor-pointer flex items-center gap-2 text-sm">
            <Upload size={16} /> Import Excel
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={() => setShowAddModal(true)} className="btn-hover px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 text-sm">
            <Plus size={16} /> Tambah Soal
          </button>
        </div>
      </div>

      {importMsg && <div className="p-3 rounded-xl bg-green-500/20 text-green-600 text-sm font-medium">{importMsg}</div>}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari soal..." className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm" />
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
              <th className="text-left p-4 font-semibold">Konten Soal</th>
              <th className="text-left p-4 font-semibold">Jawaban</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center opacity-50">
                <FileSpreadsheet size={32} className="mx-auto mb-2 opacity-30" />
                Belum ada soal. Tambahkan atau import dari Excel.
              </td></tr>
            )}
            {filtered.map(q => (
              <tr key={q.id} className="border-t border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${q.section === 'Listening' ? 'bg-blue-500/10 text-blue-600' : q.section === 'Structure' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>{q.section}</span></td>
                <td className="p-4 max-w-sm truncate">{q.content}</td>
                <td className="p-4 font-mono uppercase">{q.answerKey}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass w-full max-w-lg rounded-3xl p-8 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Tambah Soal Baru</h2>
            <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm">
              <option value="Listening">Listening</option>
              <option value="Structure">Structure</option>
              <option value="Reading">Reading</option>
            </select>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Konten soal..." rows={3} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm resize-none" />
            <div className="grid grid-cols-2 gap-3">
              {['a', 'b', 'c', 'd'].map(k => (
                <input key={k} value={(form.choices as any)?.[k] || ''} onChange={e => setForm({ ...form, choices: { ...form.choices as any, [k]: e.target.value } })} placeholder={`Pilihan ${k.toUpperCase()}`} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm" />
              ))}
            </div>
            <select value={form.answerKey} onChange={e => setForm({ ...form, answerKey: e.target.value })} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm">
              <option value="a">Jawaban: A</option><option value="b">Jawaban: B</option><option value="c">Jawaban: C</option><option value="d">Jawaban: D</option>
            </select>
            <textarea value={form.explanation || ''} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Penjelasan (opsional)" rows={2} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm resize-none" />
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 glass rounded-xl font-medium text-sm">Batal</button>
              <button onClick={handleAdd} className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
