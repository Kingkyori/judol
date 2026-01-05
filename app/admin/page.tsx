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
