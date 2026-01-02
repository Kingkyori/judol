import Link from 'next/link';
import { getSettings } from '../lib/settings';

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <div className="container">
      <div className="card">
        <div className="hero-title">Judol Learning App</div>
        <div className="hero-subtitle">Contoh aplikasi dengan dua peran: Admin mengelola pengaturan, User merasakan dampaknya secara langsung.</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <Link className="btn btn-primary" href="/admin">Buka Admin</Link>
          <Link className="btn" href="/user">Buka User</Link>
        </div>
        <div className="stat-list" style={{ marginTop: 14 }}>
          <div className="stat"><span>💡</span><div className="label">Jackpot Aktif</div><div className="value">{settings.jackpotEnabled ? 'Ya' : 'Tidak'}</div></div>
          <div className="stat"><span>🎯</span><div className="label">Izinkan Menang</div><div className="value">{settings.allowWin ? 'Ya' : 'Tidak'}</div></div>
          <div className="stat"><span>📈</span><div className="label">Presentase Jackpot</div><div className="value">{settings.jackpotPercent}</div></div>
        </div>
      </div>

      <div className="feature-grid">
        <div className="card feature-card">
          <div className="icon-badge">⚙️</div>
          <div>
            <div className="feature-title">Panel Admin</div>
            <div className="feature-desc">Kelola status jackpot, presentase, dan izin menang.</div>
          </div>
          <Link className="btn btn-primary" href="/admin">Buka</Link>
        </div>
        <div className="card feature-card">
          <div className="icon-badge">🎰</div>
          <div>
            <div className="feature-title">Mesin Jackpot</div>
            <div className="feature-desc">Coba spin dan lihat hasil sesuai pengaturan.</div>
          </div>
          <Link className="btn" href="/user">Coba</Link>
        </div>
      </div>
    </div>
  );
}
