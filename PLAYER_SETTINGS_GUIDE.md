# Fitur Player Settings - Panduan

## Deskripsi
Fitur Player Settings memungkinkan admin untuk mengatur setting spesifik untuk setiap pemain. Setting per pemain ini akan **override** setting global ketika pemain tersebut bermain.

## Cara Kerja

### Setting Global
- Setting default yang berlaku untuk semua pemain
- Dapat diubah di menu "Pengaturan Global"
- Terdiri dari:
  - `jackpotEnabled`: Aktifkan/nonaktifkan jackpot
  - `allowWin`: Izinkan/larang pemain menang
  - `jackpotPercent`: Presentase jackpot (0.0 - 1.0)

### Setting Per Pemain
- Setting khusus untuk seorang pemain tertentu
- **Override** setting global jika ada
- Jika kosong, gunakan setting global
- Contoh: Admin bisa set pemain "fikri" agar tidak bisa menang (`allowWin: false`) meski setting global mengizinkan

## Cara Menggunakan

1. **Buka Admin Panel** → Menu "Daftar Pemain" (kanan bawah)
2. **Pilih Pemain** dari daftar nama pemain yang sudah terdaftar
3. **Atur Setting** khusus untuk pemain tersebut:
   - Jackpot Aktif
   - Izinkan Menang
   - Presentase Jackpot
4. **Klik "Simpan Setting Pemain"**

## Contoh Kasus

### Kasus 1: Pemain Tidak Boleh Menang
- Pilih pemain "john"
- Set `Izinkan Menang` = OFF
- Klik Simpan
- Hasil: Pemain john tidak akan menang di permainan apapun, berbeda dengan pemain lain

### Kasus 2: Pemain dengan Presentase Jackpot Berbeda
- Setting Global: Presentase = 0.5
- Pilih pemain "sarah"
- Set `Presentase Jackpot` = 0.3
- Hasil: Pemain sarah punya peluang jackpot 30%, pemain lain 50%

## API Endpoints

### GET `/api/players`
Mendapatkan daftar semua pemain yang terdaftar.

Response:
```json
[
  {
    "id": "uuid-1",
    "username": "fikri",
    "full_name": "Fikri Rahman",
    "email": "fikri@example.com",
    "created_at": "2026-01-06T10:00:00Z"
  },
  ...
]
```

### GET `/api/players/[playerId]`
Mendapatkan setting spesifik untuk seorang pemain.

Response:
```json
{
  "id": "uuid-setting",
  "player_id": "uuid-1",
  "jackpotEnabled": false,
  "allowWin": false,
  "jackpotPercent": 0.3,
  "created_at": "2026-01-06T10:00:00Z",
  "updated_at": "2026-01-06T10:00:00Z"
}
```

Atau jika belum ada setting:
```json
{}
```

### POST `/api/players/[playerId]`
Menyimpan setting untuk seorang pemain.

Request:
```json
{
  "jackpotEnabled": false,
  "allowWin": false,
  "jackpotPercent": 0.3
}
```

## Database Schema

Tabel `player_settings`:
- `id`: UUID primary key
- `player_id`: UUID (FK ke users.id)
- `jackpotEnabled`: BOOLEAN (NULL = gunakan global)
- `jackpotPercent`: NUMERIC (NULL = gunakan global)
- `allowWin`: BOOLEAN (NULL = gunakan global)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Setup di Supabase

Jalankan SQL script yang sudah disediakan di `SUPABASE_SQL_SCRIPT.sql`:

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
```

## UI Layout

Admin page sekarang terbagi menjadi 3 bagian:

1. **Pengaturan Global** (atas)
   - Untuk mengatur setting yang berlaku ke semua pemain

2. **Daftar Pemain** (kiri bawah)
   - Menampilkan semua pemain yang terdaftar
   - Klik untuk memilih pemain

3. **Setting Pemain** (kanan bawah)
   - Form untuk mengatur setting khusus pemain yang dipilih
   - Menampilkan setting global sebagai default preview

---

**Catatan**: Implementasi player settings ini masih simplified. Untuk production, tambahkan:
- Validation lebih ketat
- RLS policies yang proper
- Audit logging
- Soft delete untuk player settings
