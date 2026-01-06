# Cleanup Checklist Sebelum GitHub

## ✅ File/Folder yang Harus Dihapus

Run commands ini untuk cleanup:

```bash
# Folder build & dependencies (akan di-generate ulang)
rm -rf node_modules
rm -rf .next

# File dokumentasi internal (sudah ada di README baru)
rm -f FILES_CREATED.md
rm -f FINAL_SUMMARY.md
rm -f IMPLEMENTATION_COMPLETE.md
rm -f INDEX.md
rm -f NEXT_ACTIONS.md
rm -f QUICK_START.md
rm -f README_AUTH.md
rm -f README_INDONESIA.md
rm -f SETUP_CHECKLIST.md
rm -f START_HERE.md
rm -f VIDEO_TUTORIAL.md
rm -f SETUP_PLAYER_SETTINGS_GUIDE.md
rm -f SETUP_REQUIRED.md
rm -f PLAYER_SETTINGS_GUIDE.md

# Environment file (jangan commit credentials!)
rm -f .env.local
```

## ✅ File yang Harus Tetap

- ✅ `.env.example` - Template untuk development
- ✅ `.gitignore` - Git ignore rules
- ✅ `package.json` & `package-lock.json`
- ✅ `tsconfig.json`
- ✅ `next.config.js`
- ✅ `next-env.d.ts`
- ✅ `app/` - Source code
- ✅ `lib/` - Utilities & helpers
- ✅ `data/` - Local data files
- ✅ `README.md` - Updated main README
- ✅ `SUPABASE_SQL_SCRIPT.sql` - Database setup
- ✅ `SETUP_PLAYER_SETTINGS_TABLE.sql` - Player settings table

## 📝 Langkah Final

1. **Cleanup files**
   ```bash
   # Windows (PowerShell)
   Get-ChildItem -Exclude 'app','lib','data','node_modules','.next','.git' | Remove-Item
   ```

2. **Verify git status**
   ```bash
   git status
   ```

3. **Add to git**
   ```bash
   git add .
   ```

4. **Commit**
   ```bash
   git commit -m "Clean up: Remove internal documentation files"
   ```

5. **Push to GitHub**
   ```bash
   git push origin main
   ```

## ⚠️ JANGAN LUPA

- ❌ JANGAN commit `.env.local` (pastikan ada di .gitignore)
- ❌ JANGAN commit `node_modules/` (sudah di .gitignore)
- ❌ JANGAN commit `.next/` (build folder)

## 📦 npm install di Server

Saat deploy:
```bash
npm install
npm run build
npm start
```

Dependencies akan di-install otomatis dari `package.json`.
