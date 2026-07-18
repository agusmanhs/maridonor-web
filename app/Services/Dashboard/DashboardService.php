<?php

namespace App\Services\Dashboard;

use App\Models\InstitutionStaff;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DashboardService
{
    public function __construct(
        private readonly DashboardRepositoryInterface $dashboardRepo
    ) {}

    public function getPmiMetrics(string $userId): array
    {
        $staff = InstitutionStaff::where('user_id', $userId)->first();
        if (!$staff) {
            throw ValidationException::withMessages([
                'auth' => ['User tidak diasosiasikan dengan institusi medis manapun.'],
            ]);
        }

        return $this->dashboardRepo->getPmiMetrics($staff->institution_id);
    }

    public function getHospitalMetrics(string $userId): array
    {
        $staff = InstitutionStaff::where('user_id', $userId)->first();
        if (!$staff) {
            throw ValidationException::withMessages([
                'auth' => ['User tidak diasosiasikan dengan institusi medis manapun.'],
            ]);
        }

        return $this->dashboardRepo->getHospitalMetrics($staff->institution_id);
    }
}
