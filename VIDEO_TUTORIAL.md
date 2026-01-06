# 📹 Video Tutorial - Setup Supabase Step by Step

Jika Anda lebih suka video tutorial, berikut adalah panduan step-by-step dengan screenshot annotations:

## PART 1: Setup Supabase Project (5 menit)

### Step 1.1: Buka Supabase
1. Buka browser → https://supabase.com
2. Klik tombol **"Sign Up"** di kanan atas

### Step 1.2: Create Account
- Pilih salah satu:
  - Email + Password
  - GitHub account
  - Google account
- Follow instruksi verifikasi email

### Step 1.3: Create New Project
1. Setelah login, akan melihat dashboard
2. Klik tombol **"New Project"** (biasanya di atas atau tengah layar)
3. Form akan muncul dengan field:
   - **Project Name:** ketik `judol-app`
   - **Database Password:** buat password kuat, **SIMPAN baik-baik** (misal: `Judol@2024#Secure`)
   - **Region:** Pilih region terdekat
     - Untuk Indonesia → Singapore
     - Untuk Asia → Tokyo/Singapore
4. Klik **"Create new project"**
5. **TUNGGU 2-3 MENIT** sampai loading selesai

### Step 1.4: Confirm Project Created
- Setelah loading, akan redirect ke project dashboard
- Di atas ada nama project "judol-app"
- Sidebar kiri ada berbagai menu (SQL Editor, Table Editor, API, etc)

✅ **SUPABASE PROJECT BERHASIL DIBUAT**

---

## PART 2: Setup Database Schema (5 menit)

### Step 2.1: Buka SQL Editor
1. Di sidebar Supabase, cari menu **SQL Editor**
2. Klik → akan terbuka blank SQL workspace

### Step 2.2: Copy SQL Script
1. Buka file [SUPABASE_SQL_SCRIPT.sql](./SUPABASE_SQL_SCRIPT.sql) dari folder project
2. Copy SEMUA isi file (Ctrl+A → Ctrl+C)

### Step 2.3: Run SQL Script
1. Kembali ke SQL Editor Supabase
2. Paste query (Ctrl+V) ke text area besar
3. **Jangan** ubah-ubah query, paste apa adanya
4. Klik tombol **"Run"** atau tekan **Ctrl+Enter**
5. Tunggu sampai query selesai execute (biasanya 1-2 detik)

### Step 2.4: Verify Success
- Seharusnya ada notifikasi "Success" atau "Query executed"
- Tidak ada error message
- Jika ada error, cek console untuk detail

### Step 2.5: Check Table
1. Di sidebar, klik **Table Editor**
2. Di kiri akan ada list table, cari **"users"**
3. Klik "users" → terbuka table view
4. Seharusnya ada column: id, username, email, full_name, phone_number, password_hash, account_number, bank_type, created_at, updated_at

✅ **DATABASE SCHEMA BERHASIL DIBUAT**

---

## PART 3: Ambil API Keys (2 menit)

### Step 3.1: Buka Settings
1. Di sidebar Supabase, klik **Settings**
2. Akan ada dropdown menu dengan berbagai opsi
3. Pilih **API**

### Step 3.2: Find API Keys
Di halaman API, akan melihat beberapa sections:
- **Project URL** (format: `https://xxxxx.supabase.co`)
- **API Keys** dengan sub-items:
  - `anon public` ← INI YANG DIPAKAI
  - `service_role` (SECRET - jangan di-expose)

### Step 3.3: Copy Keys
1. Cari **Project URL**
   - Copy dengan klik icon copy di sebelahnya
   - Paste ke notepad/text editor temporary
2. Cari **anon public** key
   - Copy dengan klik icon copy
   - Paste di bawah Project URL di notepad

**Harusnya sekarang punya di notepad:**
```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **API KEYS TERSIMPAN**

---

## PART 4: Setup Project Lokal (5 menit)

### Step 4.1: Install Dependencies
1. Buka **Terminal** (atau Command Prompt di Windows)
2. Navigate ke folder project:
```bash
cd e:\PROGRAM\judol
```
3. Run command:
```bash
npm install @supabase/supabase-js bcryptjs
```
4. Tunggu sampai `added XX packages` muncul (2-5 menit tergantung internet)

### Step 4.2: Setup .env.local File
1. Di folder project root (e:\PROGRAM\judol), lihat file `.env.local`
2. Open dengan text editor (VS Code, Notepad++, dll)
3. Isi dengan data dari notepad Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```
Ganti:
- `YOUR_PROJECT_ID` → bagian xxxxx dari project URL Anda
- `YOUR_ANON_KEY_HERE` → paste anon public key

