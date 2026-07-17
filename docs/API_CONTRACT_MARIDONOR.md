# API Contract — MARIDONOR
## REST API Design Document

**Versi:** 1.0.0
**Base URL:** `https://api.maridonor.id/api/v1`
**Tanggal:** 18 Juli 2026

---

## Daftar Isi

1. [Konvensi & Standar](#1-konvensi--standar)
2. [Auth](#2-auth)
3. [Profile & KYC](#3-profile--kyc)
4. [Donor](#4-donor)
5. [Blood Request](#5-blood-request)
6. [Blood Stock](#6-blood-stock)
7. [Institution](#7-institution)
8. [Schedule & Booking](#8-schedule--booking)
9. [Donation](#9-donation)
10. [Gamification](#10-gamification)
11. [Notification](#11-notification)
12. [Content](#12-content)
13. [Admin](#13-admin)
14. [Dashboard & Analytics](#14-dashboard--analytics)
15. [WebSocket Channels](#15-websocket-channels)

---

## 1. Konvensi & Standar

### 1.1 Base URL & Versioning
```
Production : https://api.maridonor.id/api/v1
Staging    : https://api-staging.maridonor.id/api/v1
Development: http://localhost:8000/api/v1
```

### 1.2 Autentikasi
Semua endpoint yang membutuhkan autentikasi harus menyertakan:
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

**Level Auth yang Digunakan:**

| Level | Keterangan |
|---|---|
| `Public` | Tidak perlu token |
| `Auth` | Perlu Bearer token (semua role yang sudah login) |
| `Donor` | Auth + role donor atau patient |
| `PMI Staff` | Auth + role pmi_staff atau pmi_admin |
| `RS Staff` | Auth + role rs_staff atau rs_admin |
| `PMI Admin` | Auth + role pmi_admin |
| `RS Admin` | Auth + role rs_admin |
| `Institution Staff` | Auth + role pmi_staff/pmi_admin/rs_staff/rs_admin |
| `Super Admin` | Auth + role super_admin |

### 1.3 Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": {},
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "next_cursor": "eyJpZCI6IjEyMyJ9"
  }
}
```

**Error (RFC 7807):**
```json
{
  "success": false,
  "message": "Pesan error yang deskriptif",
  "errors": {
    "field_name": ["Pesan validasi error"]
  }
}
```

### 1.4 HTTP Status Codes

| Code | Keterangan |
|---|---|
| `200` | OK — Request berhasil |
| `201` | Created — Resource berhasil dibuat |
| `204` | No Content — Berhasil tanpa response body |
| `400` | Bad Request — Input tidak valid |
| `401` | Unauthorized — Token tidak ada / invalid |
| `403` | Forbidden — Tidak punya izin |
| `404` | Not Found — Resource tidak ditemukan |
| `409` | Conflict — Duplikasi / kondisi konflik |
| `422` | Unprocessable Entity — Validasi gagal |
| `429` | Too Many Requests — Rate limit |
| `500` | Internal Server Error |

### 1.5 Pagination
Semua endpoint list menggunakan **cursor-based pagination**:
```
GET /blood-requests?per_page=15&cursor=eyJpZCI6IjEyMyJ9
```

### 1.6 Enum Values Referensi

| Enum | Values |
|---|---|
| `blood_type` | `A`, `B`, `AB`, `O` |
| `rhesus` | `positive`, `negative` |
| `component_type` | `whole_blood`, `prc`, `ffp`, `platelet`, `cryo` |
| `urgency_level` | `emergency`, `urgent`, `elective` |
| `request_status` | `draft`, `open`, `partially_fulfilled`, `fulfilled`, `expired`, `cancelled` |
| `stock_status` | `available`, `reserved`, `distributed`, `expired`, `discarded` |
| `donation_status` | `scheduled`, `completed`, `cancelled`, `deferred` |
| `booking_status` | `booked`, `checked_in`, `donated`, `deferred`, `cancelled`, `no_show` |
| `institution_type` | `pmi`, `hospital` |
| `eligibility_status` | `eligible`, `temporarily_deferred`, `permanently_deferred` |

---

## 2. Auth

### 2.1 Register Donor
**`POST /auth/register`** — `Public`

**Request Body:**
```json
{
  "name": "Agus Budi",
  "email": "agus@example.com",
  "phone": "081234567890",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!",
  "birth_date": "1995-03-15",
  "gender": "male",
  "blood_type": "A",
  "rhesus": "positive"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registrasi berhasil. Silakan verifikasi nomor HP Anda.",
  "data": {
    "user_id": "uuid",
    "email": "agus@example.com",
    "phone": "081234567890",
    "otp_sent_to": "phone"
  }
}
```

**Response `422`:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah terdaftar."],
    "phone": ["Format nomor HP tidak valid."]
  }
}
```

---

### 2.2 Register Institusi (RS / PMI)
**`POST /auth/register/institution`** — `Public`

**Request Body:**
```json
{
  "institution_name": "PMI Kota Jakarta Selatan",
  "institution_type": "pmi",
  "license_number": "PMI/JSL/2020/001",
  "npwp": "12.345.678.9-012.000",
  "province": "DKI Jakarta",
  "city": "Jakarta Selatan",
  "district": "Kebayoran Baru",
  "sub_district": "Senayan",
  "postal_code": "12190",
  "street_address": "Jl. Wijaya I No.31",
  "latitude": -6.2234,
  "longitude": 106.7991,
  "phone": "02122345678",
  "email": "pmi.jaksel@pmi.or.id",
  "pic_name": "Dr. Budi Santoso",
  "pic_phone": "081234567890",
  "operational_hours": {
    "monday":    { "is_open": true, "open": "08:00", "close": "15:00" },
    "tuesday":   { "is_open": true, "open": "08:00", "close": "15:00" },
    "wednesday": { "is_open": true, "open": "08:00", "close": "15:00" },
    "thursday":  { "is_open": true, "open": "08:00", "close": "15:00" },
    "friday":    { "is_open": true, "open": "08:00", "close": "12:00" },
    "saturday":  { "is_open": false },
    "sunday":    { "is_open": false }
  },
  "admin_name": "Rina Susanti",
  "admin_email": "rina@pmi.or.id",
  "admin_password": "SecurePassword123!",
  "admin_password_confirmation": "SecurePassword123!"
}
```

**File Upload (multipart/form-data):**
- `license_document` — File PDF/JPG izin operasional (maks 5MB)
- `npwp_document` — File PDF/JPG NPWP (maks 5MB)

**Response `201`:**
```json
{
  "success": true,
  "message": "Pendaftaran institusi berhasil. Menunggu verifikasi oleh Super Admin.",
  "data": {
    "institution_id": "uuid",
    "status": "pending",
    "estimated_review": "2–3 hari kerja"
  }
}
```

---

### 2.3 Login
**`POST /auth/login`** — `Public`

**Request Body:**
```json
{
  "email": "agus@example.com",
  "password": "SecurePassword123!",
  "remember_me": false,
  "fcm_token": "firebase_device_token_string"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1Qi...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "name": "Agus Budi",
      "email": "agus@example.com",
      "phone": "081234567890",
      "role": "donor",
      "status": "active",
      "kyc_level": 1,
      "institution_id": null
    }
  }
}
```

**Response `401`:**
```json
{
  "success": false,
  "message": "Email atau password salah."
}
```

---

### 2.4 Logout
**`POST /auth/logout`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 2.5 Kirim OTP
**`POST /auth/otp/send`** — `Public`

**Request Body:**
```json
{
  "identifier": "081234567890",
  "type": "phone_verify"
}
```
> `type`: `phone_verify`, `email_verify`, `login`, `password_reset`

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP berhasil dikirim ke 081234567890",
  "data": {
    "expires_in": 300,
    "resend_after": 60
  }
}
```

---

### 2.6 Verifikasi OTP
**`POST /auth/otp/verify`** — `Public`

**Request Body:**
```json
{
  "identifier": "081234567890",
  "code": "123456",
  "type": "phone_verify"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP berhasil diverifikasi"
}
```

**Response `422`:**
```json
{
  "success": false,
  "message": "OTP tidak valid atau sudah kedaluwarsa.",
  "errors": {
    "code": ["OTP salah. Sisa percobaan: 2"]
  }
}
```

---

### 2.7 Lupa Password
**`POST /auth/password/forgot`** — `Public`

**Request Body:**
```json
{
  "email": "agus@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda."
}
```

---

### 2.8 Reset Password
**`POST /auth/password/reset`** — `Public`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "email": "agus@example.com",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password berhasil direset. Silakan login."
}
```

---

## 3. Profile & KYC

### 3.1 Get Current User
**`GET /me`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Agus Budi",
    "email": "agus@example.com",
    "phone": "081234567890",
    "role": "donor",
    "status": "active",
    "kyc_level": 1,
    "email_verified_at": "2026-07-18T00:00:00Z",
    "phone_verified_at": "2026-07-18T00:00:00Z",
    "institution": null,
    "donor_profile": {
      "blood_type": "A",
      "rhesus": "positive",
      "eligibility_status": "eligible",
      "next_eligible_date": "2026-09-12",
      "total_donations": 7,
      "points": 450,
      "level": 2
    }
  }
}
```

---

### 3.2 Update Profile
**`PUT /me`** — `Auth`

**Request Body:**
```json
{
  "name": "Agus Budi Santoso",
  "phone": "081234567891",
  "province": "DKI Jakarta",
  "city": "Jakarta Selatan",
  "district": "Kebayoran Baru",
  "sub_district": "Senayan",
  "postal_code": "12190",
  "street_address": "Jl. Wijaya I No.5",
  "emergency_contact_name": "Siti Rahayu",
  "emergency_contact_phone": "081298765432"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": { "...updated user object..." }
}
```

---

### 3.3 Update Password
**`PUT /me/password`** — `Auth`

**Request Body:**
```json
{
  "current_password": "OldPassword123!",
  "password": "NewPassword456!",
  "password_confirmation": "NewPassword456!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Password berhasil diperbarui"
}
```

---

### 3.4 Upload Foto Profil
**`POST /me/avatar`** — `Auth` — `multipart/form-data`

**Request:** File `avatar` (JPG/PNG, maks 2MB)

**Response `200`:**
```json
{
  "success": true,
  "message": "Foto profil berhasil diperbarui",
  "data": {
    "photo_url": "https://storage.maridonor.id/avatars/uuid.jpg"
  }
}
```

---

### 3.5 Upload Dokumen KYC
**`POST /kyc/documents`** — `Auth` — `multipart/form-data`

**Request:**
- `type`: `ktp_photo` | `selfie_ktp`
- `file`: JPG/PNG (maks 5MB)

**Response `201`:**
```json
{
  "success": true,
  "message": "Dokumen berhasil diunggah. Menunggu review.",
  "data": {
    "document_id": "uuid",
    "type": "ktp_photo",
    "status": "pending"
  }
}
```

---

### 3.6 Get KYC Status
**`GET /kyc/status`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "kyc_level": 1,
    "documents": [
      {
        "id": "uuid",
        "type": "ktp_photo",
        "status": "approved",
        "reviewed_at": "2026-07-17T10:00:00Z"
      },
      {
        "id": "uuid",
        "type": "selfie_ktp",
        "status": "pending",
        "reviewed_at": null
      }
    ]
  }
}
```

---

### 3.7 Update Notification Preferences
**`PUT /me/notification-preferences`** — `Auth`

**Request Body:**
```json
{
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": false,
  "whatsapp_enabled": true,
  "blood_request_notif": true,
  "schedule_reminder_notif": true,
  "announcement_notif": false,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "07:00"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Preferensi notifikasi berhasil diperbarui"
}
```

---

## 4. Donor

### 4.1 Get Donor Profile
**`GET /donor/profile`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "nik_masked": "3271****0001",
    "gender": "male",
    "birth_date": "1995-03-15",
    "age": 31,
    "blood_type": "A",
    "rhesus": "positive",
    "weight_kg": 70.5,
    "address": {
      "province": "DKI Jakarta",
      "city": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "postal_code": "12190"
    },
    "photo_url": "https://...",
    "total_donations": 7,
    "last_donation_date": "2026-07-12",
    "next_eligible_date": "2026-09-12",
    "eligibility_status": "eligible",
    "deferral_reason": null,
    "deferral_until": null,
    "points": 450,
    "level": 2,
    "referral_code": "AGU12B",
    "emergency_contact_name": "Siti Rahayu",
    "emergency_contact_phone": "081298765432"
  }
}
```

---

### 4.2 Update Donor Profile
**`PUT /donor/profile`** — `Donor`

**Request Body:**
```json
{
  "weight_kg": 72.0,
  "blood_type": "A",
  "rhesus": "positive",
  "health_notes": "Tidak ada riwayat penyakit kronis"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Profil donor berhasil diperbarui"
}
```

---

### 4.3 Check Eligibility Status
**`GET /donor/eligibility`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "is_eligible": true,
    "eligibility_status": "eligible",
    "last_donation_date": "2026-07-12",
    "next_eligible_date": "2026-09-12",
    "days_until_eligible": 0,
    "checks": {
      "age": { "pass": true, "value": 31, "requirement": "17-65 tahun" },
      "interval": { "pass": true, "value": 56, "requirement": "minimal 56 hari" },
      "no_active_deferral": { "pass": true }
    }
  }
}
```

---

### 4.4 Donation History
**`GET /donor/history`** — `Donor`

**Query Params:** `?per_page=15&cursor=...&status=completed`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "institution": {
        "id": "uuid",
        "name": "PMI Kota Jakarta Selatan",
        "type": "pmi"
      },
      "blood_type": "A",
      "rhesus": "positive",
      "component_type": "whole_blood",
      "volume_ml": 450,
      "donated_at": "2026-07-12T09:30:00Z",
      "status": "completed",
      "points_earned": 50,
      "certificate_url": "https://storage.maridonor.id/certificates/uuid.pdf"
    }
  ],
  "meta": { "...pagination..." }
}
```

---

### 4.5 Donation History Detail
**`GET /donor/history/{donationId}`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "institution": { "id": "uuid", "name": "...", "address": "..." },
    "blood_type": "A",
    "rhesus": "positive",
    "component_type": "whole_blood",
    "volume_ml": 450,
    "donated_at": "2026-07-12T09:30:00Z",
    "status": "completed",
    "hemoglobin": 14.2,
    "systolic_bp": 120,
    "diastolic_bp": 80,
    "weight_at_donation": 70.5,
    "officer_notes": "Proses lancar",
    "points_earned": 50,
    "certificate_url": "https://..."
  }
}
```

---

### 4.6 Get Digital Donor Card
**`GET /donor/card`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "donor_id": "MARI-2026-000123",
    "name": "Agus Budi",
    "blood_type": "A",
    "rhesus": "positive",
    "total_donations": 7,
    "level": 2,
    "level_name": "Pejuang Darah",
    "photo_url": "https://...",
    "qr_code_data": "MARIDONOR:uuid:A:positive",
    "qr_code_url": "https://api.maridonor.id/qr/uuid.png",
    "issued_at": "2026-07-18T00:00:00Z"
  }
}
```

---

## 5. Blood Request

### 5.1 List Blood Requests (Publik / Nearby)
**`GET /blood-requests`** — `Auth`

**Query Params:**
```
?status=open
&urgency_level=emergency
&blood_type=A
&rhesus=positive
&city=Jakarta+Selatan
&radius_km=20
&per_page=15
&cursor=...
```

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "request_code": "REQ-20260718-0001",
      "blood_type": "A",
      "rhesus": "positive",
      "component_type": "whole_blood",
      "quantity_needed": 3,
      "quantity_fulfilled": 1,
      "urgency_level": "emergency",
      "status": "open",
      "destination_hospital": {
        "id": "uuid",
        "name": "RS Fatmawati",
        "city": "Jakarta Selatan"
      },
      "contact_name": "Keluarga Pasien",
      "contact_phone": "081234567890",
      "deadline_at": "2026-07-18T12:00:00Z",
      "distance_km": 5.2,
      "created_at": "2026-07-18T06:00:00Z"
    }
  ],
  "meta": { "...pagination..." }
}
```

---

### 5.2 Get Blood Request Detail
**`GET /blood-requests/{id}`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "request_code": "REQ-20260718-0001",
    "requester": {
      "id": "uuid",
      "name": "Budi Hartono"
    },
    "patient_name": "Siti Rahayu",
    "medical_record_number": "RM-2026-12345",
    "blood_type": "A",
    "rhesus": "positive",
    "component_type": "whole_blood",
    "quantity_needed": 3,
    "quantity_fulfilled": 1,
    "urgency_level": "emergency",
    "status": "open",
    "destination_hospital": {
      "id": "uuid",
      "name": "RS Fatmawati",
      "address": "Jl. RS Fatmawati No.4",
      "phone": "02175906",
      "latitude": -6.2985,
      "longitude": 106.7942
    },
    "contact_name": "Budi Hartono",
    "contact_phone": "081234567890",
    "notes": "Pasien operasi mendadak",
    "deadline_at": "2026-07-18T12:00:00Z",
    "opened_at": "2026-07-18T06:05:00Z",
    "created_at": "2026-07-18T06:00:00Z",
    "my_response": null
  }
}
```

---

### 5.3 Create Blood Request
**`POST /blood-requests`** — `Auth` (Donor Level 1+, atau Institution Staff)

**Request Body:**
```json
{
  "patient_name": "Siti Rahayu",
  "patient_birth_year": 1970,
  "medical_record_number": "RM-2026-12345",
  "diagnosis": "Anemia berat pasca operasi",
  "blood_type": "A",
  "rhesus": "positive",
  "component_type": "whole_blood",
  "quantity_needed": 3,
  "urgency_level": "emergency",
  "destination_hospital_id": "uuid",
  "contact_name": "Budi Hartono",
  "contact_phone": "081234567890",
  "notes": "Pasien perlu segera"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Permintaan darah berhasil dibuat dan sedang dibroadcast",
  "data": {
    "id": "uuid",
    "request_code": "REQ-20260718-0001",
    "status": "open",
    "deadline_at": "2026-07-18T12:00:00Z",
    "donors_notified": 42
  }
}
```

---

### 5.4 My Blood Requests
**`GET /blood-requests/my`** — `Auth`

**Query Params:** `?status=open&per_page=15&cursor=...`

**Response `200`:** *(sama struktur dengan List Blood Requests)*

---

### 5.5 Cancel Blood Request
**`DELETE /blood-requests/{id}`** — `Auth` (Pembuat request)

**Request Body:**
```json
{
  "reason": "Darah sudah tersedia dari sumber lain"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Permintaan darah berhasil dibatalkan"
}
```

---

### 5.6 Respond to Blood Request (Donor)
**`POST /blood-requests/{id}/respond`** — `Donor`

**Request Body:**
```json
{
  "response": "willing",
  "notes": "Saya bisa datang pukul 10.00"
}
```
> `response`: `willing`, `declined`, `saved_for_later`

**Response `200`:**
```json
{
  "success": true,
  "message": "Terima kasih! Respons Anda telah dicatat.",
  "data": {
    "response": "willing",
    "destination_hospital": {
      "name": "RS Fatmawati",
      "address": "Jl. RS Fatmawati No.4",
      "phone": "02175906",
      "maps_url": "https://maps.google.com/?q=-6.2985,106.7942"
    }
  }
}
```

---

### 5.7 List Donors Responding (Institution Staff)
**`GET /blood-requests/{id}/donors`** — `Institution Staff`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "donor_id": "uuid",
      "name": "Agus Budi",
      "blood_type": "A",
      "rhesus": "positive",
      "phone": "081234567890",
      "distance_km": 3.1,
      "response": "willing",
      "responded_at": "2026-07-18T06:30:00Z",
      "status": "confirmed"
    }
  ]
}
```

---

## 6. Blood Stock

### 6.1 List Blood Stock (Institution)
**`GET /blood-stocks`** — `Institution Staff`

**Query Params:** `?blood_type=A&rhesus=positive&component_type=whole_blood&status=available`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "blood_type": "A",
      "rhesus": "positive",
      "component_type": "whole_blood",
      "bag_number": "PMI-2026-A001",
      "quantity_ml": 450,
      "status": "available",
      "batch_number": "BATCH-20260712",
      "collected_at": "2026-07-12T09:00:00Z",
      "expires_at": "2026-08-23T09:00:00Z",
      "days_until_expiry": 36
    }
  ],
  "meta": { "...pagination..." }
}
```

---

### 6.2 Stock Summary (Institution)
**`GET /blood-stocks/summary`** — `Institution Staff`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "institution_id": "uuid",
    "institution_name": "PMI Kota Jakarta Selatan",
    "updated_at": "2026-07-18T01:30:00Z",
    "summary": [
      {
        "blood_type": "A",
        "rhesus": "positive",
        "component_type": "whole_blood",
        "available_bags": 15,
        "reserved_bags": 3,
        "total_volume_ml": 7650,
        "level": "adequate",
        "threshold_critical": 5,
        "threshold_low": 10,
        "nearest_expiry": "2026-07-21T00:00:00Z"
      },
      {
        "blood_type": "O",
        "rhesus": "negative",
        "component_type": "whole_blood",
        "available_bags": 2,
        "reserved_bags": 0,
        "total_volume_ml": 900,
        "level": "critical",
        "threshold_critical": 5,
        "threshold_low": 10,
        "nearest_expiry": "2026-07-25T00:00:00Z"
      }
    ]
  }
}
```

