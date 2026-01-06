# 🐛 Debugging User Login Issue

## Langkah untuk Debug Jika User Login Tidak Bisa Login

### 1. **Buka Browser Console (F12)**
- Pergi ke Tab **Console**
- Coba login dengan username dan password yang benar

### 2. **Lihat Console Log**
Akan terlihat:
```
Login attempt: {username: "coba ke 4", hasPassword: true}
Login result: {success: false, message: "..."}
```

### 3. **Cek Error Message yang Spesifik**

Kemungkinan error dan solusinya:

#### A. **"Username tidak ditemukan"**
- Artinya: Username tidak ada di database Supabase
- **Solusi**: Pastikan user sudah register dan check table `users` di Supabase

#### B. **"Error: Password tidak tersimpan di database"**
- Artinya: User ada tapi field `password_hash` kosong
- **Solusi**: Re-register user atau update password di database

#### C. **"Error verifying password"**
- Artinya: Ada error saat compare password dengan bcrypt
- **Solusi**: Restart server, pastikan bcryptjs installed

#### D. **"Password salah"**
- Artinya: Username ada tapi password tidak cocok
- **Solusi**: Pastikan password benar (case-sensitive)

#### E. **"Terjadi kesalahan server: ..."**
- Artinya: Ada error di server
- **Solusi**: Lihat server logs (di terminal/vercel logs)

---

## 4. **Check Server Logs**

Jalankan dev server:
```bash
npm run dev
```

Saat user login, lihat console output yang terlihat seperti:
```
Login attempt for username: coba ke 4
Supabase query - Error: null
Supabase query - Data: {id: '...', username: 'coba ke 4', has_password_hash: true}
Password validation result: true
Login successful for user: coba ke 4
```

Jika ada error, akan terlihat error details di sini.

---

## 5. **Check Database Supabase**

1. Buka [Supabase Console](https://supabase.co)
2. Pergi ke Table Editor → `users`
3. Check:
   - Ada username yang benar?
   - Field `password_hash` tidak kosong?
   - Data terlihat lengkap?

---

## 6. **Test Manual di Postman/cURL**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"coba ke 4","password":"password_user"}'
```

Response seharusnya:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "coba ke 4",
    "email": "...",
    ...
  }
}
```

---

## 7. **Checklist**

- [ ] Username ada di database Supabase table `users`
- [ ] Password sudah di-hash dengan bcrypt saat register
- [ ] Field `password_hash` tidak kosong
- [ ] Supabase credentials valid (`.env.local`)
- [ ] bcryptjs package sudah install (`npm install bcryptjs`)
- [ ] Dev server running tanpa error

Jika semua OK tapi masih error, cek error message spesifik di langkah 3 dan 4 di atas.
