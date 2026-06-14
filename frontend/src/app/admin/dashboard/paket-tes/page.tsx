"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, Package, ChevronRight } from 'lucide-react';

interface TestPackage {
  id: string;
  name: string;
  type: string;
  sections: string[];
  description?: string;
}

export default function PaketTesPage() {
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Full Test', sections: ['Listening', 'Structure', 'Reading'], description: '' });

  const fetchPkgs = async () => {
    const res = await fetch('http://localhost:3001/test-packages');
    if (res.ok) setPackages(await res.json());
  };

  useEffect(() => { fetchPkgs(); }, []);

  const handleAdd = async () => {
    const res = await fetch('http://localhost:3001/test-packages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setShowAdd(false); fetchPkgs(); setForm({ name: '', type: 'Full Test', sections: ['Listening', 'Structure', 'Reading'], description: '' }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3001/test-packages/${id}`, { method: 'DELETE' });
    fetchPkgs();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">Paket Tes</h1>
          <p className="opacity-70 mt-1">{packages.length} paket tersedia</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-hover px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 text-sm">
          <Plus size={16} /> Buat Paket Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.length === 0 && (
          <div className="col-span-full p-12 text-center opacity-50">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Belum ada paket tes. Buat paket pertama!</p>
          </div>
        )}
        {packages.map(p => (
          <div key={p.id} className="p-6 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02] border border-foreground/10 flex flex-col gap-3 btn-hover relative group">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.type === 'Full Test' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>{p.type}</span>
                <h3 className="font-bold text-lg mt-2">{p.name}</h3>
              </div>
              <button onClick={() => handleDelete(p.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
            </div>
            {p.description && <p className="text-sm opacity-60">{p.description}</p>}
            <div className="flex gap-2 flex-wrap mt-auto pt-2">
              {(Array.isArray(p.sections) ? p.sections : []).map((s: string) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-foreground/5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="glass w-full max-w-md rounded-3xl p-8 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Buat Paket Tes Baru</h2>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama Paket Tes" className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm">
              <option value="Full Test">Full Test</option>
              <option value="Section Practice">Section Practice</option>
            </select>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi (opsional)" rows={2} className="bg-foreground/5 border border-foreground/10 rounded-xl py-2.5 px-4 text-sm resize-none" />
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 glass rounded-xl font-medium text-sm">Batal</button>
              <button onClick={handleAdd} className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