---

### 6.3 Public Stock Level (Donor / Pasien)
**`GET /blood-stocks/public`** — `Auth`

**Query Params:** `?latitude=-6.2234&longitude=106.7991&radius_km=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "institution_id": "uuid",
      "institution_name": "PMI Kota Jakarta Selatan",
      "distance_km": 2.3,
      "stock_levels": {
        "A_positive": "adequate",
        "A_negative": "low",
        "B_positive": "adequate",
        "B_negative": "critical",
        "AB_positive": "adequate",
        "AB_negative": "adequate",
        "O_positive": "low",
        "O_negative": "critical"
      }
    }
  ]
}
```

---

### 6.4 Add Blood Stock
**`POST /blood-stocks`** — `Institution Staff`

**Request Body:**
```json
{
  "blood_type": "A",
  "rhesus": "positive",
  "component_type": "whole_blood",
  "bag_number": "PMI-2026-A099",
  "quantity_ml": 450,
  "batch_number": "BATCH-20260718",
  "source_donor_id": "uuid",
  "collected_at": "2026-07-18T09:00:00Z",
  "expires_at": "2026-08-29T09:00:00Z"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Stok darah berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "bag_number": "PMI-2026-A099",
    "status": "available"
  }
}
```

---

### 6.5 Update Stock Status
**`PUT /blood-stocks/{id}/status`** — `Institution Staff`

