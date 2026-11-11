# STO Barcode — Aplikasi Scan (GitHub Pages)

Halaman scan barcode untuk HP. Terpisah dari STO Launcher.
Data dikirim ke Google Spreadsheet **STO Barcode** lewat Apps Script.

## Isi repo
| File | Fungsi |
|---|---|
| `index.html` | Aplikasi scan (isi `API_URL` & `API_KEY` di sini) |
| `manifest.webmanifest` | Nama & ikon supaya bisa dipasang di layar utama HP |
| `icons/` | Ikon aplikasi |
| `.nojekyll` | Supaya GitHub Pages menampilkan file apa adanya |

## Pasang
1. **Apps Script (Spreadsheet STO Barcode)**
   - Code.gs versi 1.1.0, jalankan `setup`.
   - Terapkan → Kelola deployment → ✏️ Edit → Versi baru, akses **Siapa saja** → Terapkan.
2. **Ambil API_URL & API_KEY**: Spreadsheet → menu **STO Barcode → Info link HP (GitHub)**
   (atau Apps Script → ⚙ Setelan project → Properti skrip → `API_KEY`).
3. **Edit `index.html`**, cari baris ini lalu isi:
   ```js
   const API_URL = 'https://script.google.com/macros/s/xxxx/exec';
   const API_KEY = 'xxxxxxxxxxxxxxxx';
   ```
4. **Buat repo baru** di github.com: **New repository** → nama `sto-barcode` → Public → Create.
5. **Add file → Upload files** → tarik semua isi folder ini (index.html, manifest.webmanifest,
   folder icons, .nojekyll) → **Commit changes**.
6. **Settings → Pages** → Source: *Deploy from a branch* → Branch **main** / **(root)** → Save.
7. Tunggu 1–2 menit, buka di Chrome HP:
   `https://USERNAME.github.io/sto-barcode/`
8. **Mulai Scan** → **Izinkan** kamera → menu ⋮ → **Instal aplikasi / Tambahkan ke layar utama**.

## Catatan
- Repo publik berarti `index.html` bisa dilihat orang lain. Kalau tidak mau API_KEY tertulis di file,
  biarkan `API_URL`/`API_KEY` kosong dan buka sekali di tiap HP:
  `https://USERNAME.github.io/sto-barcode/?api=API_URL&key=API_KEY` → tersimpan di HP itu.
- Mengubah file di GitHub: tunggu 1–2 menit lalu tarik layar ke bawah / muat ulang di HP.
- Kamera ditolak? Ketuk ikon 🔒 di sebelah alamat → Izin → Kamera → Izinkan → muat ulang.
