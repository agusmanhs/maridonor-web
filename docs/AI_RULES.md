# AI Rules — MARIDONOR
## Panduan Wajib untuk AI Assistant

> [!IMPORTANT]
> Dokumen ini adalah **kontrak antara developer dan AI assistant**.
> Setiap kali AI diminta menulis kode untuk project MARIDONOR,
> **semua aturan di bawah wajib dipatuhi tanpa pengecualian.**

---

## 🔴 Aturan Dasar (Non-Negotiable)

```
1. Jangan membuat file yang tidak diperlukan.
2. Jangan mengubah file yang tidak diminta.
3. Selalu tanyakan jika ada ambiguitas — jangan berasumsi.
4. Jangan refactor kode di luar scope permintaan.
5. Satu permintaan = satu perubahan yang terfokus.
```

---

## TypeScript

```
✅ Selalu gunakan TypeScript Strict Mode
✅ Gunakan Functional Component (bukan Class Component)
✅ Semua props harus didefinisikan dengan interface atau type
✅ Gunakan return type yang eksplisit pada fungsi
✅ Gunakan 'unknown' untuk tipe yang belum diketahui
✅ Gunakan type guard untuk narrowing

❌ Jangan gunakan 'any'
❌ Jangan gunakan 'as any' atau '@ts-ignore'
❌ Jangan gunakan 'Function' sebagai tipe
❌ Jangan biarkan tipe implicit (harus selalu eksplisit)
```

### Contoh
```typescript
// ✅ BENAR
interface DonorProfile {
  id: string;
  bloodType: BloodType;
  rhesus: Rhesus;
  eligibilityStatus: EligibilityStatus;
  nextEligibleDate: string | null; // ISO 8601
}

const getDonorName = (donor: DonorProfile): string => {
  return donor.name;
};

// ❌ SALAH
const getDonorName = (donor: any) => {
  return donor.name;
};
```

---

## Validasi — Zod

```
✅ Semua validasi schema menggunakan Zod
✅ Schema didefinisikan di file terpisah: types/{domain}.schema.ts
✅ Infer TypeScript type dari Zod schema: z.infer<typeof Schema>
✅ Error message dalam Bahasa Indonesia
✅ Gunakan .transform() untuk normalisasi data

❌ Jangan validasi manual dengan if/else
❌ Jangan duplikasi type dan schema secara terpisah
```

### Contoh
```typescript
// ✅ BENAR — src/features/blood-request/types.ts
import { z } from 'zod';

export const CreateBloodRequestSchema = z.object({
  bloodType: z.enum(['A', 'B', 'AB', 'O'], {
    errorMap: () => ({ message: 'Golongan darah tidak valid.' }),
  }),
  rhesus: z.enum(['positive', 'negative']),
  quantityNeeded: z
    .number({ invalid_type_error: 'Jumlah harus berupa angka.' })
    .int()
    .min(1, 'Minimal 1 kantong.')
    .max(20, 'Maksimal 20 kantong.'),
  contactPhone: z
    .string()
    .regex(/^(08|62)\d{8,11}$/, 'Format nomor HP tidak valid.'),
});

export type CreateBloodRequestInput = z.infer<typeof CreateBloodRequestSchema>;
```

---

## Form — React Hook Form

```
✅ Semua form menggunakan React Hook Form
✅ Integrasi dengan Zod melalui @hookform/resolvers/zod
✅ Satu custom hook per form: useBloodRequestForm, useLoginForm, dll
✅ Error message ditampilkan per field menggunakan formState.errors
✅ Loading state ditangani menggunakan formState.isSubmitting

❌ Jangan gunakan state lokal (useState) untuk nilai form
❌ Jangan gunakan form tanpa resolver validasi
❌ Jangan akses nilai form di luar useForm hook
```

### Contoh
```typescript
// ✅ BENAR
const useCreateBloodRequestForm = () => {
  return useForm<CreateBloodRequestInput>({
    resolver: zodResolver(CreateBloodRequestSchema),
    defaultValues: {
      quantityNeeded: 1,
    },
  });
};

// Di komponen:
const { control, handleSubmit, formState: { errors, isSubmitting } } = useCreateBloodRequestForm();
```

