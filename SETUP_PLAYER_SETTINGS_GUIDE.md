# Setup Tabel Player Settings di Supabase

## Error yang Terjadi
Jika Anda melihat error:
```
Could not find the table 'public.player_settings' in the schema cache
```

Ini berarti **tabel `player_settings` belum dibuat** di Supabase.

## Cara Memperbaiki

### Step 1: Buka Supabase Dashboard
1. Pergi ke [https://app.supabase.com](https://app.supabase.com)
2. Login ke project Judol Anda

### Step 2: Buka SQL Editor
1. Klik menu **SQL Editor** di sidebar kiri
2. Klik **New Query** untuk buat query baru

### Step 3: Copy SQL Script
Copy seluruh isi file `SETUP_PLAYER_SETTINGS_TABLE.sql` atau query dibawah ini:

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

ALTER TABLE player_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on player_settings"
ON player_settings FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated update on player_settings"
ON player_settings FOR UPDATE
USING (true);

CREATE POLICY "Allow authenticated insert on player_settings"
ON player_settings FOR INSERT
WITH CHECK (true);
```

### Step 4: Jalankan Query
1. Paste query di **SQL Editor**
2. Klik tombol **Run** (atau Ctrl+Enter)
3. Tunggu sampai berhasil (harus ada notifikasi "Query executed successfully")

### Step 5: Verifikasi
1. Pergi ke **Table Editor** di sidebar kiri
2. Refresh atau reload page
3. Seharusnya sekarang terlihat tabel baru: `player_settings`

## Jika Masih Error

### Error: "relation "player_settings" already exists"
Tabel sudah ada, bisa langsung lanjut testing.

### Error: "foreign key constraint failed"
Pastikan:
- Tabel `users` sudah ada
- Ada minimal 1 user terdaftar di database

### Error Lainnya
Cek console browser (F12 → Console tab) untuk detail error lengkap.

## Verifikasi Setting Tersimpan

Setelah tabel dibuat, untuk memverifikasi setting pemain tersimpan:

1. **Buka Admin Panel** → Pilih pemain
2. **Atur setting** dan klik **Simpan Setting Pemain**
3. **Notifikasi Hijau** = Tersimpan sukses ✅
4. **Notifikasi Merah** = Ada error ❌

### Melihat Data di Database
1. Buka **Table Editor** → Pilih `player_settings`
2. Lihat list data yang sudah tersimpan
3. Setiap baris = setting pemain

## Struktur Tabel

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | UUID | Primary key |
| `player_id` | UUID | ID pemain (FK ke users.id) |
| `jackpotEnabled` | BOOLEAN | Aktifkan jackpot? |
| `jackpotPercent` | NUMERIC | Persentase jackpot (0.0-1.0) |
| `allowWin` | BOOLEAN | Izinkan menang? |
| `created_at` | TIMESTAMP | Waktu dibuat |
| `updated_at` | TIMESTAMP | Waktu update |

## Tips

- Setting `NULL` berarti menggunakan setting global (default)
- Setting per pemain akan **override** setting global
- Data auto-delete jika user dihapus (cascade delete)

---

**Pertanyaan?** Cek console browser atau dokumentasi file `PLAYER_SETTINGS_GUIDE.md`.
