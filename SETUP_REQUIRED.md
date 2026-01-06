# ⚠️ PENTING: Setup Tabel Player Settings

## Masalah
Jika Anda melihat error di console browser:
```
Could not find the table 'public.player_settings' in the schema cache
```

## Solusi

### Opsi 1: Jalankan Full Setup Script (Direkomendasikan)
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Buat **New Query** baru
3. Copy-paste seluruh isi file: **`SUPABASE_SQL_SCRIPT.sql`**
4. Klik **Run** (Ctrl+Enter)
5. Tunggu hingga sukses

### Opsi 2: Jalankan Setup Minimal
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Buat **New Query** baru
3. Copy-paste isi file: **`SETUP_PLAYER_SETTINGS_TABLE.sql`**
4. Klik **Run** (Ctrl+Enter)
5. Tunggu hingga sukses

### Opsi 3: Manual Query
Jalankan query di bawah di Supabase SQL Editor:

```sql
CREATE TABLE player_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  jackpotEnabled BOOLEAN,
  jackpotPercent NUMERIC(3, 2),
  allowWin BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_player_settings_player_id ON player_settings(player_id);

CREATE TRIGGER update_player_settings_timestamp
BEFORE UPDATE ON player_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE player_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on player_settings"
ON player_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update on player_settings"
ON player_settings FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated insert on player_settings"
ON player_settings FOR INSERT WITH CHECK (true);
```

## Verifikasi Berhasil ✅

Setelah jalankan query:

1. **Cek di Table Editor**
   - Buka Supabase Dashboard
   - Pergi ke **Table Editor**
   - Refresh / reload page
   - Seharusnya terlihat tabel baru: `player_settings`

2. **Test di Admin Panel**
   - Buka Admin Panel
   - Pilih pemain
   - Atur setting dan klik **Simpan Setting Pemain**
   - Seharusnya muncul notifikasi **HIJAU** (sukses)

3. **Verifikasi Data**
   - Buka Supabase Table Editor → `player_settings`
   - Seharusnya ada baris data baru dengan setting pemain

## Notifikasi Setting

Setelah tabel dibuat, Anda akan melihat:

### ✅ Notifikasi Hijau = Tersimpan
```
Setting pemain [username] tersimpan!
```

### ❌ Notifikasi Merah = Error
```
Error: [detail error]
```
Jika melihat ini, check:
- Apakah tabel `player_settings` sudah dibuat? (Cek di Table Editor)
- Apakah ada internet connection stabil?
- Cek console browser (F12) untuk detail error

## File yang Perlu Dijalankan

| File | Keterangan |
|------|-----------|
| `SUPABASE_SQL_SCRIPT.sql` | Full setup (users + player_settings) |
| `SETUP_PLAYER_SETTINGS_TABLE.sql` | Setup minimal hanya tabel player_settings |
| `SETUP_PLAYER_SETTINGS_GUIDE.md` | Dokumentasi detail |

## Struktur Tabel Player Settings

```sql
CREATE TABLE player_settings (
  id UUID PRIMARY KEY,                    -- UUID unik
  player_id UUID UNIQUE NOT NULL,        -- Referensi ke users(id)
  jackpotEnabled BOOLEAN,                -- Aktifkan jackpot?
  jackpotPercent NUMERIC(3, 2),          -- Persentase (0.00 - 1.00)
  allowWin BOOLEAN,                      -- Izinkan menang?
  created_at TIMESTAMP DEFAULT NOW(),    -- Waktu dibuat
  updated_at TIMESTAMP DEFAULT NOW()     -- Waktu update
);
```

## Perlu Bantuan?

1. **Baca dokumentasi lengkap**: `PLAYER_SETTINGS_GUIDE.md`
2. **Setup guide**: `SETUP_PLAYER_SETTINGS_GUIDE.md`
3. **Cek console browser** (F12 → Console) untuk detail error

---

**Catatan**: Setelah tabel dibuat, fitur Player Settings akan langsung berfungsi! 🎉
