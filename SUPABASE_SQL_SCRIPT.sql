-- ============================================
-- JUDOL APP - SUPABASE DATABASE SETUP SCRIPT
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- 1. BUAT TABEL USERS
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  bank_type VARCHAR(20) NOT NULL CHECK (bank_type IN ('BRI', 'DANA')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BUAT INDEXES UNTUK PERFORMA
-- =====================================================

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 3. BUAT FUNCTION UNTUK AUTO UPDATE TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. BUAT TRIGGER UNTUK AUTO UPDATE
-- =====================================================

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- 5. SETUP ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users hanya bisa lihat data mereka sendiri
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Users hanya bisa update data mereka sendiri
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid()::text = id::text);

-- 6. SETUP COMMENTS (Optional - untuk dokumentasi)
-- =====================================================

COMMENT ON TABLE users IS 'Tabel user yang terdaftar di Judol app';
COMMENT ON COLUMN users.id IS 'UUID unik untuk setiap user';
COMMENT ON COLUMN users.username IS 'Username untuk login (unique)';
COMMENT ON COLUMN users.email IS 'Email user (unique)';
COMMENT ON COLUMN users.full_name IS 'Nama lengkap user';
COMMENT ON COLUMN users.phone_number IS 'Nomor telepon';
COMMENT ON COLUMN users.password_hash IS 'Password yang sudah di-hash dengan bcrypt';
COMMENT ON COLUMN users.account_number IS 'Nomor rekening/e-wallet user';
COMMENT ON COLUMN users.bank_type IS 'Jenis bank: BRI atau DANA';
COMMENT ON COLUMN users.created_at IS 'Waktu user mendaftar';
COMMENT ON COLUMN users.updated_at IS 'Waktu update terakhir';

-- 7. BUAT TABEL PLAYER_SETTINGS
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

-- Create index untuk player_id
CREATE INDEX idx_player_settings_player_id ON player_settings(player_id);

-- Trigger untuk auto update timestamp pada player_settings
CREATE TRIGGER update_player_settings_timestamp
BEFORE UPDATE ON player_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable RLS on player_settings
ALTER TABLE player_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read all player_settings (ini simplified, bisa diperbaiki)
-- Untuk sekarang, allow public read untuk testing
CREATE POLICY "Allow public read on player_settings"
ON player_settings FOR SELECT
USING (true);

COMMENT ON TABLE player_settings IS 'Tabel setting per pemain yang override setting global';
COMMENT ON COLUMN player_settings.player_id IS 'UUID pemain (referensi ke users.id)';
COMMENT ON COLUMN player_settings.jackpotEnabled IS 'Override jackpot aktif (NULL = gunakan global setting)';
COMMENT ON COLUMN player_settings.jackpotPercent IS 'Override presentase jackpot (NULL = gunakan global setting)';
COMMENT ON COLUMN player_settings.allowWin IS 'Override izinkan menang (NULL = gunakan global setting)';

-- ============================================
-- SELESAI! Database siap digunakan
-- ============================================
-- 
-- Testing:
-- 1. Buka Table Editor → Pilih tabel "users"
-- 2. Seharusnya table kosong (belum ada users)
-- 3. Jalankan app, test registrasi
-- 4. Refresh table, seharusnya ada data user baru
--
-- ============================================
