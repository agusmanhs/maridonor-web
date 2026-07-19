<?php

namespace App\Repositories\Contracts;

use App\Models\BloodStock;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BloodStockRepositoryInterface
{
    public function findById(string $id): ?BloodStock;

    public function findByBagNumber(string $bagNumber): ?BloodStock;

    public function getStockList(string $institutionId, array $filters): LengthAwarePaginator;

    public function create(array $data): BloodStock;

    public function update(string $id, array $data): bool;

    public function getInventorySummary(string $institutionId): Collection;

    public function checkThresholds(string $institutionId): Collection;
}
