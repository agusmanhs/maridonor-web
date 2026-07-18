# MARIDONOR — Developer Setup Guide

Maridonor adalah platform logistik donor darah modern yang menghubungkan pendonor, Unit Donor Darah PMI, dan Rumah Sakit untuk mengelola pasokan darah darurat serta penjadwalan donor secara real-time.

---

## 🛠️ Prasyarat (Pre-requisites)

Sebelum memulai pengembangan lokal, pastikan perangkat Anda memiliki dependensi berikut:
*   **PHP** >= 8.2 (dilengkapi ekstensi `pdo_pgsql`, `pdo_sqlite`, `bcmath`, `xml`)
*   **Composer** (PHP Package Manager)
*   **PostgreSQL** (Database utama)
*   **Node.js** >= 18 & **npm** (Untuk build frontend/assets jika dibutuhkan)

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan server API Maridonor di komputer lokal Anda:

### 1. Klon Repositori & Instalasi Dependensi
```bash
git clone https://github.com/agusmanhs/maridonor-web.git
cd maridonor-web
composer install
```

### 2. Konfigurasi Environment File
Salin file konfigurasi environment dan sesuaikan credentials database Anda:
```bash
cp .env.example .env
php artisan key:generate
```
Buka file `.env` menggunakan editor teks Anda dan sesuaikan koneksi database PostgreSQL:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=maridonor_db
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
```

### 3. Migrasi Database & Seeding
Jalankan migrasi tabel lengkap (24 tabel terintegrasi) dan masukkan data seed awal:
```bash
php artisan migrate:fresh --seed
```

### 4. Jalankan Lokal Server
Nyalakan server development lokal:
```bash
php artisan serve
```
API server Anda sekarang aktif secara lokal di: `http://127.0.0.1:8000`

---

## 🧪 Menjalankan Automated Tests (PHPUnit)

Untuk memastikan semua modul berjalan aman tanpa merusak fungsi yang sudah ada, jalankan test suite menggunakan SQLite in-memory database:
```bash
php artisan test
```

---

## 🛡️ Mekanisme Keamanan Aktif

### 1. Rate Limiting (Mencegah Flooding SMS & Brute Force)
Endpoint berikut dilindungi oleh pembatas laju request bawaan Laravel (`throttle` middleware):
*   `POST /api/v1/auth/otp/send`: Maksimal **3 request per menit** per IP/akun.
*   `POST /api/v1/auth/otp/verify`: Maksimal **10 request per menit**.
*   `POST /api/v1/auth/login`: Maksimal **10 request per menit**.

### 2. Role-Based Access Control (RBAC)
Otorisasi endpoint sensitif dikendalikan oleh alias `role` middleware di tingkat routing. Hak akses terbagi sebagai berikut:
*   `super_admin`: Kontrol penuh atas seluruh master data, FAQ, dan kelola admin PMI/RS.
*   `pmi_admin` / `pmi_staff`: Mengelola stok darah, verifikasi check-in donor, menyetujui/memenuhi permintaan darah RS, dan menyiarkan pengumuman.
*   `rs_admin` / `rs_staff`: Membaca stok darah institusi sendiri, mengirim permohonan darah darurat ke PMI, dan memantau pemenuhan stok.
*   `donor`: Memesan janji slot donor, klaim poin referral, melihat riwayat dan lencana reward.
