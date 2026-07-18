<?php

namespace App\Repositories\Contracts;

use App\Models\ScheduleSlot;
use Illuminate\Support\Collection;

interface ScheduleSlotRepositoryInterface
{
    public function findById(string $id): ?ScheduleSlot;

    public function getSlots(string $institutionId, array $filters): Collection;

    public function create(array $data): ScheduleSlot;

    public function update(string $id, array $data): bool;

    public function incrementBookedCount(string $id): void;

    public function decrementBookedCount(string $id): void;
}
