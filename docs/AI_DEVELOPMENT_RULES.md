# AI Development Rules — MARIDONOR
## Panduan Alur Kerja Operasional AI Assistant

> [!IMPORTANT]
> Dokumen ini mengatur **protokol interaksi dan pengembangan** bagi AI assistant selama fase penulisan kode (coding).
> Wajib dijalankan di setiap langkah pengerjaan tugas.

---

## 1. Sebelum Membuat Kode

- **Baca Seluruh Dokumentasi**: Selalu baca file yang ada di folder `docs/` terlebih dahulu untuk memahami konteks dan standar arsitektur.
- **Jangan Berasumsi**: Jika ada detail kebutuhan yang kurang jelas atau tidak didefinisikan, tanyakan langsung kepada user sebelum menulis kode.
- **Jangan Membuat File Baru**: Dilarang membuat file baru (controller, helper, class, dll.) kecuali ada instruksi atau persetujuan eksplisit.
- **Jangan Mengubah Struktur Project**: Jaga agar struktur folder (`FOLDER_STRUCTURE_MARIDONOR.md`) tetap konsisten. Jangan memindahkan atau memecah komponen tanpa izin.

---

## 2. Saat Coding

- **Ubah File Seminimalkan Mungkin**: Batasi perubahan hanya pada baris dan file yang benar-benar esensial untuk menyelesaikan tugas.
- **Jangan Refactor Besar-besaran**: Dilarang melakukan refactor kode di luar scope fitur yang sedang dikerjakan tanpa izin.
- **Jangan Install Package Baru**: Jangan menambahkan library atau package baru (composer / npm) tanpa persetujuan tertulis dari user.
- **Jangan Menghapus Kode Existing**: Jangan menghapus atau mengganti kode yang sudah berjalan kecuali diminta secara spesifik.

---

## 3. Setelah Coding

Setelah selesai menulis kode, berikan laporan penutup yang berisi:
- **Daftar File yang Berubah**: Cantumkan path file dan fungsinya.
- **Alasan Perubahan**: Mengapa perubahan tersebut dilakukan.
- **Dampak Perubahan (Impact)**: Apakah ada efek samping atau potensi regresi pada fitur lain.
- **Langkah Testing**: Tulis instruksi langkah demi langkah (termasuk perintah tes otomatis) untuk memverifikasi fungsionalitas kode baru.

---

## 4. Jika Menemukan Masalah / Bug

Jika menemukan error, inkonsistensi data, atau technical debt di tengah jalan:
- **Jangan langsung memperbaikinya secara sepihak.**
- Hentikan pekerjaan dan laporkan dengan format:
  1. **Penyebab**: Apa yang memicu terjadinya masalah.
  2. **Dampak**: Apa konsekuensinya terhadap sistem.
  3. **Solusi A**: Deskripsi pendekatan solusi pertama (+ kelebihan/kekurangan).
  4. **Solusi B**: Deskripsi pendekatan solusi kedua (+ kelebihan/kekurangan).
- **Tunggu persetujuan** dari user mengenai solusi mana yang akan diambil sebelum melanjutkan coding.

---

*Versi: 1.0.0 | Dibuat: 18 Juli 2026*
