"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

type Settings = {
  jackpotEnabled: boolean;
  jackpotPercent: number;
  allowWin: boolean;
};

type PlayerSettings = {
  jackpotenabled?: boolean;
  jackpotpercent?: number;
  allowwin?: boolean;
};

type Result = {
  outcome: 'WIN' | 'LOSE' | 'DISABLED' | 'BLOCKED';
};

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userCheckLoading, setUserCheckLoading] = useState(true);
  
  const [settings, setSettings] = useState<Settings | null>(null);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [spinning, setSpinning] = useState(false);
  const symbols = useMemo(() => ['7', '♣', '♥', '♦', '★', '🍒', '🔔', '🍋'], []);
  const symbolHeight = 120;
  const repeat = 10;
  const totalHeight = symbols.length * repeat * symbolHeight;
  const [reelOffset, setReelOffset] = useState<[number, number, number]>([0, 0, 0]);
  const [reelTransition, setReelTransition] = useState<[string, string, string]>(['none', 'none', 'none']);
  const rafIdsRef = useRef<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('judol_user');
    localStorage.removeItem('userRole');
    // Redirect to home
    router.push('/');
  };

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('judol_user');
    
    if (userData) {
      setIsUserLoggedIn(true);
    } else {
      router.push('/auth/user-login');
    }
    setUserCheckLoading(false);
  }, [router]);

  // Get effective settings (player-specific overrides global)
  const effectiveSettings: Settings | null = useMemo(() => {
    if (!settings) return null;
    
    // Use player settings if available, otherwise use global
    return {
      jackpotEnabled: playerSettings && playerSettings.jackpotenabled !== null && playerSettings.jackpotenabled !== undefined 
        ? playerSettings.jackpotenabled 
        : settings.jackpotEnabled,
      jackpotPercent: playerSettings && playerSettings.jackpotpercent !== null && playerSettings.jackpotpercent !== undefined 
        ? playerSettings.jackpotpercent 
        : settings.jackpotPercent,
      allowWin: playerSettings && playerSettings.allowwin !== null && playerSettings.allowwin !== undefined 
        ? playerSettings.allowwin 
        : settings.allowWin,
    };
  }, [settings, playerSettings]);

  useEffect(() => {
    (async () => {
      try {
        // Load global settings
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          setSettings(await res.json());
        }
      } catch (e) {
        console.error('Error loading global settings:', e);
      }
    })();
  }, []);

  // Load player-specific settings
  useEffect(() => {
    if (!user?.id) return;
    
    (async () => {
      try {
        const res = await fetch(`/api/players/${user.id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setPlayerSettings(data);
        }
      } catch (e) {
        console.error('Error loading player settings:', e);
      }
    })();
  }, [user?.id]);

  async function play() {
    if (spinning) return;
    setResult(null);
    setNotice(null);
    setSpinning(true);
    // Smooth continuous scroll per reel with different duration & speed
    const start = Date.now();
    const durations = [1600, 1900, 2200];
    const speeds = [1100, 1200, 1300]; // px per second
    setReelTransition(['none', 'none', 'none']);
    const lastTime = [start, start, start];

    const animateReel = (index: 0 | 1 | 2) => {
      const tick = () => {
        const now = Date.now();
        const dt = (now - lastTime[index]) / 1000; // seconds
        lastTime[index] = now;
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / durations[index]);

        setReelOffset(prev => {
          const next: [number, number, number] = [...prev] as any;
          // constant speed scrolling; keep within available repeated symbols
          const raw = next[index] + speeds[index] * dt;
          // cap to totalHeight - symbolHeight to ensure visible content
          next[index] = Math.min(raw, totalHeight - symbolHeight);
          return next;
        });

        if (progress < 1) {
          rafIdsRef.current[index] = requestAnimationFrame(tick);
        }
      };
      rafIdsRef.current[index] = requestAnimationFrame(tick);
    };
    animateReel(0); animateReel(1); animateReel(2);

    try {
      const res = await fetch('/api/simulate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: user?.id })
      });
      const data = res.ok ? await res.json() : null;
      // Decide final reel positions according to outcome
      const n = symbols.length;
      const base = Math.floor(Math.random() * n);
      let target: [number, number, number] = [base, (base + 1) % n, (base + 3) % n]; // default non-match
      const outcome = (data?.outcome ?? 'LOSE') as Result['outcome'];
      if (outcome === 'WIN') {
        target = [base, base, base];
      }

      const stopAt = (index: 0 | 1 | 2) => {
        // pick nearest forward target offset from current position
        const current = reelOffset[index];
        const baseOffset = target[index] * symbolHeight;
        const ring = n * symbolHeight;
        let candidates: number[] = [];
        for (let k = 0; k < repeat; k++) candidates.push(baseOffset + k * ring);
        const forward = candidates.filter(c => c >= current);
        const chosen = forward.length ? Math.min(...forward) : baseOffset; // fallback
        setReelTransition(prev => {
          const next: [string, string, string] = [...prev] as any;
          next[index] = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
          return next;
        });
        setReelOffset(prev => {
          const next: [number, number, number] = [...prev] as any;
          next[index] = Math.min(chosen, totalHeight - symbolHeight);
          return next;
        });
        // cancel raf for this reel
        if (rafIdsRef.current[index]) cancelAnimationFrame(rafIdsRef.current[index]);
      };

      // Stop each reel after its own duration, then snap smoothly to target
      durations.forEach((ms, i) => {
        setTimeout(() => stopAt(i as 0 | 1 | 2), ms + 50);
      });

      // After the longest reel finishes, set result and notice
      setTimeout(() => {
        setResult(data);
        if (outcome === 'WIN') {
          setNotice('Selamat! Anda MENANG.');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
        } else if (outcome === 'LOSE') {
          setNotice('Maaf, Anda KALAH.');
        } else if (outcome === 'DISABLED') {
          setNotice('Jackpot sedang tidak aktif.');
        }
        setSpinning(false);
      }, Math.max(...durations) + 500);
    } catch {
      setSpinning(false);
    }
  }

  return (
    <div className="container">
      {userCheckLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      ) : !isUserLoggedIn ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Silakan login sebagai user terlebih dahulu.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Selamat datang, {user?.username}!</h2>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
          <div className="card">
            <div className="hero-title">Mesin Jackpot</div>
            <div className="hero-subtitle">Coba keberuntungan Anda, lihat dampak dari pengaturan Admin secara langsung.</div>
            {!settings || !effectiveSettings ? (
              <p style={{ marginTop: 12 }}>Memuat pengaturan…</p>
            ) : (
              <div className="grid-two" style={{ marginTop: 16 }}>
                <div style={{ justifySelf: 'center' }}>
                  <div className="slot-wrap">
                    <div className={`slot ${result?.outcome === 'WIN' ? 'win' : result?.outcome === 'LOSE' ? 'lose' : ''}`} role="img" aria-label="Mesin slot 3 reel">
                      {[0,1,2].map((i) => (
                        <div className={`reel ${spinning ? 'spinning' : ''}`} key={i}>
                          <div
                            className="symbols"
                            style={{ transform: `translateY(-${reelOffset[i]}px)`, transition: reelTransition[i] }}
                          >
                            {Array.from({ length: repeat }).flatMap(() => symbols).map((s, idx) => (
                              <div className="symbol" key={i+"-"+idx}>{s}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {showConfetti && (
                      <div className="confetti" aria-hidden>
                        {Array.from({ length: 14 }).map((_, i) => (
                          <span className="confetti-piece" key={i} style={{ left: `${(i*7)%100}%`, background: ["#ef4444","#22c55e","#3b82f6","#f59e0b"][i%4] }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 14, justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={play} disabled={spinning}>
                      {spinning ? 'Memutar…' : 'Spin'}
                    </button>
                    <Link className="btn btn-ghost" href="/">Beranda</Link>
                  </div>

                  {result?.outcome && (
                    <div className={`badge ${result.outcome === 'WIN' ? 'win' : result.outcome === 'LOSE' ? 'lose' : 'info'}`} style={{ marginTop: 10, justifySelf: 'center' }}>
                      {result.outcome === 'WIN' ? 'MENANG' : result.outcome === 'LOSE' ? 'KALAH' : result.outcome === 'DISABLED' ? 'NONAKTIF' : result.outcome}
                    </div>
                  )}

                  {notice && (
                    <div className="notice" style={{ marginTop: 10 }} aria-live="polite">
                      {notice}
                    </div>
                  )}
                </div>

                <div>
                  <div className="stat-list">
                    <div className="stat"><span>💡</span><div className="label">Jackpot Aktif</div><div className="value">{effectiveSettings.jackpotEnabled ? 'Ya' : 'Tidak'}</div></div>
                    <div className="stat"><span>🎯</span><div className="label">Izinkan Menang</div><div className="value">{effectiveSettings.allowWin ? 'Ya' : 'Tidak'}</div></div>
                    <div className="stat"><span>📈</span><div className="label">Presentase Jackpot</div><div className="value">{effectiveSettings.jackpotPercent}</div></div>
                  </div>
                  <div className="card" style={{ marginTop: 12 }}>
                    <p>Tekan tombol untuk mencoba spin. Hasil akan mengikuti pengaturan dari Admin.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
