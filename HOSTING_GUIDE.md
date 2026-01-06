# 🚀 Panduan Hosting & Troubleshooting

## ⚠️ Masalah Login Error di Hosting

Jika mengalami error login setelah di-deploy, ikuti langkah berikut:

### 1. **Set Environment Variables di Hosting**

Pastikan ketiga environment variables ini sudah di-set di platform hosting Anda (Vercel, Netlify, dll):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xowceygzcekpzmttwaol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@judol.com
ADMIN_PASSWORD=AdminPassword123
```

### 2. **Untuk Vercel:**

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** > **Environment Variables**
3. Tambahkan 3 variables di atas
4. Klik **Deploy** untuk redeploy dengan environment variables baru

### 3. **Untuk Netlify:**

1. Pergi ke **Site Settings** > **Build & Deploy** > **Environment**
2. Klik **Edit variables**
3. Tambahkan 3 variables
4. Trigger redeploy

## 🔧 Testing Login di Local

```bash
# Jalankan dev server
npm run dev

# Test Admin Login
# Email: admin@judol.com
# Password: AdminPassword123

# Test User Login
# Username: (user yang sudah register di Supabase)
# Password: (password user)
```

## 📋 Checklist Sebelum Deploy

- [ ] `.env.local` sudah lengkap dengan 3 environment variables
- [ ] `.env.local` NOT di-commit ke GitHub (check .gitignore)
- [ ] Supabase credentials valid dan sudah test di local
- [ ] Admin credentials sudah set di `.env.local`
- [ ] Database Supabase tabel `users` sudah ada dengan data test
- [ ] `npm run build` berhasil tanpa error
- [ ] Test login di local berjalan sempurna

## 🐛 Debug Error

Lihat browser console (F12) untuk error details. Jika masih error:

1. Cek Network tab > XHR/Fetch untuk request ke `/api/auth/login` atau `/api/auth/admin-login`
2. Lihat response dari API (status code + message)
3. Jika ada error 500, check hosting logs/console

## 💡 Tips

- Setelah ubah environment variables, **redeploy** (bukan hanya re-trigger build)
- Clear browser cache dan localStorage jika masih cache login lama
- Gunakan Incognito/Private window untuk test fresh login