**Request Body:**
```json
{
  "status": "distributed",
  "distributed_to": "uuid_institution",
  "discarded_reason": null
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Status stok berhasil diperbarui"
}
```

---

### 6.6 Expiring Stocks
**`GET /blood-stocks/expiring`** — `Institution Staff`

**Query Params:** `?days=3` (stok yang expired dalam X hari)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bag_number": "PMI-2026-A033",
      "blood_type": "A",
      "rhesus": "positive",
      "component_type": "whole_blood",
      "expires_at": "2026-07-20T09:00:00Z",
      "days_remaining": 2,
      "status": "available"
    }
  ]
}
```

---

### 6.7 Get / Update Stock Thresholds
**`GET /blood-stock-thresholds`** — `Institution Staff`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "blood_type": "A",
      "rhesus": "positive",
      "component_type": "whole_blood",
      "critical_threshold": 5,
      "low_threshold": 10
    }
  ]
}
```

**`PUT /blood-stock-thresholds`** — `PMI Admin` / `RS Admin`

**Request Body:**
```json
{
  "thresholds": [
    {
      "blood_type": "O",
      "rhesus": "negative",
      "component_type": "whole_blood",
      "critical_threshold": 3,
      "low_threshold": 8
    }
  ]
}
```

---

## 7. Institution

