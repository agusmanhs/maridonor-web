# Folder Structure — MARIDONOR
## Clean Architecture per Platform

**Versi:** 1.0.0
**Tanggal:** 18 Juli 2026
**Referensi:** SRS & DB Design MARIDONOR v1.0.0

---

## Daftar Isi

1. [Prinsip Arsitektur](#1-prinsip-arsitektur)
2. [Laravel 12 — Backend API](#2-laravel-12--backend-api-maridonor-web-app)
3. [React Native CLI — Mobile App](#3-react-native-cli--mobile-app-maridonorapp)

---

## 1. Prinsip Arsitektur

### Prinsip yang Diterapkan

| Prinsip | Penerapan |
|---|---|
| **Clean Architecture** | Pemisahan layer: Http → Service → Repository → Model |
| **SOLID** | Single Responsibility per class, Dependency Injection, Interface Abstraction |
| **Repository Pattern** | Semua akses database melalui Repository, bukan langsung dari Controller |
| **Service Layer** | Business logic ada di Service, bukan di Controller atau Model |
| **Feature-based Structure** | Folder diorganisir per fitur/domain, bukan per tipe file |
| **Dependency Inversion** | Service dan Repository menggunakan Interface (Contract) |

### Layer Dependency

```
┌─────────────────────────────────────┐
│           HTTP Layer                │  ← Controller, Request, Resource
│     (tidak tahu tentang DB)         │
└──────────────┬──────────────────────┘
               │ depends on
┌──────────────▼──────────────────────┐
│          Service Layer              │  ← Business Logic
│    (tidak tahu tentang HTTP)        │
└──────────────┬──────────────────────┘
               │ depends on
┌──────────────▼──────────────────────┐
│        Repository Layer             │  ← Data Access (via Interface)
│    (tidak tahu tentang Service)     │
└──────────────┬──────────────────────┘
               │ depends on
┌──────────────▼──────────────────────┐
│           Model Layer               │  ← Eloquent ORM
│         (Entitas Data)              │
└─────────────────────────────────────┘
```

---

## 2. Laravel 12 — Backend API (`maridonor-web-app`)

### 2.1 Struktur Folder Lengkap

```
maridonor-web-app/
│
├── app/
│   │
│   ├── Console/
│   │   └── Commands/                    # Artisan custom commands
│   │       ├── CheckExpiredStocks.php
│   │       ├── CheckExpiredRequests.php
│   │       └── SendDonorReminders.php
│   │
│   ├── Enums/                           # PHP 8.1+ Backed Enums
│   │   ├── UserRole.php                 # donor, patient, rs_staff, ...
│   │   ├── UserStatus.php               # active, suspended, deleted
│   │   ├── BloodType.php                # A, B, AB, O
│   │   ├── RhesusType.php               # positive, negative
│   │   ├── BloodComponent.php           # whole_blood, prc, ffp, ...
│   │   ├── UrgencyLevel.php             # emergency, urgent, elective
│   │   ├── RequestStatus.php            # draft, open, fulfilled, ...
│   │   ├── StockStatus.php              # available, reserved, ...
│   │   ├── DonationStatus.php           # scheduled, completed, ...
│   │   ├── BookingStatus.php            # booked, checked_in, ...
│   │   ├── InstitutionType.php          # pmi, hospital
│   │   ├── InstitutionStatus.php        # pending, approved, ...
│   │   ├── EligibilityStatus.php        # eligible, temporarily_deferred, ...
│   │   ├── KycDocumentType.php
│   │   └── NotificationType.php
│   │
│   ├── Events/                          # Laravel Events (domain events)
│   │   ├── Auth/
│   │   │   └── UserRegistered.php
│   │   ├── BloodRequest/
│   │   │   ├── BloodRequestCreated.php
│   │   │   ├── BloodRequestFulfilled.php
│   │   │   └── BloodRequestExpired.php
│   │   ├── Donation/
│   │   │   ├── DonationCompleted.php
│   │   │   └── DonorDeferred.php
│   │   └── Stock/
│   │       ├── StockUpdated.php
│   │       └── StockLevelCritical.php
│   │
│   ├── Exceptions/
│   │   ├── Handler.php
│   │   ├── Auth/
│   │   │   ├── InvalidCredentialsException.php
│   │   │   └── OtpExpiredException.php
│   │   ├── Donor/
│   │   │   └── DonorNotEligibleException.php
│   │   └── Institution/
│   │       └── InstitutionNotApprovedException.php
│   │
│   ├── Http/
│   │   │
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── Auth/
│   │   │           │   ├── AuthController.php
│   │   │           │   ├── OtpController.php
│   │   │           │   └── ProfileController.php
│   │   │           ├── Donor/
│   │   │           │   ├── DonorProfileController.php
│   │   │           │   ├── DonorHistoryController.php
│   │   │           │   ├── DonorCardController.php
│   │   │           │   └── EligibilityController.php
│   │   │           ├── BloodRequest/
│   │   │           │   ├── BloodRequestController.php
│   │   │           │   └── BloodRequestDonorController.php
│   │   │           ├── BloodStock/
│   │   │           │   ├── BloodStockController.php
│   │   │           │   ├── BloodStockPublicController.php
│   │   │           │   └── BloodStockThresholdController.php
│   │   │           ├── Institution/
│   │   │           │   ├── InstitutionController.php
│   │   │           │   └── InstitutionStaffController.php
│   │   │           ├── Schedule/
│   │   │           │   ├── ScheduleSlotController.php
│   │   │           │   └── BookingController.php
│   │   │           ├── Gamification/
│   │   │           │   ├── BadgeController.php
│   │   │           │   ├── LeaderboardController.php
│   │   │           │   └── ReferralController.php
│   │   │           ├── Notification/
│   │   │           │   ├── NotificationController.php
│   │   │           │   └── NotificationPreferenceController.php
│   │   │           ├── Content/
│   │   │           │   ├── ArticleController.php
│   │   │           │   ├── AnnouncementController.php
│   │   │           │   └── FaqController.php
│   │   │           └── Admin/
│   │   │               ├── AdminUserController.php
│   │   │               ├── AdminInstitutionController.php
│   │   │               ├── AdminKycController.php
│   │   │               ├── SystemConfigController.php
│   │   │               └── AuditLogController.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── EnsureUserIsActive.php
│   │   │   ├── EnsureInstitutionIsApproved.php
│   │   │   ├── CheckKycLevel.php
│   │   │   └── RoleMiddleware.php
│   │   │
│   │   ├── Requests/                    # Form Request Validation
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── VerifyOtpRequest.php
│   │   │   ├── Donor/
│   │   │   │   ├── UpdateDonorProfileRequest.php
│   │   │   │   └── UpdateHealthNotesRequest.php
│   │   │   ├── BloodRequest/
│   │   │   │   ├── CreateBloodRequestRequest.php
│   │   │   │   └── RespondBloodRequestRequest.php
│   │   │   ├── BloodStock/
│   │   │   │   ├── CreateBloodStockRequest.php
│   │   │   │   └── UpdateBloodStockStatusRequest.php
│   │   │   ├── Institution/
│   │   │   │   └── RegisterInstitutionRequest.php
│   │   │   └── Schedule/
│   │   │       ├── CreateScheduleSlotRequest.php
│   │   │       └── CreateBookingRequest.php
│   │   │
│   │   └── Resources/                  # API Response Transformation
│   │       ├── Auth/
│   │       │   └── UserResource.php
│   │       ├── Donor/
│   │       │   ├── DonorProfileResource.php
│   │       │   ├── DonorHistoryResource.php
│   │       │   └── DonationResource.php
│   │       ├── BloodRequest/
│   │       │   ├── BloodRequestResource.php
│   │       │   └── BloodRequestCollection.php
│   │       ├── BloodStock/
│   │       │   ├── BloodStockResource.php
│   │       │   └── StockSummaryResource.php
│   │       ├── Institution/
│   │       │   └── InstitutionResource.php
│   │       ├── Schedule/
│   │       │   ├── ScheduleSlotResource.php
│   │       │   └── BookingResource.php
│   │       └── Gamification/
│   │           ├── BadgeResource.php
│   │           └── LeaderboardResource.php
│   │
│   ├── Jobs/                            # Queue Jobs
│   │   ├── BloodRequest/
│   │   │   ├── BroadcastBloodRequestToNearbyDonors.php
│   │   │   └── ExpireBloodRequest.php
│   │   ├── Notification/
│   │   │   ├── SendPushNotification.php
│   │   │   └── SendSmsNotification.php
│   │   ├── Stock/
│   │   │   └── AlertLowBloodStock.php
│   │   └── Gamification/
│   │       ├── AwardPoints.php
│   │       └── CheckAndAwardBadges.php
│   │
│   ├── Listeners/                       # Event Listeners
│   │   ├── BloodRequest/
│   │   │   ├── BroadcastToNearbyDonors.php
│   │   │   └── NotifyRequesterOnFulfilled.php
│   │   ├── Donation/
│   │   │   ├── UpdateDonorEligibility.php
│   │   │   ├── AwardDonationPoints.php
│   │   │   └── GenerateDonationCertificate.php
│   │   └── Stock/
│   │       └── CheckStockThreshold.php
│   │
│   ├── Models/                          # Eloquent Models
│   │   ├── User.php
│   │   ├── Address.php
│   │   ├── DonorProfile.php
│   │   ├── KycDocument.php
│   │   ├── OtpCode.php
│   │   ├── NotificationPreference.php
│   │   ├── Notification.php
│   │   ├── Institution.php
│   │   ├── InstitutionStaff.php
│   │   ├── BloodStock.php
│   │   ├── BloodStockThreshold.php
│   │   ├── BloodRequest.php
│   │   ├── BloodRequestDonor.php
│   │   ├── Donation.php
│   │   ├── ScheduleSlot.php
│   │   ├── Booking.php
│   │   ├── Badge.php
│   │   ├── UserBadge.php
│   │   ├── Referral.php
│   │   ├── Article.php
│   │   ├── Announcement.php
│   │   ├── Faq.php
│   │   ├── AuditLog.php
│   │   └── SystemConfig.php
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   ├── RouteServiceProvider.php
│   │   └── RepositoryServiceProvider.php   # Bind Interface → Implementation
│   │
│   ├── Repositories/
│   │   ├── Contracts/                       # Interfaces
│   │   │   ├── UserRepositoryInterface.php
│   │   │   ├── DonorProfileRepositoryInterface.php
│   │   │   ├── BloodRequestRepositoryInterface.php
│   │   │   ├── BloodStockRepositoryInterface.php
│   │   │   ├── InstitutionRepositoryInterface.php
│   │   │   ├── DonationRepositoryInterface.php
│   │   │   ├── ScheduleSlotRepositoryInterface.php
│   │   │   ├── BookingRepositoryInterface.php
│   │   │   └── NotificationRepositoryInterface.php
│   │   │
│   │   └── Eloquent/                        # Implementations
│   │       ├── UserRepository.php
│   │       ├── DonorProfileRepository.php
│   │       ├── BloodRequestRepository.php
│   │       ├── BloodStockRepository.php
│   │       ├── InstitutionRepository.php
│   │       ├── DonationRepository.php
│   │       ├── ScheduleSlotRepository.php
│   │       ├── BookingRepository.php
│   │       └── NotificationRepository.php
│   │
│   ├── Services/                            # Business Logic
│   │   ├── Auth/
│   │   │   ├── AuthService.php
│   │   │   ├── OtpService.php
│   │   │   └── KycService.php
│   │   ├── Donor/
│   │   │   ├── DonorService.php
│   │   │   ├── EligibilityService.php       # Cek kelayakan donor
│   │   │   └── DonorCardService.php         # Generate kartu donor + QR
│   │   ├── BloodRequest/
│   │   │   ├── BloodRequestService.php
│   │   │   └── DonorMatchingService.php     # Algoritma matching donor
│   │   ├── BloodStock/
│   │   │   ├── BloodStockService.php
│   │   │   └── StockAlertService.php
│   │   ├── Institution/
│   │   │   ├── InstitutionService.php
│   │   │   └── InstitutionApprovalService.php
│   │   ├── Donation/
│   │   │   ├── DonationService.php
│   │   │   └── CertificateService.php       # Generate PDF sertifikat
│   │   ├── Schedule/
│   │   │   ├── ScheduleService.php
│   │   │   └── BookingService.php
│   │   ├── Gamification/
│   │   │   ├── PointsService.php
│   │   │   ├── BadgeService.php
│   │   │   └── LeaderboardService.php
│   │   ├── Notification/
│   │   │   ├── NotificationService.php
│   │   │   ├── PushNotificationService.php  # FCM
│   │   │   ├── SmsService.php               # SMS Gateway
│   │   │   └── EmailService.php
│   │   ├── Location/
│   │   │   ├── GeolocationService.php
│   │   │   └── RadiusSearchService.php      # Haversine / PostGIS
│   │   └── Audit/
│   │       └── AuditLogService.php
│   │
│   └── Traits/
│       ├── HasUuid.php                      # Auto-generate UUID
│       ├── HasAuditLog.php                  # Auto-log perubahan model
│       └── HasSoftDelete.php
│
├── bootstrap/
│   └── app.php
│
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── broadcasting.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── mail.php
│   ├── queue.php
│   ├── reverb.php
│   ├── sanctum.php
│   └── maridonor.php                        # Custom app config
│
├── database/
│   ├── factories/
│   │   ├── UserFactory.php
│   │   ├── DonorProfileFactory.php
│   │   ├── InstitutionFactory.php
│   │   ├── BloodRequestFactory.php
│   │   └── BloodStockFactory.php
│   │
│   ├── migrations/                          # Urutan sesuai dependency
│   │   ├── 0001_create_addresses_table.php
│   │   ├── 0002_create_users_table.php
│   │   ├── 0003_create_donor_profiles_table.php
│   │   ├── 0004_create_kyc_documents_table.php
│   │   ├── 0005_create_otp_codes_table.php
│   │   ├── 0006_create_notification_preferences_table.php
│   │   ├── 0007_create_notifications_table.php
│   │   ├── 0008_create_institutions_table.php
│   │   ├── 0009_create_institution_staff_table.php
│   │   ├── 0010_create_blood_stocks_table.php
│   │   ├── 0011_create_blood_stock_thresholds_table.php
│   │   ├── 0012_create_blood_requests_table.php
│   │   ├── 0013_create_blood_request_donors_table.php
│   │   ├── 0014_create_schedule_slots_table.php
│   │   ├── 0015_create_bookings_table.php
│   │   ├── 0016_create_donations_table.php
│   │   ├── 0017_create_badges_table.php
│   │   ├── 0018_create_user_badges_table.php
│   │   ├── 0019_create_referrals_table.php
│   │   ├── 0020_create_articles_table.php
│   │   ├── 0021_create_announcements_table.php
│   │   ├── 0022_create_faqs_table.php
│   │   ├── 0023_create_audit_logs_table.php
│   │   └── 0024_create_system_configs_table.php
│   │
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php                   # Super Admin default
│       ├── InstitutionSeeder.php            # PMI & RS sample
│       ├── BloodStockThresholdSeeder.php
│       ├── BadgeSeeder.php
│       ├── FaqSeeder.php
│       └── SystemConfigSeeder.php
│
├── routes/
│   ├── api.php                              # Semua route API
│   ├── channels.php                         # Reverb WebSocket channels
│   ├── console.php                          # Artisan scheduled commands
│   └── web.php                              # Minimal (hanya health check)
│
├── storage/
│   ├── app/
│   │   ├── public/
│   │   │   ├── avatars/
│   │   │   ├── kyc-documents/
│   │   │   └── certificates/
│   │   └── private/
│   └── logs/
│
├── tests/
│   ├── Feature/                             # Integration Tests
│   │   ├── Auth/
│   │   │   ├── RegisterTest.php
│   │   │   ├── LoginTest.php
│   │   │   └── OtpTest.php
│   │   ├── Donor/
│   │   │   ├── DonorProfileTest.php
│   │   │   └── EligibilityTest.php
│   │   ├── BloodRequest/
│   │   │   ├── CreateBloodRequestTest.php
│   │   │   └── RespondBloodRequestTest.php
│   │   ├── BloodStock/
│   │   │   └── BloodStockManagementTest.php
│   │   └── Gamification/
│   │       └── PointsAndBadgesTest.php
│   │
│   └── Unit/                               # Unit Tests
│       ├── Services/
│       │   ├── EligibilityServiceTest.php
│       │   ├── DonorMatchingServiceTest.php
│       │   ├── PointsServiceTest.php
│       │   └── StockAlertServiceTest.php
│       └── Enums/
│           └── BloodCompatibilityTest.php
│
├── .env.example
├── .gitignore
├── artisan
├── composer.json
└── phpunit.xml
```

---

### 2.2 Penjelasan Layer Laravel

| Folder | Tanggung Jawab | Aturan |
|---|---|---|
| `Http/Controllers/` | Menerima request, memanggil Service, mengembalikan Resource | Tidak boleh ada business logic |
| `Http/Requests/` | Validasi input dari client | Hanya validasi, tidak ada logic |
| `Http/Resources/` | Transformasi response API (JSON) | Tidak ada logic, hanya mapping |
| `Http/Middleware/` | Gate checking (auth, role, status) | Hanya cek izin, tidak ada logic |
| `Services/` | Business logic dan orchestration | Tidak boleh langsung akses DB |
| `Repositories/Contracts/` | Interface untuk data access | Hanya definisi method |
| `Repositories/Eloquent/` | Implementasi query DB | Hanya query, tidak ada business logic |
| `Models/` | Definisi entitas, relasi, cast | Tidak ada business logic |
| `Enums/` | Konstanta yang type-safe | Pure enum, tanpa logic |
| `Events/ & Listeners/` | Side effects (decouple) | Async via Queue |
| `Jobs/` | Proses background | Idempotent, retryable |

---

## 3. React Native CLI — Mobile App (`maridonorApp`)

### 3.1 Struktur Folder Lengkap

```
maridonorApp/
│
├── android/                             # Android native project
├── ios/                                 # iOS native project
│
├── src/
│   │
│   ├── app/                             # App-level setup
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx        # Top-level navigator
│   │   │   ├── AuthNavigator.tsx        # Stack untuk unauthenticated
│   │   │   ├── MainNavigator.tsx        # Tab Navigator (authenticated)
│   │   │   ├── DonorStackNavigator.tsx
│   │   │   ├── RequestStackNavigator.tsx
│   │   │   └── types.ts                 # Navigation types & param list
│   │   │
│   │   ├── store/                       # Global state (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── locationStore.ts
│   │   │   └── notificationStore.ts
│   │   │
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx        # TanStack Query setup
│   │   │   └── ThemeProvider.tsx        # Dark/Light mode
│   │   │
│   │   └── App.tsx                      # Entry point
│   │
│   ├── features/                        # Fitur per domain (feature-based)
│   │   │
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── OnboardingScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   ├── OtpVerificationScreen.tsx
│   │   │   │   └── ForgotPasswordScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── OtpInput.tsx
│   │   │   │   └── SocialLoginButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── useOtpVerify.ts
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── screens/
│   │   │   │   └── DashboardScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── DonorSummaryCard.tsx      # Total donor, poin, level
│   │   │   │   ├── NextEligibleBanner.tsx    # Countdown next eligible
│   │   │   │   ├── ActiveRequestBanner.tsx   # Permintaan darah aktif
│   │   │   │   ├── NearbyPMICard.tsx
│   │   │   │   └── QuickActionButtons.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboard.ts
│   │   │   └── api/
│   │   │       └── dashboardApi.ts
│   │   │
│   │   ├── donor/
│   │   │   ├── screens/
│   │   │   │   ├── DonorHistoryScreen.tsx
│   │   │   │   ├── DonorHistoryDetailScreen.tsx
│   │   │   │   ├── DonorCardScreen.tsx       # Kartu donor digital + QR
│   │   │   │   └── EligibilityStatusScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── DonorCard.tsx             # Kartu visual donor
│   │   │   │   ├── DonationHistoryItem.tsx
│   │   │   │   ├── EligibilityBadge.tsx
│   │   │   │   └── CertificateDownloadButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDonorHistory.ts
│   │   │   │   └── useDonorCard.ts
│   │   │   └── api/
│   │   │       └── donorApi.ts
│   │   │
│   │   ├── blood-request/
│   │   │   ├── screens/
│   │   │   │   ├── BloodRequestListScreen.tsx    # Daftar permintaan aktif
│   │   │   │   ├── BloodRequestDetailScreen.tsx  # Detail permintaan
│   │   │   │   ├── CreateBloodRequestScreen.tsx  # Buat permintaan
│   │   │   │   └── MyRequestsScreen.tsx          # Permintaan yang saya buat
│   │   │   ├── components/
│   │   │   │   ├── BloodRequestCard.tsx
│   │   │   │   ├── UrgencyBadge.tsx
│   │   │   │   ├── BloodTypeSelector.tsx
│   │   │   │   ├── ComponentTypeSelector.tsx
│   │   │   │   └── RequestStatusTracker.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBloodRequests.ts
│   │   │   │   ├── useCreateRequest.ts
│   │   │   │   └── useRespondToRequest.ts
│   │   │   └── api/
│   │   │       └── bloodRequestApi.ts
│   │   │
│   │   ├── schedule/
│   │   │   ├── screens/
│   │   │   │   ├── ScheduleListScreen.tsx     # Jadwal di PMI/RS terdekat
│   │   │   │   ├── BookingScreen.tsx          # Pilih slot
│   │   │   │   ├── BookingConfirmScreen.tsx
│   │   │   │   └── MyBookingsScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ScheduleSlotCard.tsx
│   │   │   │   ├── BookingQrCode.tsx
│   │   │   │   └── TimeSlotPicker.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useScheduleSlots.ts
│   │   │   │   └── useBooking.ts
│   │   │   └── api/
│   │   │       └── scheduleApi.ts
│   │   │
│   │   ├── map/
│   │   │   ├── screens/
│   │   │   │   └── NearbyFacilitiesScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── FacilityMap.tsx            # Map view
│   │   │   │   ├── FacilityMarker.tsx
│   │   │   │   ├── FacilityBottomSheet.tsx    # Detail saat marker diklik
│   │   │   │   └── StockLevelIndicator.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useNearbyFacilities.ts
│   │   │   │   └── useUserLocation.ts
│   │   │   └── api/
│   │   │       └── locationApi.ts
│   │   │
│   │   ├── notification/
│   │   │   ├── screens/
│   │   │   │   ├── NotificationListScreen.tsx
│   │   │   │   └── NotificationDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   └── NotificationItem.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useNotifications.ts
│   │   │   └── api/
│   │   │       └── notificationApi.ts
│   │   │
│   │   ├── gamification/
│   │   │   ├── screens/
│   │   │   │   ├── GameProfileScreen.tsx      # Level, poin, progress
│   │   │   │   ├── BadgesScreen.tsx
│   │   │   │   ├── LeaderboardScreen.tsx
│   │   │   │   └── ReferralScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── LevelProgressBar.tsx
│   │   │   │   ├── BadgeGrid.tsx
│   │   │   │   ├── BadgeCard.tsx              # Diraih vs belum
│   │   │   │   ├── LeaderboardItem.tsx
│   │   │   │   └── ReferralShareCard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBadges.ts
│   │   │   │   └── useLeaderboard.ts
│   │   │   └── api/
│   │   │       └── gamificationApi.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── screens/
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── EditProfileScreen.tsx
│   │   │   │   ├── EditHealthNotesScreen.tsx
│   │   │   │   ├── KycUploadScreen.tsx
│   │   │   │   ├── NotificationPreferenceScreen.tsx
│   │   │   │   └── SettingsScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── ProfileMenuItem.tsx
│   │   │   │   └── KycStatusBanner.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProfile.ts
│   │   │   └── api/
│   │   │       └── profileApi.ts
│   │   │
│   │   └── content/
│   │       ├── screens/
│   │       │   ├── ArticleListScreen.tsx
│   │       │   ├── ArticleDetailScreen.tsx
│   │       │   ├── AnnouncementListScreen.tsx
│   │       │   └── FaqScreen.tsx
│   │       ├── components/
│   │       │   ├── ArticleCard.tsx
│   │       │   └── FaqAccordion.tsx
│   │       └── api/
│   │           └── contentApi.ts
│   │
│   ├── shared/                              # Shared across all features
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                          # Reusable atomic components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── TextArea.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Skeleton.tsx             # Loading skeleton
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── ErrorState.tsx
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── ScreenWrapper.tsx        # Safe area + status bar
│   │   │       ├── Header.tsx
│   │   │       └── TabBar.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useRefreshOnFocus.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── bloodCompatibility.ts        # Tabel kompatibilitas gol. darah
│   │   │   ├── eligibilityCalculator.ts     # Hitung next_eligible_date
│   │   │   ├── dateFormatter.ts
│   │   │   ├── distanceFormatter.ts
│   │   │   └── pointsCalculator.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── bloodTypes.ts
│   │   │   ├── bloodComponents.ts
│   │   │   ├── urgencyLevels.ts
│   │   │   └── appConfig.ts
│   │   │
│   │   └── types/
│   │       ├── api.types.ts                 # Generic API response types
│   │       ├── user.types.ts
│   │       ├── donor.types.ts
│   │       ├── bloodRequest.types.ts
│   │       ├── bloodStock.types.ts
│   │       ├── institution.types.ts
│   │       └── gamification.types.ts
│   │
│   └── lib/                                 # External library wrappers
│       ├── api/
│       │   ├── client.ts                    # Axios instance + interceptors
│       │   ├── endpoints.ts                 # API endpoint constants
│       │   └── queryKeys.ts                 # TanStack Query key factory
│       │
│       ├── storage/
│       │   ├── secureStorage.ts             # React Native Keychain (token)
│       │   └── asyncStorage.ts              # AsyncStorage (preferences)
│       │
│       └── notifications/
│           ├── fcmHandler.ts                # Firebase push notification
│           └── notificationPermission.ts
│
├── __tests__/                               # Jest tests
│   ├── utils/
│   │   ├── bloodCompatibility.test.ts
│   │   └── eligibilityCalculator.test.ts
│   └── components/
│       └── Button.test.tsx
│
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── babel.config.js
├── jest.config.js
├── metro.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

### 3.2 Penjelasan Layer React Native

| Folder | Tanggung Jawab | Aturan |
|---|---|---|
| `features/[nama]/screens/` | Halaman/screen untuk fitur tersebut | Gunakan hooks, jangan logika langsung |
| `features/[nama]/components/` | Komponen khusus fitur ini | Tidak boleh dipakai di fitur lain |
| `features/[nama]/hooks/` | Custom hooks dengan TanStack Query | Satu hook per use case |
| `features/[nama]/api/` | Fungsi pemanggil API | Hanya HTTP calls, tanpa state |
| `features/[nama]/types.ts` | TypeScript types untuk fitur ini | Local types yang tidak shared |
| `shared/components/ui/` | Komponen atomic yang reusable | Tidak ada business logic |
| `shared/utils/` | Pure utility functions | Harus testable, tanpa side effects |
| `shared/types/` | TypeScript types yang dipakai banyak fitur | Model types dari API response |
| `lib/api/client.ts` | Axios instance dengan interceptor | Auth token injection, error handling |
| `app/store/` | Global state (Zustand) | Hanya state yang truly global |

---

## Ringkasan

```
maridonorMD/                   ← Dokumentasi (SRS, ERD, Flow, dll)
│
maridonor-web-app/             ← Laravel 12 Backend API
├── 10 Domain Features
├── 4 Layers (Http, Service, Repository, Model)
├── 24 Migration files
└── Clean Architecture pattern
│
maridonorApp/                  ← React Native Mobile App
├── 9 Feature modules
├── Feature-based folder structure
├── Shared components & utils
└── Typed API client
```

> [!NOTE]
> **Catatan:** Frontend Web (React 19 + Vite + TailwindCSS) belum dialokasikan ke folder. Apakah akan dibuat repository terpisah, atau digabung di dalam `maridonor-web-app` bersama Laravel?

---

*Dokumen dibuat: 18 Juli 2026*
