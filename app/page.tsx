import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSettings } from '../lib/settings';
import styles from './home.module.css';

export default async function HomePage() {
  // Check if user is logged in - if not, redirect to login
  const cookies = require('next/headers').cookies;
  const cookieStore = cookies();
  const userData = cookieStore.get('user')?.value;
  
  if (!userData) {
    // Redirect to home login page (belum login)
    // Tetapi jangan redirect, biarkan user pilih login user atau admin
  }

  const settings = await getSettings();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Judol Learning App</h1>
        <p className={styles.subtitle}>Contoh aplikasi dengan dua peran: Admin mengelola pengaturan, User merasakan dampaknya secara langsung.</p>
        
        <div className={styles.buttonGroup}>
          <Link className={styles.btnPrimary} href="/admin">Buka Admin</Link>
          <Link className={styles.btnSecondary} href="/user">Buka User</Link>
        </div>

        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>💡</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Jackpot Aktif</div>
              <div className={styles.statValue}>{settings.jackpotEnabled ? 'Ya' : 'Tidak'}</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Izinkan Menang</div>
              <div className={styles.statValue}>{settings.allowWin ? 'Ya' : 'Tidak'}</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Presentase Jackpot</div>
              <div className={styles.statValue}>{settings.jackpotPercent}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚙️</div>
          <h3 className={styles.featureTitle}>Panel Admin</h3>
          <p className={styles.featureDesc}>Kelola status jackpot, presentase, dan izin menang.</p>
          <Link className={styles.btnPrimary} href="/admin">Buka</Link>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🎰</div>
          <h3 className={styles.featureTitle}>Mesin Jackpot</h3>
          <p className={styles.featureDesc}>Coba spin dan lihat hasil sesuai pengaturan.</p>
          <Link className={styles.btnSecondary} href="/user">Coba</Link>
        </div>
      </div>
    </div>
  );
}