### 7.1 List Institutions (Map)
**`GET /institutions`** — `Public`

**Query Params:** `?type=pmi&latitude=-6.2&longitude=106.8&radius_km=20&city=Jakarta+Selatan`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "PMI Kota Jakarta Selatan",
      "type": "pmi",
      "code": "PMI-JSL-001",
      "address": "Jl. Wijaya I No.31",
      "city": "Jakarta Selatan",
      "phone": "02122345678",
      "latitude": -6.2234,
      "longitude": 106.7991,
      "distance_km": 2.3,
      "is_open_now": true,
      "operational_hours": { "...full schedule..." },
      "logo_url": "https://..."
    }
  ]
}
```

---

### 7.2 Get Institution Detail
**`GET /institutions/{id}`** — `Public`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "PMI Kota Jakarta Selatan",
    "type": "pmi",
    "code": "PMI-JSL-001",
    "address": {
      "street_address": "Jl. Wijaya I No.31",
      "district": "Kebayoran Baru",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "postal_code": "12190"
    },
    "phone": "02122345678",
    "email": "pmi.jaksel@pmi.or.id",
    "website": "https://pmijaksel.or.id",
    "operational_hours": { "...full schedule..." },
    "latitude": -6.2234,
    "longitude": 106.7991,
    "logo_url": "https://...",
    "stock_summary": {
      "A_positive": "adequate",
      "O_negative": "critical"
    }
  }
}
```

