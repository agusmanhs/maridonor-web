<?php

namespace App\Repositories\Contracts;

interface DashboardRepositoryInterface
{
    public function getPmiMetrics(string $pmiInstitutionId): array;

    public function getHospitalMetrics(string $hospitalInstitutionId): array;
}
