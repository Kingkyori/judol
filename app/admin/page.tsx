"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Settings = {
  jackpotEnabled: boolean;
  jackpotPercent: number; // 0.0 - 1.0
  allowWin: boolean; // when false, user cannot win
};

export default function AdminPage() {
  const [settings, setSettings] = useState<Settings>({
    jackpotEnabled: true,
    jackpotPercent: 0.3,
    allowWin: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setSource(res.headers.get('X-Settings-Source'));
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal menyimpan (${res.status})`);
      }
      setMessage('Tersimpan!');
      // Re-fetch to ensure UI reflects the latest persisted settings
      try {
        const r2 = await fetch('/api/settings', { cache: 'no-store' });
        if (r2.ok) {
          setSettings(await r2.json());
          setSource(r2.headers.get('X-Settings-Source'));
        }
      } catch {}
    } catch (e: any) {
      console.error('Save error:', e);
      setMessage(e.message || 'Error saat menyimpan');
    } finally {
      setSaving(false);
    }
  }

  function exportSettings() {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `judol-settings-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Download berhasil!');
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content) as Settings;
        
        // Validasi
        if (typeof imported.jackpotEnabled !== 'boolean' ||
            typeof imported.jackpotPercent !== 'number' ||
            typeof imported.allowWin !== 'boolean') {
          throw new Error('Format file tidak valid');
        }

        setSettings(imported);
        setMessage('File berhasil dimuat. Klik "Simpan" untuk menyimpan.');
      } catch (err: any) {
        setMessage(`Error import: ${err.message}`);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Pengaturan Admin</h2>
        {loading ? (
          <p>Memuat pengaturan…</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>Jackpot Aktif</span>
                <input
                  type="checkbox"
                  checked={settings.jackpotEnabled}
                  onChange={(e) => setSettings(s => ({ ...s, jackpotEnabled: e.target.checked }))}
                />
              </label>

              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>Izinkan Menang</span>
                <input
                  type="checkbox"
                  checked={settings.allowWin}
                  onChange={(e) => setSettings(s => ({ ...s, allowWin: e.target.checked }))}
                />
              </label>

              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>Presentase Jackpot</span>
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  max={1}
                  value={settings.jackpotPercent}
                  onChange={(e) => setSettings(s => ({ ...s, jackpotPercent: Number(e.target.value) }))}
                />
                <span style={{ color: '#64748b' }}>(0.0 - 1.0)</span>
              </label>

              <button className="btn btn-primary" type="submit" disabled={saving}>Simpan</button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ backgroundColor: '#666', color: 'white', cursor: 'pointer' }}
                  onClick={exportSettings}
                >
                  📥 Download Backup
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ backgroundColor: '#666', color: 'white', cursor: 'pointer' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  📤 Upload Backup
                </button>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json" 
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </div>
            {source && (
              <p style={{ marginTop: 8, color: '#64748b' }}>Sumber pengaturan: {source}</p>
            )}
            {message && <p style={{ marginTop: 10 }}>{message}</p>}
          </form>
        )}
      </div>
      <div className="card">
        <p>Catatan: Perubahan di sini akan langsung mempengaruhi halaman User.</p>
      </div>
    </div>
  );
}
