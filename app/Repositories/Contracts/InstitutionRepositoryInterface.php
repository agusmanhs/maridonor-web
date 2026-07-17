<?php

namespace App\Repositories\Contracts;

use App\Models\Institution;
use Illuminate\Support\Collection;

interface InstitutionRepositoryInterface
{
    public function findById(string $id): ?Institution;

    public function findByCode(string $code): ?Institution;

    public function getActiveList(array $filters): Collection;

    public function create(array $data): Institution;

    public function update(string $id, array $data): bool;

    public function addStaff(string $institutionId, string $userId, string $role): bool;

    public function removeStaff(string $institutionId, string $userId): bool;

    public function getStaffList(string $institutionId): Collection;
}
