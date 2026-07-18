<?php

namespace App\Repositories\Eloquent;

use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Repositories\Contracts\InstitutionRepositoryInterface;
use Illuminate\Support\Collection;

class InstitutionRepository implements InstitutionRepositoryInterface
{
    public function findById(string $id): ?Institution
    {
        return Institution::with('address')->find($id);
    }

    public function findByCode(string $code): ?Institution
    {
        return Institution::where('code', $code)->first();
    }

    public function getActiveList(array $filters): Collection
    {
        $query = Institution::with('address')->where('status', \App\Enums\InstitutionStatus::Approved);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['city'])) {
            $query->whereHas('address', function ($q) use ($filters) {
                $q->where('city', 'like', '%' . $filters['city'] . '%');
            });
        }

        // Filter spasial jarak/radius jika latitude & longitude ada (Haversine formula dengan Bounding Box filter)
        if (!empty($filters['latitude']) && !empty($filters['longitude']) && !empty($filters['radius_km'])) {
            $lat = (float) $filters['latitude'];
            $lon = (float) $filters['longitude'];
            $radius = (float) $filters['radius_km'];

            // Tambahkan filter Bounding Box kasar untuk memangkas scanning index
            $latRange = $radius / 111;
            $lonRange = $radius / (111 * cos(deg2rad($lat)));

            $query->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                ->whereBetween('longitude', [$lon - $lonRange, $lon + $lonRange])
                ->selectRaw("*, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$lat, $lon, $lat])
                ->having('distance', '<=', $radius)
                ->orderBy('distance');
        } else {
            $query->latest();
        }

        return $query->get();
    }

    public function create(array $data): Institution
    {
        return Institution::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $institution = $this->findById($id);
        if ($institution) {
            return $institution->update($data);
        }
        return false;
    }

    public function addStaff(string $institutionId, string $userId, string $role): bool
    {
        InstitutionStaff::updateOrCreate(
            ['institution_id' => $institutionId, 'user_id' => $userId],
            ['role' => $role, 'is_active' => true]
        );
        return true;
    }

    public function removeStaff(string $institutionId, string $userId): bool
    {
        $staff = InstitutionStaff::where('institution_id', $institutionId)
            ->where('user_id', $userId)
            ->first();
        
        if ($staff) {
            return $staff->delete();
        }
        return false;
    }

    public function getStaffList(string $institutionId): Collection
    {
        return InstitutionStaff::with('user')
            ->where('institution_id', $institutionId)
            ->get();
    }
}
