# 🔑 SOLUSI BUG LOGIN USER - Service Role Key Missing!

## ❌ MASALAH DITEMUKAN

**Root Cause**: Supabase Server Client menggunakan **Anon Key** bukan **Service Role Key**

Ini menyebabkan:
- Query login user BLOCKED oleh RLS (Row Level Security) policy
- User tidak bisa login karena API tidak bisa akses database dengan benar

---

## ✅ SOLUSI

### Step 1: Dapatkan Service Role Key dari Supabase

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project "judol"
3. Pergi ke **Project Settings** (ikon gear di bottom left)
4. Tab **API**
5. Lihat **Service Role Key** (secret key yang panjang, jangan Anon Key!)
6. Copy-paste key tersebut

### Step 2: Update .env.local

Edit file `.env.local` dan ganti:

```dotenv
SUPABASE_SERVICE_ROLE_KEY = YOUR_SERVICE_ROLE_KEY_HERE
```

Dengan service role key yang Anda copy.

Contoh hasilnya akan terlihat seperti:
```dotenv
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2NleWd6Y2VrcHptdHR3YW9sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NjY2NjY2NiwiZXhwIjoxOTgyMjQyNjY2fQ.xxxxx...
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Lalu jalankan lagi:
npm run dev
```

### Step 4: Test Login User

Coba login dengan username dan password yang benar. Sekarang seharusnya bisa!

---

## 📋 Checklist

- [ ] Dapat Service Role Key dari Supabase Project Settings (bukan Anon Key)
- [ ] Update `.env.local` dengan Service Role Key
- [ ] Restart dev server (`npm run dev`)
- [ ] F12 Console → buka developer tools
- [ ] Coba login user → check console log
- [ ] Lihat message: "Login successful for user: ..." (hijau di log)

---

## ⚠️ PENTING

- **JANGAN** share atau commit Service Role Key ke GitHub
- `.env.local` sudah di `.gitignore`, jadi aman
- Service Role Key bersifat **secret** - ini key untuk bypass security, gunakan dengan hati-hati
- Di production, pastikan `.env` files tidak ter-commit

---

## 🔍 Jika Masih Error

Setelah set Service Role Key, cek:

1. **Console Browser (F12)**:
   - Login coba, lihat console log details
   - Pastikan message "Login successful" terlihat

2. **Server Logs** (saat `npm run dev` running):
   - Lihat output di terminal
   - Cari: "Login successful for user: ..." atau error details

3. **Supabase Console** (Web):
   - Check table `users` ada data user?
   - Check RLS policies di table `users` (apakah terlalu restrictive?)

Jika masih ada pertanyaan, output dari F12 Console akan banyak membantu debug!
