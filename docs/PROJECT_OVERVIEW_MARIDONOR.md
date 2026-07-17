# MARIDONOR — Project Overview

> Platform Digital Donor Darah Indonesia

**Versi:** 1.0.0
**Tanggal:** 18 Juli 2026

---

## Ringkasan

MARIDONOR adalah platform digital yang menghubungkan PMI, rumah sakit, pendonor darah, dan masyarakat dalam satu ekosistem terintegrasi.

Platform ini bertujuan untuk mempermudah proses pencarian darah, meningkatkan jumlah pendonor aktif, membantu PMI mengelola stok darah secara real-time, serta menyediakan sistem pengingat donor dan notifikasi kebutuhan darah berdasarkan lokasi dan golongan darah.

Platform dikembangkan dengan pendekatan API-First sehingga dapat digunakan oleh aplikasi Web dan Mobile secara bersamaan.

---

## Visi

Menjadi platform donor darah digital yang membantu meningkatkan ketersediaan darah di Indonesia melalui teknologi modern.

---

## Misi

- Digitalisasi proses donor darah.
- Mempermudah masyarakat memperoleh informasi stok darah.
- Membantu PMI mengelola stok darah secara real-time.
- Meningkatkan jumlah pendonor aktif.
- Menghubungkan PMI, Rumah Sakit, dan masyarakat dalam satu platform.

---

## Target User

### Guest
- Melihat informasi umum
- Registrasi
- Login

### Donor
- Profil
- Jadwal donor
- Reminder donor
- Riwayat donor
- Sertifikat digital
- Badge & Reward

### Admin PMI
- Kelola stok darah
- Kelola donor
- Broadcast kebutuhan darah
- Dashboard
- Laporan

### Rumah Sakit
- Request darah
- Monitoring request

### Super Admin
- Monitoring seluruh PMI
- User Management
- Analytics Nasional

---

## Fitur MVP

- Authentication
- Dashboard
- Blood Stock
- Blood Request
- Donation Schedule
- Donation Reminder
- Notification
- Profile
- History Donor

---

## Future Features

- QR Check In
- AI Assistant
- Heatmap Donor
- Hospital Integration
- Reward Point
- Digital Certificate
- Event Donor
- Volunteer
- Mobile Apps
- AI Stock Prediction

---

## Tech Stack

### Backend
- Laravel 12
- PHP 8.4
- PostgreSQL
- Redis
- Laravel Reverb
- REST API

### Frontend Web
- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

### Mobile
- React Native CLI
- TypeScript

### Infrastructure
- Docker
- Nginx
- GitHub
- GitHub Actions
- VPS Linux

---

## Architecture

```
React Web (Frontend)
       ↓
   REST API
       ↓
Laravel (Backend) ─── Redis (Cache & Queue)
       │
       ├── PostgreSQL (Database)
       │
       ├── Firebase Cloud Messaging (FCM) ─── React Native (Mobile App)
       │
       └── Laravel Reverb (WebSocket)
```

---

## Development Principles

- API First
- Mobile Ready
- Modular
- Scalable
- Clean Architecture
- SOLID
- Type Safety
- Reusable Components
