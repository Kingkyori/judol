"use client";
import { useEffect, useState } from 'react';

type Settings = {
  jackpotEnabled: boolean;
  jackpotPercent: number;
  allowWin: boolean;
};

type Player = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  account_number: string;
  bank_type: string;
  created_at: string;
};

type PlayerSettings = {
  player_id?: string;
  jackpotenabled?: boolean;
  jackpotpercent?: number;
  allowwin?: boolean;
};

export default function AdminPage() {
  const [settings] = useState<Settings>({
    jackpotEnabled: true,
    jackpotPercent: 0.3,
    allowWin: true,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({});
  
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const res = await fetch('/api/players', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Loaded', data.length, 'players');
        setPlayers(data);
      } else {
        console.error('❌ Failed to load players:', res.status);
      }
    } catch (e) {
      console.error('Error loading players:', e);
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleSelectPlayer = async (player: Player) => {
    setSelectedPlayer(player);
    setMessage(null);
    try {
      const res = await fetch(`/api/players/${player.id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPlayerSettings(data);
      } else {
        // Jika 404 atau error, reset ke default
        setPlayerSettings({});
      }
    } catch (e) {
      console.error('Error loading player settings:', e);
      setPlayerSettings({});
    }
  };

  async function savePlayerSettings() {
    if (!selectedPlayer) return;
    
    setSaving(true);
    setMessage(null);
    try {
      console.log('Saving player settings:', { playerId: selectedPlayer.id, settings: playerSettings });
      
      const res = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerSettings),
      });
      
      console.log('API response status:', res.status);
      const responseData = await res.json();
      console.log('API response data:', responseData);
      
      if (!res.ok) {
        throw new Error(responseData.error || `Gagal menyimpan (${res.status})`);
      }
      setMessage(`✅ Setting pemain ${selectedPlayer.username} tersimpan!`);
      
      // Reload player settings untuk verify
      try {
        const r2 = await fetch(`/api/players/${selectedPlayer.id}`, { cache: 'no-store' });
        if (r2.ok) {
          const reloadedSettings = await r2.json();
          console.log('Reloaded settings:', reloadedSettings);
          setPlayerSettings(reloadedSettings);
        }
      } catch {}
    } catch (e: any) {
      console.error('Save player settings error:', e);
      setMessage(`❌ Error: ${e.message || 'Error saat menyimpan setting pemain'}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      {/* PLAYERS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* PLAYERS LIST */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ marginTop: 0, marginBottom: 0 }}>Daftar Pemain</h2>
            <button 
              onClick={loadPlayers}
              disabled={loadingPlayers}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loadingPlayers ? 'not-allowed' : 'pointer',
                opacity: loadingPlayers ? 0.6 : 1,
                fontSize: '12px',
              }}
            >
              {loadingPlayers ? '⟳ Memuat...' : '🔄 Refresh'}
            </button>
          </div>
          {loadingPlayers ? (
            <p>Memuat daftar pemain…</p>
          ) : players.length === 0 ? (
            <p style={{ color: '#666' }}>Belum ada pemain terdaftar</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectPlayer(player)}
                  style={{
                    padding: '12px',
                    border: selectedPlayer?.id === player.id ? '2px solid #333' : '1px solid #ddd',
                    backgroundColor: selectedPlayer?.id === player.id ? '#f0f0f0' : '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#333', marginBottom: 6 }}>{player.username}</div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                    <div>📧 {player.email}</div>
                    <div>💳 {player.account_number} ({player.bank_type})</div>
                    <div>👤 {player.full_name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PLAYER SETTINGS */}
        <div className="card">
          {selectedPlayer ? (
            <>
              <h2 style={{ marginTop: 0 }}>Setting Pemain: {selectedPlayer.username}</h2>
              
              {message && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    backgroundColor: message.includes('Error') || message.includes('error') ? '#ffebee' : '#e8f5e9',
                    color: message.includes('Error') || message.includes('error') ? '#c62828' : '#2e7d32',
                    border: `1px solid ${message.includes('Error') || message.includes('error') ? '#ef5350' : '#66bb6a'}`,
                  }}
                >
                  {message}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); savePlayerSettings(); }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span>Jackpot Aktif</span>
                    <input
                      type="checkbox"
                      checked={playerSettings.jackpotenabled ?? settings.jackpotEnabled}
                      onChange={(e) => setPlayerSettings(s => ({ ...s, jackpotenabled: e.target.checked }))}
                    />
                  </label>

                  <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span>Izinkan Menang</span>
                    <input
                      type="checkbox"
                      checked={playerSettings.allowwin ?? settings.allowWin}
                      onChange={(e) => setPlayerSettings(s => ({ ...s, allowwin: e.target.checked }))}
                    />
                  </label>

                  <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span>Presentase Jackpot</span>
                    <input
                      type="number"
                      step={0.01}
                      min={0}
                      max={1}
                      value={playerSettings.jackpotpercent ?? settings.jackpotPercent}
                      onChange={(e) => setPlayerSettings(s => ({ ...s, jackpotpercent: Number(e.target.value) }))}
                    />
                    <span style={{ color: '#64748b' }}>(0.0 - 1.0)</span>
                  </label>

                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Setting Pemain'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>Pilih pemain dari daftar untuk mengatur setting khusus</p>
          )}
        </div>
      </div>

      <div className="card">
        <p>Catatan: Perubahan di sini akan langsung mempengaruhi halaman User.</p>
      </div>
    </div>
  );
}
