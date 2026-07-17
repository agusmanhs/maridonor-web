# Development Roadmap — MARIDONOR
## Tahapan Pengembangan & Strategi Rilis

**Versi:** 1.0.0
**Tanggal:** 18 Juli 2026

---

## 1. Tahapan Pengembangan (Phases)

### Phase 1: Foundation (Durasi: 2 Minggu)
Fokus pada setup infrastruktur dasar dan sistem keamanan autentikasi.
- **Tugas Utama**:
  - Setup Project (Laravel, Tailwind CSS, TypeScript setup).
  - Authentication (Login, Register, OTP Verification, Reset Password).
  - User Management (Manajemen user dasar).
  - Role & Permission (Pembagian hak akses: Donor, RS, PMI, Super Admin).
  - Dashboard Layout (Struktur navigasi dan shell aplikasi).

### Phase 2: Master Data (Durasi: 2 Minggu)
Penyusunan data master yang menjadi fondasi modul operasional donor darah.
- **Tugas Utama**:
  - Unit PMI & Rumah Sakit (Data profil institusi).
  - Blood Type & Rhesus (Data klasifikasi golongan darah).
  - Blood Stock & Inventory (Sistem stok dasar).
  - Blood Component (Komponen darah: whole blood, prc, ffp, platelet, cryo).

### Phase 3: Donor (Durasi: 3 Minggu)
Modul untuk aktivitas pendonor dan gamifikasi awal.
- **Tugas Utama**:
  - Jadwal Donor (Sistem booking slot waktu).
  - Riwayat Donor (Log aktivitas donor terdahulu).
  - Reminder (Pengingat donor berikutnya secara terjadwal).
  - Sertifikat Digital (Generate PDF setelah donor selesai).

### Phase 4: Blood Request (Durasi: 3 Minggu)
Sistem permintaan darah darurat dan reguler.
- **Tugas Utama**:
  - Request Darah (Pembuatan tiket permintaan darah baru oleh RS/Keluarga).
  - Approval (Validasi data permintaan).
  - Broadcast System (Notifikasi berdasarkan kecocokan golongan darah & lokasi).
  - Status Tracking (Pemantauan pemenuhan jumlah kantong darah).

### Phase 5: Notification (Durasi: 2 Minggu)
Integrasi saluran komunikasi real-time dan notifikasi perangkat.
- **Tugas Utama**:
  - Firebase Cloud Messaging (FCM) untuk push notification mobile.
  - Email Notification (Notifikasi transaksi & transaksional).
  - Real-time Updates (Integrasi WebSocket menggunakan Laravel Reverb).
  - Reminder Scheduler (CRON job pengingat harian).

### Phase 6: Dashboard & Reporting (Durasi: 2 Minggu)
Visualisasi data dan pelaporan tingkat lanjut.
- **Tugas Utama**:
  - Statistics Widgets (Ringkasan metrik).
  - Charts (Tren donor & grafik ketersediaan stok).
  - Reports generator.
  - Export data ke Excel / PDF.

### Phase 7: Mobile App (Durasi: 4 Minggu)
Pengembangan aplikasi client untuk pendonor menggunakan React Native.
- **Tugas Utama**:
  - Setup & Navigation Mobile.
  - Authentication & Registration.
  - Interactive Map & Nearby Facilities.
  - Request Blood & Respond Flow.
  - Profile, Gamification & Badge screens.

### Phase 8: Future Releases
Fitur pengembangan jangka panjang pasca rilis stabil.
- **Fitur Terencana**:
  - AI Assistant (Rekomendasi & asisten interaktif).
  - Reward & Gamification Point Exchange.
  - Heatmap Kebutuhan & Distribusi Donor.
  - Hospital System Integration (SIMRS).
  - Volunteer & Komunitas Manajemen.
  - Event Donor Massal.
  - QR Code Check-In di lokasi donor.

---

## 2. Peta Rilis Versi (Version Mapping)

```
v1.0 (MVP)
  ├── Setup Foundation & Master Data
  ├── Modul Donor Dasar (Booking & Riwayat)
  └── Request Darah Manual
  
v1.5 (Realtime & Notification)
  ├── Integrasi WebSocket (Reverb)
  └── Push Notification & E-Mail Alert System
  
v2.0 (Mobile Apps)
  └── Rilis Aplikasi React Native (Android & iOS) untuk Donor
  
v2.5 (AI Engine)
  ├── AI Assistant & Stock Prediction
  └── Heatmap Spasial
  
v3.0 (National Platform)
  └── Integrasi Skala Nasional (Kemenkes, PMI Pusat, SIMRS)
```

---

*Versi: 1.0.0 | Dibuat: 18 Juli 2026*
