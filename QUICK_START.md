# 🚀 Quick Start Guide - Setup Supabase Judol App

## Step 1: Buat Project Supabase (5 menit)

1. Kunjungi https://supabase.com → Sign Up
2. Klik "New Project"
3. Isi:
   - **Name:** `judol-app`
   - **Password:** (buat & simpan password kuat)
   - **Region:** (pilih terdekat)
4. Tunggu 2 menit sampai selesai

## Step 2: Setup Database (5 menit)

1. Di Supabase dashboard, klik **SQL Editor**
2. Buka file [SQL Script](./SUPABASE_SQL_SCRIPT.sql)
3. Copy semua query dan jalankan di SQL Editor Supabase
4. ✅ Database sudah siap

## Step 3: Ambil API Keys (2 menit)

1. Di sidebar, klik **Settings** → **API**
2. Copy:
   - `Project URL` → simpan
   - `anon public` key → simpan

## Step 4: Setup Project Lokal (3 menit)

1. Edit file `.env.local` di root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=PASTE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_KEY_HERE
```

2. Install dependencies:
```bash
npm install @supabase/supabase-js bcryptjs
```

3. Jalankan:
```bash
npm run dev
```

4. Buka http://localhost:3000 ✅

## Step 5: Test Features (5 menit)

### Test Registrasi
- Klik **"User"** di header → Klik **"Daftar di sini"**
- Isi form dengan data uji
- Klik **"Daftar"**
- ✅ Seharusnya redirect ke login dengan pesan sukses

### Test Login
- Isi username & password dari user yang baru dibuat
- Klik **"Login"**
- ✅ Redirect ke `/user` page dan lihat nama user di header

### Test Protected Route
- Logout
- Buka http://localhost:3000/user langsung
- ✅ Seharusnya redirect ke login page otomatis

## Struktur File Baru

```
app/
├── auth/
│   ├── login/page.tsx              ← Halaman login
│   └── register/page.tsx           ← Halaman registrasi
├── api/auth/
│   ├── login/route.ts              ← API login
│   └── register/route.ts           ← API registrasi
├── components/
│   ├── HeaderNav.tsx               ← Navigation (dynamic)
│   └── ProtectedRoute.tsx          ← Protected page wrapper
lib/
├── supabase.ts                     ← Supabase client
├── auth-context.tsx                ← Auth state management
```

## Key Features

✅ **Registrasi** - Username, Email, Nama, Telepon, Password, Bank, Nomor Rekening  
✅ **Login** - Username + Password validation  
✅ **Protected Routes** - Auto redirect jika belum login  
✅ **Dynamic Header** - Tampilkan nama user atau tombol login  
✅ **Logout** - Clear session & redirect  
✅ **Password Hashing** - Secure bcryptjs  

## Important Notes

- ⚠️ Jangan share API keys ke GitHub (sudah di `.env.local`)
- 🔒 Password di-hash dengan bcrypt, tidak disimpan plain text
- 💾 Data tersimpan di Supabase database
- 🔐 RLS policies protect data user

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm install @supabase/supabase-js bcryptjs` |
| "Missing env vars" | Check `.env.local` file ada? |
| "Login gagal" | Username/password salah? Cek di Supabase |
| "Halaman user blank" | Buka console (F12), lihat error |

## Full Documentation

Untuk detail lengkap, baca [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

**Selesai! 🎉 App Anda sudah ready dengan authentication system.**

Pertanyaan? Cek console browser (F12) untuk error messages.
