<?php

namespace App\Services\BloodRequest;

use App\Enums\RequestStatus;
use App\Models\BloodRequest;
use App\Models\InstitutionStaff;
use App\Repositories\Contracts\BloodRequestRepositoryInterface;
use App\Repositories\Contracts\BloodStockRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BloodRequestService
{
    public function __construct(
        private readonly BloodRequestRepositoryInterface $requestRepo,
        private readonly BloodStockRepositoryInterface $stockRepo
    ) {}

    public function list(array $filters): Collection
    {
        return $this->requestRepo->getList($filters);
    }

    public function detail(string $id): ?BloodRequest
    {
        return $this->requestRepo->findById($id);
    }

    public function requestBlood(array $data, string $creatorId): BloodRequest
    {
        return DB::transaction(function () use ($data, $creatorId) {
            // 1. Cari institusi tempat staff bekerja untuk memverifikasi asal RS
            $staff = InstitutionStaff::where('user_id', $creatorId)->first();
            if (!$staff) {
                throw ValidationException::withMessages([
                    'requester' => ['Hanya staff institusi medis terdaftar yang dapat mengajukan permintaan darah.'],
                ]);
            }

            // 2. Generate Request Code unik
            $requestCode = 'REQ-' . strtoupper(Str::random(8));

            // 3. Simpan Blood Request
            return $this->requestRepo->create([
                'request_code' => $requestCode,
                'requester_id' => $creatorId, // FK ke users (staff peminta)
                'patient_name' => $data['patient_name'],
                'patient_birth_year' => $data['patient_birth_year'] ?? null,
                'medical_record_number' => $data['medical_record_number'] ?? null,
                'diagnosis' => $data['diagnosis'] ?? null,
                'blood_type' => $data['blood_type'],
                'rhesus' => $data['rhesus'],
                'component_type' => $data['component_type'],
                'quantity_needed' => $data['quantity_needed'],
                'quantity_fulfilled' => 0,
                'urgency_level' => $data['urgency_level'],
                'status' => RequestStatus::Open, // Otomatis open saat dibuat
                'destination_hospital_id' => $data['destination_hospital_id'],
                'contact_name' => $data['contact_name'],
                'contact_phone' => $data['contact_phone'],
                'notes' => $data['notes'] ?? null,
                'deadline_at' => $data['deadline_at'],
                'opened_at' => now(), // Diproses langsung oleh sistem
            ]);
        });
    }

    public function processRequest(string $requestId, string $status, ?string $rejectReason, string $updaterId): bool
    {
        $request = $this->requestRepo->findById($requestId);

        if (!$request || !in_array($request->status, [RequestStatus::Open, RequestStatus::PartiallyFulfilled])) {
            throw ValidationException::withMessages([
                'request_id' => ['Permintaan darah tidak valid atau sudah selesai diproses.'],
            ]);
        }

        if ($status === 'rejected') {
            return $this->requestRepo->update($requestId, [
                'status' => RequestStatus::Cancelled,
                'cancelled_at' => now(),
                'cancelled_reason' => $rejectReason ?? 'Ditolak oleh admin PMI.',
            ]);
        }

        return true;
    }

    public function fulfillRequest(string $requestId, array $bloodStockIds, string $updaterId): bool
    {
        return DB::transaction(function () use ($requestId, $bloodStockIds, $updaterId) {
            $request = $this->requestRepo->findById($requestId);

            if (!$request || !in_array($request->status, [RequestStatus::Open, RequestStatus::PartiallyFulfilled])) {
                throw ValidationException::withMessages([
                    'request_id' => ['Permintaan darah tidak valid atau sudah selesai dipenuhi.'],
                ]);
            }

            $fulfilledCount = $request->quantity_fulfilled;

            foreach ($bloodStockIds as $stockId) {
                $stock = $this->stockRepo->findById($stockId);

                // Validasi kesesuaian stok
                if (!$stock || $stock->status !== \App\Enums\StockStatus::Available) {
                    throw ValidationException::withMessages([
                        'blood_stock_ids' => ['Beberapa kantong darah pilihan tidak tersedia.'],
                    ]);
                }

                if (
                    $stock->blood_type !== $request->blood_type ||
                    $stock->rhesus !== $request->rhesus ||
                    $stock->component_type !== $request->component_type
                ) {
                    throw ValidationException::withMessages([
                        'blood_stock_ids' => ['Golongan darah atau komponen kantong tidak cocok dengan permintaan.'],
                    ]);
                }

                // Alokasikan stok (ubah status ke Distributed ke RS penerima)
                $this->stockRepo->update($stockId, [
                    'status' => \App\Enums\StockStatus::Distributed,
                    'distributed_to' => $request->destination_hospital_id,
                    'distributed_at' => now(),
                ]);

                $fulfilledCount++;
            }

            $newStatus = $fulfilledCount >= $request->quantity_needed ? RequestStatus::Fulfilled : RequestStatus::PartiallyFulfilled;

            return $this->requestRepo->update($requestId, [
                'quantity_fulfilled' => $fulfilledCount,
                'status' => $newStatus,
                'fulfilled_at' => $newStatus === RequestStatus::Fulfilled ? now() : null,
            ]);
        });
    }
}
