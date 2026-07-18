<?php

namespace App\Repositories\Eloquent;

use App\Models\ScheduleSlot;
use App\Repositories\Contracts\ScheduleSlotRepositoryInterface;
use Illuminate\Support\Collection;

class ScheduleSlotRepository implements ScheduleSlotRepositoryInterface
{
    public function findById(string $id): ?ScheduleSlot
    {
        return ScheduleSlot::with('institution')->find($id);
    }

    public function getSlots(string $institutionId, array $filters): Collection
    {
        $query = ScheduleSlot::where('institution_id', $institutionId)
            ->where('is_cancelled', false);

        if (!empty($filters['start_date'])) {
            $query->where('slot_date', '>=', $filters['start_date']);
        } else {
            // Default tampilkan slot hari ini kedepan
            $query->where('slot_date', '>=', now()->format('Y-m-d'));
        }

        if (!empty($filters['end_date'])) {
            $query->where('slot_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('slot_date')->orderBy('start_time')->get();
    }

    public function create(array $data): ScheduleSlot
    {
        return ScheduleSlot::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $slot = $this->findById($id);
        if ($slot) {
            return $slot->update($data);
        }
        return false;
    }

    public function incrementBookedCount(string $id): void
    {
        $slot = ScheduleSlot::find($id);
        if ($slot) {
            $slot->increment('booked_count');
        }
    }

    public function decrementBookedCount(string $id): void
    {
        $slot = ScheduleSlot::find($id);
        if ($slot && $slot->booked_count > 0) {
            $slot->decrement('booked_count');
        }
    }
}
