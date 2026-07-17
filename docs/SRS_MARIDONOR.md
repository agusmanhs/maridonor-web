# Software Requirements Specification (SRS)
## MARIDONOR — Platform Donor Darah Indonesia

**Versi:** 1.0.0 (Draft)
**Tanggal:** 18 Juli 2026
**Status:** 🟡 Dalam Review

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum Sistem](#2-deskripsi-umum-sistem)
3. [Aktor Sistem](#3-aktor-sistem)
4. [Kebutuhan Fungsional](#4-kebutuhan-fungsional)
5. [Kebutuhan Non-Fungsional](#5-kebutuhan-non-fungsional)
6. [Aturan Bisnis](#6-aturan-bisnis)
7. [Kebutuhan Data & Model Domain](#7-kebutuhan-data--model-domain)
8. [Kebutuhan Antarmuka Eksternal](#8-kebutuhan-antarmuka-eksternal)
9. [Batasan & Asumsi Sistem](#9-batasan--asumsi-sistem)
10. [Glossary](#10-glossary)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan kebutuhan perangkat lunak untuk sistem **MARIDONOR**, platform digital yang menghubungkan pendonor darah, rumah sakit (RS), dan Palang Merah Indonesia (PMI) dalam satu ekosistem terintegrasi.

### 1.2 Ruang Lingkup Sistem
MARIDONOR adalah platform multi-platform (web & mobile) yang memiliki tiga fungsi utama:
1. **Pencocokan Donor–Penerima** — mempertemukan pendonor dengan kebutuhan darah secara efisien
2. **Manajemen Stok Darah** — membantu PMI dan RS memantau ketersediaan darah secara real-time
3. **Edukasi & Loyalitas Donor** — mendorong kebiasaan donor darah rutin melalui gamifikasi dan edukasi

### 1.3 Target Pengguna Dokumen
- Tim Engineering (Backend, Frontend, Mobile)
- Product Manager / Business Analyst
- QA Engineer
- Stakeholder (PMI, RS mitra)

### 1.4 Referensi
- Permenkes No. 91 Tahun 2015 tentang Standar Pelayanan Transfusi Darah
- Permenkes No. 83 Tahun 2014 tentang Unit Transfusi Darah
- IEEE Std 830-1998 — Recommended Practice for SRS
- WHO Blood Safety Guidelines

---

## 2. Deskripsi Umum Sistem

### 2.1 Konteks Sistem

```
┌────────────────────────────────────────────────────────────────┐
│                     MARIDONOR ECOSYSTEM                        │
│                                                                │
│  ┌──────────┐    ┌─────────────────────────────────────────┐  │
│  │  DONOR   │◄──►│            MARIDONOR PLATFORM           │  │
│  │  (User)  │    │                                         │  │
│  └──────────┘    │  ┌──────────┐  ┌──────────┐            │  │
│                  │  │  Web App │  │Mobile App│            │  │
│  ┌──────────┐    │  └──────────┘  └──────────┘            │  │
│  │   PMI    │◄──►│                                         │  │
│  │ (Pusat)  │    │         REST API + WebSocket            │  │
│  └──────────┘    │                                         │  │
│                  │  ┌──────────┐  ┌──────────┐            │  │
│  ┌──────────┐    │  │  Admin   │  │ RS Panel │            │  │
│  │    RS    │◄──►│  │  Panel   │  │          │            │  │
│  │(Hospital)│    │  └──────────┘  └──────────┘            │  │
│  └──────────┘    └─────────────────────────────────────────┘  │
│                                                                │
│  External: Maps API | Push Notification | SMS Gateway | Email  │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Platform yang Didukung

| Platform | Target Pengguna | Teknologi |
|---|---|---|
| Web App (Responsive) | Donor, RS, PMI | React 19 + Vite + TailwindCSS |
| Mobile App (Android & iOS) | Donor | React Native CLI |
| Admin Panel (Web) | Super Admin, Admin PMI | React 19 + Vite |

### 2.3 Arsitektur Tingkat Tinggi
- **Backend:** Laravel 12 sebagai REST API server
- **Database:** PostgreSQL (data primer), Redis (cache, queue, session)
- **Real-time:** Laravel Reverb (WebSocket) untuk notifikasi & update stok live
- **Queue:** Laravel Queue dengan Redis driver untuk job background
- **Storage:** File storage untuk dokumen & foto profil

---

## 3. Aktor Sistem

### 3.1 Definisi Aktor

| ID | Aktor | Deskripsi | Platform Utama |
|---|---|---|---|
| A01 | **Donor** | Masyarakat umum yang terdaftar sebagai pendonor darah | Mobile + Web |
| A02 | **Pasien/Keluarga Pasien** | Pihak yang membutuhkan darah untuk keperluan medis | Web + Mobile |
| A03 | **Petugas RS** | Staff rumah sakit yang mengelola kebutuhan & stok darah RS | Web |
| A04 | **Admin RS** | Administrator rumah sakit, mengelola akun & setting RS | Web |
| A05 | **Petugas PMI** | Staff PMI yang mengelola stok & distribusi darah | Web |
| A06 | **Admin PMI** | Administrator PMI wilayah, mengelola unit PMI | Web |
| A07 | **Super Admin** | Administrator sistem MARIDONOR | Web |

### 3.2 Hierarki Akses

```
Super Admin (A07)
├── Admin PMI (A06)
│   └── Petugas PMI (A05)
├── Admin RS (A04)
│   └── Petugas RS (A03)
├── Donor (A01)
└── Pasien/Keluarga (A02)
```

> [!NOTE]
> A01 dan A02 bisa menjadi aktor yang sama (satu akun user bisa berperan sebagai donor sekaligus memiliki kebutuhan darah untuk keluarga)

---

## 4. Kebutuhan Fungsional

### 4.1 Modul Autentikasi & Akun (AUTH)

#### AUTH-01: Registrasi Donor
- **Aktor:** A01 (Donor)
- **Deskripsi:** Pengguna dapat mendaftar sebagai donor melalui web atau mobile
- **Input:** Nama lengkap, NIK, email, nomor HP, tanggal lahir, jenis kelamin, golongan darah, kata sandi
- **Proses:**
  1. Validasi format data input
  2. Verifikasi nomor HP via OTP (SMS/WhatsApp)
  3. Verifikasi email via link konfirmasi
  4. Simpan profil dengan status `pending_verification`
- **Output:** Akun terbuat, onboarding flow dimulai
- **Aturan Bisnis:** NIK harus unik dalam sistem

#### AUTH-02: Registrasi Institusi (RS / PMI)
- **Aktor:** A04 (Admin RS), A06 (Admin PMI)
- **Deskripsi:** Pendaftaran institusi memerlukan persetujuan Super Admin
- **Input:** Nama institusi, alamat lengkap, kode pos, provinsi, kota, nomor izin operasional, NPWP, kontak PIC, email institusi
- **Proses:**
  1. Submit form pendaftaran institusi
  2. Upload dokumen legalitas (izin operasional, akreditasi)
  3. Super Admin melakukan verifikasi manual
  4. Notifikasi hasil verifikasi ke email institusi
- **Status Flow:** `pending` → `under_review` → `approved` / `rejected`

#### AUTH-03: Login
- **Aktor:** Semua aktor
- **Metode:** Email + password, OTP via HP
- **Fitur:** Remember me, Session management, Login history

#### AUTH-04: Manajemen Profil Donor
- **Aktor:** A01
- **Data Profil Lengkap:**
  - Informasi personal (nama, NIK, foto, TTL, gender, HP, email)
  - Golongan darah & rhesus
  - Alamat domisili (provinsi, kota, kecamatan, kelurahan, kode pos)
  - Riwayat kesehatan (penyakit kronis, alergi, obat rutin)
  - Kontak darurat
  - Preferensi notifikasi

#### AUTH-05: Verifikasi Identitas (KYC Level)
- **Level 0:** Email & HP terverifikasi (default setelah registrasi)
- **Level 1:** Upload foto KTP/NIK, selfie dengan KTP
- **Level 2:** Riwayat donor terverifikasi oleh PMI/RS mitra
- **Keterangan:** Level KYC mempengaruhi fitur yang dapat diakses

---

### 4.2 Modul Profil & Kelayakan Donor (DONOR)

#### DONOR-01: Pengecekan Kelayakan Donor
- **Aktor:** A01
- **Deskripsi:** Sistem menentukan apakah donor layak berdasarkan parameter medis
- **Parameter Kelayakan:**
  - Usia 17–65 tahun
  - Berat badan minimal 45 kg
  - Interval minimal 56 hari sejak donor terakhir (whole blood)
  - Tidak sedang hamil / menyusui (khusus perempuan)
  - Tidak memiliki kondisi kontraindikasi aktif
  - Tekanan darah dalam rentang normal (sistol 90–160, diastol 60–100)
  - Kadar hemoglobin: laki-laki >= 13 g/dL, perempuan >= 12 g/dL
- **Output:** Status kelayakan: `eligible` / `temporarily_deferred` / `permanently_deferred`
- **Catatan:** Pengecekan HB & tekanan darah dilakukan saat walk-in; sistem hanya menghitung interval & kondisi yang dilaporkan user

#### DONOR-02: Riwayat Donor
- **Aktor:** A01
- **Deskripsi:** Timeline lengkap seluruh aktivitas donor
- **Data per Entri:** Tanggal & waktu, lokasi (PMI/RS), jenis donor, golongan darah, volume (mL), status, catatan petugas
- **Fitur:** Download sertifikat donor (PDF), bagikan ke media sosial

#### DONOR-03: Jadwal Donor Berikutnya
- **Aktor:** A01
- **Deskripsi:** Sistem otomatis menghitung jadwal donor berikutnya
- **Reminder:** H-7, H-3, H-0

#### DONOR-04: Kartu Donor Digital
- **Aktor:** A01
- **Konten:** Foto, nama, golongan darah + rhesus, total donor, nomor ID donor, QR Code
- **QR Code:** Ketika di-scan oleh petugas, menampilkan data donor secara singkat

---

### 4.3 Modul Pencarian & Permintaan Darah (REQUEST)

#### REQUEST-01: Buat Permintaan Darah
- **Aktor:** A01 (untuk keluarga), A02, A03 (Petugas RS)
- **Input:**
  - Golongan darah & rhesus yang dibutuhkan
  - Jenis komponen darah (whole blood, PRC, trombosit, FFP, cryo)
  - Jumlah kantong yang dibutuhkan
  - Tingkat urgensi: `emergency` (< 6 jam), `urgent` (< 24 jam), `elective` (> 24 jam)
  - Nama & lokasi RS tujuan, nama pasien, nomor kontak, batas waktu pemenuhan
- **Validasi:** Request dari user non-RS memerlukan verifikasi nomor kamar/rekam medis

#### REQUEST-02: Broadcast Permintaan ke Donor
- **Aktor:** Sistem (otomatis)
- **Deskripsi:** Sistem mengirimkan notifikasi ke donor yang relevan berdasarkan:
  - Kecocokan golongan darah (termasuk kompatibilitas universal)
  - Jarak lokasi donor ke RS tujuan (radius konfigurabel, default 20 km)
  - Status kelayakan donor (eligible)
  - Preferensi notifikasi donor
- **Urutan Prioritas:**
  1. Golongan darah sama persis + lokasi terdekat
  2. Golongan darah kompatibel + lokasi terdekat
  3. Cadangan: broadcast diperluas ke radius lebih besar

#### REQUEST-03: Respons Donor terhadap Permintaan
- **Aktor:** A01
- **Opsi Respons:** `Bersedia Donor`, `Tidak Bisa`, `Tandai untuk Nanti`
- **Flow jika Bersedia:** Konfirmasi kesediaan → Tampilkan detail RS & kontak → Pilih slot waktu → Status `donor_confirmed`

#### REQUEST-04: Status Tracking Permintaan
- **Aktor:** A02, A03
- **Status Flow:**
  ```
  draft → open → partially_fulfilled → fulfilled → closed
                    |→ expired (batas waktu terlewat)
                    |→ cancelled
  ```

#### REQUEST-05: Riwayat & Manajemen Permintaan
- **Aktor:** A02, A03, A04
- **Fitur:** Filter berdasarkan status, tanggal, golongan darah; Export ke PDF/Excel

---

### 4.4 Modul Stok Darah (STOCK)

#### STOCK-01: Manajemen Stok PMI
- **Aktor:** A05, A06
- **Entitas Stok:** Golongan darah + rhesus, jenis komponen, jumlah kantong, tanggal masuk & kadaluarsa, nomor batch, status
- **Status Stok:** `available`, `reserved`, `distributed`, `expired`, `discarded`

#### STOCK-02: Manajemen Stok RS
- **Aktor:** A03, A04
- **Deskripsi:** RS mengelola stok internal mereka sendiri (diperoleh dari PMI atau donor langsung)

#### STOCK-03: Dashboard Stok Real-time
- **Aktor:** A05, A06, A03, A04, A07
- **Fitur:** Tabel stok per golongan & komponen, indikator level (critical/low/adequate), filter per wilayah, update real-time via WebSocket

#### STOCK-04: Informasi Stok Publik
- **Aktor:** A01, A02
- **Tampilan:** Level stok per golongan (ada/menipis/habis) di PMI & RS terdekat (tanpa detail sensitif)

#### STOCK-05: Alert Stok Kritis
- **Trigger:** Stok golongan darah di bawah threshold
- **Aksi:** Notifikasi ke Admin/Petugas PMI; broadcast pencarian donor opsional

#### STOCK-06: Manajemen Kadaluarsa
- **Deskripsi:** Sistem otomatis menandai kantong darah yang mendekati/sudah kadaluarsa
- **Alert:** 3 hari & 1 hari sebelum kadaluarsa

---

### 4.5 Modul Lokasi & Peta (LOCATION)

#### LOC-01: Peta Fasilitas Kesehatan
- **Aktor:** A01, A02
- **Data per Lokasi:** Nama & alamat, jam operasional donor, level stok (umum), nomor telepon, estimasi jarak, navigasi eksternal

#### LOC-02: Deteksi Lokasi Otomatis
- **Permission:** Harus mendapat izin eksplisit dari user
- **Fallback:** Input manual kota/kecamatan

#### LOC-03: Radius Pencarian Donor
- **Default:** 20 km
- **Opsi:** 5 km, 10 km, 20 km, 50 km, seluruh kota, seluruh provinsi

---

### 4.6 Modul Notifikasi (NOTIF)

#### NOTIF-01: Notifikasi Push (Mobile)
- **Trigger Events:** Permintaan darah cocok, konfirmasi jadwal, reminder donor (H-7/H-3/H-0), update status permintaan, alert stok kritis, pencapaian badge

#### NOTIF-02: Notifikasi In-App
- **Fitur:** Mark as read, hapus notifikasi, filter per kategori

#### NOTIF-03: Notifikasi Email
- **Trigger:** Registrasi, verifikasi akun, perubahan password, laporan bulanan

#### NOTIF-04: Notifikasi SMS/WhatsApp
- **Trigger:** OTP, permintaan darah emergency, reminder kritis

#### NOTIF-05: Preferensi Notifikasi
- **Aktor:** A01
- **Opsi:** Aktif/nonaktif per channel, jam senyap (do not disturb)

---

### 4.7 Modul Jadwal Donor (SCHEDULE)

#### SCH-01: Pembuatan Slot Jadwal
- **Aktor:** A05, A03
- **Input:** Tanggal, waktu, kapasitas, lokasi, catatan
- **Tipe:** Walk-in, Terjadwal (slot), Donor Massal (event)

#### SCH-02: Booking Jadwal oleh Donor
- **Aktor:** A01
- **Flow:** Pilih PMI/RS → Pilih tanggal & slot → Konfirmasi → Terima QR code/nomor antrian
- **Aturan:** Satu donor hanya dapat memiliki 1 booking aktif

#### SCH-03: Manajemen Booking
- **Fitur:** Lihat booking aktif, batalkan (dengan batas waktu), reschedule

#### SCH-04: Absensi & Check-in Donor
- **Aktor:** A05, A03
- **Deskripsi:** Scan QR code donor atau input manual untuk konfirmasi kehadiran
- **Status:** `booked` → `checked_in` → `screening` → `donated` / `deferred`

---

### 4.8 Modul Gamifikasi & Loyalitas (GAMIF)

#### GAMIF-01: Poin & Level Donor
- **Sistem Poin:** Donor pertama: 100 poin | Donor berikutnya: 50 poin | Emergency: 2x | Lengkapi profil: 20 | Referral: 30/orang
- **Level Donor:**

| Level | Nama | Total Donor |
|---|---|---|
| 1 | Pemula Darah | 1–4 kali |
| 2 | Pejuang Darah | 5–9 kali |
| 3 | Pahlawan Darah | 10–24 kali |
| 4 | Legenda Darah | 25–49 kali |
| 5 | Maestro Darah | 50+ kali |

#### GAMIF-02: Badge & Pencapaian
Contoh badge: Pendonor Pertama, Donor Konsisten, Pahlawan Darurat, Penjelajah (3+ kota), Golongan Langka (O-/AB-), Influencer Donor (referral 5 orang)

#### GAMIF-03: Leaderboard
- **Scope:** Nasional, Per Provinsi, Per Kota
- **Periode:** Bulanan, Tahunan, All-time

#### GAMIF-04: Sertifikat & Penghargaan Digital
- Sertifikat otomatis setelah setiap donor selesai, dapat didownload PDF

---

### 4.9 Modul Dashboard & Analitik (ANALYTICS)

#### ANAL-01: Dashboard Donor (Personal)
Total donor, estimasi jiwa tertolong (1 donor ~ 3 jiwa), next eligible date, level & progress, riwayat (chart), badge

#### ANAL-02: Dashboard PMI
Total stok per golongan (grafik), tren penerimaan/pengeluaran stok, jumlah donor aktif, permintaan masuk, stok mendekati kadaluarsa

#### ANAL-03: Dashboard RS
Stok darah RS, permintaan aktif, riwayat penggunaan darah, tren kebutuhan

#### ANAL-04: Dashboard Super Admin
Total pengguna (grafik pertumbuhan), total donor nasional, sebaran stok nasional, performa RS & PMI, log aktivitas sistem

#### ANAL-05: Laporan & Export
- **Format:** PDF, Excel (XLSX)
- **Jenis:** Stok harian/mingguan/bulanan, laporan donor, laporan permintaan, laporan kadaluarsa

---

### 4.10 Modul Konten & Edukasi (CONTENT)

#### CONT-01: Artikel Edukasi
- **Kategori:** Manfaat donor, Mitos & fakta, Persiapan donor, Pasca donor, Informasi kesehatan

#### CONT-02: FAQ
Pertanyaan umum seputar donor darah, dikelola oleh Admin

#### CONT-03: Pengumuman & Berita
Info event donor massal, kebijakan baru, berita terkait donor darah

---

### 4.11 Modul Manajemen Sistem (ADMIN)

#### ADMIN-01: Manajemen User
Lihat semua user, suspend/aktifkan akun, reset password, force verifikasi

#### ADMIN-02: Manajemen Institusi (RS & PMI)
Approve/reject pendaftaran, lihat detail institusi, suspend institusi

#### ADMIN-03: Konfigurasi Sistem
- Threshold stok kritis per golongan darah
- Radius default pencarian donor
- Batas waktu respons per urgency level
- Konfigurasi poin gamifikasi
- Template notifikasi

#### ADMIN-04: Log & Audit Trail
Semua aksi kritis dicatat: login, perubahan stok, persetujuan, perubahan konfigurasi

---

## 5. Kebutuhan Non-Fungsional

### 5.1 Performa (Performance)

| Metrik | Target |
|---|---|
| API Response Time (P95) | < 300ms untuk endpoint standar |
| API Response Time (Real-time) | < 100ms untuk WebSocket event |
| Halaman web (First Contentful Paint) | < 2 detik |
| Mobile app startup time | < 3 detik |
| Database query time | < 100ms (dengan indexing) |
| Upload dokumen | Maksimal 5MB per file |

### 5.2 Skalabilitas (Scalability)
- Sistem harus mampu menangani **1.000 concurrent users** pada fase awal
- Arsitektur harus mendukung horizontal scaling tanpa refaktor besar
- Queue system harus mampu memproses **10.000 job/menit** pada puncak traffic

### 5.3 Ketersediaan (Availability)
- **Uptime Target:** 99.5% (maksimal 3.65 jam downtime/tahun)
- Sistem harus mendukung **rolling deployment** tanpa downtime
- Fitur core (permintaan darah emergency) harus tetap berjalan saat sebagian sistem down

### 5.4 Keamanan (Security)
- **Autentikasi:** JWT dengan refresh token, expiry 15 menit (access), 7 hari (refresh)
- **Otorisasi:** Role-Based Access Control (RBAC) ketat per endpoint
- **Data Sensitif:** Enkripsi data NIK & riwayat kesehatan at-rest (AES-256)
- **HTTPS:** Wajib pada seluruh komunikasi jaringan
- **OTP:** Berlaku 5 menit, maksimal 3x percobaan salah kemudian cooldown
- **Rate Limiting:** Semua endpoint memiliki rate limiter (konfigurabel per role)
- **Audit Log:** Semua aksi kritis tercatat dengan timestamp & IP

### 5.5 Privasi Data
- Sistem mematuhi **UU PDP (Perlindungan Data Pribadi)** Indonesia
- Data kesehatan donor dikategorikan sebagai **data sensitif**, akses terbatas
- Pengguna memiliki hak: melihat data sendiri, mengubah, meminta penghapusan
- Data tidak dibagikan ke pihak ketiga tanpa persetujuan eksplisit user
- Retensi: akun dihapus → 30 hari soft delete → purge permanen

### 5.6 Kemudahan Penggunaan (Usability)
- Antarmuka mendukung **Bahasa Indonesia** sebagai bahasa utama
- Mendukung **Dark Mode** dan **Light Mode**
- Desain responsif untuk semua ukuran layar
- Mengikuti standar **aksesibilitas WCAG 2.1 Level AA**
- Onboarding flow yang guided untuk user baru

### 5.7 Maintainability
- Code coverage unit test minimal **70%** untuk backend
- Seluruh API terdokumentasi menggunakan **OpenAPI 3.0 (Swagger)**
- Database migrations harus bersifat reversible
- Semua environment variable terdokumentasi di `.env.example`

---

## 6. Aturan Bisnis

### 6.1 Kelayakan Donor (BR-DONOR)

| ID | Aturan |
|---|---|
| BR-D01 | Usia minimal donor: 17 tahun, maksimal: 65 tahun |
| BR-D02 | Berat badan minimal: 45 kg |
| BR-D03 | Interval minimum antar donor (whole blood): 56 hari (8 minggu) |
| BR-D04 | Interval minimum antar donor (trombosit/apheresis): 14 hari |
| BR-D05 | Wanita hamil tidak boleh donor |
| BR-D06 | Wanita menyusui (< 6 bulan pasca lahir) tidak boleh donor |
| BR-D07 | Pasca operasi besar: tangguhan minimal 6 bulan |
| BR-D08 | Pasca tato / tindik: tangguhan minimal 12 bulan |
| BR-D09 | Penderita HIV, Hepatitis B/C aktif: ditangguhkan permanen |
| BR-D10 | Penggunaan obat pengencer darah: tangguhan sesuai durasi obat |

### 6.2 Kompatibilitas Golongan Darah (BR-BLOOD)

| Golongan Darah Penerima | Dapat Menerima Dari |
|---|---|
| AB+ | Semua golongan (Universal Recipient) |
| AB- | AB-, A-, B-, O- |
| A+ | A+, A-, O+, O- |
| A- | A-, O- |
| B+ | B+, B-, O+, O- |
| B- | B-, O- |
| O+ | O+, O- |
| O- | O- saja (Universal Donor) |

### 6.3 Pengelolaan Stok (BR-STOCK)

| ID | Aturan |
|---|---|
| BR-S01 | Whole blood: masa simpan 35–42 hari (tergantung antikoagulan) |
| BR-S02 | Trombosit: masa simpan maksimal 5 hari |
| BR-S03 | FFP (Fresh Frozen Plasma): masa simpan 12 bulan |
| BR-S04 | Cryoprecipitate: masa simpan 12 bulan |
| BR-S05 | Stok dianggap "kritis" jika < threshold (default: 10 unit per golongan) |
| BR-S06 | Stok kadaluarsa wajib di-record sebelum dibuang (disposal log) |

### 6.4 Permintaan Darah (BR-REQUEST)

| ID | Aturan |
|---|---|
| BR-R01 | Satu permintaan hanya untuk satu golongan darah & satu komponen |
| BR-R02 | Permintaan `emergency` harus mendapat respons notifikasi dalam 15 menit |
| BR-R03 | Permintaan melewati batas waktu otomatis masuk status `expired` |
| BR-R04 | Permintaan dari user non-RS memerlukan validasi nomor rekam medis atau surat rujukan |
| BR-R05 | Satu donor hanya dapat dikonfirmasi untuk satu permintaan dalam satu waktu |

---

## 7. Kebutuhan Data & Model Domain

### 7.1 Entity Relationship (Simplified)

```
User (1) ────────── (1) DonorProfile
  |                        |
  |                  (many) Donation
  |                        |
  |──── (many) BloodRequest
  |                |
  |          Notification
  |
Institution (1) ──── (many) BloodStock
     |
     |──── (many) ScheduleSlot
                       |
                 (many) Booking ──── DonorProfile
```

### 7.2 Entitas & Atribut Kunci

#### User
| Field | Type | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| name | string | Nama lengkap |
| email | string unique | Email login |
| phone | string unique | Nomor HP |
| password_hash | string | Bcrypt hash |
| role | enum | donor, patient, rs_staff, rs_admin, pmi_staff, pmi_admin, super_admin |
| status | enum | active, suspended, deleted |
| kyc_level | int | 0, 1, 2 |
| email_verified_at | timestamp | nullable |
| phone_verified_at | timestamp | nullable |

#### DonorProfile
| Field | Type | Keterangan |
|---|---|---|
| user_id | UUID FK | Relasi ke User |
| nik | string encrypted | NIK (enkripsi AES-256) |
| gender | enum | male, female |
| birth_date | date | |
| blood_type | enum | A, B, AB, O |
| rhesus | enum | positive, negative |
| weight_kg | decimal | |
| total_donations | int | |
| last_donation_date | date | nullable |
| next_eligible_date | date | nullable |
| points | int | Poin gamifikasi |
| level | int | 1–5 |
| referral_code | string unique | |
| health_notes | text encrypted | Catatan kesehatan sensitif |

#### BloodRequest
| Field | Type | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| requester_id | UUID FK | User yang meminta |
| institution_id | UUID FK nullable | RS asal permintaan |
| blood_type | enum | A, B, AB, O |
| rhesus | enum | positive, negative |
| component_type | enum | whole_blood, prc, ffp, platelet, cryo |
| quantity_needed | int | Jumlah kantong |
| quantity_fulfilled | int | Jumlah terpenuhi |
| urgency_level | enum | emergency, urgent, elective |
| status | enum | draft, open, partially_fulfilled, fulfilled, expired, cancelled |
| deadline_at | timestamp | |
| destination_hospital_id | UUID FK | |

#### BloodStock
| Field | Type | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| unit_id | UUID FK | PMI/RS pemilik stok |
| unit_type | enum | pmi, hospital |
| blood_type | enum | A, B, AB, O |
| rhesus | enum | positive, negative |
| component_type | enum | |
| bag_number | string unique | Kode kantong darah |
| quantity_ml | int | Volume dalam mL |
| status | enum | available, reserved, distributed, expired, discarded |
| collected_at | timestamp | Tanggal pengambilan |
| expires_at | timestamp | Tanggal kadaluarsa |

#### Institution
| Field | Type | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| name | string | Nama institusi |
| type | enum | pmi, hospital |
| license_number | string | Nomor izin operasional |
| status | enum | pending, under_review, approved, suspended |
| latitude | decimal | Koordinat GPS |
| longitude | decimal | Koordinat GPS |
| operational_hours | JSON | Jam operasional per hari |

---

## 8. Kebutuhan Antarmuka Eksternal

### 8.1 API Eksternal

| Layanan | Provider | Kegunaan | Prioritas |
|---|---|---|---|
| Maps / Geocoding | Google Maps API / OpenStreetMap | Peta PMI & RS, geolocation, radius pencarian | Wajib |
| Push Notification | Firebase Cloud Messaging (FCM) | Notifikasi push Android & iOS | Wajib |
| SMS Gateway | Twilio / Vonage / Zenziva | OTP, notifikasi darurat via SMS | Wajib |
| WhatsApp Gateway | WA Business API | OTP alternatif, notifikasi darurat | Opsional |
| Email Service | Mailgun / AWS SES / SendGrid | Email transaksional | Wajib |
| Storage | AWS S3 / MinIO (self-hosted) | Upload foto, dokumen, sertifikat PDF | Wajib |
| PDF Generator | Laravel DomPDF / Browsershot | Generate sertifikat & laporan | Wajib |

### 8.2 Format Data API
- **Format:** JSON (`application/json`)
- **Autentikasi:** Bearer Token (Laravel Sanctum)
- **Versioning:** URL-based (`/api/v1/...`)
- **Pagination:** Cursor-based pagination untuk performa optimal
- **Error Format:** RFC 7807 (Problem Details for HTTP APIs)
- **Dokumentasi:** OpenAPI 3.0 (Swagger)

---

## 9. Batasan & Asumsi Sistem

### 9.1 Batasan Teknis
- Sistem **tidak terintegrasi** langsung dengan HIS (Hospital Information System) RS pada fase MVP
- Verifikasi medis (HB, tekanan darah) dilakukan secara **offline** di PMI/RS; sistem hanya mencatat hasilnya
- Data golongan darah donor diinput **mandiri** oleh user; diverifikasi petugas saat pertama kali donor
- Sistem **tidak mengelola transaksi keuangan** pada fase MVP

### 9.2 Asumsi
- PMI dan RS mitra memiliki akses internet yang memadai
- Seluruh PMI mitra bersedia memasukkan data stok darah ke sistem secara aktif
- User memiliki smartphone Android min. 8.0 atau iOS min. 13
- Notifikasi darurat melalui push notification + SMS (bukan panggilan telepon otomatis)

### 9.3 Di Luar Ruang Lingkup MVP (Out of Scope)
- Integrasi BPJS Kesehatan
- Sistem pembayaran / monetisasi
- Telemedis / konsultasi dokter online
- Manajemen stok reagen & peralatan medis
- Pelaporan otomatis ke Kemenkes

---

## 10. Glossary

| Istilah | Definisi |
|---|---|
| **PMI** | Palang Merah Indonesia — lembaga yang mengelola unit transfusi darah |
| **RS** | Rumah Sakit — institusi pelayanan kesehatan |
| **Whole Blood** | Darah lengkap tanpa pemisahan komponen |
| **PRC** | Packed Red Cells — komponen darah merah pekat |
| **FFP** | Fresh Frozen Plasma — plasma beku segar |
| **Cryo** | Cryoprecipitate — konsentrat faktor pembekuan darah |
| **Apheresis** | Proses donor yang hanya mengambil komponen tertentu |
| **Deferral** | Penundaan donor karena tidak memenuhi syarat medis |
| **KYC** | Know Your Customer — proses verifikasi identitas pengguna |
| **RBAC** | Role-Based Access Control — kontrol akses berbasis peran |
| **MVP** | Minimum Viable Product — versi minimal yang fungsional |
| **HIS** | Hospital Information System — sistem informasi manajemen RS |

---

> [!IMPORTANT]
> **Status Dokumen:** Draft v1.0 — memerlukan review dan persetujuan stakeholder sebelum masuk ke fase desain sistem.

> [!NOTE]
> **Open Questions untuk Diskusi Lanjutan:**
> 1. Apakah ada integrasi dengan sistem data PMI nasional yang sudah ada?
> 2. Bagaimana mekanisme monetisasi platform (berlangganan RS? gratis sepenuhnya?)?
> 3. Apakah notifikasi darurat perlu panggilan telepon otomatis (auto-call)?
> 4. Apakah perlu fitur multi-bahasa daerah selain Bahasa Indonesia?
> 5. Apakah ada kebutuhan fitur komunitas / forum donor?
> 6. Bagaimana onboarding PMI yang belum memiliki data digital stok darah?
> 7. Apakah donor bisa memilih untuk anonim dalam permintaan darah tertentu?

---

*Dokumen dibuat: 18 Juli 2026 | Akan diperbarui secara iteratif bersama tim.*