---

### 7.3 List Institution Staff
**`GET /institutions/{id}/staff`** — `PMI Admin` / `RS Admin`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid",
      "name": "Rina Susanti",
      "email": "rina@pmi.or.id",
      "phone": "081234567890",
      "role": "admin",
      "is_active": true
    }
  ]
}
```

---

### 7.4 Add Staff to Institution
**`POST /institutions/{id}/staff`** — `PMI Admin` / `RS Admin`

**Request Body:**
```json
{
  "email": "newstaff@pmi.or.id",
  "role": "staff"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Undangan berhasil dikirim ke newstaff@pmi.or.id"
}
```

---

### 7.5 Remove Staff
**`DELETE /institutions/{id}/staff/{userId}`** — `PMI Admin` / `RS Admin`

**Response `200`:**
```json
{
  "success": true,
  "message": "Staff berhasil dihapus dari institusi"
}
```

---

## 8. Schedule & Booking

### 8.1 List Schedule Slots
**`GET /schedule-slots`** — `Auth`

**Query Params:** `?institution_id=uuid&date=2026-07-20&available_only=true`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "institution": {
        "id": "uuid",
        "name": "PMI Kota Jakarta Selatan"
      },
      "slot_date": "2026-07-20",
      "start_time": "08:00",
      "end_time": "09:00",
      "capacity": 10,
      "booked_count": 7,
      "available_count": 3,
      "type": "regular",
      "is_full": false
    }
  ]
}
```

---

### 8.2 Create Schedule Slot
**`POST /schedule-slots`** — `Institution Staff`

**Request Body:**
```json
{
  "slot_date": "2026-07-25",
  "start_time": "08:00",
  "end_time": "09:00",
  "capacity": 10,
  "type": "regular",
  "event_name": null,
  "notes": "Slot reguler harian"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Slot jadwal berhasil dibuat",
  "data": { "id": "uuid", "slot_date": "2026-07-25", "..." }
}
```

---

### 8.3 Cancel Schedule Slot
**`DELETE /schedule-slots/{id}`** — `Institution Staff`

**Request Body:**
```json
{
  "reason": "Petugas tidak tersedia"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Slot dibatalkan. Notifikasi dikirim ke 7 donor yang telah booking."
}
```

---

### 8.4 Create Booking
**`POST /bookings`** — `Donor`

**Request Body:**
```json
{
  "slot_id": "uuid"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Booking berhasil!",
  "data": {
    "id": "uuid",
    "slot": {
      "institution_name": "PMI Kota Jakarta Selatan",
      "slot_date": "2026-07-25",
      "start_time": "08:00",
      "address": "Jl. Wijaya I No.31"
    },
    "queue_number": 8,
    "qr_code_url": "https://api.maridonor.id/qr/booking-uuid.png",
    "status": "booked"
  }
}
```

