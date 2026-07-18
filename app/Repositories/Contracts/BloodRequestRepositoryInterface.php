<?php

namespace App\Repositories\Contracts;

use App\Models\BloodRequest;
use Illuminate\Support\Collection;

interface BloodRequestRepositoryInterface
{
    public function findById(string $id): ?BloodRequest;

    public function getList(array $filters): Collection;

    public function create(array $data): BloodRequest;

    public function update(string $id, array $data): bool;

    public function addRequiredBags(string $requestId, array $bags): void;

    public function getRequestDonors(string $requestId): Collection;
}