---

## API Request — TanStack Query

```
✅ Semua request HTTP menggunakan TanStack Query
✅ Query key didefinisikan di lib/api/queryKeys.ts
✅ Satu custom hook per use case: useBloodRequests, useCreateBooking, dll
✅ Query hook untuk GET: useQuery atau useInfiniteQuery
✅ Mutation hook untuk POST/PUT/DELETE: useMutation
✅ Error state ditangani di setiap hook
✅ Loading state diekspos dari hook

❌ Jangan fetch langsung dengan axios di komponen
❌ Jangan gunakan useState + useEffect untuk fetching data
❌ Jangan buat query key inline di komponen (harus dari queryKeys.ts)
```

### Contoh
```typescript
// ✅ BENAR — lib/api/queryKeys.ts
export const queryKeys = {
  bloodRequests: {
    all: ['blood-requests'] as const,
    list: (filters: BloodRequestFilters) =>
      [...queryKeys.bloodRequests.all, 'list', filters] as const,
    detail: (id: string) =>
      [...queryKeys.bloodRequests.all, 'detail', id] as const,
  },
};

// ✅ BENAR — features/blood-request/hooks/useBloodRequests.ts
export const useBloodRequests = (filters: BloodRequestFilters) => {
  return useInfiniteQuery({
    queryKey: queryKeys.bloodRequests.list(filters),
    queryFn: ({ pageParam }) => bloodRequestApi.getList({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    initialPageParam: undefined,
  });
};

export const useCreateBloodRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bloodRequestApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bloodRequests.all });
    },
  });
};
```

---

## API Response — Laravel Resource

```
✅ Semua response API menggunakan Laravel API Resource
✅ Semua response menggunakan format standar:
   { success, message, data, meta }
✅ Resource berada di app/Http/Resources/{Domain}/
✅ Tidak ada field sensitif di response (nik_encrypted, password)
✅ Nested relasi menggunakan Resource lain (bukan array manual)
✅ Nullable field menggunakan whenLoaded() atau when()

❌ Jangan return $model->toArray() dari controller
❌ Jangan return response()->json($data) tanpa Resource
❌ Jangan ekspos field yang tidak ada di API Contract
```

### Contoh
```php
// ✅ BENAR — Controller
return response()->json([
    'success' => true,
    'message' => 'Data berhasil diambil',
    'data'    => new BloodRequestResource($bloodRequest),
], 200);

// ✅ BENAR — Resource
public function toArray(Request $request): array
{
    return [
        'id'          => $this->id,
        'blood_type'  => $this->blood_type,
        'created_at'  => $this->created_at->toISOString(),
        'institution' => new InstitutionResource($this->whenLoaded('institution')),
    ];
}

// ❌ SALAH — Controller
return response()->json($bloodRequest->toArray());
```

---

## Format Tanggal — ISO 8601

```
✅ Semua tanggal dari API menggunakan format ISO 8601
✅ Backend: ->toISOString() untuk datetime, Y-m-d untuk date
✅ Frontend: simpan dan kirim dalam format ISO string
✅ Tampilkan ke user menggunakan fungsi formatter:
   formatDate(), formatDateTime() dari shared/utils/dateFormatter.ts

❌ Jangan gunakan format lokal (18/07/2026) untuk komunikasi API
❌ Jangan gunakan new Date() tanpa validasi format input
❌ Jangan manipulasi tanggal tanpa library (gunakan dayjs atau date-fns)
```

### Contoh
```typescript
// ✅ BENAR — dateFormatter.ts
export const formatDate = (isoString: string): string => {
  return dayjs(isoString).locale('id').format('D MMMM YYYY');
  // Output: "18 Juli 2026"
};

export const formatDateTime = (isoString: string): string => {
  return dayjs(isoString).locale('id').format('D MMMM YYYY, HH:mm');
  // Output: "18 Juli 2026, 09:30"
};

// ✅ BENAR — penggunaan di komponen
<Text>{formatDate(donation.donated_at)}</Text>

// ❌ SALAH
<Text>{new Date(donation.donated_at).toLocaleDateString()}</Text>
```