---

### 8.5 My Bookings
**`GET /bookings/my`** — `Donor`

**Query Params:** `?status=booked&per_page=10`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slot": {
        "institution_name": "PMI Kota Jakarta Selatan",
        "slot_date": "2026-07-25",
        "start_time": "08:00"
      },
      "queue_number": 8,
      "qr_code_url": "https://...",
      "status": "booked",
      "created_at": "2026-07-18T02:00:00Z"
    }
  ]
}
```

---

### 8.6 Cancel Booking
**`DELETE /bookings/{id}`** — `Donor`

**Request Body:**
```json
{
  "reason": "Ada kepentingan mendadak"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Booking berhasil dibatalkan"
}
```

---

### 8.7 Check-in Donor (Staff)
**`POST /bookings/{id}/checkin`** — `Institution Staff`

**Request Body:**
```json
{
  "qr_code": "MARIDONOR:booking-uuid"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "donor": {
      "name": "Agus Budi",
      "blood_type": "A",
      "rhesus": "positive",
      "total_donations": 7,
      "kyc_level": 1,
      "last_donation_date": "2026-07-12"
    },
    "booking_status": "checked_in",
    "queue_number": 8
  }
}
```

---

## 9. Donation

### 9.1 Record Donation (Staff)
**`POST /donations`** — `Institution Staff`

**Request Body:**
```json
{
  "donor_id": "uuid",
  "booking_id": "uuid",
  "blood_request_id": null,
  "component_type": "whole_blood",
  "volume_ml": 450,
  "donated_at": "2026-07-18T09:30:00Z",
  "hemoglobin": 14.2,
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "weight_at_donation": 70.5,
  "status": "completed",
  "officer_notes": "Proses lancar, tidak ada keluhan"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Donor berhasil dicatat",
  "data": {
    "id": "uuid",
    "status": "completed",
    "points_earned": 50,
    "donor_new_total": 8,
    "donor_next_eligible_date": "2026-09-12",
    "certificate_url": "https://storage.maridonor.id/certificates/uuid.pdf"
  }
}
```

---

### 9.2 Record Deferral (Staff)
**`POST /donations/{id}/defer`** — `Institution Staff`

**Request Body:**
```json
{
  "deferred_reason": "Hemoglobin di bawah batas minimal (11.5 g/dL)",
  "deferral_type": "temporary",
  "deferral_until": "2026-08-18"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Penundaan donor berhasil dicatat",
  "data": {
    "eligibility_status": "temporarily_deferred",
    "deferral_until": "2026-08-18"
  }
}
```

---

### 9.3 Download Certificate
**`GET /donations/{id}/certificate`** — `Donor`

**Response:** File PDF (application/pdf)

---

## 10. Gamification

### 10.1 My Points & Level
**`GET /me/points`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total_points": 450,
    "level": 2,
    "level_name": "Pejuang Darah",
    "next_level": 3,
    "next_level_name": "Pahlawan Darah",
    "donations_for_next_level": 3,
    "point_history": [
      {
        "points": 50,
        "reason": "Donor selesai",
        "earned_at": "2026-07-12T09:30:00Z"
      }
    ]
  }
}
```

---

### 10.2 All Badges
**`GET /badges`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "first_donor",
      "name": "Pendonor Pertama",
      "description": "Selesaikan donor pertama Anda",
      "icon_url": "https://...",
      "criteria_type": "donation_count",
      "points_reward": 100,
      "is_earned": true,
      "earned_at": "2026-01-15T00:00:00Z"
    },
    {
      "id": "uuid",
      "code": "consistent_donor",
      "name": "Donor Konsisten",
      "description": "Donor 3 kali berturut-turut",
      "icon_url": "https://...",
      "criteria_type": "streak",
      "points_reward": 150,
      "is_earned": false,
      "earned_at": null
    }
  ]
}
```

---

### 10.3 Leaderboard
**`GET /leaderboard`** — `Auth`

**Query Params:** `?scope=city&period=monthly&city=Jakarta+Selatan`
> `scope`: `national`, `province`, `city`
> `period`: `monthly`, `yearly`, `all_time`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "scope": "city",
    "city": "Jakarta Selatan",
    "period": "monthly",
    "month": "Juli 2026",
    "my_rank": 12,
    "rankings": [
      {
        "rank": 1,
        "donor_id": "uuid",
        "name": "Budi Santoso",
        "blood_type": "O",
        "rhesus": "negative",
        "total_donations_period": 3,
        "total_points": 850,
        "level": 3,
        "photo_url": "https://..."
      }
    ]
  }
}
```

---

