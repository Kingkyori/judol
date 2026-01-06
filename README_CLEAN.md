# Judol - Judi Daring Learning Project

Aplikasi Next.js untuk belajar sistem admin-user dengan kontrol setting jackpot per pemain.

## 🚀 Quick Start

### 1. Setup Database (Supabase)
1. Buka [Supabase](https://app.supabase.com)
2. Pergi ke **SQL Editor**
3. Copy-paste isi file `SUPABASE_SQL_SCRIPT.sql` dan jalankan

### 2. Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📋 Fitur Utama

### Admin Panel
- **Pengaturan Per Pemain**: Set jackpot, presentase, dan izin menang untuk setiap user
- **Daftar Pemain**: Lihat semua pemain terdaftar dengan detail lengkap
- **Real-time Control**: Perubahan langsung mempengaruhi user saat bermain

### User Page
- **Slot Machine**: Coba keberuntungan dengan slot machine 3 reel
- **Dynamic Settings**: Hasil spin mengikuti setting spesifik dari admin
- **Stat Display**: Lihat setting yang berlaku (global atau personal)

## 🏗️ Struktur Database

### Tabel `users`
- id, username, email, full_name, phone_number
- password_hash, account_number, bank_type
- created_at, updated_at

### Tabel `player_settings`
- player_id, jackpotenabled, jackpotpercent, allowwin
- created_at, updated_at

## 🔧 Konfigurasi

### Global Settings (`/api/settings`)
Tersimpan di `data/settings.json`:
```json
{
  "jackpotEnabled": true,
  "allowWin": true,
  "jackpotPercent": 0.5
}
```

### Player Settings (`/api/players/{userId}`)
Tersimpan di Supabase `player_settings` table:
- Override global settings untuk user tertentu
- NULL value berarti gunakan global setting

## 📱 Pages

- **`/`** - Halaman beranda
- **`/auth/login`** - Login
- **`/auth/register`** - Registrasi
- **`/admin`** - Admin panel
- **`/user`** - User jackpot page

## 🔐 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Supabase** - Backend & Database
- **CSS Modules** - Styling

## 📚 Setup Details

Untuk setup database lengkap, lihat: [SUPABASE_SQL_SCRIPT.sql](SUPABASE_SQL_SCRIPT.sql)

Untuk setup player_settings table saja, lihat: [SETUP_PLAYER_SETTINGS_TABLE.sql](SETUP_PLAYER_SETTINGS_TABLE.sql)

## 🎯 Algoritma Menang

Presentase jackpot bekerja dengan:
```
random_value = Math.random() (0.0 - 1.0)
WIN jika: random_value < jackpotPercent
```

**Contoh:** Presentase 0.1 (10%)
- Spin 100 kali → ~10 kali menang

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t judol .
docker run -p 3000:3000 judol
```

## 📝 Environment Variables

Lihat `.env.example` untuk template lengkap.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📞 Support

Untuk masalah dengan Supabase setup, lihat file SQL dan jalankan di SQL Editor.

## 📄 License

MIT
