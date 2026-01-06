# ✅ Setup Checklist - Judol Authentication System

## 📋 Pre-Setup
- [ ] Node.js & npm sudah terinstall
- [ ] Project Judol sudah buka di VS Code
- [ ] Terminal ready untuk run commands

---

## 🌐 STEP 1: Setup Supabase Project (5 min)

- [ ] Kunjungi https://supabase.com
- [ ] Sign Up (gunakan email/GitHub/Google)
- [ ] Verifikasi email (check inbox)
- [ ] Login ke dashboard Supabase
- [ ] Klik "New Project"
- [ ] Isi form:
  - [ ] Project Name: `judol-app`
  - [ ] Database Password: (buat password kuat, **simpan baik-baik**)
  - [ ] Region: (pilih region terdekat, misal Singapore)
- [ ] Tunggu 2 menit sampai project initialized

---

## 🗄️ STEP 2: Setup Database Schema (5 min)

- [ ] Masuk ke Supabase project Anda
- [ ] Di sidebar, klik **SQL Editor**
- [ ] Klik **New Query** atau tombol **+**
- [ ] Copy-paste script dari file [SUPABASE_SQL_SCRIPT.sql](./SUPABASE_SQL_SCRIPT.sql)
- [ ] Jalankan query (Ctrl+Enter atau click Run)
- [ ] Check: Tidak ada error, success message muncul
- [ ] Klik **Table Editor** → cek tabel `users` sudah ada

---

## 🔑 STEP 3: Ambil API Keys (2 min)

Di Supabase dashboard:
- [ ] Sidebar → **Settings** → **API**
- [ ] Copy **Project URL** 
  - Format: `https://xxxxx.supabase.co`
  - Paste ke somewhere safe (notepad dulu)
- [ ] Copy **anon public** key
  - Klik icon copy di sebelah key
  - Paste ke somewhere safe

---

## 💻 STEP 4: Setup Project Lokal (5 min)

- [ ] Buka terminal di folder project
- [ ] Install dependencies:
```bash
npm install @supabase/supabase-js bcryptjs
```
- [ ] Wait sampai install selesai

- [ ] Buka file `.env.local` di root folder
- [ ] Edit:
```env
NEXT_PUBLIC_SUPABASE_URL=PASTE_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_ANON_KEY_HERE
```
- [ ] Replace dengan keys yang sudah di-copy
- [ ] **JANGAN commit file ini ke git!**
- [ ] Save file

- [ ] Jalankan app:
```bash
npm run dev
```
- [ ] Tunggu sampai "ready on http://localhost:3000"

---

## 🧪 STEP 5: Test Features (10 min)

### Test Registrasi
- [ ] Buka browser → http://localhost:3000
- [ ] Klik menu **"User"** di header
- [ ] Diklik → Harusnya redirect ke login page
- [ ] Klik link **"Daftar di sini"**
- [ ] Fill form:
  - [ ] Username: `testuser1`
  - [ ] Email: `test@example.com`
  - [ ] Nama Lengkap: `Test User`
  - [ ] Nomor Telepon: `081234567890`
  - [ ] Password: `password123`
  - [ ] Konfirmasi Password: `password123`
  - [ ] Pilih Rekening: BRI
  - [ ] Nomor Rekening: `123456789`
- [ ] Klik **"Daftar"**
- [ ] Check hasil:
  - [ ] Alert "Registrasi berhasil" muncul
  - [ ] Redirect ke login page
  - [ ] Username/password bisa diisi

### Test Login
- [ ] Di login page, isi:
  - [ ] Username: `testuser1`
  - [ ] Password: `password123`
- [ ] Klik **"Login"**
- [ ] Check hasil:
  - [ ] Tidak ada error
  - [ ] Redirect ke `/user` page
  - [ ] Lihat header → username seharusnya ganti jadi "👤 Test User"
  - [ ] Ada tombol "Logout" di header

### Test Protected Routes
- [ ] Klik **"Logout"** di header
- [ ] Header kembali tampilkan "User" button
- [ ] Buka di browser: http://localhost:3000/user
- [ ] Check: Harusnya auto redirect ke login page
- [ ] Logout button hilang dari header ✅

### Test Data Tersimpan
- [ ] Ke Supabase dashboard
- [ ] Klik **Table Editor** → pilih table `users`
- [ ] Check: Ada 1 row dengan username `testuser1`
- [ ] Lihat password field → harusnya panjang string random (ter-hash) ✅

### Test Error Handling
- [ ] Try login dengan username salah
  - [ ] Check: Error message "Username atau password salah"
- [ ] Try registrasi dengan username yang sudah ada
  - [ ] Check: Error message "Username sudah terdaftar"
- [ ] Try registrasi dengan email yang sudah ada
  - [ ] Check: Error message "Email sudah terdaftar"

---

## 📁 STEP 6: Verify File Structure

Check semua file sudah ada:
```
app/
├── auth/
│   ├── login/
│   │   ├── page.tsx ✅
│   │   └── login.module.css ✅
│   └── register/
│       ├── page.tsx ✅
│       └── register.module.css ✅
├── api/auth/
│   ├── login/route.ts ✅
│   └── register/route.ts ✅
├── components/
│   ├── HeaderNav.tsx ✅
│   ├── HeaderNav.module.css ✅
│   └── ProtectedRoute.tsx ✅
├── user/page.tsx ✅ (updated)
└── layout.tsx ✅ (updated)

lib/
├── supabase.ts ✅
└── auth-context.tsx ✅

.env.local ✅ (dengan keys)
```

---

## 🎯 STEP 7: Next Steps (Optional)

- [ ] Customize styling (warna, font, layout)
- [ ] Tambah email verification
- [ ] Implement password reset
- [ ] Buat user profile page
- [ ] Integrate dengan fitur lain (jackpot, admin, dll)

---

## 🆘 Troubleshooting

Jika ada masalah:

| Error | Solusi |
|-------|--------|
| "Cannot find module @supabase/supabase-js" | `npm install @supabase/supabase-js bcryptjs` |
| "Missing NEXT_PUBLIC_SUPABASE_URL" | Check `.env.local`, restart `npm run dev` |
| "Login gagal, username tidak ditemukan" | Username salah? Register dulu? |
| "Password tidak match" | Password typo? Case-sensitive! |
| "Halaman user blank/error" | Buka F12 → Console, lihat error |
| "Data tidak tersimpan ke Supabase" | Check API key? Database schema? RLS policy? |

Buka [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) untuk troubleshooting lengkap.

---

## ✨ Selesai!

Selamat! 🎉 Authentication system Anda sudah ready.

**Fitur yang sudah bisa:**
- ✅ Registrasi user baru
- ✅ Login dengan username & password
- ✅ Protected user page (hanya untuk yang login)
- ✅ Logout
- ✅ Data tersimpan di Supabase
- ✅ Password di-hash secure

**Selanjutnya:**
- Customize UI/styling sesuai brand Anda
- Tambah fitur lanjut (email verify, password reset, profile edit, dll)
- Deploy ke production (Vercel, Railway, dll)

Happy coding! 🚀
