# Setup dan Implementasi Supabase untuk Judol App

## 📋 Daftar Isi
1. [Setup Supabase](#setup-supabase)
2. [Database Schema](#database-schema)
3. [Instalasi Dependencies](#instalasi-dependencies)
4. [Konfigurasi Environment](#konfigurasi-environment)
5. [File Structure](#file-structure)
6. [Fitur & Flow](#fitur--flow)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Setup Supabase

### 1. Buat Akun Supabase
- Kunjungi https://supabase.com
- Klik **"Sign Up"**
- Registrasi menggunakan Email, GitHub, atau Google

### 2. Buat Project Baru
1. Setelah login, klik **"New Project"**
2. Isi form:
   - **Project Name:** `judol-app`
   - **Database Password:** Buat password kuat (minimum 8 karakter)
   - **Region:** Pilih region terdekat (Indonesia, Singapore, dll)
3. Tunggu ~2 menit hingga project selesai

### 3. Dapatkan API Keys
1. Di sidebar kiri, klik **Settings** → **API**
2. Copy:
   - **Project URL** (format: `https://xxxxx.supabase.co`)
   - **anon public** (key untuk frontend)
   - **service_role** (key untuk backend - JANGAN expose di frontend)

**⚠️ PENTING:** Jangan share API key public di repository GitHub

---

## Database Schema

### Tabel `users`

```sql
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

-- Indexes untuk performa
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Column Details:
| Column | Type | Keterangan |
|--------|------|-----------|
| `id` | UUID | Primary key auto-generated |
| `username` | VARCHAR(50) | Unique, untuk login |
| `email` | VARCHAR(100) | Unique, untuk komunikasi |
| `full_name` | VARCHAR(100) | Nama lengkap user |
| `phone_number` | VARCHAR(20) | Nomor telepon (e.g. 08123456789) |
| `password_hash` | VARCHAR(255) | Password ter-hash dengan bcrypt |
| `account_number` | VARCHAR(50) | Nomor rekening/e-wallet |
| `bank_type` | VARCHAR(20) | BRI atau DANA |
| `created_at` | TIMESTAMP | Waktu registrasi |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

### Row Level Security (RLS)

Jalankan di SQL Editor Supabase:

```sql
-- Enable RLS pada table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa lihat data mereka sendiri
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: User hanya bisa update data mereka sendiri
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid()::text = id::text);
```

---

## Instalasi Dependencies

```bash
# Masuk ke folder project
cd e:\PROGRAM\judol

# Install Supabase client dan bcryptjs (untuk hash password)
npm install @supabase/supabase-js bcryptjs
```

---

## Konfigurasi Environment

### File: `.env.local`
Buat file `.env.local` di root folder project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

**Catatan:**
- Ganti `YOUR_PROJECT_ID` dengan ID project Supabase Anda
- Ganti `YOUR_ANON_PUBLIC_KEY` dengan public key
- Prefix `NEXT_PUBLIC_` membuat variable ini accessible di browser

---

## File Structure

Setelah setup selesai, struktur folder Anda akan terlihat seperti:

```
judol/
├── .env.local                      # Environment variables
├── app/
│   ├── layout.tsx                  # Root layout (sudah updated)
│   ├── page.tsx                    # Home page (Beranda)
│   ├── globals.css
│   ├── auth/
│   │   ├── login/
│   │   │   ├── page.tsx            # Halaman login
│   │   │   └── login.module.css    # Styling login
│   │   └── register/
│   │       ├── page.tsx            # Halaman registrasi
│   │       └── register.module.css # Styling registrasi
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts        # API login
│   │   │   └── register/
│   │   │       └── route.ts        # API registrasi
│   │   ├── settings/
│   │   └── simulate/
│   ├── user/
│   │   └── page.tsx                # User dashboard (protected)
│   ├── admin/
│   │   └── page.tsx
│   └── components/
│       ├── HeaderNav.tsx           # Navigation component
│       ├── HeaderNav.module.css
│       └── ProtectedRoute.tsx      # Wrapper untuk protected pages
├── lib/
│   ├── supabase.ts                 # Supabase client & types
│   ├── auth-context.tsx            # Auth context & hooks
│   └── settings.ts
├── data/
│   └── settings.json
├── package.json
└── tsconfig.json
```

---

## Fitur & Flow

### 1. **Registrasi (Sign Up)**

**Flow:**
1. User klik menu "User" di header → Redirect ke login page
2. User klik "Daftar di sini" → Ke halaman registrasi
3. Fill form: username, email, nama, telepon, password, rekening, pilih bank
4. Click "Daftar"
5. API `/api/auth/register` validasi & hash password
6. Data disimpan ke Supabase
7. Redirect ke login page

**Form Fields:**
- Username (unique)
- Email (unique, validated)
- Nama Lengkap
- Nomor Telepon
- Password (min 6 char)
- Confirm Password
- Pilih Bank (BRI / DANA dropdown)
- Nomor Rekening

**Validasi:**
- Semua field required
- Email format valid
- Password min 6 karakter
- Password harus sama dengan konfirmasi
- Bank hanya BRI atau DANA

### 2. **Login**

**Flow:**
1. User di login page (`/auth/login`)
2. Input username & password
3. Click "Login"
4. API `/api/auth/login`:
   - Cari user berdasarkan username di Supabase
   - Verifikasi password dengan bcrypt
   - Return user data (tanpa password)
5. AuthContext simpan user di localStorage
6. Redirect ke `/user` page

**Validasi:**
- Username & password required
- Username harus exist di database
- Password harus match

### 3. **Protected Routes**

Halaman `/user` dilindungi dengan `ProtectedRoute` component:

```tsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

- Jika user belum login → Redirect ke `/auth/login`
- Jika user sudah login → Bisa akses halaman

### 4. **Logout**

User bisa logout dengan klik tombol "Logout" di header:
- Clear localStorage
- Clear auth state
- Redirect ke home page

### 5. **Header Navigation**

Dynamic menu di header:
- **Jika belum login:** Tampilkan tombol "User" (link ke login)
- **Jika sudah login:** Tampilkan nama user + tombol "Logout"

---

## Testing

### Manual Testing Steps

#### Test Registrasi:
1. Buka http://localhost:3000/auth/register
2. Fill semua field:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Nama: `Test User`
   - Telepon: `081234567890`
   - Password: `password123`
   - Confirm: `password123`
   - Bank: Pilih "BRI"
   - Rekening: `1234567890`
3. Click "Daftar"
4. Check: Alert "Registrasi berhasil", redirect ke login

#### Test Login:
1. Buka http://localhost:3000/auth/login
2. Input:
   - Username: `testuser123`
   - Password: `password123`
3. Click "Login"
4. Check: Redirect ke `/user`, lihat nama user di header

#### Test Protected Route:
1. Buka http://localhost:3000/user (tanpa login)
2. Check: Auto redirect ke `/auth/login`

#### Test Logout:
1. Login dulu
2. Click tombol "Logout" di header
3. Check: Redirect ke home, header kembali tampilkan "User" button

### Test Database (Supabase Console)

1. Buka Supabase console
2. Klik **Table Editor** → pilih `users` table
3. Lihat data user yang terdaftar
4. Verifikasi:
   - Username unique
   - Email unique
   - Password sudah ter-hash

---

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
**Solusi:**
```bash
npm install @supabase/supabase-js bcryptjs
npm run dev
```

### Error: "Missing environment variables"
**Check:**
1. File `.env.local` sudah ada?
2. Variable `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diisi?
3. Restart dev server: `npm run dev`

### Login gagal "Username atau password salah"
**Check:**
1. Username benar? (case-sensitive)
2. Password benar?
3. User sudah terdaftar? (cek di Supabase console)

### User tidak bisa access `/user` page
**Check:**
1. Sudah login?
2. Local storage ada `judol_user` key?
3. Browser console ada error?

### Data tidak tersimpan ke Supabase
**Check:**
1. API key benar?
2. Database table `users` sudah dibuat?
3. RLS policies benar?
4. Check server logs untuk error details

### Password tidak ter-hash di database
**Check:**
1. bcryptjs sudah install? `npm list bcryptjs`
2. Route `/api/auth/register` pakai `bcrypt.hash()`?

---

## Security Tips

✅ **Do's:**
- Hash semua password dengan bcrypt
- Validasi input di backend (jangan hanya di frontend)
- Gunakan HTTPS untuk production
- Keep API keys di `.env.local` (jangan commit ke git)
- Use environment variables untuk credentials

❌ **Don'ts:**
- Jangan simpan plain text password
- Jangan expose API keys di client-side code
- Jangan trust client-side validation saja
- Jangan upload `.env.local` ke GitHub

---

## Next Steps (Optional)

Fitur yang bisa ditambahkan:

1. **Email Verification**
   - Kirim verification link ke email saat registrasi
   - User harus verify email sebelum bisa login

2. **Password Reset**
   - Forgot password flow
   - Reset via email link

3. **User Profile Update**
   - Edit nama, email, nomor rekening
   - Change password

4. **Admin Dashboard**
   - Lihat semua registered users
   - Edit/delete users
   - Export user data

5. **Audit Log**
   - Track login activity
   - Track data changes

---

## Support

Jika ada masalah atau pertanyaan:
1. Check console browser (F12) untuk error messages
2. Check server logs: `npm run dev`
3. Cek Supabase documentation: https://supabase.com/docs
4. Debug dengan console.log() untuk trace flow

Happy coding! 🚀
