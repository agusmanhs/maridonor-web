# Coding Standards — MARIDONOR
## Standar Pemrograman & Git Workflow

**Versi:** 1.0.0
**Tanggal:** 18 Juli 2026

---

## 1. General Rules

- **TypeScript Strict Mode**: Wajib digunakan di seluruh bagian aplikasi React Web dan Mobile.
- **Hindari 'any'**: Jangan pernah menggunakan tipe data `any`. Cari atau definisikan tipe/interface yang tepat.
- **Functional Component**: Wajib menggunakan functional component dengan React Hooks. Class component dilarang.
- **Service Layer**: Semua API/business logic harus dipisahkan ke dalam Service Layer.
- **TanStack Query**: Semua operasi pengambilan data (query) dan manipulasi data (mutation) harus melalui TanStack Query.
- **React Hook Form**: Semua form input wajib dikelola menggunakan React Hook Form.
- **Zod**: Semua skema validasi (frontend & mobile) wajib menggunakan Zod.
- **Kualitas Kode**:
  - Hindari duplicate code (DRY - Don't Repeat Yourself).
  - Hindari hardcode nilai-nilai konfigurasi atau token styling.

---

## 2. Naming Convention

| Tipe File | Konvensi Penamaan | Contoh |
|---|---|---|
| **Component** | PascalCase | `BloodCard.tsx` |
| **Hook** | camelCase (prefix `use`) | `useBloodStock.ts` |
| **Service** | PascalCase (suffix `Service`) | `BloodService.ts` |
| **Repository** | PascalCase (suffix `Repository`) | `BloodRepository.ts` |
| **Type / Interface** | PascalCase | `BloodType.ts` |
| **Enum** | PascalCase (suffix `Status` / `Type` / dll) | `BloodStatus.ts` |

---

## 3. Folder Structure (Feature Based)

Aplikasi diorganisasikan berdasarkan fitur/domain untuk mempermudah skalabilitas dan pemeliharaan:
```
/src
  /features
    /auth         # Fitur Autentikasi
    /blood        # Fitur Pengelolaan Darah & Stok
    /request      # Fitur Permintaan Darah
    /profile      # Fitur Profil Donor & Institusi
    /dashboard    # Fitur Halaman Utama per Role
```

---

## 4. Git Workflow

Pengembangan menggunakan alur pencabangan (branching strategy) terstruktur:

```
main (Production)
  ▲
  │ (Release / Hotfix Merge)
develop (Development)
  ▲
  ├── feature/login
  ├── feature/dashboard
  ├── feature/blood-stock
  └── hotfix/login (langsung ke develop/main jika kritis)
```

### Aturan Branch Naming
- **Fitur Baru**: `feature/{nama-fitur}` (contoh: `feature/auth`, `feature/dashboard`)
- **Perbaikan Bug**: `fix/{isu-spesifik}` atau `hotfix/{isu-kritis}` (contoh: `fix/login`, `hotfix/api`)
- **Rilis Versi**: `release/v{major.minor.patch}` (contoh: `release/v1.0.0`)

---

## 5. Conventional Commits

Semua commit message harus mengikuti standar Conventional Commits:

`type(scope): deskripsi singkat`

### Tipe Commit (Types)
- `feat`: Fitur baru untuk user.
- `fix`: Perbaikan bug.
- `docs`: Perubahan atau penambahan dokumentasi.
- `style`: Perubahan format kode, semicolon, styling (tidak memengaruhi logika).
- `refactor`: Perubahan kode yang tidak memperbaiki bug atau menambah fitur.
- `perf`: Perbaikan performa kode.
- `test`: Penambahan atau perbaikan unit/integration tests.
- `build`: Perubahan yang memengaruhi build system atau dependency eksternal.
- `ci`: Perubahan konfigurasi CI/CD (GitHub Actions).
- `chore`: Maintenance umum atau update package.

### Contoh Commit
```
feat(auth): implement login API
feat(stock): create blood stock CRUD
fix(auth): refresh token bug
docs(api): update endpoint documentation
refactor(notification): simplify service
```

---

## 6. Pull Request Rules

- **Minimal 1 Reviewer**: Setiap PR harus di-review dan di-approve oleh minimal 1 developer lain sebelum di-merge.
- **No Direct Merge to Main**: Dilarang melakukan merge langsung ke branch `main`. Semua harus melalui `develop` terlebih dahulu.
- **Lulus Pengujian**: Semua unit test & integration test wajib lulus (`pass`) pada pipeline CI.
- **Bebas Lint Error**: Tidak boleh ada error atau warning kritis dari linter (ESLint/PHPStan).

---

## 7. Laravel Rules (Backend)

- **Form Request**: Wajib memisahkan aturan validasi input ke dalam Form Request.
- **API Resource**: Gunakan API Resource untuk menstrukturkan response data JSON.
- **Service Layer**: Simpan seluruh business logic di Service.
- **Repository Pattern**: Semua transaksi database wajib melalui model abstraction di Repository.
- **Database Transaction**: Gunakan `DB::transaction()` untuk membungkus operasi database yang memodifikasi lebih dari satu tabel guna menjaga integritas data.

---

## 8. React Rules (Frontend & Mobile)

- **No Class Components**: Selalu gunakan Functional Components.
- **Hooks**: Gunakan React Hooks bawaan (`useState`, `useEffect`, `useMemo`) dengan benar.
- **No Prop Drilling**: Gunakan state management (Zustand) atau React Context untuk data yang dibutuhkan lintas komponen jauh.
- **Custom Hooks**: Ekstrak business logic atau data fetching dari file UI component ke dalam Custom Hooks.
- **Lazy Loading**: Gunakan code splitting/lazy loading untuk mengoptimalkan performa load aplikasi.

---

## 9. Database Rules

- **UUID**: Gunakan UUID v4 sebagai Primary Key untuk semua tabel.
- **Foreign Key**: Wajib mendefinisikan Foreign Key constraint secara eksplisit pada level database.
- **Soft Delete**: Terapkan kolom `deleted_at` (soft delete) untuk data transaksional atau data master yang kritis.
- **Timestamps**: Kolom `created_at` dan `updated_at` wajib ada di setiap tabel.

---

## 10. AI Rules

Bagi AI Coding Assistant (Claude/Gemini):
- **JANGAN** mengubah file tanpa instruksi atau permintaan spesifik.
- **JANGAN** menginstall package/dependency baru tanpa persetujuan eksplisit.
- **JANGAN** mengubah struktur folder dasar yang telah disepakati.
- **JANGAN** membuat duplicate component. Gunakan komponen yang ada di `shared/components/ui/`.
- **JANGAN** pernah menulis tipe data `any` dalam TypeScript.

---

*Versi: 1.0.0 | Dibuat: 18 Juli 2026*
