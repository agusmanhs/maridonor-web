# Definition of Done — MARIDONOR
## Checklist Sebelum Fitur Dinyatakan Selesai

**Versi:** 1.0.0
**Berlaku untuk:** Backend (Laravel 12) & Mobile (React Native)

> [!IMPORTANT]
> Sebuah fitur **belum selesai** sampai **semua** kriteria di bawah terpenuhi.
> Tidak ada pengecualian kecuali ada persetujuan eksplisit dari lead developer.

---

## Daftar Isi

1. [Migration](#1--migration)
2. [Model](#2--model)
3. [Controller](#3--controller)
4. [Service](#4--service)
5. [Repository](#5--repository)
6. [Validation](#6--validation)
7. [API Resource](#7--api-resource)
8. [Test](#8--test)
9. [Documentation](#9--documentation)
10. [UI](#10--ui)
11. [Responsive](#11--responsive)
12. [Dark Mode](#12--dark-mode)
13. [Error Handling](#13--error-handling)
14. [Quick Reference Checklist](#14-quick-reference-checklist)

---

## 1. ✅ Migration

Semua perubahan skema database harus melalui file migration. **Tidak boleh ada perubahan langsung ke database production.**

### Checklist
- [ ] Naming: `YYYY_MM_DD_HHMMSS_create_{table}_table.php`
- [ ] Primary key menggunakan UUID: `$table->uuid('id')->primary()`
- [ ] Semua tabel memiliki `$table->timestamps()`
- [ ] Tabel soft-deletable memiliki `$table->softDeletes()`
- [ ] Enum menggunakan `VARCHAR` + `CHECK` constraint (bukan PostgreSQL native ENUM)
- [ ] Foreign key dengan `constrained()->onDelete('restrict')` secara default
- [ ] Index didefinisikan untuk kolom yang sering di-query
- [ ] Kolom nullable eksplisit dengan `->nullable()`
- [ ] Default value didefinisikan dengan `->default(...)`
- [ ] `down()` benar-benar membalik `up()` (rollback aman)
- [ ] `php artisan migrate` berhasil ✓
- [ ] `php artisan migrate:rollback` berhasil ✓

### Contoh
```php
// ✅ BENAR
$table->uuid('id')->primary();
$table->string('status', 20)->default('active');
$table->string('blood_type', 5)->nullable();
$table->index(['blood_type', 'rhesus']);

// ❌ SALAH
$table->id();                                    // auto-increment
$table->enum('status', ['active', 'inactive']);  // native enum
```

---

## 2. ✅ Model

Model adalah representasi entitas. **Tidak boleh ada business logic di dalam model.**

### Checklist
- [ ] Menggunakan trait `HasUuid` (auto-generate UUID)
- [ ] `$fillable` didefinisikan — bukan `$guarded = []`
- [ ] Kolom sensitif (`nik`, `health_notes`) menggunakan enkripsi custom cast
- [ ] Semua enum di-cast: `'role' => UserRole::class`
- [ ] Boolean di-cast: `'is_active' => 'boolean'`
- [ ] Timestamp di-cast: `'expires_at' => 'datetime'`
- [ ] JSON/JSONB di-cast: `'operational_hours' => 'array'`
- [ ] Semua relasi didefinisikan dengan return type yang tepat
- [ ] Soft delete menggunakan `SoftDeletes` trait
- [ ] Menggunakan `HasAuditLog` trait untuk entitas kritis
- [ ] Tidak ada query langsung atau business logic di model

---

## 3. ✅ Controller

Controller hanya berperan sebagai orchestrator. **Tidak ada business logic di controller.**

### Checklist
- [ ] Berada di `app/Http/Controllers/Api/V1/{Domain}/`
- [ ] Setiap method **maksimal 10 baris**
- [ ] Tidak memanggil Model secara langsung — harus via Service
- [ ] Mengembalikan `JsonResponse` dengan tipe return eksplisit
- [ ] Response menggunakan API Resource
- [ ] HTTP status code sesuai konvensi (201 create, 204 delete, dll)
- [ ] Middleware yang tepat diterapkan di route
- [ ] Dependency Injection via constructor

### Contoh
```php
// ✅ BENAR
public function store(CreateBloodRequestRequest $request): JsonResponse
{
    $result = $this->bloodRequestService->create(
        $request->user(),
        $request->validated()
    );

    return response()->json([
        'success' => true,
        'message' => 'Permintaan darah berhasil dibuat',
        'data'    => new BloodRequestResource($result),
    ], 201);
}
```

---

## 4. ✅ Service

Service adalah **rumah business logic**. Semua aturan bisnis ada di sini.

### Checklist
- [ ] Berada di `app/Services/{Domain}/`
- [ ] Menggunakan Dependency Injection — bukan `new Repository()` di method
- [ ] Hanya berinteraksi melalui Repository Interface
- [ ] Setiap method memiliki satu tanggung jawab (SRP)
- [ ] Exception custom dilempar untuk kondisi bisnis yang gagal
- [ ] Side effects dikirim via Event/Job — bukan langsung di Service
- [ ] Atomicity dibungkus `DB::transaction()`
- [ ] Return type eksplisit (DTO atau Model)
- [ ] Tidak ada HTTP-specific code (`request()`, `response()`)

### Contoh
```php
// ✅ BENAR
public function create(User $requester, array $data): BloodRequest
{
    return DB::transaction(function () use ($requester, $data) {
        $request = $this->bloodRequestRepo->create([
            ...$data,
            'requester_id' => $requester->id,
            'deadline_at'  => $this->calculateDeadline($data['urgency_level']),
        ]);

        event(new BloodRequestCreated($request));

        return $request;
    });
}
```

---

## 5. ✅ Repository

Repository memisahkan akses data dari business logic. **Semua query melalui repository.**

### Checklist
- [ ] Interface di `app/Repositories/Contracts/{Name}RepositoryInterface.php`
- [ ] Implementasi di `app/Repositories/Eloquent/{Name}Repository.php`
- [ ] Interface di-binding di `RepositoryServiceProvider`
- [ ] Hanya berisi method akses data — tidak ada business logic
- [ ] Method diberi nama deskriptif: `findNearbyEligibleDonors()`
- [ ] Eager loading relasi untuk mencegah N+1 problem
- [ ] List menggunakan `cursorPaginate()` bukan `paginate()`
- [ ] Tidak ada raw SQL kecuali benar-benar perlu

### Contoh
```php
// Interface
interface BloodRequestRepositoryInterface
{
    public function findOpenByBloodType(string $type, string $rhesus): Collection;
    public function create(array $data): BloodRequest;
}

// Implementasi
public function findOpenByBloodType(string $type, string $rhesus): Collection
{
    return BloodRequest::with(['destinationHospital', 'requester'])
        ->where('blood_type', $type)
        ->where('status', RequestStatus::Open)
        ->where('deadline_at', '>', now())
        ->latest()->get();
}
```

---

## 6. ✅ Validation

**Tidak ada validasi di controller, service, atau model.**

### Checklist
- [ ] Menggunakan `FormRequest` — bukan `$request->validate()` di controller
- [ ] Berada di `app/Http/Requests/{Domain}/{Action}Request.php`
- [ ] `authorize()` berisi logika otorisasi yang tepat
- [ ] Nilai enum divalidasi: `Rule::enum(BloodType::class)`
- [ ] Pesan error dalam **Bahasa Indonesia** yang ramah
- [ ] Phone number: `regex:/^(08|62)\d{8,11}$/`
- [ ] NIK: `digits:16`
- [ ] Upload file: `mimes`, `max` size
- [ ] Logic validasi reusable dibuat sebagai `Rule` class

### Contoh
```php
public function rules(): array
{
    return [
        'blood_type'      => ['required', Rule::enum(BloodType::class)],
        'quantity_needed' => ['required', 'integer', 'min:1', 'max:20'],
        'contact_phone'   => ['required', 'regex:/^(08|62)\d{8,11}$/'],
    ];
}

public function messages(): array
{
    return [
        'quantity_needed.max'  => 'Jumlah kantong maksimal 20 per permintaan.',
        'contact_phone.regex'  => 'Format nomor HP tidak valid.',
    ];
}
```

---

## 7. ✅ API Resource

**Tidak ada `$model->toArray()` atau array manual di controller.**

### Checklist
- [ ] Berada di `app/Http/Resources/{Domain}/{Name}Resource.php`
- [ ] Collection resource: `{Name}Collection.php`
- [ ] Field sensitif **tidak** diekspos (password, `nik_encrypted`)
- [ ] NIK dimask: `3271****0001`
- [ ] Nested resource menggunakan Resource lain
- [ ] Nullable field menggunakan `$this->when()` atau `$this->whenLoaded()`
- [ ] Timestamp: ISO 8601 (`2026-07-18T09:00:00Z`)
- [ ] Tanggal: `Y-m-d` format
- [ ] Nama field konsisten dengan `API_CONTRACT_MARIDONOR.md`
- [ ] Tidak ada business logic di Resource

### Contoh
```php
public function toArray(Request $request): array
{
    return [
        'id'                   => $this->id,
        'blood_type'           => $this->blood_type,
        'deadline_at'          => $this->deadline_at?->toISOString(),
        'destination_hospital' => new InstitutionResource(
            $this->whenLoaded('destinationHospital')
        ),
        'my_response'          => $this->when(
            $request->user()?->isDonor(),
            fn() => $this->myResponse?->response
        ),
        'created_at'           => $this->created_at->toISOString(),
    ];
}
```

---

## 8. ✅ Test

**Setiap fitur harus memiliki test yang memverifikasi behavior, bukan implementasi.**

### Checklist

**Feature Test:**
- [ ] Happy path (skenario berhasil)
- [ ] Setiap skenario error yang relevan
- [ ] Test autentikasi: tanpa token → `401`
- [ ] Test otorisasi: role salah → `403`
- [ ] Test validasi: input invalid → `422` dengan pesan error benar
- [ ] Database assertion: data tersimpan/berubah di DB
- [ ] Event/Job assertion jika ada dispatch
- [ ] Minimal **3 test case** per endpoint

**Unit Test:**
- [ ] Service method ditest dengan mock Repository
- [ ] Utility: `EligibilityService`, `PointsService`, dll

**Coverage:**
- [ ] Minimum **70% coverage** untuk Service layer
- [ ] Semua endpoint di API Contract punya minimal 1 feature test

### Contoh
```php
public function test_donor_can_create_blood_request(): void
{
    $donor = User::factory()->donor()->kyc1()->create();

    $this->actingAs($donor)
        ->postJson('/api/v1/blood-requests', [...valid data...])
        ->assertStatus(201)
        ->assertJsonPath('success', true);

    $this->assertDatabaseHas('blood_requests', [
        'requester_id' => $donor->id,
        'status'       => 'open',
    ]);

    Event::assertDispatched(BloodRequestCreated::class);
}

public function test_kyc_level_0_donor_cannot_create_request(): void
{
    $donor = User::factory()->donor()->kyc0()->create();

    $this->actingAs($donor)
        ->postJson('/api/v1/blood-requests', [...])
        ->assertStatus(403);
}
```

---

## 9. ✅ Documentation

**Code yang tidak terdokumentasi adalah technical debt.**

### Checklist

**Backend:**
- [ ] Setiap Service method: PHPDoc dengan `@param`, `@return`, `@throws`
- [ ] Repository method: minimal satu baris deskripsi
- [ ] Custom exception: deskripsi kapan dilempar
- [ ] Business logic kompleks: komentar `// Alasan: ...`

**API:**
- [ ] Endpoint baru ditambahkan ke `API_CONTRACT_MARIDONOR.md`
- [ ] Request/response schema diperbarui jika ada perubahan
- [ ] Breaking change dinotasikan: `⚠️ BREAKING CHANGE`

**Struktur:**
- [ ] File ditempatkan sesuai `FOLDER_STRUCTURE_MARIDONOR.md`
- [ ] Tidak ada file "orphan" di luar struktur yang disepakati

---

## 10. ✅ UI

**Semua layar mengikuti design system yang disepakati.**

### Checklist

**Komponen:**
- [ ] Menggunakan `shared/components/ui/` — tidak ada custom ad-hoc
- [ ] Tidak ada warna, font, spacing hardcoded — gunakan design tokens
- [ ] Loading state: `Skeleton` component
- [ ] Empty state: `EmptyState` component
- [ ] Error state: `ErrorState` component dengan tombol retry

**Aksesibilitas:**
- [ ] Touch target minimal **44×44 dp**
- [ ] Semua gambar memiliki `accessibilityLabel`
- [ ] Animasi menggunakan `react-native-reanimated`

**Konsistensi:**
- [ ] Warna CTA utama: merah MARIDONOR `#E63946`
- [ ] Indikator stok: merah=kritis, kuning=rendah, hijau=aman
- [ ] Format golongan darah tampil: `A+`, `O-` (bukan `A_positive`)
- [ ] Format tanggal tampil: `18 Juli 2026`

---

## 11. ✅ Responsive

**Semua layar berfungsi baik di berbagai ukuran perangkat.**

### Device Coverage
- [ ] Layar kecil: **360×640 dp** (Redmi 9A — target utama user Indonesia)
- [ ] Layar medium: **390×844 dp** (iPhone 14)
- [ ] Layar besar: **430×932 dp** (iPhone 14 Plus)

### Implementasi
- [ ] Tidak ada `width`/`height` hardcoded — gunakan `flex` atau `%`
- [ ] Teks tidak terpotong di layar kecil
- [ ] Scroll berfungsi jika konten melebihi layar (`ScrollView`/`FlatList`)
- [ ] Keyboard tidak menutupi input (`KeyboardAvoidingView`)
- [ ] Safe area ditangani: `useSafeAreaInsets()`
- [ ] Notch dan Dynamic Island tidak menutupi konten
- [ ] Bottom navigation tidak tertutupi gesture bar

---

## 12. ✅ Dark Mode

**Tidak boleh ada warna hardcoded yang hanya baik di satu mode.**

### Token Warna

| Token | Light | Dark |
|---|---|---|
| `background` | `#FFFFFF` | `#121212` |
| `surface` | `#F5F5F5` | `#1E1E1E` |
| `text.primary` | `#1A1A1A` | `#FFFFFF` |
| `text.secondary` | `#6B7280` | `#9CA3AF` |
| `border` | `#E5E7EB` | `#374151` |
| `primary` | `#E63946` | `#E63946` |

### Checklist
- [ ] Semua warna menggunakan token — bukan hardcoded hex
- [ ] Deteksi mode: `useColorScheme()` hook
- [ ] Ikon SVG menyesuaikan warna mode aktif
- [ ] Status bar: `dark-content` di light, `light-content` di dark
- [ ] Diuji di **kedua mode** sebelum PR

---

## 13. ✅ Error Handling

**Aplikasi harus gagal dengan elegan. User tidak boleh melihat error teknis atau blank screen.**

### Backend (Laravel)
- [ ] Exception handler mengembalikan JSON — bukan HTML error page
- [ ] `ModelNotFoundException` → `404` dengan pesan ramah
- [ ] `AuthenticationException` → `401`
- [ ] `AuthorizationException` → `403`
- [ ] `ValidationException` → `422` dengan detail field errors
- [ ] `ThrottleRequestsException` → `429` dengan `retry_after`
- [ ] Stack trace **tidak** diekspos di production
- [ ] Error tak terduga di-log (Sentry / Laravel Log)

### Mobile (React Native)
- [ ] Network error: "Koneksi bermasalah. Coba lagi."
- [ ] `401` → auto logout + redirect ke Login
- [ ] `403` → "Anda tidak memiliki akses ke fitur ini"
- [ ] `422` → pesan validasi di bawah masing-masing field
- [ ] `404` → `EmptyState` (bukan blank screen)
- [ ] `500` → `ErrorState` dengan tombol "Coba Lagi"
- [ ] Loading state selama request berlangsung
- [ ] Crash dilaporkan ke Sentry / Firebase Crashlytics

---

## 14. Quick Reference Checklist

Gunakan saat membuat atau mereview Pull Request:

```
BACKEND
─────────────────────────────────────────────
[ ] Migration: UUID, constraint, index, up+down OK
[ ] Model: fillable, casts, relasi, trait
[ ] Controller: thin (<10 baris), pakai Service & Resource
[ ] Service: SRP, exception, transaction, no HTTP code
[ ] Repository: interface bound, no N+1
[ ] Validation: FormRequest, pesan Indonesia
[ ] API Resource: no sensitive data, field konsisten
[ ] Feature Test: happy path + minimal 2 error case
[ ] Unit Test: Service layer
[ ] PHPDoc: Service & Repository
[ ] API Contract diupdate

MOBILE
─────────────────────────────────────────────
[ ] Komponen dari shared/components/ui
[ ] Tidak ada warna/spacing hardcoded
[ ] Loading state (Skeleton)
[ ] Empty state (EmptyState)
[ ] Error state (ErrorState) dengan retry
[ ] Responsive: 360dp hingga 430dp
[ ] Dark Mode: semua state di kedua mode
[ ] Error handling: network, 401, 403, 422, 500
[ ] Touch target minimal 44x44 dp
[ ] Aksesibilitas label pada gambar
```

---

> [!NOTE]
> **Pengecualian** hanya bisa diberikan oleh lead developer dengan alasan tertulis dan dicatat sebagai **technical debt** di issue tracker.

---

*Versi: 1.0.0 | Dibuat: 18 Juli 2026*
