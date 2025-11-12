# supabase-api-simjur

Singkat: proyek Next.js (App Router) sederhana yang digunakan sebagai starter untuk API/Frontend dengan konfigurasi Tailwind/PostCSS.

## Ringkasan struktur
- [app/page.tsx](app/page.tsx) — halaman utama, ekspor default: [`Home`](app/page.tsx)
- [app/layout.tsx](app/layout.tsx) — layout root, ekspor default: [`RootLayout`](app/layout.tsx) dan [`metadata`](app/layout.tsx)
- [app/globals.css](app/globals.css) — gaya global & konfigurasi tema
- [package.json](package.json) — dependensi & script
- [postcss.config.mjs](postcss.config.mjs) — konfigurasi PostCSS (Tailwind)
- [tsconfig.json](tsconfig.json) — konfigurasi TypeScript
- [next.config.ts](next.config.ts) — konfigurasi Next.js
- [api.txt](api.txt) — catatan koneksi database / Supabase (berisi kredensial; jangan commit ke publik)
- [.gitignore](.gitignore) — file/folder yang diabaikan oleh Git

## Persyaratan
- Node.js (disarankan versi LTS)
- npm

## Instalasi & Jalankan
1. Pasang dependensi:
```sh
npm install