**Contoh:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY2NjY2NjYsImV4cCI6MTk4MjI0MjY2Nn0.1a2b3c4d...
```

4. **SAVE FILE** (Ctrl+S)
5. **JANGAN commit file ini ke GitHub!**

### Step 4.3: Start Development Server
1. Kembali ke terminal
2. Run:
```bash
npm run dev
```
3. Tunggu sampai muncul:
```
ready on http://localhost:3000
```

✅ **APP SUDAH READY DI http://localhost:3000**

---

## PART 5: Test Features (15 menit)

### Test 5.1: Navigasi ke Login
1. Buka browser → http://localhost:3000
2. Di header, lihat menu: **Beranda | Admin | User**
3. Klik menu **User** (tombol biru)
4. Seharusnya redirect ke halaman login
5. Lihat ada form dengan:
   - Username input
   - Password input
   - Tombol "Login"
   - Link "Daftar di sini"

✅ **LOGIN PAGE BERHASIL DIBUKA**

### Test 5.2: Registrasi User Baru
1. Di login page, klik **"Daftar di sini"**
2. Akan buka halaman registrasi dengan form:
   - Username
   - Email
   - Nama Lengkap
   - Nomor Telepon
   - Password
   - Konfirmasi Password
   - Pilih Rekening (dropdown: BRI/DANA)
   - Nomor Rekening

3. **ISI FORM DENGAN DATA TESTING:**
```
Username: testuser123
Email: test@example.com
Nama Lengkap: John Doe
Nomor Telepon: 081234567890
Password: password123
Konfirmasi Password: password123
Pilih Rekening: BRI
Nomor Rekening: 1234567890
```

4. Klik **"Daftar"**
5. **TUNGGU 2-3 DETIK**
6. Seharusnya:
   - Ada alert: "Registrasi berhasil! Silakan login"
   - Redirect ke login page
   - Alert hilang otomatis

✅ **REGISTRASI BERHASIL**

### Test 5.3: Login dengan User Baru
1. Di login page, isi:
```
Username: testuser123
Password: password123
```

2. Klik **"Login"**
3. Tunggu 2-3 detik
4. Seharusnya:
   - Tidak ada error
   - Redirect ke `/user` page (halaman dengan mesin jackpot)
   - Di header, menu "User" berubah jadi "👤 John Doe" + tombol "Logout"
   - Bisa lihat statistik jackpot di halaman

✅ **LOGIN BERHASIL**

### Test 5.4: Test Protected Route
1. Di halaman user, klik **"Logout"** (tombol merah di header)
2. Seharusnya:
   - Header kembali tampilkan "User" button (bukan nama user)
   - Redirect ke home page

3. Sekarang buka langsung URL: http://localhost:3000/user
4. Seharusnya:
   - AUTO REDIRECT ke `/auth/login`
   - Tidak bisa langsung akses halaman user tanpa login

✅ **PROTECTED ROUTE BERHASIL**

### Test 5.5: Verify Data di Supabase
1. Buka Supabase dashboard → **Table Editor**
2. Pilih table **"users"**
3. Seharusnya ada 1 row dengan:
   - username: `testuser123`
   - email: `test@example.com`
   - full_name: `John Doe`
   - bank_type: `BRI`
   - password_hash: (long random string, bukan plain text)

✅ **DATA TERSIMPAN DI SUPABASE**

### Test 5.6: Test Error Handling
1. **Test Error: Username Tidak Exist**
   - Klik logout
   - Go to login page
   - Isi:
     - Username: `userbuatan123` (username yang tidak ada)
     - Password: `password123`
   - Click Login
   - Seharusnya error: "Username atau password salah"

2. **Test Error: Password Salah**
   - Isi:
     - Username: `testuser123`
     - Password: `wrongpassword`
   - Click Login
   - Seharusnya error: "Username atau password salah"

3. **Test Error: Duplikasi Username**
   - Logout
   - Click "Daftar di sini"
   - Coba registrasi dengan username: `testuser123` (sudah ada)
   - Seharusnya error: "Username sudah terdaftar"

4. **Test Error: Password Terlalu Pendek**
   - Di form registrasi, isi password: `123` (hanya 3 karakter)
   - Seharusnya error: "Password minimal 6 karakter"

✅ **ERROR HANDLING BERJALAN BAIK**

---

## PART 6: Troubleshooting Common Issues

### Issue: "Cannot find module @supabase/supabase-js"

**Solusi:**
```bash
cd e:\PROGRAM\judol
npm install @supabase/supabase-js bcryptjs
npm run dev
```

### Issue: "Missing NEXT_PUBLIC_SUPABASE_URL"

**Solve:**
1. Check file `.env.local` ada di root folder?
2. Isi dengan SUPABASE URL dan KEY
3. Restart server: Stop terminal (Ctrl+C), then `npm run dev`

### Issue: "Login gagal, username tidak ditemukan"

**Check:**
1. Username benar? (case-sensitive)
2. User sudah registrasi?
3. Lihat Supabase Table Editor → "users" table ada data?

### Issue: "Halaman blank atau error"

**Debug:**
1. Buka Browser Console: F12 → Console tab
2. Lihat error message
3. Check server logs di terminal (npm run dev output)

### Issue: "Data tidak tersimpan ke Supabase"

**Check:**
1. `.env.local` ada API key yang benar?
2. Database "users" table sudah dibuat di Supabase?
3. Network request berhasil? (Check F12 → Network tab)
4. Supabase project active? (Check dashboard)

---

## ✅ SELESAI!

Jika semua test pass, berarti:
- ✅ Supabase project berhasil setup
- ✅ Database schema berhasil dibuat
- ✅ API keys berhasil dikonfigurasi
- ✅ Project lokal berhasil terkoneksi ke Supabase
- ✅ Authentication system ready to use!

---

## 📚 Next Steps

Sekarang Anda bisa:

1. **Customize UI/Styling**
   - Edit file di `app/auth/login/login.module.css`
   - Edit file di `app/auth/register/register.module.css`
   - Sesuaikan dengan brand Anda

2. **Tambah Fitur Lanjut**
   - Email verification
   - Password reset
   - User profile page
   - Admin dashboard

3. **Deploy ke Production**
   - Push ke GitHub
   - Deploy di Vercel, Railway, atau hosting lain
   - Setup custom domain

---

## 💬 Questions?

Baca dokumentasi lengkap: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Happy coding! 🚀
