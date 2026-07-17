# MARIDONOR — Backend API (Laravel 12)

Platform donor darah digital yang menghubungkan pendonor, rumah sakit, dan PMI Indonesia.

Repository ini berisi backend API yang dibangun menggunakan Laravel 12.

## Dokumentasi Proyek
Seluruh dokumentasi spesifikasi, desain database, API contract, dan roadmap telah disatukan di dalam folder `docs/`:

- [Project Overview](docs/PROJECT_OVERVIEW_MARIDONOR.md)
- [SRS (Software Requirements Specification)](docs/SRS_MARIDONOR.md)
- [Database Design (ERD & Schema)](docs/DB_DESIGN_MARIDONOR.md)
- [User Flow](docs/USER_FLOW_MARIDONOR.md)
- [Folder Structure](docs/FOLDER_STRUCTURE_MARIDONOR.md)
- [API Contract (~83 endpoints)](docs/API_CONTRACT_MARIDONOR.md)
- [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md)

## Tech Stack Backend
- Laravel 12
- PHP 8.4
- PostgreSQL
- Redis
- Laravel Reverb

## Setup & Instalasi Lokal
1. Clone repository ini.
2. Salin file `.env.example` menjadi `.env` dan sesuaikan kredensial database Anda.
3. Jalankan instalasi dependensi:
   ```bash
   composer install
   npm install
   ```
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Jalankan migrasi database dan seeders:
   ```bash
   php artisan migrate --seed
   ```
6. Jalankan server lokal:
   ```bash
   php artisan serve
   ```