### 10.4 My Referrals
**`GET /me/referrals`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "referral_code": "AGU12B",
    "referral_link": "https://maridonor.id/join?ref=AGU12B",
    "total_referred": 5,
    "total_points_earned": 150,
    "referrals": [
      {
        "name": "Citra Dewi",
        "status": "first_donation_completed",
        "points_awarded": 30,
        "joined_at": "2026-06-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 11. Notification

### 11.1 List Notifications
**`GET /notifications`** — `Auth`

**Query Params:** `?is_read=false&type=blood_request&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "blood_request",
      "title": "Permintaan Darah Darurat!",
      "body": "Golongan darah A+ dibutuhkan di RS Fatmawati. Jarak 5 km dari Anda.",
      "data": {
        "blood_request_id": "uuid",
        "urgency_level": "emergency"
      },
      "is_read": false,
      "created_at": "2026-07-18T06:00:00Z"
    }
  ],
  "meta": {
    "unread_count": 3,
    "...pagination..."
  }
}
```

---

### 11.2 Mark Notification as Read
**`PUT /notifications/{id}/read`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "message": "Notifikasi ditandai sudah dibaca"
}
```

---

### 11.3 Mark All as Read
**`POST /notifications/read-all`** — `Auth`

**Response `200`:**
```json
{
  "success": true,
  "message": "Semua notifikasi ditandai sudah dibaca"
}
```

---

### 11.4 Delete Notification
**`DELETE /notifications/{id}`** — `Auth`

**Response `204`:** *(No Content)*

---

## 12. Content

### 12.1 List Articles
**`GET /articles`** — `Public`

**Query Params:** `?category=benefit&per_page=10&cursor=...`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "5 Manfaat Donor Darah yang Jarang Diketahui",
      "slug": "5-manfaat-donor-darah",
      "excerpt": "Selain menyelamatkan nyawa orang lain...",
      "thumbnail_url": "https://...",
      "category": "benefit",
      "published_at": "2026-07-15T00:00:00Z",
      "view_count": 1245
    }
  ]
}
```

---

### 12.2 Get Article Detail
**`GET /articles/{slug}`** — `Public`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "5 Manfaat Donor Darah yang Jarang Diketahui",
    "slug": "5-manfaat-donor-darah",
    "content": "**Markdown content here...**",
    "thumbnail_url": "https://...",
    "category": "benefit",
    "author": { "name": "Tim MARIDONOR" },
    "published_at": "2026-07-15T00:00:00Z",
    "view_count": 1246
  }
}
```

---

### 12.3 List Announcements
**`GET /announcements`** — `Auth`

**Query Params:** `?type=event&per_page=10`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Donor Darah Massal HUT RI ke-81",
      "content": "Dalam rangka HUT RI...",
      "type": "event",
      "is_pinned": true,
      "institution": {
        "name": "PMI Kota Jakarta Selatan"
      },
      "published_at": "2026-07-17T00:00:00Z",
      "expires_at": "2026-08-17T00:00:00Z"
    }
  ]
}
```

---

### 12.4 List FAQs
**`GET /faqs`** — `Public`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "Berapa lama interval minimal antar donor darah?",
      "answer": "Minimal 56 hari (8 minggu) untuk whole blood...",
      "category": "Kelayakan Donor"
    }
  ]
}
```

---

## 13. Admin

### 13.1 List All Users
**`GET /admin/users`** — `Super Admin`

**Query Params:** `?role=donor&status=active&kyc_level=0&search=agus&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Agus Budi",
      "email": "agus@example.com",
      "phone": "081234567890",
      "role": "donor",
      "status": "active",
      "kyc_level": 1,
      "created_at": "2026-07-01T00:00:00Z"
    }
  ],
  "meta": { "total": 1240, "...pagination..." }
}
```

---

### 13.2 Suspend / Activate User
**`PUT /admin/users/{id}/suspend`** — `Super Admin`

**Request Body:**
```json
{
  "reason": "Melanggar ketentuan penggunaan"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Akun berhasil disuspend. Notifikasi dikirim ke user."
}
```

**`PUT /admin/users/{id}/activate`** — `Super Admin`

**Response `200`:**
```json
{
  "success": true,
  "message": "Akun berhasil diaktifkan kembali."
}
```

---

### 13.3 List Institutions (Admin)
**`GET /admin/institutions`** — `Super Admin`

**Query Params:** `?status=pending&type=pmi&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "PMI Kota Bandung",
      "type": "pmi",
      "status": "pending",
      "city": "Bandung",
      "submitted_at": "2026-07-17T10:00:00Z"
    }
  ]
}
```

---

### 13.4 Approve / Reject Institution
**`PUT /admin/institutions/{id}/approve`** — `Super Admin`

**Request Body:**
```json
{
  "notes": "Dokumen lengkap dan valid"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Institusi berhasil disetujui. Email konfirmasi dikirim."
}
```

**`PUT /admin/institutions/{id}/reject`** — `Super Admin`

**Request Body:**
```json
{
  "reason": "Dokumen izin operasional tidak lengkap"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Institusi ditolak. Email penolakan dikirim."
}
```

---

### 13.5 KYC Review Queue
**`GET /admin/kyc`** — `Super Admin`

**Query Params:** `?status=pending&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "document_id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Agus Budi",
        "current_kyc_level": 0
      },
      "type": "ktp_photo",
      "file_url": "https://storage.maridonor.id/kyc/uuid.jpg",
      "submitted_at": "2026-07-17T14:00:00Z"
    }
  ]
}
```

---

### 13.6 Approve / Reject KYC
**`PUT /admin/kyc/{documentId}/approve`** — `Super Admin`

**Response `200`:**
```json
{
  "success": true,
  "message": "Dokumen KYC disetujui. Level KYC user diperbarui."
}
```

**`PUT /admin/kyc/{documentId}/reject`** — `Super Admin`

**Request Body:**
```json
{
  "reason": "Foto KTP tidak jelas / buram"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Dokumen KYC ditolak. Notifikasi dikirim ke user."
}
```

---

### 13.7 System Configs
**`GET /admin/system-configs`** — `Super Admin`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "key": "donor_search_radius_km",
      "value": 20,
      "description": "Radius default pencarian donor untuk broadcast permintaan darah"
    },
    {
      "key": "emergency_response_minutes",
      "value": 15,
      "description": "Batas waktu notifikasi untuk permintaan emergency"
    },
    {
      "key": "points_config",
      "value": {
        "first_donation": 100,
        "regular_donation": 50,
        "emergency_multiplier": 2,
        "complete_profile": 20,
        "referral_success": 30
      },
      "description": "Konfigurasi poin gamifikasi"
    }
  ]
}
```

**`PUT /admin/system-configs/{key}`** — `Super Admin`

**Request Body:**
```json
{
  "value": 25
}
```

---

