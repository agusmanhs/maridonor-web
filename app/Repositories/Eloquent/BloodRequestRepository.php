<?php

namespace App\Repositories\Eloquent;

use App\Models\BloodRequest;
use App\Models\BloodRequestDonor;
use App\Repositories\Contracts\BloodRequestRepositoryInterface;
use Illuminate\Support\Collection;

class BloodRequestRepository implements BloodRequestRepositoryInterface
{
    public function findById(string $id): ?BloodRequest
    {
        return BloodRequest::with(['requester', 'destinationHospital.address', 'requestDonors.donorProfile.user'])->find($id);
    }

    public function getList(array $filters): Collection
    {
        $query = BloodRequest::with(['requester', 'destinationHospital.address']);

        // Filter berdasarkan rumah sakit pembuat
        if (!empty($filters['requester_id'])) {
            $query->where('requester_id', $filters['requester_id']);
        }

        // Filter berdasarkan PMI tujuan/wilayah (jika ada relasi PMI tertentu, atau filter kota alamat RS)
        if (!empty($filters['city'])) {
            $query->whereHas('destinationHospital.address', function ($q) use ($filters) {
                $q->where('city', 'like', '%' . $filters['city'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['urgency'])) {
            $query->where('urgency', $filters['urgency']);
        }

        return $query->latest()->get();
    }

    public function create(array $data): BloodRequest
    {
        return BloodRequest::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $request = $this->findById($id);
        if ($request) {
            return $request->update($data);
        }
        return false;
    }

    public function addRequiredBags(string $requestId, array $bags): void
    {
        // Menyimpan alokasi kantong darah spesifik jika sudah dipenuhi
        // (Misal link bag numbers ke blood_request_donors)
    }

    public function getRequestDonors(string $requestId): Collection
    {
        return BloodRequestDonor::with('donorProfile.user')
            ->where('blood_request_id', $requestId)
            ->get();
    }
}