---

## Laravel — Aturan Tambahan

```
✅ Gunakan Repository Pattern — semua query via Repository
✅ Gunakan Service Layer — business logic di Service, bukan Controller
✅ Gunakan FormRequest untuk validasi — bukan $request->validate()
✅ Gunakan PHP 8.x Enums untuk konstanta
✅ Gunakan Dependency Injection — bukan new ClassName() di method
✅ Gunakan DB::transaction() untuk operasi atomik
✅ Gunakan event() untuk side effects (notifikasi, poin)

❌ Jangan query langsung di Controller atau Model
❌ Jangan gunakan $request->all() — gunakan $request->validated()
❌ Jangan gunakan array string untuk role/status — gunakan Enum
❌ Jangan buat logika di migration — hanya skema
```

---

## React Native — Aturan Tambahan

```
✅ Gunakan functional component dengan hooks
✅ Satu file = satu komponen utama
✅ Props interface dinamai: {ComponentName}Props
✅ Custom hook diawali dengan 'use': useBloodRequests, useAuth
✅ Komponen reusable di shared/components/ui/
✅ Komponen spesifik fitur di features/{nama}/components/
✅ Gunakan React.memo() untuk komponen yang sering re-render

❌ Jangan inline style — gunakan StyleSheet.create()
❌ Jangan logic di JSX — ekstrak ke variable atau fungsi
❌ Jangan useEffect untuk fetching — gunakan TanStack Query
❌ Jangan manipulasi state langsung — gunakan setState/Zustand setter
```

---

## Commit Message — Conventional Commits

```
Format: <type>(<scope>): <deskripsi singkat>

type yang valid:
  feat     — fitur baru
  fix      — bug fix
  refactor — refactor tanpa perubahan behavior
  test     — menambah atau mengubah test
  docs     — perubahan dokumentasi
  chore    — perubahan konfigurasi, dependency
  style    — formatting, tidak ada perubahan logic

Contoh:
  feat(auth): add OTP verification endpoint
  fix(donor): correct eligibility date calculation
  refactor(blood-request): extract matching logic to service
  test(auth): add login feature test
  docs(api): update blood stock endpoints
```

---

## Checklist Sebelum Generate Kode

Sebelum menulis kode, AI harus memastikan:

```
[ ] Sudah memahami scope permintaan dengan jelas
[ ] Tidak akan mengubah file di luar scope
[ ] Tidak akan membuat file baru yang tidak perlu
[ ] Tipe TypeScript sudah didefinisikan (tidak pakai 'any')
[ ] Validasi menggunakan Zod schema
[ ] Form menggunakan React Hook Form + Zod resolver
[ ] API call menggunakan TanStack Query hook
[ ] Response menggunakan Laravel API Resource
[ ] Tanggal dalam format ISO 8601
[ ] Query database melalui Repository, bukan langsung di Controller/Service
[ ] Business logic di Service, bukan Controller
[ ] Kode mengikuti folder structure yang sudah disepakati
```

---

## Larangan Eksplisit (Hard No)

```
❌ JANGAN gunakan 'any' dalam TypeScript
❌ JANGAN buat Class Component di React Native
❌ JANGAN fetch data dengan useEffect + useState
❌ JANGAN validasi form dengan if/else manual
❌ JANGAN return response tanpa API Resource di Laravel
❌ JANGAN query DB langsung di Controller
❌ JANGAN hardcode warna, font size, atau spacing
❌ JANGAN gunakan $request->all() — selalu $request->validated()
❌ JANGAN buat file di folder yang salah
❌ JANGAN ubah file yang tidak diminta
```

---

*Versi: 1.0.0 | Dibuat: 18 Juli 2026*
