-- ============================================
-- SUPABASE SETUP: TABEL PLAYER_SETTINGS
-- ============================================
-- Jalankan query ini di Supabase SQL Editor untuk membuat tabel player_settings
-- ============================================

-- 1. BUAT TABEL PLAYER_SETTINGS
-- =====================================================

CREATE TABLE player_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  jackpotEnabled BOOLEAN,
  jackpotPercent NUMERIC(3, 2),
  allowWin BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREATE INDEX UNTUK PERFORMA
-- =====================================================

CREATE INDEX idx_player_settings_player_id ON player_settings(player_id);

-- 3. BUAT TRIGGER UNTUK AUTO UPDATE TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_settings_timestamp
BEFORE UPDATE ON player_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- 4. SETUP ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE player_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read (untuk testing)
-- Untuk production, ganti dengan proper RLS policy
CREATE POLICY "Allow public read on player_settings"
ON player_settings FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated update on player_settings"
ON player_settings FOR UPDATE
USING (true);

CREATE POLICY "Allow authenticated insert on player_settings"
ON player_settings FOR INSERT
WITH CHECK (true);

-- 5. SETUP COMMENTS (Dokumentasi)
-- =====================================================

COMMENT ON TABLE player_settings IS 'Tabel setting per pemain yang override setting global';
COMMENT ON COLUMN player_settings.id IS 'UUID unik untuk setiap player setting';
COMMENT ON COLUMN player_settings.player_id IS 'UUID pemain (referensi ke users.id)';
COMMENT ON COLUMN player_settings.jackpotEnabled IS 'Override jackpot aktif (NULL = gunakan global setting)';
COMMENT ON COLUMN player_settings.jackpotPercent IS 'Override presentase jackpot (NULL = gunakan global setting)';
COMMENT ON COLUMN player_settings.allowWin IS 'Override izinkan menang (NULL = gunakan global setting)';
COMMENT ON COLUMN player_settings.created_at IS 'Waktu setting dibuat';
COMMENT ON COLUMN player_settings.updated_at IS 'Waktu setting terakhir diupdate';

-- ============================================
-- SELESAI! Tabel player_settings siap digunakan
-- ============================================
-- 
-- Testing:
-- 1. Buka Supabase Dashboard
-- 2. Pergi ke SQL Editor
-- 3. Copy dan jalankan query di atas
-- 4. Refresh table list, seharusnya terlihat "player_settings"
-- 5. Sekarang admin page bisa menyimpan setting per pemain
--
-- ============================================