### 13.8 Audit Logs
**`GET /admin/audit-logs`** — `Super Admin`

**Query Params:** `?entity_type=blood_stock&action=blood_stock.created&from=2026-07-01&to=2026-07-18&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": { "id": "uuid", "name": "Rina Susanti", "role": "pmi_staff" },
      "action": "blood_stock.created",
      "entity_type": "BloodStock",
      "entity_id": "uuid",
      "new_values": {
        "bag_number": "PMI-2026-A099",
        "blood_type": "A",
        "status": "available"
      },
      "ip_address": "103.xx.xx.xx",
      "created_at": "2026-07-18T09:00:00Z"
    }
  ]
}
```

---

## 14. Dashboard & Analytics

### 14.1 Donor Dashboard
**`GET /dashboard/donor`** — `Donor`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total_donations": 7,
    "lives_helped_estimate": 21,
    "total_volume_ml": 3150,
    "points": 450,
    "level": 2,
    "level_name": "Pejuang Darah",
    "donations_to_next_level": 3,
    "eligibility_status": "eligible",
    "next_eligible_date": null,
    "active_booking": {
      "id": "uuid",
      "institution_name": "PMI Kota Jakarta Selatan",
      "slot_date": "2026-07-25",
      "start_time": "08:00"
    },
    "recent_donations": [ "...last 3 donations..." ],
    "nearby_requests": [ "...max 3 active requests nearby..." ],
    "badges_earned": 4,
    "badges_total": 12
  }
}
```

---

### 14.2 PMI Dashboard
**`GET /dashboard/pmi`** — `PMI Staff`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "institution_id": "uuid",
    "institution_name": "PMI Kota Jakarta Selatan",
    "stock_summary": {
      "total_available_bags": 87,
      "critical_blood_types": ["O_negative", "B_negative"],
      "expiring_within_3_days": 5
    },
    "requests": {
      "open": 3,
      "emergency": 1,
      "fulfilled_today": 2
    },
    "today_schedule": {
      "total_slots": 4,
      "total_capacity": 40,
      "total_booked": 28,
      "checked_in": 15,
      "donated": 12
    },
    "monthly_stats": {
      "total_donations": 312,
      "total_donors": 298,
      "stock_received_ml": 140400,
      "stock_distributed_ml": 123000
    }
  }
}
```

---

### 14.3 Hospital Dashboard
**`GET /dashboard/hospital`** — `RS Staff`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "institution_id": "uuid",
    "institution_name": "RS Fatmawati",
    "stock_summary": {
      "total_available_bags": 23,
      "critical_blood_types": ["AB_negative"],
      "expiring_within_3_days": 2
    },
    "active_requests": 2,
    "monthly_usage": {
      "total_bags_used": 145,
      "total_volume_ml": 65250
    }
  }
}
```

---

### 14.4 Super Admin Dashboard
**`GET /dashboard/admin`** — `Super Admin`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totals": {
      "users": 15420,
      "donors": 12340,
      "pmi_units": 48,
      "hospitals": 215
    },
    "pending_approvals": {
      "institutions": 3,
      "kyc_documents": 47
    },
    "today": {
      "new_users": 124,
      "donations_completed": 892,
      "blood_requests_open": 34,
      "blood_requests_emergency": 5
    },
    "national_stock": {
      "A_positive": "adequate",
      "O_negative": "critical",
      "B_negative": "low"
    }
  }
}
```

---

## 15. WebSocket Channels (Laravel Reverb)

### 15.1 Channel Definitions

| Channel | Type | Subscriber | Event |
|---|---|---|---|
| `user.{userId}` | Private | User ybs | Notifikasi personal |
| `institution.{institutionId}` | Private | Staff institusi | Update stok, permintaan baru |
| `blood-requests.{requestId}` | Private | Pembuat request | Update status, donor merespons |
| `admin.global` | Private | Super Admin | Pendaftaran baru, alert kritis |

---

### 15.2 Event Payloads

**`notification.new`** — Channel: `user.{userId}`
```json
{
  "event": "notification.new",
  "data": {
    "id": "uuid",
    "type": "blood_request",
    "title": "Permintaan Darah Darurat!",
    "body": "Golongan A+ dibutuhkan di RS Fatmawati.",
    "data": { "blood_request_id": "uuid" }
  }
}
```

**`stock.updated`** — Channel: `institution.{institutionId}`
```json
{
  "event": "stock.updated",
  "data": {
    "blood_type": "O",
    "rhesus": "negative",
    "component_type": "whole_blood",
    "available_bags": 2,
    "level": "critical"
  }
}
```

**`request.status.changed`** — Channel: `blood-requests.{requestId}`
```json
{
  "event": "request.status.changed",
  "data": {
    "request_id": "uuid",
    "old_status": "open",
    "new_status": "partially_fulfilled",
    "quantity_fulfilled": 1,
    "quantity_needed": 3
  }
}
```

**`donor.responded`** — Channel: `blood-requests.{requestId}`
```json
{
  "event": "donor.responded",
  "data": {
    "donor_name": "Agus Budi",
    "blood_type": "A",
    "rhesus": "positive",
    "response": "willing"
  }
}
```

---

> [!IMPORTANT]
> **Total Endpoint:** ±83 endpoint di 14 domain.
> Semua endpoint menggunakan prefix `/api/v1`.

> [!NOTE]
> **Open Questions:**
> 1. Apakah perlu endpoint `/auth/social-login` (Google / Apple Sign-in)?
> 2. Apakah laporan (report) export PDF/Excel dihandle via endpoint sinkron atau async job + polling?
> 3. Apakah ada kebutuhan **rate limit khusus** per endpoint (misal: OTP max 3x/jam)?

---

*Dokumen dibuat: 18 Juli 2026*
