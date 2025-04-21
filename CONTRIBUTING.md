<h1 align="center">Contributing to Farmverse</h1>

Terima kasih udah tertarik bantuin Farmverse! Proyek ini dibangun pakai **Next.js**, **MySQL**, dan **Prisma**. Kita pakai pendekatan yang clean dan rapi, tapi tetep santai. Yuk, mulai!


## Menyiapkan Proyek Lokal

_Clone_ dan _install_ dulu:
```bash
git clone https://github.com/namamu/farmverse.git
cd farmverse
npm install
```

Bikin _file_ .env dari _template_:
```bash
cp .env.example .env
```

Generate Prisma dan jalankan **_dev server_**:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

Kalau butuh _seed_ data:
```bash
npx prisma db seed
```

## Struktur Folder
- src/app/api/ → API route (controller)
- src/actions/ → Server actions
- src/utils/ → Konfigurasi, helper, auth, dsb
- src/constants/ → String tetap
- src/types/ → Enum
- src/middleware.ts → Middleware auth & role
- src/test/ → Unit test

## _Commit Sytle_
Gunakan format _commit_ yang konsisten:
```bash
feat: Menambahkan fitur login Google
fix: Memperbaiki bug validasi register
refactor: Merapikan handler verifikasi
test: Menambahkan unit test untuk action register
```

Atau pakai gaya gitmoji, contohnya:
```bash
✨ Tambahin fitur verifikasi role
🐛 Benerin error redirect di login
🧪 Nambahin test register
```

## Catatan Penting
- Farmverse punya 4 _role_: FARMER, BANK, CUSTOMER, ADMIN
- Login bisa pakai Google, tapi pengguna tetap diverifikasi internal dulu
- Gunakan _util_ dari **src/utils/** */ untuk hal-hal standar (kayak _logger_, _auth handler_, dsb)

---

Yuk, bantu bangun ekosistem agrikultur yang canggih dan inklusif lewat teknologi!
Semangat berkontribusi bareng tim Farmverse!